import logger from "../helpers/logger.helper.js"

export const  winston =(req,res,next)=>{
    req.logger= logger
    logger.HTTP(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`),
    next()
}