'use strict';
const Thenable = require('thenablejs');

const co = require('co');
const path = require('path');
const NEDB = require('nedb');
const dbWrap = require('co-nedb');
const PipeValid = require('pipe-valid');

class DB {
  constructor(dbName) {
    this.db = dbWrap(new NEDB({ filename: path.join(__dirname, '../../../db/', './', dbName), autoload: true }));

    this.validor = new PipeValid();
    this.initValidor();

    this.Format = {
      DateTime: 'YYYY-MM-DD hh:mm:ss',
      Date: 'YYYY-MM-DD',
      Time: 'hh:mm:ss'
    };
  }

  initValidor() {
    const validor = this.validor;
    validor.define('isDatetime', function(time) {
      return /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(time + '');
    });
    validor.define('isDate', function(time) {
      return /\d{4}-\d{2}-\d{2}/.test(time + '');
    });
    validor.define('isTime', function(time) {
      return /\d{2}:\d{2}:\d{2}/.test(time + '');
    });
  }

  setSuccess(result) {
    return new Thenable(resolve => resolve(result));
  }

  setFailure(error) {
    return new Thenable((resolve, reject) => reject(error));
  }

  insert(data) {
    return co(function*() {
      let result = yield this.db.insert(data);
      console.log(1, result);
      return result;
    }.bind(this));
  }

  modify(condition, newData) {
    return co(function*() {
      let result = 0;
      if (condition) {
        result = yield this.db.update(condition, { $set: newData });
      }
      return result;
    }.bind(this));
  }

  remove(condition) {
    return co(function*() {
      let result = 0;
      if (condition) {
        result = yield this.db.remove(condition, { multi: true });
      }
      return result;
    }.bind(this));
  }

  queryOne(condition) {
    return co(function*() {
      let result = yield this.db.findOne(condition || {});
      return result;
    }.bind(this));
  }

  queryAll(condition) {
    return co(function*() {
      let result = yield this.db.find(data, condition || {});
      return result;
    }.bind(this));
  }

  queryCount(condition) {
    return co(function*() {
      let result = yield this.db.count(condition || {});
      return result;
    }.bind(this));
  }
}

module.exports = DB;
