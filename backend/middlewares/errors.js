const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) =>
{
    err.statusCode = err.statusCode || 500

    if (process.env.NODE_ENV === 'DEVELOPMENT')
    {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
    if (process.env.NODE_ENV === 'PRODUCTION')
    {
      let error = { ...err }
      error.message = err.message

      //Wrong Mongoose ObjectId Error
      if (err.name === 'CastError') {
        const message = `Resourcec not found,Invalid: ${err.path}`
        error = new ErrorHandler(message, 400)
      }

      //Handling Mongoose validation Error
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message)
        error = new ErrorHandler(message, 400)
      }

      //Hnadling Mongoose Duplicate Key errors
      if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        error = new ErrorHandler(message, 400)
      }
      //Handling Wrong jwt ErrorHandler
      if (err.name === 'JsonWebTokenError') {
        const message = 'Json Web Token is invalid, Try again!!!!'
        error = new ErrorHandler(message, 400)
      }
      //Handling Expired jwt Error
      if (err.name === 'TokenExpiredError') {
        const message = 'Json Web Token is expired, Try again!!!!'
        error = new ErrorHandler(message, 400)
      }

      res.status(err.statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error',
      })
    }
    
}