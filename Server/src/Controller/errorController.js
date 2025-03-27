const errorController = (error,req,res,next)=>{
    error.status = error.status || "error";
    error.statusCode = error.statusCode || 500;

    return (res.status(error.statusCode).json({
        status: error.status,
        message:error.message
    }))
}

export default errorController;