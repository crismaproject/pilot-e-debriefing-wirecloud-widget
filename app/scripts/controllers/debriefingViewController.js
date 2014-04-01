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
                
            }
        ]);
