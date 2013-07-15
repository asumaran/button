$(function(){
  $('.btn').button({
    onActivate: function () {
      console.log('on active callback');
    },
    onDeactivate: function () {
      console.log('on deactive callback');
    }
  });
});
