const { Router } = require("express");
const {getUsers, updateRoles, deleteUser} = require('../controllers/User.Controllers');
const {verifyExistRoles} = require('../middlewares/verifyExistRoles');
const {verifyToken, isAdmin} = require('../middlewares/auth.jwt');

const router = Router();

router.get('/',[verifyToken, isAdmin], getUsers);
router.put('/update/:userID', [verifyToken, isAdmin, verifyExistRoles], updateRoles)
router.delete('/delete/:userID', [verifyToken, isAdmin], deleteUser);


module.exports = router;