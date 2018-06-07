jQuery(document).ready(function ($) {
  function ticker() {
    $('#ticker li:first').slideUp(function() {
      $(this).appendTo($('#ticker')).slideDown();
    });
  }
  var timer = setInterval(ticker, 3000);
});
