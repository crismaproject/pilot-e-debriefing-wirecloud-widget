/* Services */
angular.module(
    'eu.crismaproject.pilotE.services'
).factory(
    'eu.crismaproject.pilotE.services.OoI',
    [
        'OOI_API',
        '$resource',
        '$timeout',
        function (OOI_API, $resource, $timeout) {
            'use strict';

            var getCapturePatients,
                getMaxCareMeasures,
                getClassifications,
                getAverageRating,
                getAverageRatingString,
                getRatedMeasuresCount,
                getQueue,
                queueMap;

            // TODO: implement proper ooi integration

            getCapturePatients = function () {
                return $resource(OOI_API + '/CRISMA.capturePatients/:patientId', {patientId: '@id', deduplicate: true, level: 5},
                    {
                        'get':    {method: 'GET', cache: true, transformResponse: function (data) {
                            // we augment the patient with virtual properties
                            var patient;

                            patient = JSON.parse(data);
                            patient.ratedMeasuresCount = getRatedMeasuresCount(patient);
                            patient.averageRating = getAverageRating(patient);
                            patient.averageRatingString = getAverageRatingString(patient.averageRating);

                            return patient;
                        }},
                        'save':   {method: 'PUT', cache: true, transformRequest: function (data) {
                            // we remove the virtual properties from the patient again
                            return JSON.stringify(data, function (k, v) {
                                if (k === 'averageRating' || k === 'averageRatingString' || k === 'ratedMeasuresCount') {
                                    return undefined;
                                }

                                if (k.substring(0, 1) === '$' && !(k === '$self' || k === '$ref')) {
                                    return undefined;
                                }

                                return v;
                            });
                        }, transformResponse: function (data) {
                            // we augment the patient with virtual properties again
                            var patient;

                            patient = JSON.parse(data);
                            patient.ratedMeasuresCount = getRatedMeasuresCount(patient);
                            patient.averageRating = getAverageRating(patient);
                            patient.averageRatingString = getAverageRatingString(patient.averageRating);

                            return patient;
                        }},
                        'query':  {method: 'GET', isArray: true, transformResponse: function (data) {
                            // we strip the ids of the objects only
                            var col, res, i;

                            col = JSON.parse(data).$collection;
                            res = [];

                            for (i = 0; i < col.length; ++i) {
                                res.push({'id': parseInt(col[i].$self.substr(col[i].$self.lastIndexOf('/') + 1), 10)});
                            }

                            return res;
                        }},
                        'getAll' : {method : 'GET', isArray : true, transformResponse : function(data) {
                          var col, res;
                          col = JSON.parse(data).$collection;
                          res = col;
                          return res;
                        }},
                        'remove': {method: 'DELETE', cache: true},
                        'delete': {method: 'DELETE', cache: true}
                    });
            };

            getMaxCareMeasures = function () {
                return 7;
            };

            getClassifications = function () {
                return [
                    'T1', 'T2', 'T3'
                ];
            };

            getAverageRating = function (patient) {
                var i, numerator, denominator;

                if (patient.careMeasures.length !== getMaxCareMeasures()) {
                    throw 'IllegalArgumentException: not all care measures specified';
                }

                numerator = 0;
                denominator = 0;
                for (i = 0; i < patient.careMeasures.length; ++i) {
                    if (patient.careMeasures[i].rating) {
                        denominator++;
                        numerator += parseInt(patient.careMeasures[i].rating, 10);
                    }
                }

                return denominator > 0 ? Math.round((numerator / denominator) * 100) / 100 : null;
            };

            getRatedMeasuresCount = function (patient) {
                var i, count;

                if (patient.careMeasures.length !== getMaxCareMeasures()) {
                    throw 'IllegalArgumentException: not all care measures specified';
                }

                count = 0;
                for (i = 0; i < patient.careMeasures.length; ++i) {
                    if (patient.careMeasures[i].rating) {
                        count++;
                    }
                }

                return count;
            };

            getAverageRatingString = function (rating) {
                if (!rating) {
                    return '';
                }

                if (rating <= 1.5) {
                    return '++';
                } else if (rating <= 2.5) {
                    return '+';
                } else if (rating <= 3.5) {
                    return '0';
                } else if (rating <= 4.5) {
                    return '-';
                } else if (rating <= 6) {
                    return '--';
                }

                return '';
            };

            queueMap = {};

            getQueue = function (queueName) {
                var queue, clear, currentPromise;

                if (!queueName) {
                    throw 'IllegalArgumentException: queueName empty';
                }

                currentPromise = queueMap[queueName];

                queue = function (fn, timeout) {
                    clear();

                    currentPromise = $timeout(fn, timeout);
                    queueMap[queueName] = currentPromise;
                    currentPromise.then(function () {
                        queueMap[queueName] = undefined;
                    });
                };

                clear = function () {
                    if (currentPromise) {
                        $timeout.cancel(currentPromise);
                    }
                };

                return {
                    queue : queue,
                    clear : clear
                };
            };
            
            return {
                getCapturePatients : getCapturePatients,
                getMaxCareMeasures : getMaxCareMeasures,
                getClassifications : getClassifications,
                getAverageRating : getAverageRating,
                getAverageRatingString : getAverageRatingString,
                getRatedMeasuresCount : getRatedMeasuresCount,
                getQueue : getQueue
            };
        }
    ]
);
