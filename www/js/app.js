// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('protonbiz_mobile', ['ionic', 'ionic.cloud', 'ngCordova', 'protonbiz_mobile.controllers', 'protonbiz_mobile.create_controllers', 'loginModule', 'ion-floating-menu', 'ionic-modal-select', 'ion-datetime-picker', 'pascalprecht.translate'])

  .run(function ($ionicPlatform, $location, $ionicPush) {


    $ionicPlatform.ready(function () {
      // var push = new Ionic.Push({
      //   "debug": true
      // });
      //
      // push.register(function(token) {
      //   console.log("My Device token:",token.token);
      //   push.saveToken(token);  // persist the token in the Ionic Platform
      // });
    });

    if (localStorage.getItem("token") !== null && localStorage.getItem("token") !== "") {
      console.log("User found");
      $location.path('/app/orders');
      // location.reload();

    } else {
      console.log("No user");
      $location.path('/login');
    }//go ahead and authenticate them without getting a new token.}

    $ionicPush.register().then(function (t) {
      return $ionicPush.saveToken(t);
    }).then(function (t) {
      console.log('Token saved:', t.token);
    });

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      // if (window.cordova && window.cordova.plugins.Keyboard) {
      //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //   cordova.plugins.Keyboard.disableScroll(true);
      //
      // }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $translateProvider, $ionicCloudProvider) {


    $ionicCloudProvider.init({
      "core": {
        "app_id": "6e8ab553"
      },
      "push": {
        "sender_id": "701779140717",
        "pluginConfig": {
          "ios": {
            "badge": true,
            "sound": true
          },
          "android": {
            "iconColor": "#343434"
          }
        }
      }
    });


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
            templateUrl: 'templates/users.html',
            controller: 'UsersCtrl'
          }
        }
      })

      .state('app.orders', {
        url: '/orders',
        views: {
          'menuContent': {
            templateUrl: 'templates/orders.html',
            controller: 'OrdersCtrl'
          }
        },
        params: {
          user: ['user', 'companyId']
        }
      })
      .state('app.order_new', {
        url: '/orders/new',
        views: {
          'menuContent': {
            templateUrl: 'templates/order_create.html',
            controller: 'OrderCreateCtrl'
          }
        }
      })

      .state('app.customer_new', {
        url: '/customers/new',
        views: {
          'menuContent': {
            templateUrl: 'templates/customer_create.html',
            controller: 'CustomerCreateCtrl'
          }
        }
      })
      .state('app.order', {
        url: '/orders/:orderId',
        views: {
          'menuContent': {
            templateUrl: 'templates/order.html',
            controller: 'OrderCtrl'
          }
        },
        params: {
          user: ['order', 'companyId']
        }
      })
      .state('app.customers', {
        url: '/customers',
        views: {
          'menuContent': {
            templateUrl: 'templates/customers.html',
            controller: 'CustomersCtrl'
          }
        }
      })
      .state('app.customer', {
        url: '/customers/:customerId',
        views: {
          'menuContent': {
            templateUrl: 'templates/customer.html',
            controller: 'CustomerCtrl'
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

      .state('app.product_new', {
        url: '/products/new',
        views: {
          'menuContent': {
            templateUrl: 'templates/product_create.html',
            controller: 'ProductCreateCtrl'
          }
        }
      })
      .state('app.product', {
        url: '/products/:productId',
        views: {
          'menuContent': {
            templateUrl: 'templates/product.html',
            controller: 'ProductCtrl'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('app.help_activities', {
        url: '/help/activites',
        views: {
          'menuContent': {
            templateUrl: 'templates/help/activities.html'
          }
        }
      })
      .state('app.help', {
        url: '/help',
        views: {
          'menuContent': {
            templateUrl: 'templates/help/help_menu.html'
          }
        }
      })
      .state('app.changeStatus', {
        url: '/changeStatus/:orderId',
        views: {
          'menuContent': {
            templateUrl: 'templates/changeStatus.html',
            controller: 'changeStatusCtrl'
          }
        }
      })
      .state('logout', {
          url: '/logout',
          controller: 'LogoutCtrl'
        }
      )
      .state('app.map', {
        url: '/map',
        views: {
          'menuContent': {
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
          }
        }

      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');


    $translateProvider.translations('en', {
      loginTitle: 'Login',
      usernameLabel: 'Username',
      organisationLabel: 'Organisation',
      passwordLabel: 'Password',
      loginBtn: 'Login',
      forgotpasswordLabel: 'Forgot your password?',
      operationLabel: 'Operation',
      inputLabel: 'Input',
      cultureLabel: 'Culture',
      priceLabel: 'Price',
      dateLabel: 'Date',
      datePocetkaLabel: 'Date ',
      datePlaniranLabel: 'Date',
      dateZavrsetkaLabel: 'Date',
      tableLabel: 'Table',
      prikljucnaLabel: 'Priključne mašine',
      radniciLabel: 'Radnici',
      saveLabel: 'Save',
      orderLabel: 'Working orders',
      orderAll: 'All Orders',
      newOrderLabel: 'New work order',
      settingsLabel: 'Settings',
      settingsChangeLabel: 'Change settings',

      logOutLabel: 'Log out',
      listOfOrdersLabel: 'List of work orders',
      searchOrdersLabel: 'Search orders',
      searchOrders1Label: 'Search reports',
      CHOOSE_LABEL: 'Select existing ',
      CREATE_LABEL: 'Create new ',
      PRODUCTS: 'Products ',
      ADD_TO_INVOICE: 'Add to invoice',
      TAXES: 'Taxes',
      CHOOSEN_TAXES: 'Selected taxes',
      CHANGE_LABEL: 'Select another',
      CHOOSEN_PRODUCT: 'Selected product',
      SHIPPING_INFO: 'Shipping info',
      newReport: 'New field report',
      regionLabel: 'Region',
      plotLabel: 'Plot',
      activityLabel: 'Type of Activity',

      timeLabel: 'Time',
      notificationsLabel: 'Notifications',
      showOnMapLabel: 'Show on map',
      nameLabel: 'Name',
      enterNameLabel: 'Enter name',
      descriptionLabel: 'Description',
      enterDescriptionLabel: 'Enter description',
      createLabel: 'Create',
      cancelLabel: 'Cancel',
      needHelpLabel: 'Need help?',
      addItemLabel: 'Add Item',
      createItemLabel: 'Create Item',
      editingLabel: 'Editing',
      newOrder: 'New working order',
      newReportLabel: 'New report',
      reportLabel: 'Reports',
      reportAll: 'All Reports',
      prognoza: "Weather forecast",
      CHOOSE: "Choose",
      CHOOSEN_CUSTOMER: "Choosen customer ",
      NOTIFICATION_SETTINGS: "Notification settings",
      CUSTOMER: "Customer",

      lang: "Choose language",
      favorit: "Favorites",
      podesavanja: "Settings",
      editOrder: "Edit Working Order",
      en: "English",
      rs: "Serbian",
      ar: 'Arab',
      de: 'German'


    });

    $translateProvider.translations('de', {
      loginTitle: 'Login',
      usernameLabel: 'Username',
      organisationLabel: 'Organisation',
      passwordLabel: 'Password',
      loginBtn: 'Login',
      forgotpasswordLabel: 'Forgot your password?',
      operationLabel: 'Operation',
      inputLabel: 'Input',
      cultureLabel: 'Culture',
      priceLabel: 'Price',
      dateLabel: 'Date',
      datePocetkaLabel: 'Date ',
      datePlaniranLabel: 'Date',
      dateZavrsetkaLabel: 'Date',
      tableLabel: 'Table',
      prikljucnaLabel: 'Priključne mašine',
      radniciLabel: 'Radnici',
      saveLabel: 'Save',
      orderLabel: 'Working orders',
      orderAll: 'All Orders',
      newOrderLabel: 'New work order',
      settingsLabel: 'Settings',
      settingsChangeLabel: 'Change settings',

      logOutLabel: 'Log out',
      listOfOrdersLabel: 'List of work orders',
      searchOrdersLabel: 'Search orders',
      searchOrders1Label: 'Search reports',
      CHOOSE_LABEL: 'Choose',

      newReport: 'New field report',
      regionLabel: 'Region',
      plotLabel: 'Plot',
      activityLabel: 'Type of Activity',

      timeLabel: 'Time',
      notificationsLabel: 'Notifications',
      showOnMapLabel: 'Show on map',
      nameLabel: 'Name',
      enterNameLabel: 'Enter name',
      descriptionLabel: 'Description',
      enterDescriptionLabel: 'Enter description',
      createLabel: 'Create',
      cancelLabel: 'Cancel',
      needHelpLabel: 'Need help?',
      addItemLabel: 'Add Item',
      createItemLabel: 'Create Item',
      editingLabel: 'Editing',
      newOrder: 'New working order',
      newReportLabel: 'New report',
      reportLabel: 'Reports',
      reportAll: 'All Reports',
      prognoza: "Weather forecast",
      CHOOSE: "Choose",
      CHOOSEN_CUSTOMER: "Choosen customer ",
      NOTIFICATION_SETTINGS: "Benachrichtigungseinstellungen",
      CHOOSE_LABEL: 'Choose',
      CUSTOMER: "Customer",
      katOpst: "Cadastral region",
      vrstaAktivnosti: "Type of activity",
      parcela: "Parcel",
      "opis": "Description",
      "listaR": "Field report List",
      "sortby": "Sort by",
      "vreme": "Time",
      "naziv": "Name",
      "tipAktivnosti": "Type of activity",
      "datumPosete": "Date of visit",
      "en": "English",
      "rs": "Serbian",
      "lang": "Choose language",
      "mera": "Unit",
      "cel": "Metric (Celsius)",
      "far": "Imperial (Fahrenheit)",
      "favorit": "Favorites",
      "podesavanja": "Settings",
      "editOrder": "Edit Working Order",
      ar: 'Arab',
      de: 'German'


    });
    $translateProvider.translations('rs', {
      loginTitle: 'Prijavi se',
      usernameLabel: 'Korisnicko ime',
      organisationLabel: 'Organizacija',
      passwordLabel: 'Lozinka',
      loginBtn: 'Prijavi se',
      forgotpasswordLabel: 'Zaboravili ste sifru?',
      operationLabel: 'Operacija',
      inputLabel: 'Input',
      kulturaLabel: 'Kultura',
      operationILabel: 'Izabrana operacija',
      inputILabel: 'Izabran input',
      cultureILabel: 'Izabrana kultura',
      priceLabel: 'Ukupan trošak',
      priceLabel2: 'Ukupan prihod',
      dateLabel: 'Datum',
      pogonskeLabel: 'Pogonske mašine',
      pogonskeILabel: 'Izabrane pogonske mašine',
      datePocetkaLabel: 'Datum početka ',
      datePlaniranLabel: 'Datum planiran',
      dateZavrsetkaLabel: 'Datum završetka',
      tableLabel: 'Table',
      prikljucnaLabel: 'Priključne mašine',
      radniciLabel: 'Radnici',
      podaciRNLabel: 'Podaci o radnom nalogu',
      CUSTOMER: "Kupac",
      CHOOSE: "Izaberi",
      CHOOSEN_CUSTOMER: "Izabran kupac ",

      NOTIFICATION_SETTINGS: "Podesavanje notifikacija",

      saveLabel: 'Sačuvaj',
      orderLabel: 'Radni Nalozi',
      orderAll: 'Svi nalozi',
      CHOOSE_LABEL: 'Izaberi',
      materijalLabel: 'Izabrani materijal',
      newOrderLabel: 'Novi radni nalog',
      settingsLabel: 'Podešavanja',
      logOutLabel: 'Odjavi se',
      listOfOrdersLabel: 'Lista radnih naloga',
      searchOrdersLabel: 'Pretraži naloge',
      searchOrders1Label: 'Pretraži beleške',
      settingsChangeLabel: 'Promena podešavanja',
      timeLabel: 'Vreme',
      notificationsLabel: 'Obaveštenja',
      showOnMapLabel: 'Prikaži na mapi',
      nameLabel: 'Naziv',
      enterNameLabel: 'Unesi naziv',
      descriptionLabel: 'Opis',
      enterDescriptionLabel: 'Unesi opis',
      createLabel: 'Dodaj',
      cancelLabel: 'Odustani',
      needHelpLabel: 'Pomoc?',
      addItemLabel: 'Dodaj stavku',
      createItemLabel: 'Kreiraj stavku',
      editingLabel: 'Izmena',
      newOrder: 'Novi radni nalog',
      newReportLabel: 'Nova beleška',
      reportLabel: 'Beleška',
      reportAll: 'Sve beleške',
      prognoza: "Vremenska Prognoza",
      katOpst: "Katastarska opstina",
      vrstaAktivnosti: "Vrsta aktivnosti",
      parcela: "Parcela",
      opis: "Opis",
      listaR: "Lista terenskih beleški",
      sortby: "Sortiraj po",
      vreme: "Vremenu",
      naziv: "Nazivu",
      tipAktivnosti: "Tip aktivnosti",
      datumPosete: "Datum posete",
      en: "Engleski",
      rs: "Srpski",
      lang: "Izaberite jezik",
      "mera": "Jedinična mera",
      "cel": "Celzijus",
      "far": "Farenhajt",
      "favorit": "Favorit",
      "podesavanja": "Podešavanja",
      "editOrder": "Izmena radnog naloga",
      ar: 'Arapski',
      de: 'Nemacki'

    });

    $translateProvider.translations('ar', {

      loginTitle: 'تسجيل الدخول',
      usernameLabel: 'اسم المستخدم',
      organisationLabel: 'منظمة',
      passwordLabel: 'كلمه السر',
      loginBtn: 'تسجيل الدخول',
      en: "الإنجليزية",
      rs: "صربي",
      ar: 'صربي',
      settingsLabel: 'إعدادات',
      logOutLabel: 'خروج',
      notificationsLabel: 'الإشعارات',
      lang: 'تسجيل الدخول',
      de: 'ألمانية'


    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');

  });
