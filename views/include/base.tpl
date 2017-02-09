<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
  <link rel='stylesheet' href='/css/common.css' />
  <link rel="stylesheet" href="/css/jquery.modals.css" />
  <script src="/js/jquery.min.js"></script>
  <script src="/js/jquery.modals.js"></script>
  {% block block_head %}{% endblock %}
</head>
<body>

  <div id="main">
    <div id="sidebar">
      {% block block_sidebar %}{% endblock %}
    </div>

    <div id="content">
      {% block block_content %}{% endblock %}
    </div>
  </div>

  {% block block_foot %}{% endblock %}
</body>
</html>
