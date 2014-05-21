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
                
                
                
            }
        ]);
