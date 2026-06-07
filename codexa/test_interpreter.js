import * as acorn from 'acorn';

class Scope {
  constructor(parent = null, name = 'Block') {
    this.parent = parent;
    this.name = name;
    this.variables = {};
  }

  declare(name, value) {
    this.variables[name] = value;
  }

  get(name) {
    if (name in this.variables) {
      return this.variables[name];
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    throw new ReferenceError(`${name} is not defined`);
  }

  set(name, value) {
    if (name in this.variables) {
      this.variables[name] = value;
      return;
    }
    if (this.parent) {
      this.parent.set(name, value);
      return;
    }
    throw new ReferenceError(`${name} is not defined`);
  }
}

class ReturnSignal {
  constructor(value) {
    this.value = value;
  }
}

const formatMemoryValue = (val) => {
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'function') return '[Function]';
  if (val && typeof val === 'object' && val.hasOwnProperty('type')) {
    if (val.type === 'FunctionDeclaration') return `[Function: ${val.id.name}]`;
    if (val.type === 'ClassDeclaration') return `[Class: ${val.id.name}]`;
  }
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'object') {
    if (val.__proto__ && val.__proto__.type === 'ClassDeclaration') {
      const className = val.__proto__.id.name;
      const cleanProps = { ...val };
      delete cleanProps.__proto__;
      return `${className} ${JSON.stringify(cleanProps)}`;
    }
    return JSON.stringify(val);
  }
  return String(val);
};

