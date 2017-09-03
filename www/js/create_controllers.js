/**
 * Created by basskibo on 13.8.17..
 */
angular.module('protonbiz_mobile.create_controllers', [])


  .controller('OrderCreateCtrl', function ($scope, $http, $rootScope, $stateParams, $ionicActionSheet, $ionicPopup, $state) {
    $scope.dataLoaded = false;
    $scope.input1 = true;


    var totalPrice = 0;
    // $scope.quantity = 0;
    console.log('order_create ctrl', $stateParams.obj);
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

      $scope.invoiceAdded = function (product, quantity) {
        console.log(product, quantity);

        if (product.stockSize >= quantity) {
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: quantity + " " + product.unit + " of " + product.name + ' successfully added to invoice'
          });
          $scope.products = [];
          $scope.products.push(product);
          totalPrice += product.pricePerUnit * quantity;
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'Failed',
            template: 'Sorry, but there is not enough products in stock. You have ' + product.stockSize + ' ' + product.unit + "'s left"
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
        console.log('taxeeeees: ', res);
        $scope.dataLoaded = true;
      });
    }


    $scope.createInvoice = function (order) {

      order.ownerId = $rootScope.company;
      order.customerId = order.customer.id;
      if (order.withTax) {
        order.taxId = order.tax.id;
        order.taxRate = order.tax.taxRate;
      }
      order.status = 'active';
      order.createdBy = $rootScope.userName;
      order.customerTelephone = order.customer.telephone;
      order.deliveryAddress = order.customer.address + " " + order.customer.addressStreetNumber;
      order.products = $scope.products;

      order.price = 1000;
      order.totalPrice = totalPrice;
      order.customerName = order.customer.firstName + " " + order.customer.lastName;
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
        $state.go('app.orders', {reload: true}, {abstract: false});
      }).catch(function (err) {
        console.log(err);
      });


    }


  })

  .controller('CustomerCreateCtrl', function ($scope, $rootScope, $location, $stateParams, $ionicActionSheet, $http, $state) {
    $scope.isEdit = false;

    if($rootScope.customerEdit !== null && $rootScope.customerEdit !== undefined){
      $scope.customer = $rootScope.customerEdit;
      $scope.customer.addressStreetNumber = parseInt($scope.customer.addressStreetNumber);
      $scope.isEdit = true;
    }
    $scope.create = function (customer) {
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };

      if(!$scope.isEdit){
        customer.ownerId = $rootScope.company;
        customer.createdBy = $rootScope.userName;
        customer.hasDebt = false;
        $http({
          method: 'POST',
          url: "https://protonbiz.herokuapp.com/customer",
          data: customer,
          headers: config.headers
        }).then(function (res) {
          $state.go('app.customers', {reload: true}, {abstract: false});
        }).catch(function (err) {
          console.log(err);
        });
      }else{
        $http({
          method: 'PUT',
          url: "https://protonbiz.herokuapp.com/customer/"  + $scope.customer.id,
          data: customer,
          headers: config.headers
        }).then(function (res) {
          // $state.go('app.customers', {reload: true}, {abstract: false});
          $scope.$emit('fetchCustomer');
          // $scope.isEdit = false;
          // $rootScope.customerEdit = null;
          // $scope.customer = null;
          // // $state.go('app.customers');
          $location.path('/app/customers');

        }).catch(function (err) {
          console.log(err);
        });
      }

    };

    $scope.$on('$destroy', function () {
      // console.log('destroingggg');
      // $scope.isEdit = false;
      // $rootScope.customerEdit = null;
      // $scope.customer = null;
    });
  })


  .controller('ProductCreateCtrl', function ($scope, $rootScope, $location, $stateParams, $ionicActionSheet, $http, $state) {

    $scope.units = [];
    $scope.categories = [];
    initUnitsAndCategories();
    $scope.create = function (product) {
      product.ownerId = $rootScope.company;
      product.createdBy = $rootScope.userName;
      var config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Accept': 'application/json;odata=verbose'
        }
      };
      $http({
        method: 'POST',
        url: "https://protonbiz.herokuapp.com/product",
        data: product,
        headers: config.headers
      }).then(function (res) {
        $state.go('app.products', {reload: true}, {abstract: false});
      }).catch(function (err) {
        console.log(err);
      });
    };


    function initUnitsAndCategories() {
      //UNITS
      $scope.units.push('piece');
      $scope.units.push('kg');
      $scope.units.push('g');
      $scope.units.push('l');
      $scope.units.push('cm');
      $scope.units.push('m');
      $scope.units.push('m³');
      $scope.units.push('dm³');
      $scope.units.push('cm³');
      $scope.units.push('oz');
      $scope.units.push('lb');
      $scope.units.push('yd');
      $scope.units.push('gal');
      //CATEGORIES
      $scope.categories.push('Electronics Accessories');
      $scope.categories.push('Food');
      $scope.categories.push('Beverages');
      $scope.categories.push('Clothing');
      $scope.categories.push('Clothing Accessories');
      $scope.categories.push('Jewelry & Watches');
      $scope.categories.push('Video Games & Software');
      $scope.categories.push('Books');
      $scope.categories.push('Shoes');
      $scope.categories.push('Hobbies & Creative Arts');
      $scope.categories.push('Pet Supplies');
      $scope.categories.push('Audio Equipment');
      $scope.categories.push('Print, Copy, Scan & Fax');
      $scope.categories.push('General Office Supplies');
      $scope.categories.push('Outdoor Furniture');
      $scope.categories.push('Power & Electrical Supplies');
      $scope.categories.push('Tools');
      $scope.categories.push('Toys');
      $scope.categories.push('Vehicle Parts & Accessories');
      $scope.categories.push('Science & Laboratory');
      $scope.categories.push('Retail');
      $scope.categories.push('Medical');
      $scope.categories.push('Work Safety Protective Gear');
      $scope.categories.push('Party & Celebration');

    }


  });


