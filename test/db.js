'use strict';
const co = require('co');
const NEDB = require('nedb');
const dbWrap = require('co-nedb');

const db = dbWrap(new NEDB({ filename: './db/test.db', autoload: true }));

co(function*() {
  const id = new Date/1;
  yield db.insert({ name: `Tobi_${id}`, birthday: '1989-10-20 10:30:11' });
  yield db.insert({ name: `Jane_${id}`, birthday: '1990-01-22 08:33:12' });

  // const result = yield db.findOne({ name: { $regex: /^Tobi/ } });
  // console.log(result);

  // 删除成功后，返回删除的数量，可能为0的
  // const result3 = yield db.remove({ name: { $regex: /^\w{4}_/ } }, { multi: true });
  // console.log(result3);

  // 数量
  // yield db.count({ name: { $regex: /^\w{4}_/ } });

  // 更新，如果不掉用 $set 方法，则会替换整个对象
  // yield db.update({ name: { $regex: /^Tobi/ }}, { $set: {desc: 'a sunshine body', birthday: '1989-10-21 10:30:03'} });
  // const result2 = yield db.findOne({ name: { $regex: /^Tobi/ } });
  // console.log(result2);
});
