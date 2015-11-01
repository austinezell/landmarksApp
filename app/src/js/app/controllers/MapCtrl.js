var app = angular.module('landmarksApp')



app.controller('MapCtrl', function($scope, $stateParams) {
  $scope.$on('$ionicView.enter', function() {
    detectBrowser()
  });

  function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
  }
});
