angular.module('eu.crismaproject.pilotE.directives').directive(
    'alertsAndRequestsWidget',
    function () {
        'use strict';

        var scope = {
                alertsAndRequestsData: '=',
                alertsListData: '=',
                reqVehiclesListData: '='
            };

        return {
            scope: scope,
            restrict: 'AE',
            templateUrl: 'templates/alertsAndRequestsWidgetTemplate.html',
            controller: 'alertsAndRequestsWidgetDirectiveController'
        };
    }
);