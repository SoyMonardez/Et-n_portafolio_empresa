// Wrapper para handlers async — captura promesas rechazadas y las pasa al errorHandler.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
