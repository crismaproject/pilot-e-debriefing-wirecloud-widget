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

            var getCapturePatients, getMaxCareMeasures, getClassifications;

            // TODO: implement proper ooi integration

            getCapturePatients = function () {
                return $resource(OOI_API + '/CRISMA.capturePatients/:patientId', {},
                    {
                        'get':    {method: 'GET', cache: true},
                        'save':   {method: 'POST', cache: true},
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

            return {
                getCapturePatients : getCapturePatients,
                getMaxCareMeasures : getMaxCareMeasures,
                getClassifications : getClassifications
            };
        }
    ]
);
