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

            var getCapturePatients, getMaxCareMeasures;

            // TODO: implement proper ooi integration

            getCapturePatients = function () {
                return $resource('devResources/capturePatients/:patientId.json', {patientId: '@id'}, {
                    query: {method: 'GET', params: { patientId: 'allPatients'}, isArray: true}
                });
            };

            getMaxCareMeasures = function () {
                return 7;
            };

            return {
                getCapturePatients : getCapturePatients,
                getMaxCareMeasures : getMaxCareMeasures
            };
        }
    ]
);
