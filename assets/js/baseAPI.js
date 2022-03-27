// 在ajaxPrefilter中统一拼接请求的根路径
// 每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 $.ajaxPrefilter() 这个函数。 拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  options.url = 'http://www.liulongbin.top:3007' + options.url;
})