export function generateTraces(codeText) {
  let ast;
  try {
    ast = acorn.parse(codeText, { ecmaVersion: 2020, locations: true });
  } catch (e) {
    return [{
      line: 1,
      explanation: `Syntax Error: ${e.message}`,
      memory: {},
      console: [],
      error: true
    }];
  }

  const steps = [];
  const consoleLogs = [];
  const globalScope = new Scope(null, 'Global');
  
  // Set up console.log in global scope
  globalScope.declare('console', {
    log: (...args) => {
      const logLine = args.map(v => {
        if (v && typeof v === 'object' && v.__proto__ && v.__proto__.type === 'ClassDeclaration') {
          const className = v.__proto__.id.name;
          const cleanProps = { ...v };
          delete cleanProps.__proto__;
          return `${className} ${JSON.stringify(cleanProps)}`;
        }
        return typeof v === 'object' ? JSON.stringify(v) : String(v);
      }).join(' ');
      consoleLogs.push(logLine);
    }
  });

  let stepCount = 0;
  const STEP_LIMIT = 200;

  function addStep(node, explanation) {
    stepCount++;
    if (stepCount > STEP_LIMIT) {
      throw new Error('Execution limit exceeded (possible infinite loop).');
    }
    
    const { scopes, memory } = getScopesAndMemory(scopeStack[scopeStack.length - 1]);
    steps.push({
      line: node.loc.start.line,
      explanation: explanation,
      memory: memory,
      scopes: scopes,
      console: [...consoleLogs]
    });
  }

  function getScopesAndMemory(scope) {
    const scopes = [];
    const memory = {};
    
    let curr = scope;
    while (curr) {
      const vars = {};
      for (const [key, val] of Object.entries(curr.variables)) {
        if (key === 'console') continue;
        vars[key] = formatMemoryValue(val);
      }
      
      if (curr.parent || Object.keys(vars).length > 0) {
        scopes.push({
          name: curr.name,
          variables: vars
        });
      }
      
      for (const [key, val] of Object.entries(curr.variables)) {
        if (key === 'console') continue;
        if (!(key in memory)) {
          memory[key] = formatMemoryValue(val);
        }
      }
      
      curr = curr.parent;
    }
    
    return { scopes, memory };
  }

  const scopeStack = [globalScope];

  function evaluateExpression(node, scope) {
    switch (node.type) {
      case 'Literal':
        return node.value;
        
      case 'Identifier':
        if (node.name === 'undefined') return undefined;
        return scope.get(node.name);
        
      case 'ThisExpression':
        return scope.get('this');
        
      case 'BinaryExpression': {
        const left = evaluateExpression(node.left, scope);
        const right = evaluateExpression(node.right, scope);
        switch (node.operator) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
          case '%': return left % right;
          case '<': return left < right;
          case '>': return left > right;
          case '<=': return left <= right;
          case '>=': return left >= right;
          case '==': return left == right;
          case '===': return left === right;
          case '!=': return left != right;
          case '!==': return left !== right;
          default: throw new Error(`Unsupported binary operator: ${node.operator}`);
        }
      }
      
      case 'LogicalExpression': {
        const left = evaluateExpression(node.left, scope);
        if (node.operator === '&&') {
          return left && evaluateExpression(node.right, scope);
        } else if (node.operator === '||') {
          return left || evaluateExpression(node.right, scope);
        }
        throw new Error(`Unsupported logical operator: ${node.operator}`);
      }
      
      case 'UnaryExpression': {
        const argument = evaluateExpression(node.argument, scope);
        switch (node.operator) {
          case '-': return -argument;
          case '+': return +argument;
          case '!': return !argument;
          case 'typeof': return typeof argument;
          default: throw new Error(`Unsupported unary operator: ${node.operator}`);
        }
      }
      
      case 'UpdateExpression': {
        const name = node.argument.name;
        const oldVal = scope.get(name);
        const newVal = node.operator === '++' ? oldVal + 1 : oldVal - 1;
        scope.set(name, newVal);
        return node.prefix ? newVal : oldVal;
      }
      
      case 'AssignmentExpression': {
        if (node.left.type === 'MemberExpression') {
          const obj = evaluateExpression(node.left.object, scope);
          const prop = node.left.computed ? evaluateExpression(node.left.property, scope) : node.left.property.name;
          const val = evaluateExpression(node.right, scope);
          if (node.operator === '=') {
            obj[prop] = val;
          } else if (node.operator === '+=') {
            obj[prop] += val;
          } else if (node.operator === '-=') {
            obj[prop] -= val;
          }
          return obj[prop];
        } else {
          const name = node.left.name;
          const val = evaluateExpression(node.right, scope);
          if (node.operator === '=') {
            scope.set(name, val);
          } else if (node.operator === '+=') {
            scope.set(name, scope.get(name) + val);
          } else if (node.operator === '-=') {
            scope.set(name, scope.get(name) - val);
          } else {
            throw new Error(`Unsupported assignment operator: ${node.operator}`);
          }
          return scope.get(name);
        }
      }
      
      case 'MemberExpression': {
        const obj = evaluateExpression(node.object, scope);
        const prop = node.computed ? evaluateExpression(node.property, scope) : node.property.name;
        return obj[prop];
      }
      
      case 'NewExpression': {
        const className = node.callee.name;
        const klass = scope.get(className);
        const args = node.arguments.map(arg => evaluateExpression(arg, scope));
        
        const instance = { __proto__: klass };
        const constructorMethod = klass.body.body.find(m => m.kind === 'constructor');
        
        if (constructorMethod) {
          const ctorScope = new Scope(scope, `${className}.constructor`);
          scopeStack.push(ctorScope);
          ctorScope.declare('this', instance);
          constructorMethod.value.params.forEach((param, idx) => {
            ctorScope.declare(param.name, args[idx]);
          });
          
          addStep(node, `Create new instance of class "${className}" and call constructor.`);
          try {
            executeStatement(constructorMethod.value.body, ctorScope);
          } finally {
            scopeStack.pop();
          }
        } else {
          addStep(node, `Create new instance of class "${className}".`);
        }
        
        return instance;
      }
      
      case 'CallExpression': {
        if (node.callee.type === 'MemberExpression' &&
            node.callee.object.name === 'console' &&
            node.callee.property.name === 'log') {
          const args = node.arguments.map(arg => evaluateExpression(arg, scope));
          const consoleObj = scope.get('console');
          consoleObj.log(...args);
          return undefined;
        }
        
        const funcName = node.callee.name;
        const func = scope.get(funcName);
        if (!func || func.type !== 'FunctionDeclaration') {
          throw new TypeError(`${funcName} is not a function`);
        }
        
        const args = node.arguments.map(arg => evaluateExpression(arg, scope));
        
        const funcScope = new Scope(func.lexicalScope, `Function: ${funcName}`);
        scopeStack.push(funcScope);
        
        func.params.forEach((param, idx) => {
          funcScope.declare(param.name, args[idx]);
        });
        
        addStep(node, `Call function "${funcName}" with arguments: ${args.map(formatMemoryValue).join(', ')}`);
        
        let returnVal = undefined;
        try {
          executeStatement(func.body, funcScope);
        } catch (signal) {
          if (signal instanceof ReturnSignal) {
            returnVal = signal.value;
          } else {
            throw signal;
          }
        } finally {
          scopeStack.pop();
        }
        
        return returnVal;
      }
      
      default:
        throw new Error(`Unsupported expression type: ${node.type}`);
    }
  }

  function executeStatement(node, scope) {
    switch (node.type) {
      case 'BlockStatement': {
        const blockScope = new Scope(scope, 'Block');
        scopeStack.push(blockScope);
        try {
          for (const stmt of node.body) {
            executeStatement(stmt, blockScope);
          }
        } finally {
          scopeStack.pop();
        }
        break;
      }
      
      case 'VariableDeclaration': {
        for (const decl of node.declarations) {
          const varName = decl.id.name;
          const val = decl.init ? evaluateExpression(decl.init, scope) : undefined;
          scope.declare(varName, val);
          addStep(decl, `Declare variable "${varName}" initialized to ${formatMemoryValue(val)}.`);
        }
        break;
      }
      
      case 'ExpressionStatement': {
        const expr = node.expression;
        if (expr.type === 'CallExpression' &&
            expr.callee.type === 'MemberExpression' &&
            expr.callee.object.name === 'console' &&
            expr.callee.property.name === 'log') {
          const args = expr.arguments.map(arg => evaluateExpression(arg, scope));
          const consoleObj = scope.get('console');
          consoleObj.log(...args);
          
          const printedStr = args.map(v => {
            if (v && typeof v === 'object' && v.__proto__ && v.__proto__.type === 'ClassDeclaration') {
              const className = v.__proto__.id.name;
              const cleanProps = { ...v };
              delete cleanProps.__proto__;
              return `${className} ${JSON.stringify(cleanProps)}`;
            }
            return typeof v === 'object' ? JSON.stringify(v) : String(v);
          }).join(' ');
          addStep(expr, `Execute console.log() to print: "${printedStr}"`);
        } else if (expr.type === 'AssignmentExpression') {
          const val = evaluateExpression(expr, scope);
          let varName = '';
          if (expr.left.type === 'MemberExpression') {
            const prop = expr.left.computed ? '[computed]' : expr.left.property.name;
            const objName = expr.left.object.type === 'ThisExpression' ? 'this' : expr.left.object.name;
            varName = `${objName}.${prop}`;
          } else {
            varName = expr.left.name;
          }
          addStep(expr, `Assign value ${formatMemoryValue(val)} to variable "${varName}".`);
        } else if (expr.type === 'UpdateExpression') {
          const varName = expr.argument.name;
          const oldVal = scope.get(varName);
          evaluateExpression(expr, scope);
          const newVal = scope.get(varName);
          addStep(expr, `Update variable "${varName}" from ${oldVal} to ${newVal}.`);
        } else {
          evaluateExpression(expr, scope);
          addStep(expr, `Evaluate expression: ${codeText.slice(expr.start, expr.end)}`);
        }
        break;
      }
      
      case 'IfStatement': {
        const condVal = evaluateExpression(node.test, scope);
        const condExprText = codeText.slice(node.test.start, node.test.end);
        addStep(node.test, `Check condition: "${condExprText}" evaluates to ${condVal}.`);
        
        if (condVal) {
          executeStatement(node.consequent, scope);
        } else if (node.alternate) {
          executeStatement(node.alternate, scope);
        }
        break;
      }
      
      case 'WhileStatement': {
        const condExprText = codeText.slice(node.test.start, node.test.end);
        while (true) {
          const condVal = evaluateExpression(node.test, scope);
          addStep(node.test, `Check loop condition: "${condExprText}" evaluates to ${condVal}.`);
          if (!condVal) {
            break;
          }
          executeStatement(node.body, scope);
        }
        break;
      }
      
      case 'ForStatement': {
        const forScope = new Scope(scope, 'For Loop');
        scopeStack.push(forScope);
        
        try {
          if (node.init) {
            if (node.init.type === 'VariableDeclaration') {
              for (const decl of node.init.declarations) {
                const varName = decl.id.name;
                const val = decl.init ? evaluateExpression(decl.init, forScope) : undefined;
                forScope.declare(varName, val);
                addStep(decl, `Initialize loop variable "${varName}" to ${formatMemoryValue(val)}.`);
              }
            } else {
              evaluateExpression(node.init, forScope);
              addStep(node.init, `Execute loop initialization.`);
            }
          }
          
          const condExprText = node.test ? codeText.slice(node.test.start, node.test.end) : 'true';
          while (true) {
            if (node.test) {
              const condVal = evaluateExpression(node.test, forScope);
              addStep(node.test, `Check loop condition: "${condExprText}" evaluates to ${condVal}.`);
              if (!condVal) {
                break;
              }
            }
            
            executeStatement(node.body, forScope);
            
            if (node.update) {
              const oldVal = node.update.type === 'UpdateExpression' ? forScope.get(node.update.argument.name) : null;
              evaluateExpression(node.update, forScope);
              if (node.update.type === 'UpdateExpression') {
                const varName = node.update.argument.name;
                const newVal = forScope.get(varName);
                addStep(node.update, `Update loop variable "${varName}" from ${oldVal} to ${newVal}.`);
              } else {
                addStep(node.update, `Execute loop update.`);
              }
            }
          }
        } finally {
          scopeStack.pop();
        }
        break;
      }
      
      case 'FunctionDeclaration': {
        const funcName = node.id.name;
        node.lexicalScope = scope;
        scope.declare(funcName, node);
        addStep(node, `Declare function "${funcName}".`);
        break;
      }
      
      case 'ClassDeclaration': {
        const className = node.id.name;
        scope.declare(className, node);
        addStep(node, `Declare class "${className}".`);
        break;
      }
      
      case 'ReturnStatement': {
        const val = node.argument ? evaluateExpression(node.argument, scope) : undefined;
        addStep(node, `Return value ${formatMemoryValue(val)}.`);
        throw new ReturnSignal(val);
      }
      
      default:
        throw new Error(`Unsupported statement type: ${node.type}`);
    }
  }

  try {
    for (const stmt of ast.body) {
      executeStatement(stmt, globalScope);
    }
  } catch (e) {
    if (e instanceof Error) {
      steps.push({
        line: ast.loc.end.line,
        explanation: `Error during execution: ${e.message}`,
        memory: getScopesAndMemory(scopeStack[scopeStack.length - 1]).memory,
        scopes: getScopesAndMemory(scopeStack[scopeStack.length - 1]).scopes,
        console: [...consoleLogs],
        error: true
      });
    } else {
      throw e;
    }
  }

  if (steps.length === 0) {
    steps.push({
      line: 1,
      explanation: 'No executable code found.',
      memory: {},
      scopes: [],
      console: []
    });
  }

  return steps;
}

// Test runner for classes
const code = `
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const p = new Point(10, 20);
console.log(p);
`;

const resSteps = generateTraces(code);
console.log(JSON.stringify(resSteps, null, 2));
