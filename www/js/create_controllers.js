/**
 * Created by basskibo on 13.8.17..
 */
angular.module('protonbiz_mobile.create_controllers', [])


  .controller('OrderCreateCtrl', function ($scope, $http, $rootScope, $ionicActionSheet, $ionicPopup) {
    $scope.dataLoaded = false;
    $scope.input1 = true;

    var totalPrice = 0;
    // $scope.quantity = 0;
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


      $scope.changeInput = function () {
        $scope.input1 = !$scope.input1;
      };

      $scope.incr = function () {
        $scope.quantity++;
      };

      $scope.decr = function () {
        $scope.quantity--;
      };

      $scope.invoiceAdded = function (product,quantity) {
        console.log(product, quantity);

        if(product.stockSize >= quantity){
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template:  quantity +  " " +product.unit +" of " + product.name +' successfully added to invoice'
          });
          $scope.products = [];
          $scope.products.push(product);
        }else{
          var alertPopup = $ionicPopup.alert({
            title: 'Failed',
            template:  'Sorry, but there is not enough products in stock. You have ' + product.stockSize + ' '+ product.unit +  "'s left"
          });
        }

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



    $scope.createInvoice = function (order) {

      order.ownerId = $rootScope.company;
      order.customerId = order.customer.id;
      if(order.withTax){
        order.taxId = order.tax.id;
        order.taxRate = order.tax.taxRate;
      }
      order.status = 'active';
      order.customerTelephone = order.customer.telephone;
      order.deliveryAddress = order.customer.address + " " + order.customer.addressStreetNumber;
      order.products = $scope.products;
      delete order.customer;
      delete order.product;
      delete order.tax;

      console.log("sssssss", order);



      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http({
        method: 'POST',
        url: "https://protonbiz.herokuapp.com/orders",
        data: order,
        headers: config.headers
      }).then(function (res) {
        $state.go('app.orders', {reload:true},{abstract:false});
      }).catch(function (err) {
        console.log(err);
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
    };

  });


