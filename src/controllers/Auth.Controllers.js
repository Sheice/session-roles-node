const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const Role = require('../models/Role');
const  authCtrl = {};

authCtrl.Signup = async (req, res) => {
    const {username, password, confirmPassowrd, email, roles} = req.body;

    if(!username || !password || !email || !confirmPassowrd ){
        return res.json({success: false, msg:'Completa todos los datos correctamente'})
    }


    // match if the user exist
    const userFound = await User.findOne({username});
   
    if(userFound) {
      return res.json({success: false, msg:'El usuario ya está en uso'})
    }

    const foundEmail = await User.findOne({email: email});
   

    if(foundEmail) {
        return res.json({success: false, msg:'El email ya está registrado'})
    }

  
    // // validate dates of client
   

    if(username.length < 3) {
        return res.json({success: false, msg:'El usuario debe tener al menos 3 dígitos'})
    }

    if(!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)){
        return res.json({success: false, msg:'Email inválido'})
    }

    if(password.length < 4) {
        return res.json({success: false, msg:'La contraseña debe tener al menos 4 dígitos'})
    }

    if(password !== confirmPassowrd) {
        return    res.json({success: false, msg:'Contraseñas diferentes'})
    }

    // encrypt password
   const salt = await bcrypt.genSalt(10);

    
    const newUser = new User({
        username,
        email,
        password: await bcrypt.hash(password, salt)
    });

    // if there's role and exist in the database, add 
    if(roles){
        const foundRoles = await Role.find({name: {$in: roles}});
        newUser.roles = foundRoles.map(role => role._id)
    } else {
        const role = await Role.findOne({name: "usuario"});
        newUser.roles = [role._id];
    }
    
    const user =  await newUser.save();

    // add token

    const token = jsonWebToken.sign({id: user._id}, process.env.JWT_SECRET , {
        expiresIn: 21600 // 6 hours
    });

    return res.json({success: true, token,  msg:'Se  ha registrado correctamente'})
}

authCtrl.Signin = async (req, res) => {
    const {email, password} = req.body;

    const userfound = await User.findOne({email: email}).populate("roles");

    if(!userfound){
        return res.json({success: false, msg:'Usuario no registrado'});
    }

    const validatePassword = await bcrypt.compare(password, userfound.password);

    if(!validatePassword) {
        return res.json({success: false, msg:'Contraseña inválida'});
    }

       // add token

    
    const token = jsonWebToken.sign({id: userfound._id}, process.env.JWT_SECRET, {
        expiresIn: 21600 // 6 hours
    })

    res.json({success: true, token, user: userfound});

}


// verify token
authCtrl.verifyToken = async (req, res) => {
   
  
        const token = req.headers["x-access-token"];

        if(!token) {
            return res.json({success: false, msg:'Token inválido'});
        }
    
        const validateToken = jsonWebToken.verify(token, process.env.JWT_SECRET);
      
        req.userId = validateToken.id;

        const user = await User.findById(req.userId);
        if(!user){
            return res.json({success: false, msg:'Usuario no encontrado'});
        }

        res.json({success: true, user});
}

module.exports = authCtrl;