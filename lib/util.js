'use strict';
const os = require('os');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  isDir (fullpath, notExistValue) {
    if (fs.existsSync(fullpath)) {
      let stat = fs.statSync(fullpath);
      return stat.isDirectory();
    }
    return notExistValue;
  },

  openBrowser (target, callback) {
    var map, opener;
    map = {
      'darwin': 'open',
      'win32': 'start '
    };
    opener = map[process.platform] || 'xdg-open';
    return require("child_process").exec(opener + ' ' + target, callback || function() {});
  },

  getIps () {
    const ifaces = os.networkInterfaces();
    const ips = [];
    Object.keys(ifaces).forEach(key => {
      ifaces[key].forEach(details => {
        if (details.family === 'IPv4') {
          ips.push(details.address);
        }
      });
    });
    return ips;
  }
};
