/**
 * Wrap an async Express route handler so a rejected promise is forwarded to
 * `next(err)` instead of crashing the process or hanging the request.
 * @param {(req: import("express").Request, res: import("express").Response) => Promise<void>} fn
 * @returns {import("express").RequestHandler}
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

module.exports = asyncHandler;
