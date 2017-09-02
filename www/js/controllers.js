angular.module('protonbiz_mobile.controllers', [])

  .controller('AppCtrl', function ($scope, $location, $ionicModal, $cordovaNetwork,$ionicSideMenuDelegate,  $rootScope, $ionicPopup, $state, $ionicPlatform, $http) {

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    document.addEventListener("deviceready", function () {

      $scope.network = $cordovaNetwork.getNetwork();
      $scope.isOnline = $cordovaNetwork.isOnline();
      // $scope.$apply();

      $scope.$on('cloud:push:notification', function(event, data) {
        var msg = data.message;
        alert(msg.title + ': ' + msg.text);
      });


      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        $scope.isOnline = true;
        $scope.network = $cordovaNetwork.getNetwork();

        // $scope.$apply();
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        console.log("got offline");
        $scope.isOnline = false;
        $scope.network = $cordovaNetwork.getNetwork();

        // $scope.$apply();
      })

    }, false);



    $rootScope.createNewOrder = function () {
      console.log('global go');
      $state.go('app.order_new');
    };

    $rootScope.createNewCustomer = function () {
      console.log('global go');
      $state.go('app.customer_new');
    };

    $rootScope.createNewProduct = function () {
      console.log('global go');
      $state.go('app.product_new');
    };

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $scope.goToProfile =  function () {
      $state.go('app.profile');
      $ionicSideMenuDelegate.toggleLeft();

    };

    function fetchCompany(id) {
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/company/" + id, config).then(function (res) {
        console.log(res);
        $rootScope.companyObj = res.data;
        window.localStorage.setItem("company", JSON.stringify(res.data));

      });
    }




    var userParsed = JSON.parse(localStorage.getItem("user"));
    $rootScope.currentUser = userParsed;

    $rootScope.userName = localStorage.getItem("user_name");
    $rootScope.company = localStorage.getItem("companyId");

    fetchCompany($rootScope.company);
    $scope.goToProducts = function () {
      $location.path('/app/products');
    };
    $scope.goToCustomers = function () {
      $location.path('/app/playlists');
    };
    $scope.goToOrders = function () {
      $location.path('/app/orders');
    };


    $scope.goToSetings = function () {
      $location.path('app.setings');
    };
    $scope.logout = function () {
      console.log('log out bitch');
      window.localStorage.setItem("token", "");
      window.localStorage.setItem("user_name", "");
      window.localStorage.setItem("companyId", "");
      window.localStorage.setItem("user", "");

      $rootScope.currentUser = null;
      $rootScope.userName = null;
      $rootScope.company = null;

      $location.path('/login');
    };
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function (e) {
//    console.log('current user: ' + $scope.currentUser.firstName);
    });

