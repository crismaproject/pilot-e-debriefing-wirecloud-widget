angular.module(
    'eu.crismaproject.pilotE.controllers'
).controller(
    'eu.crismaproject.pilotE.controllers.siteDetailsDirectiveController',
    [
        '$scope',
        'de.cismet.commons.angular.angularTools.AngularTools',
        'DEBUG',
        function ($scope, angularTools, DEBUG) {
            'use strict';
            var select2Format;
            
            select2Format = function (selection) {
                try {
                    return '<span style="margin: 10px;"><img src="' + JSON.parse(selection.id).icon + '"/></span>' + selection.text;
                } catch (e) {
                    // could not parse selection
                }
            };
              
            $scope.latitude = 0;
            $scope.longitude = 0;
            $scope.timestamp = new Date().toISOString();
            $scope.select2Options = {
                allowClear: false,
                formatResult: select2Format,
                formatSelection: select2Format
            };
                
            $scope.createLatLng = function () {
                angularTools.safeApply($scope, function() {
                    $scope.selectedCoordinate = new google.maps.LatLng($scope.latitude, $scope.longitude);
                });
            };
            
            $scope.createArea = function () {
                var newArea;
                
                newArea = JSON.parse($scope.selectedArea);
                newArea.type = 'Point';
                newArea.time = $scope.timestamp;
                newArea.coordinates = [$scope.latitude, $scope.longitude];
                
                $scope.areas.push(newArea);
            }
            
            $scope.removeArea = function (index) {
                $scope.areas.splice(index, 1);
            };
            
            $scope.$watch('selectedCoordinate', function (n, o) {
                if(n !== o) {
                    angularTools.safeApply($scope, function() {
                        $scope.latitude = n.lat();
                        $scope.longitude = n.lng();
                    });
                }
            });
            
            $scope.$watch('areas', function (areas) {
                var i, j, newAreas, preserveSelection, selArea;

                newAreas = $.extend(true, [], $scope.allAreas);
                if (areas) {
                    for (i = 0; i < areas.length; ++i) {
                        for (j = 0; j < newAreas.length; ++j) {
                            if (areas[i].name === newAreas[j].name) {
                                newAreas.splice(j, 1);
                                break;
                            }
                        }
                    }
                }
                
                $scope.availableAreas = newAreas;
                if(newAreas.length > 0) {
                    preserveSelection = false;
                    if($scope.selectedArea) {
                        selArea = JSON.parse($scope.selectedArea);
                        
                        for (i = 0; i < newAreas.length && !preserveSelection; ++i) {
                            if(newAreas[i].name === selArea.name) {
                                preserveSelection = true;
                            }
                        }
                    }
                    if(!preserveSelection) {
                        $scope.selectedArea = JSON.stringify(newAreas[0]);
                    }
                } else {
                    $scope.selectedArea = null;
                }
            }, true);
        }
    ]
);
