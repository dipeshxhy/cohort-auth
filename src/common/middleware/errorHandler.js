export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
  next();
};
