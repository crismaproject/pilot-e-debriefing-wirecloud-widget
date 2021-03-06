angular.module('eu.crismaproject.pilotE.directives').directive(
    'transportationWidget',
    function () {
        'use strict';

        var scope = {
                patientsData: '=',
                listHeader: '@',
                kpiListData: '=',
                stepMinutes: '='
            };

        return {
            scope: scope,
            restrict: 'AE',
            templateUrl: 'templates/transportationWidgetTemplate.html',
            controller: 'transportationWidgetDirectiveController'
        };
    }
);