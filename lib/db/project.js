'use strict';
const Moment = require('moment');
const Error = require('./error');
const DB = require('./common/db');

class Project extends DB {
  constructor() {
    super('/project');
  }

  initValidor() {
    super.initValidor();

    const validor = this.validor;
    validor.check('name').notEmpty(Error.empty('项目'));

    const beginTimeName = '开始时间';
    validor.check('beginTime')
      .notEmpty(Error.empty(beginTimeName))
      .isDatetime(Error.format(beginTimeName));

    const endTimeName = '结束时间';
    validor.check('endTime')
      .notEmpty(Error.empty(endTimeName))
      .isDatetime(Error.format(endTimeName));
  }

  insert(data) {
    data = Object.assign({ name: '' }, data || {});
    const checkResult = this.validor.start(data);
    if (checkResult.pass) {
      data.beginTime = Moment().format(this.Format.DateTime);
      return super.insert(data);
    }
    return super.setFailure(Error.empty('项目名字'));
  }
}

module.exports = new Project;
