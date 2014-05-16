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
                
                $scope.cmKpiData = [ {
                  value : '35min',
                  key : 'average time until care measures start'
                }, {
                  value : '0',
                  key : 'number of peoples died'
                } ];
                
                
                $scope.$on('requestElemSelectedFromNav1', function(event, msg) {
                  console.info('ResponsePhasesNavDataController received elemSelected event, now broadcasting it to child controllers. value: ' + msg);
                  $scope.$broadcast('executeElemSelectedNav1', msg);
                });
                $scope.$on('requestElemSelectedFromNav2', function(event, msg) {
                  console.info('ResponsePhasesNavDataController received elemSelected event, now broadcasting it to child controllers. value: ' + msg);
                  $scope.$broadcast('executeElemSelectedNav2', msg);
                });

                
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
                
                
                
            }
        ]);
