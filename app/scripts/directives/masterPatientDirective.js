angular.module(
    'eu.crismaproject.pilotE.directives'
).directive(
    'masterPatientWidget',
    function () {
        'use strict';

        var scope = {
                patients: '=',
                selectedPatient: '='
            };

        return {
            scope: scope,
            restrict: 'E',
            templateUrl: 'templates/masterPatientTemplate.html',
            controller: 'masterPatientDirectiveController'
        };
    }
).run(['$templateCache', function ($templateCache) {
    'use strict';

    $templateCache.put('masterPatientDirectiveTablePager', '<div id="custom-pager"><ul class="pager ng-cloak"><li ng-repeat="page in pages" ng-class="{\'disabled\': !page.active, \'previous\': page.type == \'prev\', \'next\': page.type == \'next\'}" ng-show="page.type == \'prev\' || page.type == \'next\'" ng-switch="page.type"><a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo; Previous</a><a ng-switch-when="next" ng-click="params.page(page.number)" href="">Next &raquo;</a></li><li><div class="btn-group"><button type="button" ng-class="{\'active\':params.count() == 10}" ng-click="params.count(10)" class="btn btn-default">10</button><button type="button" ng-class="{\'active\':params.count() == 25}" ng-click="params.count(25)" class="btn btn-default">25</button><button type="button" ng-class="{\'active\':params.count() == 50}" ng-click="params.count(50)" class="btn btn-default">50</button><button type="button" ng-class="{\'active\':params.count() == 100}" ng-click="params.count(100)" class="btn btn-default">100</button></div></li></ul></div>');
}]);