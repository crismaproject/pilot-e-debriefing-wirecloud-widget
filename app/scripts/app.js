angular.module(
'eu.crismaproject.pilotE',
[
  'eu.crismaproject.pilotE.controllers',
  'eu.crismaproject.pilotE.directives',
  'eu.crismaproject.pilotE.services',
  'ui.bootstrap',
  // might clash with ui.bootstrap thus only declaring the used modules instead of the whole bunch
  'mgcrea.ngStrap.timepicker',
  'ngRoute',
  'ngAnimate',
  'ui.chart'
]
).config(['$routeProvider','$timepickerProvider', function ($routeProvider, $timepickerProvider) {
// consistent defaults for the whole app
        'use strict';

//        $routeProvider
//            .when('/', {
//                templateUrl: 'views/debriefing.html',
//                controller: 'debriefingViewController'
//            }).when('/debriefing', {
//                templateUrl : 'views/debriefing.html',
//                controller : 'debriefingViewController'
//            }).otherwise({
//                redirectTo: '/'
//            });
            
       
        angular.extend(
                $timepickerProvider.defaults,
                {
                    timeFormat: 'HH:mm',
                    timeType: 'iso',
                    minuteStep: '1'
                }
        );
       
       
    }]);

