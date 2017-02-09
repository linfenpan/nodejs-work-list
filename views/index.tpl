{% extends './include/base.tpl' %}

{% block block_sidebar %}
  <input class="title" type="text" placeholder="工作项" />
  <div class="main">
    <ul class="workList">
      <li>
        <div class="text">[梦幻]短信还价系统</div>
        <div class="opers">
          <a href="javascript:;" class="">查看</a>
        </div>
      </li>
      <li>
        <div class="text">[梦幻]短信还价系统</div>
        <div class="opers">
          <a href="javascript:;" class="">查看</a>
        </div>
      </li>
    </ul>
  </div>
  <a href="javascript:;" class="addItem">新增<span class="b">+</span></a>
{% endblock %}

{% block block_content %}


  <!-- 加载编辑器的容器 -->
  <!-- <script id="container" name="content" type="text/plain">这里写你的初始化内容</script> -->
  <!-- 实例化编辑器 -->
  <!-- <script type="text/javascript">
      var ue = UE.getEditor('container');
  </script> -->
{% endblock %}

{% block block_foot %}
  <script src="/js/index.js"></script>
{% endblock %}
