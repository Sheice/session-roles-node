const Role = require('../models/Role');
const verifyExistRoles = {};

verifyExistRoles.verifyExistRoles = async (req, res, next) => {
    if(req.body.roles){
        for(let i = 0; i < req.body.roles.length; i++){
            const role = await Role.find({name: {$in: req.body.roles[i]}});
            if(role.length === 0){
                return res.json({success: false, msg:'El rol '+ req.body.roles[i] + ' no existe'})
            }
        }
    }
    next()
}


module.exports = verifyExistRoles;