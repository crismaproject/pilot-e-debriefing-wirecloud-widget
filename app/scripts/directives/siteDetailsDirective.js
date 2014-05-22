angular.module(
    'eu.crismaproject.pilotE.directives'
).directive(
    'siteDetailWidget',
    function () {
        'use strict';
        
        var scope = {
                allAreas: '=',
                areas: '=',
                editing: '=',
                selectedCoordinate: '='
            };

        return {
            scope: scope,
            restrict: 'E',
            templateUrl: 'templates/siteDetailsTemplate.html',
            controller: 'eu.crismaproject.pilotE.controllers.siteDetailsDirectiveController'
        };
    }
);