'use strict';

var common = {
  namespace: function(name, value) {
    setNamespace(this, name, value);
    return this;
  }
};

function setNamespace(ctx, name, value) {
  if (!ctx) {
    throw 'namespace缺少上下文对象';
  }
  var arr = name.split('.');
  var data = ctx;
  arr.forEach(function(key) {
    data[key] = data[key] || {};
    data = data[key];
  });
  data = value;
  return ctx;
}
