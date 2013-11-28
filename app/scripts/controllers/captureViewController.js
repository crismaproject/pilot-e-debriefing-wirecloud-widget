angular.module('eu.crismaproject.pilotE.controllers',
    [
        'ngTable',
        'eu.crismaproject.pilotE.services',
        'eu.crismaproject.pilotE.configuration'
    ])
    .controller('captureViewController',
        [
            '$scope',
            'eu.crismaproject.pilotE.services.OoI',
            'DEBUG',
            function ($scope, ooi, DEBUG) {
                'use strict';

                if (DEBUG) {
                    console.log("initialising capture view controller");
                }

                $scope.patients = ooi.getCapturePatients().query();
                $scope.selectedPatient = null;
            }]);
