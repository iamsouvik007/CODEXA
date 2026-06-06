import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ZoomableImage({ src, alt }) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <motion.img
        src={src}
        alt={alt}
        onClick={() => setIsZoomed(true)}
        className="my-6 max-h-[400px] w-auto cursor-zoom-in rounded-xl border border-border/50 shadow-md transition-shadow hover:shadow-lg"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
