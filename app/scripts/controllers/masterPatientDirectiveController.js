angular.module('eu.crismaproject.pilotE.controllers')
    .controller('masterPatientDirectiveController',
        [
            '$scope',
            '$q',
            'ngTableParams',
            'eu.crismaproject.pilotE.services.OoI',
            'DEBUG',
            function ($scope, $q, NgTableParams, ooi, DEBUG) {
                'use strict';

                var initTable;

                if (DEBUG) {
                    console.log("initialising master patient directive controller");
                }

                if (!$scope.patients) {
                    throw "IllegalStateException: patients not provided by directive user";
                }

                initTable = function (allPatients) {
                    $scope.tableParams = new NgTableParams(
                        {
                            page: 1,
                            count: 10
                        },
                        {
                            total: $scope.patients.length,
                            getData: function ($defer, params) {
                                var currentPatients, resolvedPatients, i;

                                currentPatients = allPatients.slice(
                                    (params.page() - 1) * params.count(),
                                    params.page() * params.count()
                                );

                                resolvedPatients = [];

                                for (i = 0; i < currentPatients.length; ++i) {
                                    resolvedPatients[i] = ooi.getCapturePatients().get({patientId: currentPatients[i].id}).$promise;
                                }

                                $q.all(resolvedPatients).then(function (thePatients) {
                                    var patient, i, j, rating, getRatingString;

                                    getRatingString = function (rating) {
                                        if (rating <= 1.5) {
                                            return '++';
                                        } else if (rating <= 2.5) {
                                            return '+';
                                        } else if (rating <= 3.5) {
                                            return '0';
                                        }

                                        return '';
                                    };

                                    for (i = 0; i < thePatients.length; ++i) {
                                        patient = thePatients[i];
                                        rating = null;
                                        for (j = 0; j < patient.careMeasures.length; ++j) {
                                            rating += patient.careMeasures[j].rating;
                                        }

                                        if (rating !== null) {
                                            rating /= patient.careMeasures.length;
                                            rating = Math.round(rating * 100) / 100;
                                            patient.averageRating = rating;
                                            patient.averageRatingString = getRatingString(rating);
                                        }
                                    }
                                    $defer.resolve(thePatients);
                                });
                            }
                        }
                    );
                };

                if ($scope.patients.length === 0) {
                    if ($scope.patients.$promise) {
                        $scope.patients.$promise.then(function () {
                            initTable($scope.patients);
                        });
                    } else {
                        throw "IllegalStateException: no patients";
                    }
                } else {
                    initTable($scope.patients);
                }

                $scope.maxCareMeasures = ooi.getMaxCareMeasures();
                $scope.selectedPatient = null;

                $scope.setSelected = function (patient) {
                    $scope.selectedPatient = patient;
                };
            }]);
