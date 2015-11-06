var app = angular.module('landmarksApp');

app.factory('landmark', function($window, $http){
  var landmark = {};

  landmark.getAll = function(){
    return $http.get('/landmarks')
  }

  landmark.getOne = function(id){
    return $http.get(`/landmarks/${id}`)
  }

  return landmark;
})
