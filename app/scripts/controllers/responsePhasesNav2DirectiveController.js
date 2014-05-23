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
                  
                  $scope.$parent.hideResponsePhasesNav = true;
               };
                
                $scope.$on('executeElemSelectedNav2', function(event, index) {
                  console.info('ResponsePhasesNav2Controller - received elemSelected event. value: ' + index);
                  if( !(index === null || index === undefined || parseInt(index, 10) < 0 ) ){
                    $scope.selectedItemIndex = index;
                    $scope.$parent.selectedItemIndexNav2 = index;
                  }
                });
                
            }
        ]);
