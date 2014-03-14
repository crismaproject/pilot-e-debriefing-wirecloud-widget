angular.module('eu.crismaproject.pilotE.directives').directive(
    'careMeasuresWidget',
    function () {
        'use strict';

        var scope = {
                patientsData: '=',
                kpiListData: '='
            };

        return {
            scope: scope,
            restrict: 'AE',
            templateUrl: 'templates/careMeasuresWidgetTemplate.html',
            controller: 'careMeasuresWidgetDirectiveController'
        };
    }
);