angular.module('eu.crismaproject.pilotE.directives').directive(
    'alertsAndRequestsWidget',
    function () {
        'use strict';

        var scope = {
                patientsData: '=',
                kpiListData: '=',
                stepMinutes: '='
            };

        return {
            scope: scope,
            restrict: 'AE',
            templateUrl: 'templates/alertsAndRequestsWidgetTemplate.html',
            controller: 'alertsAndRequestsWidgetDirectiveController'
        };
    }
);