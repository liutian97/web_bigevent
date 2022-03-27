$(function() {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”的链接
  $('#link_login').on('click', function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })


  // 自定义校验规则
  // (1) 从 layui 中获取 form 对象：(类似引入jQuery.js会生成$对象)
  var form = layui.form;
  var layer = layui.layer; // 在 layui 中使用 layer
  // (2) 通过 form.verify() 函数自定义校验规则：
  form.verify({
    // 自定义了一个叫做 pwd 校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function(value) {
      var pwd = $(".reg-box [name=password]").val(); // 属性选择器
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })


  // 发起 注册用户 的Ajax请求
  // 监听 注册表单 的提交事件
  $("#form_reg").on('submit', function(e) {
    // 1. 阻止默认的提交行为
    e.preventDefault();
    // 2. 发起Ajax的POST请求
    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val()
    }
    $.post('/api/reguser', data, function(res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功，请登录！');
      // 自动点击事件 跳转到登录页面
      $("#link_login").click();
    })
  })


  // 发起 登录 的Ajax请求
  // 监听 登录表单 的提交事件
  $("#form_login").submit(function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(), // 快速获取表单中的数据
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！');
        localStorage.setItem('token', res.token); // 将登录成功得到的 token 字符串，保存到 localStorage 中
        location.href = '/index.html'; // 跳转到后台主页
      }
    })
  })















})