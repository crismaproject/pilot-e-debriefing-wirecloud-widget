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
             // stackedValue: true
             }
           },
           axes : {
             xaxis : {
               renderer : $.jqplot.DateAxisRenderer,
               min : '1899-12-30 08:23:00',
               tickOptions : {
                 formatString : '%R'
               },
               tickInterval : '30 minutes',
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
               // numberColumns: 3,
               // numberRows : 1,
               rowSpacing : '4.0em',
             }
           },
           cursor : {
           // show: true,
           // zoom:true,
           // showTooltip:true
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

            var patientPreTriageCheckCorrectTimestamp = [];
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
                                  patientPreTriageCheckCorrectTimestamp
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
                      patientPreTriageCheckCorrectTimestamp
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
                        console.log(patientPreTriageCheckCorrectTimestamp);
                      }

                      // Starttime for the chart shall be 30 minutes before
                      // the earliest triage timestamp.
                      var timePeriodStart = moment(
                          patientPreTriageCheckCorrectTimestamp[0][0])
                          .subtract('minutes', 30).format(
                              'YYYY-MM-DD HH:mm:ss');
                      if (DEBUG) {
                        console.log('timePeriodStart: ' + timePeriodStart);
                      }

                      // Endtime for the chart shall be 30 minutes after the
                      // last triage timestamp.
                      var timePeriodEnd = moment(
                          patientPreTriageCheckCorrectTimestamp[patientPreTriageCheckCorrectTimestamp.length - 1][0])
                          .add('minutes', 30).format('YYYY-MM-DD HH:mm:ss');
                      if (DEBUG) {
                        console.log('timePeriodEnd: ' + timePeriodEnd);
                      }

                      var calculatePreTriagedPatients = function(
                          dateTimeStamp, dataArray, nbrIterations,
                          iterStepMinutes) {
                        var arrWrongClassifiedPatients = [];
                        var arrCorrectClassifiedPatients = [];

                        for (var currIter = 0; currIter < nbrIterations; currIter++) {

                          var currIterTimeStamp = moment(dateTimeStamp)
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
                              nbrCorrectClassifiedPatients ]);
                        }

                        return [ arrCorrectClassifiedPatients,
                            arrWrongClassifiedPatients ];
                      };

                      if (DEBUG) {
                       console.log('WrongClassifiedPatients: ');
                       console.log(calculatePreTriagedPatients(
                           timePeriodStart,
                           patientPreTriageCheckCorrectTimestamp, 20, 30)[1]);
                       console.log('CorrectClassifiedPatients: ');
                       console.log(calculatePreTriagedPatients(
                           timePeriodStart,
                           patientPreTriageCheckCorrectTimestamp, 20, 30)[0]);
                      }

                      var stepMinutes = 30;
                      patientDataForChart = calculatePreTriagedPatients(
                          timePeriodStart,
                          patientPreTriageCheckCorrectTimestamp, 20,
                          stepMinutes);

                      // Finally set start date to chart options.
                      chartOpts.barChartOptions.axes.xaxis.min = timePeriodStart;

                      // Finally set the tickInterval to chart options.
                      if (DEBUG) {
                        console.log(stepMinutes.toString() + ' minutes');
                      }
                      chartOpts.barChartOptions.axes.xaxis.tickInterval = stepMinutes.toString() + ' minutes'; // i.e. '30 minutes'

                      $scope.chartData = patientDataForChart;
                      $scope.chartSettings = chartOpts.barChartOptions;

                    });
          });
    }]);
