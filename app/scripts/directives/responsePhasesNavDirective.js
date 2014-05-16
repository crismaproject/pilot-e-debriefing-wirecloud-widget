angular.module('eu.crismaproject.pilotE.directives').directive(
    'responsePhasesNav',
    function() {
      'use strict';
      
     var scope = {
       listHeader: '@',
       listItems: '='
     };
   
     return {
       scope: scope,
       restrict: 'AE',
       templateUrl: 'templates/responsePhasesNavTemplate.html',
       controller: 'responsePhasesNavController'
     };
    }
);
