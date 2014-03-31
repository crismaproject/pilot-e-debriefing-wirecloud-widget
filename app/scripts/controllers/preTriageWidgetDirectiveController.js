var controllers = angular.module('eu.crismaproject.pilotE.controllers');

    controllers.controller('preTriageWidgetDirectiveController',
        ['$scope',
         'eu.crismaproject.pilotE.services.OoI',
         '$q',
         'DEBUG',
         
    function($scope, ooiService, $q, DEBUG) {
     'use strict';
     
     if (DEBUG) {
       console.log('initialising pre triage widget directive controller');
     }

     if (!$scope.patientsData) {
         throw 'IllegalStateException: patientsData not provided by directive user';
     }
     
     if (!$scope.kpiListData) {
         throw 'IllegalStateException: kpiListData not provided by directive user';
     }
     
     
     if (!$scope.stepMinutes) {
       if (DEBUG) {
         console.log('stepMinutes not provided by directive user, setting default value.');
       }
       $scope.stepMinutes = 10;
     }
          
      var chartOpts = {
           barChartOptions : {
             // Tell the plot to stack the bars.
             stackSeries : true,
           captureRightClick : true,
           title : {
             text : 'Pre-Triage',
             fontFamily : 'Helvetica',
             fontSize : '14pt',
             show : true,
           },
           seriesColors : [ '#CCCCCC', '#FF6600' ],
           seriesDefaults : {
             renderer : $.jqplot.BarRenderer,
             rendererOptions : {
               // Put a 30 pixel margin between bars.
               barMargin : 30,
               barWidth : 15,
               // Highlight bars when mouse button pressed.
               // Disables default highlighting on mouse over.
               highlightMouseDown : true
             },
             pointLabels : {
               show : true,
             }
           },
           axes : {
             xaxis : {
               renderer : $.jqplot.DateAxisRenderer,
               tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
               tickOptions : {
                 fontSize: '8pt',
                 formatString : '%R'
               },
               label : 'Time since exercise start (hh:mm)',
               labelOptions : {
                 fontFamily : 'Helvetica',
                 fontSize : '14pt'
               }
             },
             yaxis : {
               padMin : 0,
               label : 'Amount of Patients',
               labelOptions : {
                 fontFamily : 'Helvetica',
                 fontSize : '14pt'
               },
               labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
               pad : 1.1,
               rendererOptions : {
                 forceTickAt0 : true
               }
             }
           },
           legend : {
             show : true,
             location : 'ne',
             placement : 'outside',
             labels : [ 'correct pre-triage of patients',
                 'wrong pre-triage of patients' ],
             renderer : $.jqplot.EnhancedLegendRenderer,
             rendererOptions : {
               rowSpacing : '4.0em',
             }
           },
           cursor : {
             show: true,
             zoom: true,
           }
          }
        };
      
      
      var patientDataForChart = [];

      // Get number of all patients.

      var numberOfPatients = 0;
      $scope.patientsData.$promise
          .then(function(resp) {
            numberOfPatients = resp.length;
            if (DEBUG) {
              console.log('Number of Patients: ' + numberOfPatients);
            }

            // Get pre-triage classification of all patients and put the
            // data into a map.

            $scope.patientPreTriageCheckCorrectTimestamp = [];
            var patientPreTriageCheckIncorrectTimestamp = [];
            var patientPreTriageCheck = [];
            var patientPromises = [];
            
            for (var patId = 1; patId <= numberOfPatients; patId++) {
              var patientXY = ooiService.getCapturePatients().get({
                patientId : patId
              });
              patientPromises.push(patientXY.$promise);
            }

            $q
                .all(patientPromises)
                .then(
                    function(responses) {
                      angular
                          .forEach(
                              responses,
                              function(resp) {
                                if (DEBUG) {
                                 console.log(resp);
                                 console.log(resp.correctTriage);
                                 console.log(resp.preTriage.classification);
                                }

                                var correctPreTriage = resp.correctTriage === resp.preTriage.classification;
                                if (DEBUG) {
                                  console.log('correctPreTriage: ' + correctPreTriage);
                                }

                                patientPreTriageCheck.push([ resp.id,
                                    correctPreTriage,
                                    resp.preTriage.timestamp ]);

                                if (moment(resp.preTriage.timestamp)
                                    .isValid()) {
                                  $scope.patientPreTriageCheckCorrectTimestamp
                                      .push([
                                          moment(resp.preTriage.timestamp)
                                              .format('YYYY-MM-DD HH:mm:ss'),
                                          correctPreTriage ]);
                                } else {
                                  patientPreTriageCheckIncorrectTimestamp
                                      .push([ resp.preTriage.timestamp,
                                          correctPreTriage ]);
                                }

                              });

                      // Sort array by date ascending.
                      $scope.patientPreTriageCheckCorrectTimestamp
                          .sort(function(a, b) {
                            // a < b
                            if (moment(a[0]).diff(moment(b[0])) < 0) {
                              return -1;
                            }
                            // a > b
                            if (moment(b[0]).diff(moment(a[0])) < 0) {
                              return 1;
                            }
                            // a must be equal to b
                            return 0;
                          });
                      
                      if (DEBUG) {
                        console.log($scope.patientPreTriageCheckCorrectTimestamp);
                      }

                      // Starttime for the chart.
                      $scope.timePeriodStart = moment(
                          $scope.patientPreTriageCheckCorrectTimestamp[0][0]).format('YYYY-MM-DD HH:mm:ss');
                      if (DEBUG) {
                        console.log('timePeriodStart: ' + $scope.timePeriodStart);
                      }

                      // Endtime for the chart.
                      $scope.timePeriodEnd = moment(
                          $scope.patientPreTriageCheckCorrectTimestamp[$scope.patientPreTriageCheckCorrectTimestamp.length - 1][0]).format('YYYY-MM-DD HH:mm:ss');
                      if (DEBUG) {
                        console.log('timePeriodEnd: ' +  $scope.timePeriodEnd);
                      }

                      $scope.calculatePreTriagedPatients = function(
                          startDateTimeStamp, endDateTimeStamp, dataArray, iterStepMinutes) {
                        var arrWrongClassifiedPatients = [];
                        var arrCorrectClassifiedPatients = [];

                        var currIter = 0;
                        var currIterTimeStamp = moment(startDateTimeStamp);
                        
                        while (!currIterTimeStamp.isAfter(moment(endDateTimeStamp))){
                        currIterTimeStamp = moment(startDateTimeStamp)
                        .add('minutes', iterStepMinutes * currIter);

                          var nbrWrongClassifiedPatients = 0;
                          var nbrCorrectClassifiedPatients = 0;

                          for (var i = 0; i < dataArray.length; i++) {
                            // Only consider time until dateTimeStamp.
                            if (moment(dataArray[i][0]).diff(
                                currIterTimeStamp) <= 0) {
                              if (dataArray[i][1] === true) {
                                // Triage classification is correct.
                                nbrCorrectClassifiedPatients++;
                              } else {
                                // Triage classification is wrong.
                                nbrWrongClassifiedPatients++;
                              }
                            }
                          }

                          arrWrongClassifiedPatients.push([
                              currIterTimeStamp
                                  .format('YYYY-MM-DD HH:mm:ss'),
                              nbrWrongClassifiedPatients ]);
                          arrCorrectClassifiedPatients.push([
                              currIterTimeStamp
                                  .format('YYYY-MM-DD HH:mm:ss'),
                              nbrCorrectClassifiedPatients]);
                          
                          currIter++;
                        }

                        return [ arrCorrectClassifiedPatients,
                            arrWrongClassifiedPatients ];
                      };

                      if (DEBUG) {
                       console.log('WrongClassifiedPatients: ');
                       console.log($scope.calculatePreTriagedPatients(
                           $scope.timePeriodStart,
                           $scope.timePeriodEnd, $scope.patientPreTriageCheckCorrectTimestamp, $scope.stepMinutes)[1]);
                       console.log('CorrectClassifiedPatients: ');
                       console.log($scope.calculatePreTriagedPatients(
                           $scope.timePeriodStart,
                           $scope.timePeriodEnd, $scope.patientPreTriageCheckCorrectTimestamp, $scope.stepMinutes)[0]);
                      }

                      patientDataForChart = $scope.calculatePreTriagedPatients(
                          $scope.timePeriodStart,
                          $scope.timePeriodEnd,
                          $scope.patientPreTriageCheckCorrectTimestamp,
                          $scope.stepMinutes);

                      // Finally set start date to chart options.
                      chartOpts.barChartOptions.axes.xaxis.min = moment($scope.timePeriodStart).subtract('minutes', 30).format('YYYY-MM-DD HH:mm:ss');

                      // Finally set end date to chart options.
                      chartOpts.barChartOptions.axes.xaxis.max = moment($scope.timePeriodEnd).add('minutes', 30).format('YYYY-MM-DD HH:mm:ss');
                      
                      $scope.chartData = patientDataForChart;
                      $scope.chartSettings = chartOpts.barChartOptions;

                    });
          });
            
            $scope.$watch('stepMinutes', function() {
              if (parseInt($scope.stepMinutes, 10) > 0) {
                var patientDataForChart = [];
                patientDataForChart = $scope.calculatePreTriagedPatients(
                    $scope.timePeriodStart,
                    $scope.timePeriodEnd,
                    $scope.patientPreTriageCheckCorrectTimestamp,
                    $scope.stepMinutes);
                $scope.chartData = patientDataForChart;
              }
            });
            
    }]);
