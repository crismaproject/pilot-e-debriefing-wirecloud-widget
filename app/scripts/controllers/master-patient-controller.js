angular.module('eu.crismaproject.pilotE.controllers',
    [
        'ngTable',
        'eu.crismaproject.pilotE.services',
        'eu.crismaproject.pilotE.configuration'
    ])
    .controller('master-patient-controller',
        [
            '$scope',
            '$q',
            'ngTableParams',
            'eu.crismaproject.pilotE.services.OoI',
            'DEBUG',
            function ($scope, $q, NgTableParams, ooi, DEBUG) {
                'use strict';

                if (DEBUG) {
                    console.log("initialising master controller");
                }

                $scope.patients = ooi.getCapturePatients().query(function () {
                    $scope.tableParams = new NgTableParams(
                        {
                            page: 1,
                            count: 10
                        },
                        {
                            total: $scope.patients.length,
                            getData: function ($defer, params) {
                                var currentPatients, resolvedPatients, i;

                                currentPatients = $scope.patients.slice(
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
                });
                $scope.maxCareMeasures = ooi.getMaxCareMeasures();
                $scope.selectedPatient = null;

                $scope.setSelected = function (patient) {
                    $scope.selectedPatient = patient;
                };
            }]);
