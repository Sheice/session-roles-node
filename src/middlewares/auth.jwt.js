const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role')

const auth = {}

 auth.verifyToken = async (req, res, next) => {
   try {
        const token = req.headers["x-access-token"];

        if(!token) {
            return res.json({success: false, msg:'Token inválido'});
        }

        const validateToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.userId = validateToken.id;

        const user = await User.findById(req.userId, {password: 0});
        if(!user){
            return res.json({success: false, msg:'Usuario no encontrado'});
        }

        next();
   } catch (error) {
       return res.json({success: false, msg:'no autorizado'})
   }
}

auth.isModerator = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if(!user){
        return res.json({success: false, msg:'No autorizado'}) 
    }

    const roles = await Role.find({_id: {$in: user.roles}})
    // if is moderator go next
    for(let i =0; i < roles.length; i++) {
        if(roles[i].name === "moderador"){
            next();
            return
        }
    }

     return res.json({success: false, msg:'No autorizado'})
}

auth.isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if(!user){
        return res.json({success: false, msg:'No autorizado'}) 
    }

    const roles = await Role.find({_id: {$in: user.roles}})
  
    // if is admin go next
    for(let i =0; i < roles.length; i++) {
        if(roles[i].name === "administrador"){
            next();
            return
        }
    }

     return res.json({success: false, msg:'No autorizado'})
}


module.exports = auth;