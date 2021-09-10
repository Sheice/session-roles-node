const Role = require('../models/Role');
const User = require('../models/User');
const userCtrl = {};

userCtrl.getUsers = async (req, res) => {
    const users = await User.find().populate('roles');

    if(!users){
        return res.json({success: false, msg:'Ha ocurrido un error'});
    }

    return res.json({success: true, users});
}

userCtrl.updateRoles = async (req, res) => {
    const roles = await Role.find({name: {$in: req.body.roles}})
    const user = await User.findByIdAndUpdate(req.params.userID, {roles: roles}, {new: true});

    
    if(!user){
        return res.json({success: false, msg:'Ha ocurrido un error'})
    }

    return res.json({success: true, msg:'Se ha actualizado correctamente', user})
}

userCtrl.deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.userID);
    if(!user){
        return res.json({success: false, msg:'Ha ocurrido un error'})
    }

    return res.json({success: true, msg:'Se eliminó correctamente', user})
}
 

module.exports = userCtrl;