//  $scope.currentUser = user;

  })

  .controller('CustomersCtrl', function ($scope, $http, $rootScope, $ionicActionSheet, $state) {
    $scope.dataLoaded = false;
    console.log(' cusotmers Ctrl');
    $scope.showSearch = function () {
      $scope.searchActive = !$scope.searchActive;
    };

    fetchCustomers();

    $scope.doRefresh = function () {
      fetchCustomers();
    };

    function fetchCustomers() {
      console.log('fetching cusotmers');
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/customer?isActive=true&ownerId="+ $rootScope.company, config).then(function (res) {
        console.log(res);
        generateCredentialsImg(res.data);
        $scope.customers = res.data;
        $scope.dataLoaded = true;

      }).finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });


      function generateCredentialsImg(customers) {
        for(var i = 0; i < customers.length; i++){
          var firstNameCred = customers[i].firstName.substring(0,1).toUpperCase();
          var lastNameCred = customers[i].lastName.substring(0,1).toUpperCase();
          customers[i].cred = firstNameCred + lastNameCred;
        }
      }
    }

    $scope.onHold = function (customer) {
      console.log('holding....');
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: 'Call'},
          {text: 'Send SMS'},
          {text: 'Send email'},
          {text: 'Edit'}
        ],
        destructiveText: 'Remove',
        titleText: 'Customers action',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          console.log(index);
          return true;
        },
        destructiveButtonClicked: function () {
          customer.isActive =false;
           $http({
            method: 'PUT',
            url: 'https://protonbiz.herokuapp.com/customer/' + customer.id,
            data: customer,
             headers: config.headers
          }).then(function (response) {
             console.log(response.data);
             hideSheet();
             $scope.dataLoaded = false;
             fetchCustomers();
           }).catch(function (error) {
             console.log(error.data);
          });
          console.log('sada jeste',customer.id);
        }
      });
    };

  })

  .controller('CustomerCtrl', function ($scope, $stateParams,$ionicActionSheet, $http) {
    $scope.dataLoaded = false;

    var sv = $stateParams.customerId;
    var config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'Accept': 'application/json;odata=verbose'
      }
    };

    $http.get("https://protonbiz.herokuapp.com/customer/" + sv, config).then(function (res) {
      console.log(res);
      $scope.customer = res.data;
      $scope.dataLoaded = true;

    });

    $scope.show = function () {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: 'See clients profile'},
          {text: 'Remind client'},
          {text: 'Edit'}
        ],
        destructiveText: 'Remove',
        titleText: 'Invoice action',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          console.log('Button pressed ' + index);
          return true;
        }
      });

      $scope.callNumber = function (num) {
        console.log("1244444444444444444444444444444444444444444444444444444444444444444444");
        window.plugins.CallNumber.callNumber(onSuccess, onError, num, true);

      };

      function onSuccess(result){
        console.log("Success:"+result);
      }

      function onError(result) {
        console.log("Error:"+result);
      }

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 20000);

    };

  })

  .controller('ProductsCtrl', function ($scope, $stateParams, $http, $rootScope) {
    $scope.dataLoaded = false;

    fetchProducts();

    $scope.showSearch = function () {
      $scope.searchActive = !$scope.searchActive;
    };

    $scope.doRefresh = function () {
      fetchProducts();
    };

    function fetchProducts() {
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/product?ownerId=" + $rootScope.company, config).then(function (res) {
        console.log(res);
        $scope.products = res.data;
        $scope.dataLoaded = true;
      }).finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
    }



  })


  .controller('OrdersCtrl', function ($scope, $stateParams, $http, $rootScope, $state, $ionicActionSheet) {
    $scope.$on('cloud:push:notification', function(event, data) {
      var msg = data.message;
      console.log('##########################', msg);
      alert(msg.title + ': ' + msg.text);
    });
    $scope.dataLoaded = false;

    fetchOrders($rootScope.company);


    $scope.goToOrder = function (id) {
      $state.go('app.order', {orderId: id});
    };


    $scope.showSearch = function () {
      $scope.searchActive = !$scope.searchActive;
    };

    $scope.doRefresh = function () {
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/orders?ownerId=" + $rootScope.company, config).then(function (res) {
        console.log(res);
        $scope.orders = res.data;
        $scope.dataLoaded = true;
      })
    .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });



    };

    $scope.onHold = function () {
      console.log('holding....')
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: 'Edit'}
          ],
          destructiveText: 'Remove',
          titleText: 'Invoice action',
          cancelText: 'Cancel',
          cancel: function () {
            // add cancel code..
          },
          buttonClicked: function (index) {
            return true;
          }
        });
    };

    function fetchOrders(companyId) {
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/orders?ownerId=" + companyId, config).then(function (res) {
        console.log(res);
        $scope.orders = res.data;
        $scope.dataLoaded = true;
      });


      $rootScope.$on('fetch_orders', function (args, companyId) {
        fetchOrders(companyId);
      });
      $scope.$watch('orders', function (args, vs) {
        $scope.orders = args;
      })
    }
  })



  .controller('OrderCtrl', function ($scope, $stateParams, $http, $ionicActionSheet, $timeout, $location) {
    var sv = $stateParams.orderId;
    $scope.dataLoaded = false;

    var config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'Accept': 'application/json;odata=verbose'
      }
    };
    $http.get("https://protonbiz.herokuapp.com/orders/" + sv, config).then(function (res) {
      console.log(res);
      $scope.order = res.data;
      $scope.dataLoaded = true;
    });

    $scope.show = function () {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: 'Change Invoice status'},
          {text: 'See clients profile'},
          {text: 'Edit'}
        ],
        destructiveText: 'Remove',
        titleText: 'Invoice action',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          switch(index){
            case 0:
              $location.path('/app/customers/' + $scope.order.customerId);
              break;
            case 1:
              $location.path('/app/changeStatus/'+ $scope.order.id);
              console.log('oasjgsa',index);
              break;
          }
          return true;
        }
        ,
        destructiveButtonClicked : function(index){
          console.log("DESTROY BUTTON !");
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 20000);

    };
    })

  .controller('ProductCtrl', function ($scope, $stateParams, $http, $ionicActionSheet, $timeout) {
    var sv = $stateParams.productId;
    $scope.dataLoaded = false;

    var config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'Accept': 'application/json;odata=verbose'
      }
    };
    $http.get("https://protonbiz.herokuapp.com/product/" + sv, config).then(function (res) {
      console.log(res);
      $scope.order = res.data;
      $scope.dataLoaded = true;

    });

    $scope.show = function () {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: 'Edit'}
        ],
        destructiveText: 'Remove',
        titleText: 'Product action',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 20000);

    };
    })









    .controller('SettingsCtrl', function ($scope, $stateParams, $ionicPopup, $translate) {
      $scope.changeLanguage = function (langKey, $translateProvider) {

        $translate.use(langKey);
        if (langKey == 'rs') {
          text = 'Jezik promenjen na srpski';
        }


        var lng = $translate.use();
        var title;
        console.log(lng);
        console.log($scope.user);

        if (lng == 'rs') {
          lng = "Jezik promenjen na Srpski";
          title = "Jezik";
        } else if (lng == 'en') {
          lng = "Language changed to English";
          title = 'Language';
        } else if(lng == 'ar'){
          lng = "تغيير اللغة إلى العربية";
          title = 'لغة';
        } else if(lng == 'de'){
          lng = "Sprache geändert auf Deutsch";
          title= "Sprache";
        }
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: lng
        });
      };

    })

    .controller('UsersCtrl', function ($scope, $stateParams, $http) {

      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/user", config).then(function (res) {
        console.log(res);
        $scope.users = res.data;
      });

    })
  .controller('changeStatusCtrl', function ($scope, $stateParams, $http) {
    var orderId = $stateParams.orderId;
    console.log(orderId);
    var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };

    $scope.change = function (status) {
      console.log(status);
    };
      $http.get("https://protonbiz.herokuapp.com/orders/" + orderId, config).then(function (res) {
        console.log('order' , res);
        $scope.order = res.data;
      });

    });
