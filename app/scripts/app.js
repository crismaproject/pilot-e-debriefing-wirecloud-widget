angular.module('eu.crismaproject.pilotE', ['eu.crismaproject.pilotE.controllers', 'ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        'use strict';

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'master-patient-controller'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
