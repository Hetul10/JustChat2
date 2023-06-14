const express=require('express');
const router=express.Router();
const {registerUser,authUser,allUsers}=require('../controllers/userController');
const {access}=require('.././middlewares/authMiddleware');

router.route('/').post(registerUser).get(access,allUsers);
router.post('/login',authUser);

module.exports=router;