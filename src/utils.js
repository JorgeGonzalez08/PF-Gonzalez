export const processError=(error, res)=>{
   console.log(error);
   res.setHeader('Content-Type','application/json');
res.status(500).json({status:'error', detalle:`${error.message}`})
}
