angular.module('eu.crismaproject.pilotE', ['eu.crismaproject.pilotE.controllers', 'eu.crismaproject.pilotE.directives', 'ngRoute', 'ngAnimate', 'ui.chart'])
    .config(['$routeProvider', function ($routeProvider) {
        'use strict';

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'captureViewController'
            }).when('/debriefing', {
              templateUrl : 'views/debriefing.html',
              controller : 'debriefingViewController'
          }).otherwise({
                redirectTo: '/'
            });
    }]);

