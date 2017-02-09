'use strict';

var $sidebar = $('#sidebar'),
  $content = $('#content');

// 侧边栏逻辑
(function() {
  $sidebar.on('click', '.addItem', function() {
    $.prompt('新工作项名字', function(name) {
      console.log('新增工作项目', arguments);
    });
  });
})();
