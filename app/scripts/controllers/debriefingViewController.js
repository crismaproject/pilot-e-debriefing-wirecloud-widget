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
