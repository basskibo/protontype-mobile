// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','starter.controllers','loginModule', 'ion-floating-menu'])

.run(function($ionicPlatform, $location) {


  if(localStorage.getItem("token") !== null && localStorage.getItem("token") !== ""){
    console.log("User found");
    $location.path('/app/orders');
    // location.reload();

  }else{
    console.log("No user");
    $location.path('/login');
  }//go ahead and authenticate them without getting a new token.}

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


//    .state('forgotpassword', {
//        url: '/forgot-password',
//        templateUrl: 'templates/forgot-password.html',
//        controller:'ForgotPassCtrl'
//      })
//
//
//      .state('tab', {
//      url: '/tab',
//      abstract: true,
//      templateUrl: 'templates/tabs.html'
//    })

  .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        cache: false,
        controller: 'LoginCtrl'
      })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller:'UsersCtrl'
      }
    }
  })

  .state('app.orders', {
      url: '/orders',
      views: {
        'menuContent': {
          templateUrl: 'templates/orders.html',
          controller:'OrderCtrl'
        }
      },
      params:{
        user:  ['user','companyId']
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.products', {
      url: '/products',
      views: {
        'menuContent': {
          templateUrl: 'templates/products.html',
          controller: 'ProductsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
    .state('logout', {
      url: '/logout',
      controller:'LogoutCtrl'
      }
    );
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
