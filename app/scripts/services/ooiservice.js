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

            // TODO: implement proper ooi integration

            var getCapturePatients = function () {
                return $resource('devResources/capturePatients/:patientId.json', {patientId: '@id'}, {
                    query: {method: 'GET', params: { patientId: 'allPatients'}, isArray: true}
                });
            };

            return {
                getCapturePatients : getCapturePatients
            };
        }
    ]
);
