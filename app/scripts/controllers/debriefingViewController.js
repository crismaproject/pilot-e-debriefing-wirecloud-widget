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
                $scope.exercise = ooi.exercises().get({id: 9});
                
                
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
                                
                
//                $scope.requestedVehiclesData = [ {
//                  value : '10',
//                  key : 'RTW'
//                }, {
//                  value : '6',
//                  key : 'NEF'
//                }, {
//                  value : '1',
//                  key : 'GW-San'
//                }, {
//                  value : '3',
//                  key : 'MTW'
//                }, {
//                  value : '1',
//                  key : 'RTH'
//                }, {
//                  value : '21',
//                  key : 'total number'
//                } ];
                
                $scope.totNumVehicles = null;
                $scope.requestedVehiclesData = [];
                
                $scope.$watch('totNumVehicles', function() {
                  if($scope.totNumVehicles !== null){
                    
                    if($scope.totNumVehicles.rtw > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.rtw.toString(),
                        key : 'RTW'
                      });
                    }
                    
                    if($scope.totNumVehicles.nef > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.nef.toString(),
                        key : 'NEF'
                      });
                    }
                    
                    if($scope.totNumVehicles.mtw > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.mtw.toString(),
                        key : 'MTW'
                      });
                    }
                    
                    if($scope.totNumVehicles.rth > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.rth.toString(),
                        key : 'RTH'
                      });
                    }
                    
                    if($scope.totNumVehicles.gwSan > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.gwSan.toString(),
                        key : 'GW-SAN'
                      });
                    }
                    
                    if($scope.totNumVehicles.sanEl > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.sanEl.toString(),
                        key : 'SAN-EL'
                      });
                    }
                    
                    if($scope.totNumVehicles.ugSanEl > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.ugSanEl.toString(),
                        key : 'UG-SAN-EL'
                      });
                    }
                    
                    if($scope.totNumVehicles.kid > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.kid.toString(),
                        key : 'KID'
                      });
                    }
                    
                    if($scope.totNumVehicles.kdow > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.kdow.toString(),
                        key : 'KDOW'
                      });
                    }
                    
                    if($scope.totNumVehicles.ktw > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.ktw.toString(),
                        key : 'KTW'
                      });
                    }
                    
                    if($scope.totNumVehicles.pv > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.pv.toString(),
                        key : 'PV'
                      });
                    }
                    
                    if($scope.totNumVehicles.ft > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.ft.toString(),
                        key : 'FT'
                      });
                    }
                    
                    if($scope.totNumVehicles.trv > 0){
                      $scope.requestedVehiclesData.push({
                        value : $scope.totNumVehicles.trv.toString(),
                        key : 'TRV'
                      });
                    }
                    
                    
                    $scope.requestedVehiclesData.push({
                      value : $scope.totNumVehicles.total.toString(),
                      key : 'total number'
                    });
                      
                  }
                });
                
            }
        ]);
