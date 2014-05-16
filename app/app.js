/*global angular*/
'use strict';

var dev9DemoApp = angular.module('dev9-demo',
  [ 'ui.router', 'templates', 'placeholders' ]
)

.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
	    // It's very handy to add references to $state and $stateParams to the $rootScope
	    // so that you can access them from any scope within your applications.
	    $rootScope.$state = $state;
	    $rootScope.$stateParams = $stateParams;
    }
  ]
)

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider
        .otherwise('/');

      $stateProvider
          .state("main", {
              url: "/",
              controller: "MainCtrl",
              templateUrl: "partials/main.html"
          });
    }
  ]
);