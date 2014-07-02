angular.module('eu.crismaproject.pilotE.controllers')
    .controller('debriefingViewController',
        [   '$resource',
            '$scope',
            'eu.crismaproject.pilotE.services.OoI',
            'DEBUG',
            'STEP_MINUTES',
            function ($resource, $scope, ooi, DEBUG, STEP_MINUTES) {
                'use strict';

                if (DEBUG) {
                    console.log('initialising debriefing view controller');
                }
                

//                $scope.patients = ooi.getCapturePatients().getAll();
//                $scope.patients = $scope.$parent.patients;
//                $scope.exercise = $scope.$parent.exercise;
                
                $scope.useprecalculatedbounds = true;

                
                //Data for Care-Measures-Widget:
                
                $scope.cmKpiData = [
//                {
//                  value : '??',
//                  key : 'Number of application of basic measures on scene'
//                }
//                ,
                {
                  value : '??',
                  key : 'Percentage of correct supplied patients'
                }
                
                ];
                
//                $scope.$watch('kpi6a', function() {
//                  $scope.cmKpiData[0].value =  $scope.$parent.kpi6a;
//                });
                
                $scope.$watch('kpi6b', function() {
                  $scope.cmKpiData[0].value =  ($scope.$parent.kpi6b * 100).toString() + '%';
                });
                
                //Data for Pre-Triage-Widget:
                
//                $scope.stepMinutesData = 10;
//                $scope.stepMinutesData = parseInt(STEP_MINUTES, 10);
                $scope.stepMinutesData = $scope.stepMinutesInterval;
                
                
                
                                
                $scope.ptrKpiData = [ {
                  value : '??min',
                  key : 'Time until all patients are pretriaged'
                } ];
                
                $scope.$watch('kpi4a', function() {
                  $scope.ptrKpiData[0].value =  $scope.$parent.kpi4a;
                });
                
                //Data for Triage-Widget:
                
                $scope.trKpiData = [ {
                  value : '??min',
                  key : 'Time until all patients are triaged'
                } ];
                
                $scope.$watch('kpi4b', function() {
                  $scope.trKpiData[0].value =  $scope.$parent.kpi4b;
                });
                
                //Data for Transportation-Widget:
                
                
                $scope.transpKpiData = [ {
                  value : '??min',
                  key : 'Time until last patient is transported to the hospital'
                }, {
                  value : '??min',
                  key : 'Time until red patients are away from the incident scene'
                } ];
                
                $scope.$watch('kpi1', function() {
                  $scope.transpKpiData[0].value =  $scope.$parent.kpi1;
                });
                
                $scope.$watch('kpi2', function() {
                  $scope.transpKpiData[1].value =  $scope.$parent.kpi2;
                });
                
                
                //Data for Alerts-and-Requests-Widget:
                
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
                
                
                $scope.alertsData = [];
                
                
                
                //Data for Breadcrumb-Stack-Widget
                
                $scope.stackNavData = [ {
                    value : 'Inspect'
                  }, {
                    value : 'Response - Exercise Run 2'
                  }
                ];
                
                $scope.breadcrumbKpiHeaderData = 'Key Performance Indicators';
                
                $scope.breadcrumbKpiData = [ {
                  value : '??',
                  key : 'Ratio of medical responders per patient'
                }];
                
                $scope.$watch('kpi3a', function() {
                  $scope.breadcrumbKpiData[0].value =  $scope.$parent.kpi3a;
                });
                
                $scope.listHeaderData = 'Response Phases';
                
                $scope.listItemsData = [
                  {
                    value : 'Resource Requests'
                  },
                  
//                  {
//                    value : 'Resources on site'
//                  }, {
//                    value : 'Spatial Planing'
//                  },
                  
                  {
                    value : 'Pre-Triage'
                  }, {
                    value : 'Triage'
                  }, {
                    value : 'Start of Evacuation of Patients'
                  }, {
                    value : 'Care Measures'
                  }
                ];
                
                
                //React when an indicator has been selected in timeline widget.
                
                $scope.$watch('selIndicator', function() {
                  if(DEBUG){
                    console.log('selIndicator has changed!');
                  }
                  $scope.navigateToSelIndicator();
                });
                
                
                $scope.navigateToSelIndicator = function(){
                  if(DEBUG){
                    console.log('Navigate to selected indicator!');
                  }
                  
                  if ($scope.$parent.selIndicator !== null){
                    
                    if(DEBUG){
                      console.log('$scope.$parent.selIndicator: ' + $scope.$parent.selIndicator);
                    }
                    
                    switch ($scope.$parent.selIndicator){
                      
                      case 'OverallTime':
                        $scope.navigateBack();
                      break;
                      case 'PreTriageTime':
                        $scope.hideResponsePhasesNav = true;
                        $scope.selectedItemIndexNav1 = 1;
                      break;
                      case 'TriageTime':
                        $scope.hideResponsePhasesNav = true;
                        $scope.selectedItemIndexNav1 = 2;
                      break;
                      case 'TransportationTime':
                        $scope.hideResponsePhasesNav = true;
                        $scope.selectedItemIndexNav1 = 3;
                      break;
                      case 'TreatmentTime':
                        //care measures
                        $scope.hideResponsePhasesNav = true;
                        $scope.selectedItemIndexNav1 = 4;
                      break;
                      case 'ResourceRequests':
                        //resource requests
                        $scope.hideResponsePhasesNav = true;
                        $scope.selectedItemIndexNav1 = 0;
                      break;
                      case 'ResourceArrivals':
                        //todo: create view
                      break;
                      default:
                        //no match
                        if (DEBUG) {
                          console.log('Selected indicator unknown!');
                        }
                        break;
                    }
                  }
                  
                };
                
                
                
//                $scope.selectedItemIndexNav2 = -1;
                
                
//                $scope.$on('requestElemSelectedFromNav1', function(event, index) {
//                  console.info('ResponsePhasesNavDataController received elemSelected event, now broadcasting it to child controllers. index: ' + index);
//                  console.info('$scope.listItemsData[' + index + ']: ' + $scope.listItemsData[index].value);
//                  $scope.$broadcast('executeElemSelectedNav1', index);
//                });
//                $scope.$on('requestElemSelectedFromNav2', function(event, index) {
//                  console.info('ResponsePhasesNavDataController received elemSelected event, now broadcasting it to child controllers. index: ' + index);
//                  console.info('$scope.listItemsData[' + index + ']: ' + $scope.listItemsData[index].value);
//                  $scope.$broadcast('executeElemSelectedNav2', index);
//                });
                
                $scope.navigateBack = function() {
                  console.info('Navigate back has been clicked!');
                  $scope.hideResponsePhasesNav = false;
                  $scope.selectedItemIndexNav1 = -1;
                  $scope.selectedItemIndexNav2 = -1;
               };
                
            }
        ]);
