const Role = require('../models/Role');

const createRoles = async () => {
  try {
        const count = await Role.estimatedDocumentCount();

        if(count > 0) return;

       
        const user = new Role({name: 'usuario'}).save();
        const moderator = new Role({name: 'moderador'}).save();
        const admin = new Role({name: 'administrador'}).save();

        await user.save();
        await moderator.save();
        await admin.save();
        
  } catch (error) {
      console.error(error)
  }
}

module.exports =  createRoles;