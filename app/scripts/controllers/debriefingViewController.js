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
                  value : '14',
                  key : 'Number of application of basic measures on scene'
                }, {
                  value : '3',
                  key : 'Patient/ mime assessment of basic measures '
                } ];
                
                //Data for Pre-Triage-Widget:
                
                $scope.stepMinutesData = 10;
                                
                $scope.ptrKpiData = [ {
                  value : '6min',
                  key : 'Time until all patients are pretriaged'
                } ];
                
                //Data for Triage-Widget:
                
                $scope.trKpiData = [ {
                  value : '11min',
                  key : 'Time until all patients are triaged'
                } ];
                
                //Data for Transportation-Widget:
                
                $scope.transpKpiData = [ {
                  value : '70min',
                  key : 'Time until last patient is transported to the hospital'
                }, {
                  value : '43min',
                  key : 'Time until red patients are away from the incident scene'
                } ];
                
                
                //Data for Breadcrumb-Stack-Widget
                
                $scope.stackNavData = [ {
                    value : 'Inspect'
                  }, {
                    value : 'Response - Exercise Run 2'
                  }
                ];
                
                $scope.breadcrumbKpiHeaderData = 'Key Performance Indicators';
                
                $scope.breadcrumbKpiData = [ {
                  value : '1,5',
                  key : 'Ratio of medical responders  per patient'
                }];
                
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
