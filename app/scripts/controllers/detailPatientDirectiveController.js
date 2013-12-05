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

                $scope.$on('ratingChanged', function () {
                    $scope.patient.ratedMeasuresCount = ooi.getRatedMeasuresCount($scope.patient);
                    $scope.patient.averageRating = ooi.getAverageRating($scope.patient);
                    $scope.patient.averageRatingString = ooi.getAverageRatingString($scope.patient.averageRating);
                });
            }
        ])
    .controller('detailPatientDirectiveCareMeasureController',
        [
            '$scope',
            function ($scope) {
                'use strict';

                $scope.$watch('cm.rating', function () {
                    $scope.$emit('ratingChanged');
                });
            }]);
