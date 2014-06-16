angular.module('eu.crismaproject.pilotE.controllers')
    .controller('debriefingViewController',
        [   '$resource',
            '$scope',
            'eu.crismaproject.pilotE.services.OoI',
            'DEBUG',
            function ($resource, $scope, ooi, DEBUG) {
                'use strict';

                if (DEBUG) {
                    console.log('initialising debriefing view controller');
                }
                

//                $scope.patients = ooi.getCapturePatients().getAll();
//                $scope.patients = $scope.$parent.patients;
                
                $scope.useprecalculatedbounds = true;

                
                //Data for Care-Measures-Widget:
                
                $scope.cmKpiData = [ {
                  value : '??',
                  key : 'Number of application of basic measures on scene'
                }, {
                  value : '??',
                  key : 'Patient / mime assessment of basic measures '
                } ];
                
                $scope.$watch('kpi6a', function() {
                  $scope.cmKpiData[0].value =  $scope.$parent.kpi6a;
                });
                
                $scope.$watch('kpi6b', function() {
                  $scope.cmKpiData[1].value =  $scope.$parent.kpi6b;
                });
                
                //Data for Pre-Triage-Widget:
                
                $scope.stepMinutesData = 10;
                                
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
//                  {
//                    value : 'Alerts and Requests'
//                  }, {
//                    value : 'Resources on site'
//                  }, {
//                    value : 'Spatial Planing'
//                  },
                  
                  {
                    value : 'Pre-Triage'
                  }, {
                    value : 'Triage'
                  }, {
                    value : 'Transportation of Patients'
                  }, {
                    value : 'Care Measures'
                  }
                ];
                
                
                
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
