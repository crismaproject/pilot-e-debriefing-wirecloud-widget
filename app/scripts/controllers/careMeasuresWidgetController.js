var controllers = angular.module('eu.crismaproject.pilotE.controllers');

    controllers.controller('careMeasuresWidgetController',
        ['$scope',
         'eu.crismaproject.pilotE.services.OoI',
         '$q',
         'DEBUG',
         
    function($scope, ooiService, $q, DEBUG) {
     'use strict';
          
      var chartSettings = {
          pieChartOptions : {
            // Provide a custom seriesColors array to override the default colors.
            seriesColors : [ '#FF0000', '#FFFF00', '#66FF66', '#C0C0C0' ],
            title : {
              text : 'Overview of all patients',
              fontFamily : 'Helvetica',
              fontSize : '14pt',
              show : true,
            },
            seriesDefaults : {
              // Make this a pie chart.
              renderer : jQuery.jqplot.PieRenderer,
              rendererOptions : {
                // Put data labels on the pie slices.
                // By default, labels show the percentage of the slice.
                showDataLabels : true,
                dataLabels : 'value'
              }
            },
            legend : {
              show : true,
              location : 'e'
            }
          }
        };
          
      var patientDataForChart = [];

      var numberOfPatients = 0;
      var patients = ooiService.getCapturePatients().query();
      patients.$promise.then(function(resp) {
        
        // Get number of all patients.
        numberOfPatients = resp.length;
        if (DEBUG) {
          console.log('Number of Patients: ' + numberOfPatients);
        }

        // Get triage classification of all patients and put the data into a
        // map.
        
        
        var classificationMap = {};
        var patientPromises = [];

        for (var patId = 1; patId <= numberOfPatients; patId++) {
          var triageClassification = 'unclassified';
          var patientXY = ooiService.getCapturePatients().get({
            patientId : patId
          });
          patientPromises.push(patientXY.$promise);
        }

        $q.all(patientPromises).then(
            function(responses) {
              angular.forEach(responses,
                  function(resp) {
                    if (DEBUG) {
                     console.log(resp);
                     console.log(resp.correctTriage);
                     console.log(resp.triage.classification);
                    }
                    triageClassification = resp.triage.classification;

                    if (triageClassification === null || triageClassification === undefined || triageClassification.valueOf() === '') {
                      triageClassification = 'unclassified';
                    }

                    if (classificationMap[triageClassification] === null || classificationMap[triageClassification] === undefined) {
                      classificationMap[triageClassification] = 0;
                    }
                    classificationMap[triageClassification]++;
                    
                    if (DEBUG) {
                     console
                         .log('classificationMap.T1: ' + classificationMap.T1);
                     console
                         .log('classificationMap.T2: ' + classificationMap.T2);
                     console
                         .log('classificationMap.T3: ' + classificationMap.T3);
                     console.log('classificationMap.unclassified: ' + classificationMap.unclassified);
                    }
                  });

              if (DEBUG) {
               console.log(classificationMap);
               console.log('classificationMap.T2: ' + classificationMap.T2);
              }

              for ( var key in classificationMap) {
                patientDataForChart.push([ key, classificationMap[key] ]);
              }
              
              if (DEBUG) {
               console.log(patientDataForChart);
              }

              patientDataForChart.sort(function(a, b) {
                if (a[0] > b[0]) {
                  return 1;
                }
                if (a[0] < b[0]) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });

              $scope.someData = [ patientDataForChart ];
              $scope.myChartOpts = chartSettings.pieChartOptions;
            });

      });
      
      $scope.incidentData = [ {
        value : '35min',
        key : 'average time until care measures start'
      }, {
        value : '0',
        key : 'number of peoples died'
      } ];
      
    }]);
