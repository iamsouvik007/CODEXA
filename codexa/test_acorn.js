import * as acorn from 'acorn';
const code = `for(let i = 0; i < 10; i++) {
  console.log(i);
}`;
const ast = acorn.parse(code, { ecmaVersion: 2020, locations: true });
console.log(JSON.stringify(ast, null, 2));
