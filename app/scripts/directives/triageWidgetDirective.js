angular.module('eu.crismaproject.pilotE.directives').directive(
    'triageWidget',
    function () {
        'use strict';

        var scope = {
                patientsData: '=',
                kpiListData: '=',
                stepMinutes: '=',
                stepAmount: '='
            };

        return {
            scope: scope,
            restrict: 'AE',
            templateUrl: 'templates/triageWidgetTemplate.html',
            controller: 'triageWidgetDirectiveController'
        };
    }
);