angular.module(
    'eu.crismaproject.pilotE',
    [
        'eu.crismaproject.pilotE.controllers',
        'eu.crismaproject.pilotE.directives',
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap.tpls',
        'ui.bootstrap.tabs',
        'google-maps'
    ]
).config(['$routeProvider', function ($routeProvider) {
    'use strict';

    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'captureViewController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
