angular.module('eu.crismaproject.pilotE.controllers',
    [
        'ngTable',
        'ui.bootstrap.alert',
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
                    console.log('initialising capture view controller');
                }

                $scope.patients = ooi.getCapturePatients().query();
                $scope.selectedPatient = null;
                $scope.alerts = [];

                $scope.$on('alertSave', function (e, alert) {
                    if (alert) {
                        $scope.alerts.pop();
                        $scope.alerts.push(alert);

                        if (alert.type === 'success') {
                            ooi.getQueue('alertSave').queue(function () { $scope.alerts.pop(); }, 4000);
                        } else {
                            ooi.getQueue('alertSave').clear();
                        }
                    }
                });
            }
        ]);
