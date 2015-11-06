var app = angular.module('landmarksApp');

app.factory('landmark', function($window, $http, auth){
  var landmark = {};

  landmark.getAll = function(){
    return $http.get('/landmarks')
  }

  landmark.getOne = function(id){
    return $http.get(`/landmarks/${id}`)
  }

  landmark.addToVisited = (id) => {
    console.log('hit');
    $http.defaults.headers.common.Authorization = `Bearer ${auth.getToken()}`;
    return $http.post(`/users/visited/${id}`)
  }

  return landmark;
})
