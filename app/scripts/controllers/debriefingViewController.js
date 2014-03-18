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
                
            }
        ]);
