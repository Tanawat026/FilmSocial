// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','ngCordovaOauth'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
    $stateProvider
    .state('home',{
        url:'/home',
        controller:'sampleFacebookController'
    });
    $urlRouterProvider.otherwise('/home');
})

.controller('sampleFacebookController',function($scope,$http,$cordovaOauth){
  $scope.facebookLogin = function(){
     $cordovaOauth.facebook("198141657343845", ["public_profile","email"]).then(function(result) {
         console.log(JSON.stringify(result));
        //window.localStorage.setItem("AccessToken",result.access_token);
          $scope.access_token = result.access_token
        $http.get("https://graph.facebook.com/v2.8/me", { params: { access_token: $scope.access_token, fields: "id,name,gender,email,picture,age_range", format: "json" }}).then(function(result) {
            $scope.fbid = result.data.id;
            $scope.email = result.data.email;
            $scope.name = result.data.name;
            $scope.gender = result.data.gender;
            $scope.age_range = result.data.age_range.min;
            $scope.picture = result.data.picture.data.url;
            alert("Welcome : "+$scope.name);
          $state.go('FirstPage', {name:$scope.name,picture:$scope.picture});
         });

     }, function(error) {
         console.log(error);
     });
     };
})

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
})

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(7.8945151,98.3525661),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($element[0], mapOptions);

        $scope.onCreate({map: map});

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
})
