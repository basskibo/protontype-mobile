angular.module('loginModule', [])
  .controller('LoginCtrl', function ($rootScope, $scope, $stateParams, $http, $timeout, $ionicPopup, $state, $ionicLoading, $ionicHistory, $location, $ionicNavBarDelegate, $ionicPlatform, $cordovaNetwork) {
// Perform the login action when the user submits the login form
    // Form data for the login modal
    $scope.isOnline = true;
    document.addEventListener("deviceready", function () {

    $scope.isOnline = $cordovaNetwork.isOnline();

    }, false);

    $scope.loginData = {};
    $ionicNavBarDelegate.showBackButton(false);
    $ionicPlatform.registerBackButtonAction(function () {
      navigator.app.exitApp();
    }, 100);

    $scope.reload = function () {
        $ionicLoading.show({
          template: "<ion-spinner icon=\'spiral\'></ion-spinner>\n",
          duration: 3000
        }).then(function(){
          console.log("The loading indicator is now displayed");
        });


    };


    $scope.reload2 = function () {
      $ionicLoading.show({
        template: "<ion-spinner name='bubbles'></ion-spinner>",
        duration: 10000,
        name:'ios'
      }).then(function(){
      });
    };



    $scope.checkConnection = function(){
      var networkState = navigator.connection.type;
      var states = {};
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.CELL]     = 'Cell generic connection';
      states[Connection.NONE]     = 'No network connection';

      alert('Connection type: ' + states[networkState]);
    };

    $scope.login = function (user) {

      var login = $http.post('https://protonbiz.herokuapp.com/auth/index', user);
      login.success(function (result) {
        var token = result.token;
        var user = result.user;

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $ionicLoading.show({
          template: "<ion-spinner name='bubbles'></ion-spinner>",
          duration: 5000,
          name:'ios'
        }).then(function(){
          console.log('doneeeee');
          setToLocaleStorage(token, user);
          $rootScope.currentUser = user;
          $rootScope.userName = localStorage.getItem("user_name");
          $rootScope.company = localStorage.getItem("companyId");
          // $rootScope.$broadcast('fetch_orders', $rootScope.company);
          $timeout(changeState,4000);
        });

        function changeState() {
          $state.go('app.orders', {user: user,companyId: user.companyId});
        }

        function setToLocaleStorage(token, user) {
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("user_name", user.firstName + " " + user.lastName);
          window.localStorage.setItem("companyId", user.companyId);
          window.localStorage.setItem("user", JSON.stringify(user));
          // location.reload();
        }
      });
      login.error(function (res) {
          $scope.error = res.err;
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed',
            template: $scope.error
          });

          alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
          });
      });
    };
  });
