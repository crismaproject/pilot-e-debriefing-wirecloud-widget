angular.module('eu.crismaproject.pilotE.controllers')
    .controller('debriefingViewController',
        [
            '$scope',
            'eu.crismaproject.pilotE.services.OoI',
            'DEBUG',
            function ($scope, ooi, DEBUG) {
                'use strict';

                if (DEBUG) {
                    console.log('initialising debriefing view controller');
                }

//                $scope.patients = ooi.getCapturePatients().getAll();
                $scope.exercise = ooi.exercises().get({id: 3});
                
                
//                $scope.exercise.$promise.then(function () {
//                  $scope.patients = $scope.exercise.patients;
//                  if (DEBUG) {
////                    console.log('$scope.exercise :' + $scope.exercise.toSource());
////                    console.log('$scope.patients :' + $scope.patients.toSource());
//                    console.log('$scope.exercise.alertsRequests :' + $scope.exercise.alertsRequests.toSource());
//                    
//                    var abbrevReqs = [];
//                    for (var i = 0; i < $scope.exercise.alertsRequests.length; ++i) {
//                      abbrevReqs.push($scope.exercise.alertsRequests[i].abbrevRequests);
//                    }
//                    console.log('$scope.exercise.alertsRequests.abbrevRequests :' + $scope.exercise.alertsRequests.toSource());
//                    console.log('abbrevReqs :' + abbrevReqs.toSource());
//                  }
//                });
                


                $scope.stepMinutesData = 10;
                                
                
                $scope.requestedVehiclesData = [ {
                  value : '10',
                  key : 'RTW'
                }, {
                  value : '6',
                  key : 'NEF'
                }, {
                  value : '1',
                  key : 'GW-San'
                }, {
                  value : '3',
                  key : 'MTW'
                }, {
                  value : '1',
                  key : 'RTH'
                }, {
                  value : '21',
                  key : 'total number'
                } ];
                
            }
        ]);
