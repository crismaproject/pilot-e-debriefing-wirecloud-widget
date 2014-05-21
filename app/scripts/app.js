angular.module(
    'eu.crismaproject.pilotE',
    [
        'eu.crismaproject.pilotE.controllers',
        'eu.crismaproject.pilotE.directives',
        'eu.crismaproject.pilotE.services',
        'ui.bootstrap',
        // might clash with ui.bootstrap thus only declaring the used modules instead of the whole bunch
        'mgcrea.ngStrap.timepicker'
    ]
).config(
    [
        '$timepickerProvider',
        function ($timepickerProvider) {
            // consistent defaults for the whole app
            'use strict';

            angular.extend(
                $timepickerProvider.defaults,
                {
                    timeFormat: 'HH:mm',
                    timeType: 'iso',
                    minuteStep: '1'
                }
            );
        }
    ]
);
