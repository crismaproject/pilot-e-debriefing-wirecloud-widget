angular.module('eu.crismaproject.pilotE.controllers')
    .controller('responsePhasesNavController',
        [
            '$scope',
            '$location',
            'DEBUG',
            function ($scope, $location,  DEBUG) {
                'use strict';

                if (DEBUG) {
                    console.log('initialising ResponsePhasesNavController controller');
                }
                
                $scope.currentLocation = $location.path();

                $scope.selectedItemIndex = -1;
                
                $scope.itemClicked = function(index) {
                  console.info('ResponsePhasesNavController - item with index: ' + index + ' has been clicked!');
                  $scope.$emit('requestElemSelectedFromNav2', index);
                };
                
                $scope.$on('executeElemSelectedNav1', function(event, index) {
                  console.info('ResponsePhasesNavController - received elemSelected event. value: ' + index);
                  if( !(index === null || index === undefined || parseInt(index, 10) < 0 ) ){
                    $scope.selectedItemIndex = index;
                    $scope.$parent.selectedItemIndexNav1 = index;
                  }
                });
                
            }
        ]);
