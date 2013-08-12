$(function(){

	$('.btn-single').button({
    onActivate: function () {
      console.log('on active callback');
    },
    onDeactivate: function () {
      console.log('on deactive callback');
    }
  });

  $('.btn-unique').button({
    onActivate: function () {
      console.log('on active callback');
    },
    onDeactivate: function () {
      console.log('on deactive callback');
    }
  });

  $('.btn-multiple').button({
    onActivate: function () {
      console.log('on active callback');
    },
    onDeactivate: function () {
      console.log('on deactive callback');
    }
  });
  
});
