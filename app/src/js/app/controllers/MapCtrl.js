var app = angular.module('landmarksApp');



app.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
  $scope.$on('$ionicView.enter', function() {
    $scope.locations = [
      { name: 'Mission San Jose', id: 1 },
      { name: 'Rancho Higuera Historical Park', id: 2 },
      { name: 'Centerville Pioneer Cemetery', id: 3 },
      { name: 'Leland Stanford Winery', id: 4 },
      { name: 'Ardenwood Historic Farm', id: 5 },
      { name: 'Shinn Historic Park & Arboretum', id: 6 }
    ];
    initialize();
  });
      function initialize() {

        var myLatlng;

        async.series([
          function(callback){
            $scope.loading = $ionicLoading.show({
              content: 'Getting current location...',
              showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function(pos) {
              console.log(pos);
              myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
              $scope.loading.hide();
              callback();
            }, function(error) {
              alert('Unable to get location: ' + error.message);
              callback(error);
            });
          },
          function(callback){
            console.log(myLatlng);
            var mapOptions = {
              center: myLatlng,
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
            callback();
          }
        ], function(err){
          if(err){
            alert(err);
          }
          $scope.map = map;
        });


        //Marker + infowindow + angularjs compiled ng-click
        // var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        // var compiled = $compile(contentString)($scope);
        //
        // var infowindow = new google.maps.InfoWindow({
        //   content: compiled[0]
        // });
        //
        // var marker = new google.maps.Marker({
        //   position: myLatlng,
        //   map: map,
        //   title: 'Uluru (Ayers Rock)'
        // });
        //
        // google.maps.event.addListener(marker, 'click', function() {
        //   infowindow.open(map,marker);
        // });

        $scope.map = map;
      }
      // google.maps.event.addDomListener(window, 'load', initialize);

      function centerOnMe() {
        if(!$scope.map) {
          return;
        }


        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };

      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };

    });
