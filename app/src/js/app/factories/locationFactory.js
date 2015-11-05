var app = angular.module('landmarksApp');

app.factory('landmark', function($window, $http){
  var landmark = {};

  landmark.getAll = function(){
    return $http.get('/landmarks')
  }

  return landmark;
})
