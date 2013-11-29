angular.module('eu.crismaproject.pilotE.controllers')
    .controller('detailPatientDirectiveController',
        [
            '$scope',
            'eu.crismaproject.pilotE.services.OoI',
            'DEBUG',
            function ($scope, ooi, DEBUG) {
                'use strict';

                if (DEBUG) {
                    console.log('initialising detail patient directive controller');
                }

                $scope.classifications = ooi.getClassifications();
            }
        ]);
