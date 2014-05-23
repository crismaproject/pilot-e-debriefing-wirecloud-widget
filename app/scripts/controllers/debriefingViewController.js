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

                $scope.patients = ooi.getCapturePatients().getAll();
                
                //Data for Care-Measures-Widget:
                
                $scope.cmKpiData = [ {
                  value : '35min',
                  key : 'average time until care measures start'
                }, {
                  value : '0',
                  key : 'number of peoples died'
                } ];
                
                //Data for Pre-Triage-Widget:
                
                $scope.stepMinutesData = 10;
                                
                $scope.ptrKpiData = [ {
                  value : '6min',
                  key : 'time until pre-triage starts'
                }, {
                  value : '30min',
                  key : 'max time until pre-triage starts'
                }, {
                  value : '4',
                  key : 'number of classification errors'
                } ];
                
                //Data for Triage-Widget:
                
                $scope.trKpiData = [ {
                  value : '11min',
                  key : 'time until triage starts'
                }, {
                  value : '60min',
                  key : 'max time until triage starts'
                }, {
                  value : '3',
                  key : 'number of classification errors'
                } ];
                
                //Data for Transportation-Widget:
                
                $scope.transpKpiData = [ {
                  value : '70min',
                  key : 'max time last red patient is transported'
                }, {
                  value : '43min',
                  key : 'time first red patient is transported'
                }, {
                  value : '0',
                  key : 'number of people died'
                } ];
                
                
                //Data for Breadcrumb-Stack-Widget
                
                $scope.listHeaderData = 'Response Phases';
                
                $scope.listItemsData = [ {
                    value : 'Alerts and Requests'
                  }, {
                    value : 'Resources on site'
                  }, {
                    value : 'Spatial Planing'
                  }, {
                    value : 'Pre-Triage'
                  }, {
                    value : 'Triage'
                  }, {
                    value : 'Transportation of Patients'
                  }, {
                    value : 'Care Measures'
                  }
                ];
                
                $scope.hideResponsePhasesNav = false;
                $scope.selectedItemIndexNav1 = -1;
                $scope.selectedItemIndexNav2 = -1;
                
                
                $scope.$on('requestElemSelectedFromNav1', function(event, index) {
                  console.info('ResponsePhasesNavDataController received elemSelected event, now broadcasting it to child controllers. index: ' + index);
                  console.info('$scope.listItemsData[' + index + ']: ' + $scope.listItemsData[index].value);
                  $scope.$broadcast('executeElemSelectedNav1', index);
                });
                $scope.$on('requestElemSelectedFromNav2', function(event, index) {
                  console.info('ResponsePhasesNavDataController received elemSelected event, now broadcasting it to child controllers. index: ' + index);
                  console.info('$scope.listItemsData[' + index + ']: ' + $scope.listItemsData[index].value);
                  $scope.$broadcast('executeElemSelectedNav2', index);
                });
                
                $scope.navigateBack = function() {
                  console.info('Navigate back has been clicked!');
                  $scope.hideResponsePhasesNav = false;
                  $scope.selectedItemIndexNav1 = -1;
                  $scope.selectedItemIndexNav2 = -1;
               };
                
            }
        ]);
