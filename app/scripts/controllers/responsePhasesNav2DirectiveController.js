angular.module('eu.crismaproject.pilotE.controllers')
    .controller('responsePhasesNav2Controller',
        [
            '$scope',
            '$location',
            'DEBUG',
            function ($scope, $location, DEBUG) {
                'use strict';

                if (DEBUG) {
                    console.log('initialising ResponsePhasesNav2Controller controller');
                }
                
                $scope.currentLocation = $location.path();

                $scope.selectedItemIndex = -1;
                
                $scope.itemClicked = function(index) {
                  console.info('ResponsePhasesNav2Controller - item with index: ' + index + ' has been clicked!');
                  $scope.$emit('requestElemSelectedFromNav1', index);
               };
                
                $scope.$on('executeElemSelectedNav2', function(event, msg) {
                  console.info('ResponsePhasesNav2Controller - received elemSelected event. value: ' + msg);
                  if( !(msg === null || msg === undefined || parseInt(msg, 10) < 0 ) ){
                    $scope.selectedItemIndex = msg;
                  }
                });
                
            }
        ]);
