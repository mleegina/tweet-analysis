var app = angular.module("twitterbot", []);

app.controller("mainController", ['$scope','$http',function($scope, $http) {

  // The load function
  $scope.load = function(){
    // Error Handinling: If either of fields are blank display a note
    if($('#keyword').val() == "" || $('#quantity').val() == "") {
      $('#note').html('Slow down hotshot, enter a value for both');
    } else {
      // If both of the fields contain values, send the parameters
      $('#note').html('Your tweets are ready! To download, select a file type and click Export.');
    }
  };

  $scope.display = function(){
    // Receive mongoDB data, format, and display
    $.getJSON('/read', function(data){

      var twits = JSON.stringify(data);
      var quantity = document.getElementById("quantity").value;

      for (var i=0; i < quantity; i++){
        var tweet = "<li>" + "<div class = 'text'>" + data[0].statuses[i].text + "</div>" + "</li>";
        var userinfo = "<li><div class ='info'></br> <h4>"+ data[0].statuses[i].user.screen_name+ "</h4></br> Followers: "+ data[0].statuses[i].user.followers_count+"</div> </li>";
        $('#ticker').append(tweet);
        $('#profile').append(userinfo);
      };
    });
  };

  // Export Function & Error Handling
  $scope.export = function(){
    if ($('#filename').val()==""){
      $('#note').html("Don't forget to name your file!");
    } else {
      $('#note').html("To repeat, just go ahead and search another keyword!");
    }
  }
}]);
