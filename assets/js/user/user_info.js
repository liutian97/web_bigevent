$(function() {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: function(value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间'
      }
    }
  })
  initUserInfo();

  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      url: '/my/userinfo',
      method: 'GET',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        console.log(res);

        // 使用form.val方法快速为表单赋值
        form.val('formUserInfo', res.data) // formUserInfo 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值

      }
    })

  }

  // 实现表单的重置效果
  $("#btnReset").on('click', function(e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    initUserInfo();
  })

  //发起请求更新用户的信息
  // 监听表单的提交事件
  $(".layui-form").on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/my/userinfo',
      method: 'POST',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('修改用户信息失败！');
        }
        layer.msg('修改用户信息成功！');
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo(); // window是子页面的窗口（当前是iframe窗口），父页面的窗口是index.html。
      }
    })
  })


})