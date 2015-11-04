var app = angular.module('landmarksApp');



app.controller('MapCtrl', function($scope, $ionicLoading, $compile, landmark) {
  $scope.$on('$ionicView.enter', function() {
    initialize();
  });
      function initialize() {
        var landmarksMap;
        var myLatlng;
        var bounds;
        var center;
        var area;
        var displayLocationArray = [];
        var styles = [
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [
              { saturation: -100 },
              { invert_lightness: true }
            ]
          }, {
            "featureType": "landscape",
            "stylers": [
              { "weight": 0.1 },
              { "saturation": 58 },
              { "color": "#FBF8E7" }
            ]
          }
        ];

        function boundsAndCenter(landmarksMap){
          var boundsObj = landmarksMap.getBounds();
          console.log(boundsObj);
          var ne = boundsObj.getSouthWest().toString();
          var sw = boundsObj.getNorthEast().toString();

          bounds = {NE: ne, SW: sw};
          center = landmarksMap.getCenter().toString();
        }

        function calcArea(center, bounds){
          var neBounds = formatCoord(bounds.NE);
          var swBounds = formatCoord(bounds.SW);
          var distanceEq = Math.pow((parseFloat(swBounds[0]) - parseFloat(neBounds[0])), 2) + Math.pow((parseInt(swBounds[1]) - parseInt(neBounds[1])), 2);
          var distance = Math.sqrt(distanceEq);
          var radius = distance/2;
          area = (Math.PI * Math.pow(radius, 2));
        }

        function formatCoord(coord){
          return coord.split("").filter(function(el){
            return el.match(/[\d|,|\.]/g);
          }).join("").split(",");
        }

        function ConvertDMSToDD(degrees, minutes, seconds, direction) {
          var dd = parseFloat(degrees + minutes/60 + seconds/(60*60));

          if (direction == "S" || direction == "W") {
              dd = dd * -1;
          } // Don't do anything for N or E
          return dd;
        }

        function getLandmarks(){
          landmark.getAll()
          .success(function(locations){
            locations.forEach(function(location){
              formatLandmarkCoordinates(location);
            })
          })
          .error(function(err){
            console.log(err);
          })
        }

        function formatLandmarkCoordinates(location){
          if (!location.latitude){
            var formated = location.location.split(",");
            var coordinates = {lat: parseFloat(formated[0]), lng: parseFloat(formated[1])};
          } else {
            var latParts = location.latitude.split(/[^\d\w]+/);
            var lngParts = location.longitude.split(/[^\d\w]+/);
            var lat = ConvertDMSToDD(latParts[0], latParts[1], latParts[2], latParts[3]) * .1;
            var lng = ConvertDMSToDD(lngParts[0], lngParts[1], lngParts[2], lngParts[3]) * .1;
            var coordinates = {lat: lat, lng: lng};
          }
          landmarkFromCenter(coordinates, location);
        }

        function landmarkFromCenter(landmarkCoord, location){
          // console.log(landmarkCoord);
          var centerCoord = formatCoord(center);
          var distanceEq = Math.pow((parseFloat(landmarkCoord.lat) - parseFloat(centerCoord[0])), 2) + Math.pow((parseInt(landmarkCoord.lng) - parseInt(centerCoord[1])), 2);
          var distance = Math.sqrt(distanceEq);
          var areaCeil = parseInt(Math.ceil(area));
          if(distance < areaCeil){
            console.log(landmarkCoord);
          }
        }

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
            var mapOptions = {
              center: myLatlng,
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              styles: styles
            };

            landmarksMap = new google.maps.Map(document.getElementById("map"),
            mapOptions);

            landmarksMap.addListener('zoom_changed', function() {
              boundsAndCenter(landmarksMap);
              calcArea(center, bounds);
              getLandmarks();
            });

            landmarksMap.addListener('center_changed', function() {
               boundsAndCenter(landmarksMap);
               calcArea(center, bounds);
               getLandmarks()
            });

            google.maps.event.addListenerOnce(landmarksMap, 'idle', function(){
              boundsAndCenter(landmarksMap)
              calcArea(center, bounds);
              getLandmarks();
            });
            callback();
          }
        ], function(err){
          if(err){
            alert(err);
          }
          $scope.map = landmarksMap;
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

      }
    });
