'use strict';
const express = require('express');
const router = express.Router();
const Code = require('./common').Code;
const DB = require('require-dir')('../lib/db');

// 新增项目
router.post('/add', function(req, res, next) {
  const body = req.body;
  DB.project.insert(body)
    .then(
      (data) => res.send({ code: Code.Success, data }),
      (error) => res.send({ code: Code.Failure, error })
    );
});

module.exports = router;
