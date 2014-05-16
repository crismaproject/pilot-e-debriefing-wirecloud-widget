angular.module('eu.crismaproject.pilotE.directives').directive(
    'responsePhasesNav2',
    function() {
      'use strict';
      
     var scope = {
       listHeader: '@',
       listItems: '='
     };
   
     return {
       scope: scope,
       restrict: 'AE',
       templateUrl: 'templates/responsePhasesNav2Template.html',
       controller: 'responsePhasesNav2Controller'
     };
    }
);
