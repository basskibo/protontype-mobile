angular.module('protonbiz_mobile.controllers', [])

  .controller('AppCtrl', function ($scope, $location, $ionicModal, $cordovaNetwork, $ionicSideMenuDelegate, $rootScope, $ionicPopup, $state, $ionicPlatform, $http) {

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    document.addEventListener("deviceready", function () {

      $scope.network = $cordovaNetwork.getNetwork();
      $scope.isOnline = $cordovaNetwork.isOnline();
      // $scope.$apply();

      $scope.$on('cloud:push:notification', function (event, data) {
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


    $rootScope.$on('fetchCustomer', function (args,ve) {
      $scope.customers = null;
      console.log("fetching. . .... . ... . . . . .");
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/customer?isActive=true&ownerId=" + $rootScope.company, config).then(function (res) {
        console.log('customers' ,$scope.customers);
        console.log('Fetched' ,res);
        // generateCredentialsImg(res.data);
        $scope.$emit('refreshCustomers',res.data);
        $scope.customers = res.data;
        $scope.dataLoaded = true;

      }).finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
    });

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

    $scope.goToProfile = function () {
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

    $rootScope.$on('refreshCustomers', function (args,ev) {
      generateCredentialsImg(ev);
      $scope.customers = ev;
      console.log("customers list refreshed");
    });

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
      $http.get("https://protonbiz.herokuapp.com/customer?isActive=true&ownerId=" + $rootScope.company, config).then(function (res) {
        console.log(res);
        generateCredentialsImg(res.data);
        $scope.customers = res.data;
        $scope.dataLoaded = true;

      }).finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });

    }

    function generateCredentialsImg(customers) {
      for (var i = 0; i < customers.length; i++) {
        var firstNameCred = customers[i].firstName.substring(0, 1).toUpperCase();
        var lastNameCred = customers[i].lastName.substring(0, 1).toUpperCase();
        customers[i].cred = firstNameCred + lastNameCred;
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
          customer.isActive = false;
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
          console.log('sada jeste', customer.id);
        }
      });
    };

  })

  .controller('CustomerCtrl', function ($scope, $stateParams, $ionicActionSheet, $rootScope, $http, $timeout , $state, $location ) {
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
          {text: 'Call'},
          {text: 'Send SMS'},
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
          switch (index){
            case 0:
              break;
            case 1:
              break;
            case 2:
              $rootScope.customerEdit = null;
              $rootScope.customerEdit = $scope.customer;
              $location.path('/app/customers/new');
              break;
          }
          return true;
        }
      });

      $scope.callNumber = function (num) {
        console.log("1244444444444444444444444444444444444444444444444444444444444444444444");
        window.plugins.CallNumber.callNumber(onSuccess, onError, num, true);

      };

      function onSuccess(result) {
        console.log("Success:" + result);
      }

      function onError(result) {
        console.log("Error:" + result);
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
      }).finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
    }


  })


  .controller('OrdersCtrl', function ($scope, $stateParams, $http, $rootScope, $state, $ionicActionSheet) {
    console.log('OrdersCtrl init >>>>>>>>');
    $scope.$on('cloud:push:notification', function (event, data) {
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
      $http.get("https://protonbiz.herokuapp.com/orders?isActive=true&ownerId=" + $rootScope.company, config).then(function (res) {
        console.log(res);
        $scope.orders = res.data;
        $scope.dataLoaded = true;
      })
        .finally(function () {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });


    };

    $scope.onHold = function (selectedOrder) {
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
          if(index === 0){
            $state.go('app.order_new',{obj: selectedOrder});
          }
          return true;
        },
        destructiveButtonClicked: function () {
          var config = {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("token"),
              'Accept': 'application/json;odata=verbose'
            }
          };
          selectedOrder.isActive = false;
          $http.put("https://protonbiz.herokuapp.com/orders/" + selectedOrder.id, selectedOrder, config).then(function (res) {
            $scope.doRefresh();
            $state.go('app.orders', {}, {reload:true});
          });
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
      $http.get("https://protonbiz.herokuapp.com/orders?isActive=true&ownerId=" + companyId, config).then(function (res) {
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


  .controller('OrderCtrl', function ($scope, $stateParams,$state,  $http, $ionicActionSheet, $timeout, $location) {
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
          switch (index) {
            case 0:
              $location.path('/app/changeStatus/' + $scope.order.id);
              break;
            case 1:
              $location.path('/app/customers/' + $scope.order.customerId);
              break;
            case 2:
              $state.go('app.order_new',{obj: $scope.order});
              break;
          }
          return true;
        }
        ,
        destructiveButtonClicked: function () {
          console.log("DESTROY BUTTON !");
          var config = {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("token"),
              'Accept': 'application/json;odata=verbose'
            }
          };
          $scope.order.isActive = false;
          $http.put("https://protonbiz.herokuapp.com/orders/" + $scope.order.id, $scope.order, config).then(function (res) {
            // $state.go('app.orders', {}, {reload:true});
            $location.path('/app/orders');
          });
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
      $scope.product = res.data;
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


  .controller('SettingsCtrl', function ($scope, $stateParams, $ionicPopup, $ionicActionSheet, $translate, $timeout) {


    $scope.show = function () {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: 'Edit Profile'}
        ],
        titleText: 'Profile action',
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

      function onSuccess(result) {
        console.log("Success:" + result);
      }

      function onError(result) {
        console.log("Error:" + result);
      }

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 20000);

    };

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
      } else if (lng == 'ar') {
        lng = "تغيير اللغة إلى العربية";
        title = 'لغة';
      } else if (lng == 'de') {
        lng = "Sprache geändert auf Deutsch";
        title = "Sprache";
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
  .controller('changeStatusCtrl', function ($scope, $stateParams, $http, $location, $state) {
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
      $scope.order.status = status;
      $http.put("https://protonbiz.herokuapp.com/orders/" + $scope.order.id, $scope.order, config).then(function (res) {
        $scope.order = res.data;
        $state.go('app.order', {orderId: res.data.id, newStatus: status});
      });

    };
    $http.get("https://protonbiz.herokuapp.com/orders/" + orderId, config).then(function (res) {
      console.log('order', res);
      $scope.order = res.data;
      $scope.dataLoaded = true;
    });

  })
  .controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
    console.log('google maps');
    var options = {timeout: 10000, enableHighAccuracy: true};
    var map;

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      yourLatLng = latLng;


      var mapOptions = {
        center: latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var myLatLng = {lat: 45.264795, lng: 19.814562};
      var myLatLng2 = {lat: 45.254176, lng: 19.828402};
      var myLatLng3 = {lat: 45.241381, lng: 19.837103};
      var myLatLng4 = {lat: 45.237047, lng: 19.722905};
      map = $scope.map ;

      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello Home!'
      });

      var marker2 = new google.maps.Marker({
        position: myLatLng2,
        map: map,
        title: 'Lovely street!'
      });
      var marker3 = new google.maps.Marker({
        position: myLatLng3,
        map: map,
        title: 'Hello World!'
      });

      var marker4 = new google.maps.Marker({
        position: myLatLng4,
        map: map,
        title: 'Hello World!'
      });


      marker.addListener('click', function() {
        map.setZoom(14);
        map.setCenter(marker.getPosition());
      });

      marker2.addListener('click', function() {
        map.setZoom(14);
        map.setCenter(marker2.getPosition());
      });
      marker3.addListener('click', function() {
        map.setZoom(14);
        map.setCenter(marker3.getPosition());
      });


      var infowindow = new google.maps.InfoWindow({
        content: 'Invoice for Mr. Bojan Jagetic'
      });

      var infowindow2 = new google.maps.InfoWindow({
        content: 'Invoice for Mrs. Teodora Lepojevic'
      });

      var infowindow3 = new google.maps.InfoWindow({
        content: 'Invoice for Mr. Darth Vader'
      });

      marker.addListener('click', function() {
        infowindow.open(marker.get('map'), marker);
      });
      marker2.addListener('click', function() {
        infowindow2.open(marker2.get('map'), marker2);
      });
      marker3.addListener('click', function() {
        infowindow3.open(marker3.get('map'), marker3);
      });


    }, function(error){
      console.log("Get here to get work done");
    });


    // google.maps.event.addListener($scope.map, 'idle', function(){
    //
    //
    //   // var marker = new google.maps.Marker({
    //   //   map: $scope.map,
    //   //   animation: google.maps.Animation.DROP,
    //   //   position: latLng
    //   // });
    //
    // });


  });

