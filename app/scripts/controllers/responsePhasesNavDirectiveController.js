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
                
                $scope.$on('executeElemSelectedNav1', function(event, msg) {
                  console.info('ResponsePhasesNavController - received elemSelected event. value: ' + msg);
                  if( !(msg === null || msg === undefined || parseInt(msg, 10) < 0 ) ){
                    $scope.selectedItemIndex = msg;
                  }
                });
                
            }
        ]);
