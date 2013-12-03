/* Services */
angular.module(
    'eu.crismaproject.pilotE.services',
    [
        'ngResource',
        'eu.crismaproject.pilotE.configuration'
    ]
).factory(
    'eu.crismaproject.pilotE.services.OoI',
    [
        'OOI_API',
        '$resource',
        function (OOI_API, $resource) {
            'use strict';

            var getCapturePatients,
                getMaxCareMeasures,
                getClassifications,
                getAverageRating,
                getAverageRatingString,
                getRatedMeasuresCount;

            // TODO: implement proper ooi integration

            getCapturePatients = function () {
                return $resource(OOI_API + '/CRISMA.capturePatients/:patientId', {},
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
                        'save':   {method: 'POST', cache: true, transformRequest: function (data) {
                            // we remove the virtual properties from the patient again
                            console.log(data);

                            delete data.ratedMeasuresCount;
                            delete data.averageRating;
                            delete data.averageRatingString;

                            return data;
                        }},
                        'query':  {method: 'GET', isArray: true, transformResponse: function (data) {
                            // we strip the ids of the objects only
                            var col, res, i;

                            col = JSON.parse(data).$collection;
                            res = [];

                            for (i = 0; i < col.length; ++i) {
                                res.push({"id": parseInt(col[i].$ref.substr(col[i].$ref.lastIndexOf('/') + 1), 10)});
                            }

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
                    throw "IllegalArgumentException: not all care measures specified";
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
                    throw "IllegalArgumentException: not all care measures specified";
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

            return {
                getCapturePatients : getCapturePatients,
                getMaxCareMeasures : getMaxCareMeasures,
                getClassifications : getClassifications,
                getAverageRating : getAverageRating,
                getAverageRatingString : getAverageRatingString,
                getRatedMeasuresCount : getRatedMeasuresCount
            };
        }
    ]
);
