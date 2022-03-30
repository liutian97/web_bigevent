$(function() {
  var layer = layui.layer;
  var form = layui.form;

  initArtCateList();

  // (1) 获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return "获取文章分类列表失败！";
        }
        // console.log(res);
        var htmlStr = template('tpl-table', res);
        $("tbody").html(htmlStr);
      }
    })
  }


  // (2) 实现添加文章分类的功能 (按钮点击事件（弹出层） + 表单监听事件 （更新数据）)
  // 为"添加分类"添加点击事件
  var indexAdd = null;
  $("#btnAddCate").on('click', function() {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $("#dialog-add").html()
    })
  })

  // form表单是动态创建的，直接用form表单的id不能绑定submit事件
  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  $("body").on('submit', '#form-add', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/addcates',
      method: 'POST',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('新增文章分类失败！');
        }
        initArtCateList();
        layer.msg('新增文章分类成功！');
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd);
      }
    })
  })

  // (3) 文章类别页面实现 “操作” 的功能 (按钮点击事件（弹出层） + 表单监听事件 （更新数据）)
  // 通过 代理 的形式，为 btn-edit 按钮绑定点击事件 （给body,卡片区域的div都可绑定事件进行代理）
  var indexEdit = null;
  $("tbody").on('click', '.btn-edit', function() {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $("#dialog-edit").html()
    });
    // 根据 id 的值,发起请求获取文章分类的数据，并填充到表单中
    var id = $(this).attr('data-id');
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function(res) {
        form.val('form-edit', res.data) // 'form-edit'是修改分类的弹出层表单中 lay-filter 属性的值
      }
    })
  })

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新分类信息失败！');
        }
        layer.msg('更新分类信息成功！');
        layer.close(indexEdit);
        initArtCateList();
      }
    })
  })

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function() {
    var id = $(this).attr('data-id');
    // 提示用户是否要删除
    layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
      //do something
      // 根据 Id 删除文章分类
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败！');
          }
          layer.msg('删除文章分类成功！');
          initArtCateList();
          layer.close(index);
        }
      })
    })
  })


})