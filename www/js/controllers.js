
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $location, $ionicModal, $cordovaNetwork, $rootScope, $ionicPopup, $state, $ionicPlatform ) {


  document.addEventListener("deviceready", function () {

    $scope.network = $cordovaNetwork.getNetwork();
    $scope.isOnline = $cordovaNetwork.isOnline();
    $scope.$apply();

    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      $scope.isOnline = true;
      $scope.network = $cordovaNetwork.getNetwork();

      $scope.$apply();
    })

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      console.log("got offline");
      $scope.isOnline = false;
      $scope.network = $cordovaNetwork.getNetwork();

      $scope.$apply();
    })

  }, false);


  $scope.user = localStorage.getItem("user_name");
  $scope.company = localStorage.getItem("companyId");
  $scope.goToProducts = function () {
    $location.path('/app/products');
  };
  $scope.goToCustomers = function () {
    $location.path('/app/playlists');
  };
  $scope.goToOrders = function () {
    $location.path('/app/orders');
  };

  $scope.logout = function () {
    console.log('log out bitch');
    window.localStorage.setItem("token", "");
    window.localStorage.setItem("user_name", "");
    window.localStorage.setItem("companyId", "");
    $location.path('/login');
  };
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
//    console.log('current user: ' + $scope.currentUser.firstName);
  });

//  $scope.currentUser = user;

})

.controller('PlaylistsCtrl', function($scope, $http) {
  $http({
    method  : 'GET',
    withCredentials: false,
    url     : 'https://protonbiz.herokuapp.com/customer?ownerId='+$scope.company
  })
    .success(function(data) {
      $scope.customers = data;
    });
})

.controller('PlaylistCtrl', function($scope, $stateParams, $http) {


})

  .controller('ProductsCtrl', function($scope, $stateParams, $http) {
    $http({
      method  : 'GET',
      withCredentials: false,
      url     : 'https://protonbiz.herokuapp.com/product?ownerId='+$scope.company
    })
      .success(function(data) {
        $scope.products = data;
      });

})


.controller('OrderCtrl', function($scope, $stateParams, $http) {
$http({
    method  : 'GET',
    withCredentials: false,
    url     : 'https://protonbiz.herokuapp.com/orders?ownerId='+$scope.company
  })
    .success(function(data) {
      $scope.orders = data;
    });
})


.controller('UsersCtrl', function($scope, $stateParams, $http) {

$http({
    method  : 'GET',
    withCredentials: false,
    url     : 'https://protonbiz.herokuapp.com/user'
  })
    .success(function(data) {
      $scope.users = data;
    });
});
