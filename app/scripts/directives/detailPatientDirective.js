angular.module('eu.crismaproject.pilotE.directives').directive(
    'detailPatientWidget',
    function () {
        'use strict';

        var scope = {
                patient: '='
            };

        return {
            scope: scope,
            restrict: 'E',
            templateUrl: 'templates/detailPatientTemplate.html',
            controller: 'detailPatientDirectiveController'
        };
    }
).directive(
    'triageSelect',
    function () {
        'use strict';

        var scope = {
            selectedTriage: '='
        };

        return {
            scope: scope,
            restrict: 'AE',
            templateUrl: 'templates/triageSelectTemplate.html',
            controller: function ($scope) {
                var format;

                format = function (selection) {
                    if (selection.text === '') {
                        return '';
                    }

                    return '<img src="img/' + selection.text + '.png"/>';
                };

                $scope.select2Options = {
                    allowClear: true,
                    formatResult: format,
                    formatSelection: format
                };
            }
        };
    }
);
