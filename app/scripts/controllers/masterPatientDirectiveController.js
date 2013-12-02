angular.module('eu.crismaproject.pilotE.controllers')
    .controller('masterPatientDirectiveController',
        [
            '$scope',
            '$q',
            '$filter',
            'ngTableParams',
            'eu.crismaproject.pilotE.services.OoI',
            'DEBUG',
            function ($scope, $q, $filter, NgTableParams, ooi, DEBUG) {
                'use strict';

                if (DEBUG) {
                    console.log("initialising master patient directive controller");
                }

                if (!$scope.patients) {
                    throw "IllegalStateException: patients not provided by directive user";
                }

                $scope.tableParams = new NgTableParams(
                    {
                        page: 1,
                        count: 10,
                        sorting: { name: 'asc' }
                    },
                    {
                        total: $scope.patients.length,
                        $scope: {$data: {}},
                        getData: function ($defer, params) {
                            var currentPatients, resolvedPatients, i;

                            // FIXME: this won't work with order and filter, we have to apply this paging at the very
                            // latest, however, shall be fixed as soon as proper backend is available
                            currentPatients = $scope.patients.slice(
                                (params.page() - 1) * params.count(),
                                params.page() * params.count()
                            );

                            resolvedPatients = [];

                            for (i = 0; i < currentPatients.length; ++i) {
                                // FIXME: we shouldn't load the data here, we either assume that it has already been loaded
                                // or we load it once and cache it, shall be fixed as soon as proper backend is available
                                resolvedPatients[i] = ooi.getCapturePatients().get({patientId: currentPatients[i].id}).$promise;
                            }

                            $q.all(resolvedPatients).then(function (thePatients) {
                                var patient, i, j, rating, getRatingString, ordered;

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

                                ordered = params.filter() ? $filter('filter')(thePatients, params.filter()) : thePatients;
                                ordered = params.sorting() ? $filter('orderBy')(ordered, params.orderBy()) : thePatients;

                                params.total(ordered.length);
                                $defer.resolve(ordered);
                            });
                        }
                    }
                );

                $scope.$watch('patients.length', function (n, o, p) {
                    $scope.tableParams.reload();
                });

                $scope.maxCareMeasures = ooi.getMaxCareMeasures();
                $scope.selectedPatient = null;

                $scope.setSelected = function (patient) {
                    $scope.selectedPatient = patient;
                };
            }]);
