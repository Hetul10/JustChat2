const express=require("express");
const {access} =require("../middlewares/authMiddleware");
const {createGroupChat,renameGroup,removeFromGroup,addToGroup,accessChat,fetchChat}=require('.././controllers/chatController');

const router=express.Router();

router.route("/").post(access,accessChat).get(access,fetchChat);
router.route('/group').post(access,createGroupChat);
router.route('/rename').put(access,renameGroup);
router.route('/groupremove').put(access,removeFromGroup);
router.route('/groupadd').put(access,addToGroup);

module.exports=router;