var app = angular.module('landmarksApp')

app.controller('PlaylistsCtrl', function($scope) {
  $scope.locations = [
    { name: 'Mission San Jose', id: 1 },
    { name: 'Rancho Higuera Historical Park', id: 2 },
    { name: 'Centerville Pioneer Cemetery', id: 3 },
    { name: 'Leland Stanford Winery', id: 4 },
    { name: 'Ardenwood Historic Farm', id: 5 },
    { name: 'Shinn Historic Park & Arboretum', id: 6 }
  ];
})
