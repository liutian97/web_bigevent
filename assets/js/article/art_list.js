$(function() {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;


  // 定义查询参数对象q （请求数据的时候，将q提交到服务器）
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initTable();
  initCate();
  // (1) 请求文章列表数据并使用模板引擎渲染列表结构
  // 获取文章列表数据 的 initTable 方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total);
      }
    })
  }

  // 定义美化时间格式的过滤器
  template.defaults.imports.dataFormat = function(date) {
    var dt = new Date(date);
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // (2) 发起请求获取并渲染文章分类的下拉选择框
  // 获取文章分类的列表数据 的 initCate 方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res);
        $("[name=cate_id]").html(htmlStr);
        // 动态添加的表单要通过 layui 重新渲染表单区域的UI结构 （1. 页面本身没有可选项内容  2. 通过模板引擎添加的并不会被layui的js文件所监听到）
        form.render();
      }
    })
  }

  // (3) 实现筛选的功能
  // 为筛选表单绑定 submit 事件
  $("#form-search").on('submit', function(e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  })

  // (4) 定义渲染分页的 renderPage 方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id  不用加 # 号
      count: total, // 数据总数，从服务端得到
      limit: q.pagesize, //每页显示的条数
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],

      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
      jump: function(obj, first) { //obj包含了当前分页的所有参数
        // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit;
        // initTable(); // 直接调用获取文章列表数据 的 initTable 方法 ，会造成死循环
        // 根据最新的 q 获取对应的数据列表，并渲染表格
        if (!first) { // 如果 first 的值为 undefined , 是通过 方式二 调用jump回调的，可以直接调用获取文章列表数据 的 initTable 方法进行更新
          initTable();
        }
      }
    })
  }

  // (5) 实现删除文章的功能
  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function() {
    // 获取删除按钮的个数
    var len = $(".btn-delete").length;
    var id = $(this).attr('data-id');
    // 提示用户是否要删除
    layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
      //do something
      // 根据 Id 删除文章分类
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！');
          }
          layer.msg('删除文章成功！');
          if (len === 1) {
            // 如果 len 的值等于1，删除后，页面上就没有数据.则让页码值 -1 之后,再重新调用 initTable 方法
            // 页码值最小必须是 1 （先判断页码值是否为1 ，不是在-1进行重新更新数据）
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable();
        }
      })
      layer.close(index);
    })
  })

})