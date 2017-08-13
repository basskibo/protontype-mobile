/**
 * Created by basskibo on 13.8.17..
 */
angular.module('protonbiz_mobile.create_controllers', [])


  .controller('OrderCreateCtrl', function ($scope, $http, $rootScope, $ionicActionSheet) {
    $scope.dataLoaded = false;

    console.log('order_create ctrl');

  })

  .controller('CustomerCreateCtrl', function ($scope, $stateParams,$ionicActionSheet, $http) {
    $scope.dataLoaded = false;
    console.log('customer_create ctrl');


    $scope.create = function (customer) {
        console.log($scope.customer);
    };

  });


