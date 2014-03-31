angular.module('eu.crismaproject.pilotE.directives').directive(
    'preTriageWidget',
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
            templateUrl: 'templates/preTriageWidgetTemplate.html',
            controller: 'preTriageWidgetDirectiveController'
        };
    }
);