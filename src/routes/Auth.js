const { Router } = require("express");
const{Signin, Signup, verifyToken} = require('../controllers/Auth.Controllers');

const router = Router();

router.post('/signin', Signin);
router.post('/signup', Signup);
router.post('/token', verifyToken);


module.exports = router;
