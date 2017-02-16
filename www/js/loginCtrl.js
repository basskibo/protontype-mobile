angular.module('loginModule', [])
  .controller('LoginCtrl', function ($scope, $stateParams, $http, $ionicPopup, $state, $ionicLoading, $ionicHistory, $location, $ionicNavBarDelegate, $ionicPlatform, $cordovaNetwork) {
// Perform the login action when the user submits the login form
    // Form data for the login modal
    document.addEventListener("deviceready", function () {

    $scope.isOnline = $cordovaNetwork.isOnline();

    }, false);

    $scope.loginData = {};
    $ionicNavBarDelegate.showBackButton(false);
    $ionicPlatform.registerBackButtonAction(function () {
      navigator.app.exitApp();
    }, 100);

    $scope.reload = function () {
      location.reload();
    };
    $scope.login = function (user) {

      var login = $http.post('https://protonbiz.herokuapp.com/auth/index', user);
      login.success(function (result) {
        // LocalService.set('auth_token', JSON.stringify(result));
        var token = result.token;
        var user = result.user;

        // var alertPopup = $ionicPopup.alert({
        //   title: 'Welcome ' + user.firstName + ' ' + user.lastName,
        //   template: 'Good to have you back.'
        // });
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        // alertPopup.then(function (res) {
        //
        // });
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>',
          duration: 4000
        }).then(function(){
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("user_name", user.firstName + " " + user.lastName);
          window.localStorage.setItem("companyId", user.companyId);
          $state.go('app.orders', {user: user,companyId: user.companyId});
          location.reload();
        });


      });
      login.error(function (res) {
        $scope.error = res.err;
      });
    };
  });
