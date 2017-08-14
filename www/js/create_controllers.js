/**
 * Created by basskibo on 13.8.17..
 */
angular.module('protonbiz_mobile.create_controllers', [])


  .controller('OrderCreateCtrl', function ($scope, $http, $rootScope, $ionicActionSheet, $ionicPopup) {
    $scope.dataLoaded = false;

    console.log('order_create ctrl');
    fetchCustomers();
    fetchProducts();
    fetchTaxes();

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
        $scope.customers = res.data;
        $scope.dataLoaded = true;
      });
    }


    function fetchProducts() {
      console.log('fetching products');
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/product?isActive=true&ownerId=" + $rootScope.company, config).then(function (res) {
        console.log(res);
        $scope.products = res.data;
        $scope.dataLoaded = true;

      });


      $scope.invoiceAdded = function () {
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: 'Product successfully added to invoice'
        });
      };
    }


    function fetchTaxes() {
      console.log('fetching taxes');
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http.get("https://protonbiz.herokuapp.com/tax?ownerId=" + $rootScope.company, config).then(function (res) {
        $scope.taxes = res.data;
        console.log('taxeeeees: ' , res);
        $scope.dataLoaded = true;
      });
    }



  })

  .controller('CustomerCreateCtrl', function ($scope, $rootScope, $location, $stateParams,$ionicActionSheet, $http, $state) {

    $scope.create = function (customer) {
      customer.ownerId = $rootScope.company;
      customer.createdBy = $rootScope.userName;
      customer.hasDebt = false;
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };

      $http({
        method: 'POST',
        url: "https://protonbiz.herokuapp.com/customer",
        data: customer,
        headers: config.headers
      }).then(function (res) {
        $state.go('app.customers', {reload:true},{abstract:false});
      }).catch(function (err) {
        console.log(err);
      });
      // $http.post("https://protonbiz.herokuapp.com/customer" ,{data: customer}, config).then(function (res) {
      //   console.log(res);
      //   $scope.customers = res.data;
      //   console.log('ssssssssssssssssss',res.data);
      // });
    };

  });


