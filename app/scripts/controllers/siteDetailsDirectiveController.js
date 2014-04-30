angular.module(
    'eu.crismaproject.pilotE.controllers'
).controller(
    'eu.crismaproject.pilotE.controllers.siteDetailsDirectiveController',
    [
        '$scope',
        'DEBUG',
        function ($scope, ooi, DEBUG) {
            'use strict';
            var select2Format;
            
            select2Format = function (selection) {
                return '<img src="' + JSON.parse(selection.id).icon + '"/>' + selection.text;
            };
                
            $scope.select2Options = {
                    allowClear: false,
                    formatResult: select2Format,
                    formatSelection: select2Format
                };
                
            
            $scope.$watch('areas', function (areas) {
                var i, j, newAreas;

                newAreas = $.extend(true, [], $scope.allAreas);
                if (areas) {
                    for (i = 0; i < areas.length; ++i) {
                        for (j = 0; j < $scope.newAreas.length; ++j) {
                            if (areas[i].name === newAreas[j]) {
                                newAreas = newAreas.splice(j, 1);
                                break;
                            }
                        }
                    }
                }
                
                $scope.availableAreas = newAreas;
                if(newAreas.length > 0) {
                    $scope.selectedArea = newAreas[0];
                } else {
                    $scope.selectedArea = null;
                }
            });
        }
    ]
);
