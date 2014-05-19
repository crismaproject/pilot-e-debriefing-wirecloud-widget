angular.module(
    'eu.crismaproject.pilotE.directives'
).directive(
    'siteMapWidget',
    function () {
        'use strict';
        
        var scope = {
                allowCoordinateSelection: '=',
                location: '=',
                locationIcon: '@',
                locationTitle: '@',
                tacticalAreas: '=',
                selectedCoordinate: '=',
                visible: '=',
                editing: '='
            };

        return {
            scope: scope,
            restrict: 'E',
            templateUrl: 'templates/siteMapTemplate.html',
            controller: 'eu.crismaproject.pilotE.controllers.siteMapDirectiveController'
        };
    }
);