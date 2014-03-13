angular.module('eu.crismaproject.pilotE', ['eu.crismaproject.pilotE.controllers', 'eu.crismaproject.pilotE.directives', 'ngRoute', 'ngAnimate', 'ui.chart'])
    .config(['$routeProvider', function ($routeProvider) {
        'use strict';

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'captureViewController'
            }).when('/widgets/care-measures', {
                templateUrl : 'views/care-measures-widget.html',
                controller : 'careMeasuresWidgetController'
            }).otherwise({
                redirectTo: '/'
            });
    }]);

