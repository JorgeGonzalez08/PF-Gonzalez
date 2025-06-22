export function onlyAdmin(req,res,next) {
    if (req.user.rol === "admin") {
        next();
    }else{
        res.status(403).send('Acceso denegado. Solo administradores pueden ingresar')
    }
}

export function onlyUser(req,res,next) {
    if (req.user.rol==='user') {
        next();
    }else{
        res.status(403).send('Acceso denegado. Solo usuarios pueden ingresar')
    }
}