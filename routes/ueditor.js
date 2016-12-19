'use strict';
const path = require('path');
const express = require('express');
const ueditor = require("ueditor")
const router = express.Router();

router.all("/ue", ueditor(path.join(__dirname, '../public'), function(req, res, next) {
  var ActionType = req.query.action;
  if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
      var file_url = '/upload/image/';//默认上传地址为图片
      /*其他上传格式的地址*/
      if (ActionType === 'uploadfile') {
          file_url = '/upload/file/'; //附件保存地址
      }
      if (ActionType === 'uploadvideo') {
          file_url = '/upload/video/'; //视频保存地址
      }
      res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
      res.setHeader('Content-Type', 'text/html');
  }
  else if (ActionType === 'listimage'){
    //客户端发起图片列表请求
    var dir_url = '/images/ueditor/';
    res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
  }
  else {
    // 客户端发起其它请求
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/config.json');
  }
})
);

module.exports = router;
