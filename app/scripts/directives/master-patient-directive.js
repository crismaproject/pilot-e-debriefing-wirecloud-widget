angular.module(
    'eu.crismaproject.pilotE.directives',
    []
).directive(
    'masterPatientDirective',
    function () {
        'use strict';

//        var scope = {
//                worldstatePath: '=',
//                selectedWorldstate: '='
//            };

        return {
//            scope: scope,
            restrict: 'E',
            templateUrl: 'templates/master-patient-template.html',
//            controller: function ($scope) {
//                $scope.setSelectedWorldstate = function (pathIndex) {
//                    $scope.selectedWorldstate = $scope.worldstatePath[pathIndex];
//                };
//            }
        };
    }
);
