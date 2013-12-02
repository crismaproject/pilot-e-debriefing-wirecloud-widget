angular.module(
    'eu.crismaproject.pilotE.directives',
    [
    ]
).directive(
    'masterPatientWidget',
    function () {
        'use strict';

        var scope = {
                patients: '=',
                selectedPatient: '='
            };

        return {
            scope: scope,
            restrict: 'E',
            templateUrl: 'templates/masterPatientTemplate.html',
            controller: 'masterPatientDirectiveController'
        };
    }
);
