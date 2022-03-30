$(function() {
  var layer = layui.layer;
  var form = layui.form;

  initCate();

  // 初始化富文本编辑器
  initEditor();

  // (1) 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      mathod: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res);
        $("[name=cate_id]").html(htmlStr);
        // 调用 form.render() 方法渲染表单结构
        form.render();
      }
    })
  }

  // (2) 渲染封面裁剪区域
  // 实现基本裁剪效果
  // 1. 初始化图片裁剪器
  var $image = $('#image');
  // 2.裁剪选项
  var options = {
      spectRatio: 400 / 280,
      preview: '.img-preview'
    }
    // 3. 初始化裁剪区域 
  $image.cropper(options)

  // (3) 点击"选择封面"按钮打开文件选择框
  // 为选择封面的按钮，绑定点击事件处理函数
  $("#btnChooseImage").on('click', function() {
      $('#coverFile').click();
    })
    // (4) 将选择的图片设置到裁剪区域中
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
  $("#coverFile").on('change', function(e) {
    var files = e.target.files;
    if (files.length === 0) {
      return
    }
    // 更换裁剪的图片
    // 1. 拿到用户选择的文件
    var file = e.target.files[0];
    // 2. 根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(file);
    // 3. 更换
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // (5) 分析发布文章的实现步骤
  // 定义文章的发布状态
  var art_state = '已发布';

  // 为"存为草稿"按钮，绑定点击事件处理函数
  $("#btnSave2").on('click', function() {
    art_state = '草稿';
  })

  // (6) 基于Form表单创建FormData对象 （处理请求数据的参数）
  // 表单绑定 submit 提交事件
  $("#form-pub").on('submit', function(e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault();
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0]);
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state);
    // 4. 将裁剪后的图片，输出为文件
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将裁剪后的封面追加到FormData对象中
        fd.append('cover_img', blob);
        // 6. 发起 ajax 数据请求
        publishArticle(fd);
      })


    // forEach遍历对象
    // fd.forEach(function(value, key) { 
    //   console.log(key, value);
    // })
  })

  // (7) 发起Ajax请求实现发布文章的功能
  // 定义一个发布文章的 publishArticle 方法：
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！');
        }
        layer.msg('发布文章成功！');
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html';
      }
    })
  }

})