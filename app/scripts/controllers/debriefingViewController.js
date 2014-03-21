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

                $scope.patients = ooi.getCapturePatients().query();
                
                
                $scope.stepMinutesData = 10;
                $scope.stepAmountData = 30;
                
                $scope.cmKpiData = [ {
                  value : '11min',
                  key : 'time until triage starts'
                }, {
                  value : '60min',
                  key : 'max time until triage starts'
                }, {
                  value : '3',
                  key : 'number of classification errors'
                } ];
                
            }
        ]);
