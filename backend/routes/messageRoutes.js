const express=require('express');
const { access } = require('../middlewares/authMiddleware');
const {sendMessage,allMessages}=require('../controllers/messageController');

const router=express.Router();

router.route('/').post(access,sendMessage);
router.route('/:chatId').get(access,allMessages);

module.exports=router