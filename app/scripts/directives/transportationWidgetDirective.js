angular.module('eu.crismaproject.pilotE.directives').directive(
    'transportationWidget',
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
            templateUrl: 'templates/transportationWidgetTemplate.html',
            controller: 'transportationWidgetDirectiveController'
        };
    }
);