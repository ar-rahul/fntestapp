
const HttpStatusCode = require('./httpStatusCode.js');
const AppError = require('./appError.js');

const sendErrorDev = (err, req, res) => {

    err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stackTrace: err.stack
    })
    
}

const sendErrorProd = (err, req, res) => {


    if(err.isOperational) {
        
    err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';


     res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })

    } else {

        err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;

        res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went wrong',
            })
    }

    
    
}


const globalErrorHandler = (err, req, res, next) => { 

    //console.log('Error Found');

    if(process.env.NODE_ENV === 'development'){

        sendErrorDev(err, req, res);

    } else if (process.env.NODE_ENV === 'production') {

        if (err.name =='CastError') err = handleCastError(err);

        sendErrorProd(err, req, res);

    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

    }
}

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, HttpStatusCode.BAD_REQUEST);
}

module.exports = globalErrorHandler;