angular.module(
    'eu.crismaproject.pilotE',
    [
        'eu.crismaproject.pilotE.controllers',
        'eu.crismaproject.pilotE.directives',
        'eu.crismaproject.pilotE.services',
        'ui.bootstrap',
        'mgcrea.ngStrap'
    ]
).config(
    [
        '$timepickerProvider',
        function ($timepickerProvider) {
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
