/**
 * Created by basskibo on 13.8.17..
 */
angular.module('protonbiz_mobile.create_controllers', [])


  .controller('OrderCreateCtrl', function ($scope, $http, $rootScope, $ionicActionSheet) {
    $scope.dataLoaded = false;

    console.log('order_create ctrl');

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


