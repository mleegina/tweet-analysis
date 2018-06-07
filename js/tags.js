jQuery(document).ready(function ($) {
  function ticker() {
    $('#profile li:first').slideUp(function() {
      $(this).appendTo($('#profile')).slideDown();
    });
  }
  var timer = setInterval(ticker, 3000);
});
