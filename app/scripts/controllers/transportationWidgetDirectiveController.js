var controllers = angular.module('eu.crismaproject.pilotE.controllers');

    controllers.controller('transportationWidgetDirectiveController',
        ['$scope',
         'eu.crismaproject.pilotE.services.OoI',
         '$q',
         'DEBUG',
         
    function($scope, ooiService, $q, DEBUG) {
     'use strict';
     
     if (DEBUG) {
       console.log('initialising transportation widget directive controller');
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
     
     if (!$scope.stepAmount) {
       if (DEBUG) {
         console.log('stepAmount not provided by directive user, setting default value.');
       }
       $scope.stepAmount = 30;
     }
          
     var chartOpts = {
         barChartOptions : {
        // Tell the plot to stack the bars.
        stackSeries : true,
        captureRightClick : true,
        title : {
          text : 'Overview transportation of all patients',
          fontFamily : 'Helvetica',
          fontSize : '14pt',
          show : true,
        },
        seriesColors : [ '#FF0000', '#FFFF00', '#66FF66', '#C0C0C0' ],
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
            tickInterval : '60 minutes',
 
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
          labels : [ 'T1', 'T2', 'T3', 'unclassified' ],
          renderer : $.jqplot.EnhancedLegendRenderer,
          rendererOptions : {
            //numberColumns: 3,
            //numberRows : 1,
            rowSpacing : '1.0em',
          }
        },
        cursor : {
          show : true,
          zoom : true,
        //   showTooltip:true
        }
       }
     };
      
      
     var patientDataForChart = [];

     //Get number of all patients.
     var numberOfPatients = 0;
     
     $scope.patientsData.$promise
         .then(function(resp) {
           numberOfPatients = resp.length;
           if (DEBUG) {
             console.log('Number of Patients: ' + numberOfPatients);
           }

           //Get pre-triage classification of all patients and put the data into a map.

           $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp = [];
           var idCorrectTriageTransportTimeCheckIncorrectTimestamp = [];
           var idCorrectTriageTransportTimeCheck = [];
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
                                console.log(resp.transportation_timestamp);
                               }

                               idCorrectTriageTransportTimeCheck.push([
                                   resp.id, resp.correctTriage,
                                   resp.preTriage.timestamp ]);

                               if (moment(resp.transportation_timestamp)
                                   .isValid()) {
                                 $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp
                                     .push([
                                         moment(
                                             resp.transportation_timestamp)
                                             .format('YYYY-MM-DD HH:mm:ss'),
                                         resp.correctTriage ]);
                               } else {
                                 idCorrectTriageTransportTimeCheckIncorrectTimestamp
                                     .push([
                                         resp.transportation_timestamp,
                                         resp.correctTriage ]);
                               }

                             });
                     if (DEBUG) {
                      console.log(idCorrectTriageTransportTimeCheck);
                      console.log(moment().format());
                      console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
                      console.log(idCorrectTriageTransportTimeCheck[0][2]);
                      console.log($scope.idCorrectTriageTransportTimeCheckCorrectTimestamp);
                      console.log(idCorrectTriageTransportTimeCheckIncorrectTimestamp);
                     }

                     //Sort array by date ascending. 
                     $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp
                         .sort(function(a, b) {
                           //a < b 
                           if (moment(a[0]).diff(moment(b[0])) < 0) {
                             return -1;
                           }
                           //a > b 
                           if (moment(b[0]).diff(moment(a[0])) < 0) {
                             return 1;
                           }
                           // a must be equal to b
                           return 0;
                         });

                     if (DEBUG) {
                       console.log($scope.idCorrectTriageTransportTimeCheckCorrectTimestamp);
                     }

                     //Starttime for the chart shall be 30 minutes before the earliest transportation timestamp.
                     $scope.timePeriodStart = moment(
                         $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp[0][0])
                         .subtract('minutes', 30).format(
                             'YYYY-MM-DD HH:mm:ss');
                     if (DEBUG) {
                       console.log('timePeriodStart: ' + $scope.timePeriodStart);
                     }

                     //Endtime for the chart shall be 30 minutes after the last transportation timestamp.
                     var timePeriodEnd = moment(
                         $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp[$scope.idCorrectTriageTransportTimeCheckCorrectTimestamp.length - 1][0])
                         .add('minutes', 30).format('YYYY-MM-DD HH:mm:ss');
                     if (DEBUG) {
                       console.log('timePeriodEnd: ' + timePeriodEnd);
                     }

                     $scope.calculateTransportedPatients = function(
                         dateTimeStamp, dataArray, nbrIterations,
                         iterStepMinutes) {
                       var arrT1 = [];
                       var arrT2 = [];
                       var arrT3 = [];
                       var arrUnclassified = [];

                       for (var currIter = 0; currIter < nbrIterations; currIter++) {

                         var currIterTimeStamp = moment(dateTimeStamp)
                             .add('minutes', iterStepMinutes * currIter);

                         var nbrT1 = 0;
                         var nbrT2 = 0;
                         var nbrT3 = 0;
                         var nbrUnclassified = 0;

                         for (var i = 0; i < dataArray.length; i++) {
                           //Only consider time until dateTimeStamp.
                           if (moment(dataArray[i][0]).diff(
                               currIterTimeStamp) <= 0) {
                             if (dataArray[i][1] === 'T1') {
                               nbrT1++;
                             } else if (dataArray[i][1] === 'T2') {
                               nbrT2++;
                             } else if (dataArray[i][1] === 'T3') {
                               nbrT3++;
                             } else {
                               //Triage classification is wrong.
                               arrUnclassified++;
                             }
                           }
                         }

                         arrT1.push([
                             currIterTimeStamp
                                 .format('YYYY-MM-DD HH:mm:ss'), nbrT1 ]);
                         arrT2.push([
                             currIterTimeStamp
                                 .format('YYYY-MM-DD HH:mm:ss'), nbrT2 ]);
                         arrT3.push([
                             currIterTimeStamp
                                 .format('YYYY-MM-DD HH:mm:ss'), nbrT3 ]);
                         arrUnclassified.push([
                             currIterTimeStamp
                                 .format('YYYY-MM-DD HH:mm:ss'),
                             nbrUnclassified ]);
                       }

                       return [ arrT1, arrT2, arrT3, arrUnclassified ];
                     };

                     if (DEBUG) {
                      console.log('T1-Patients: ');
                      console
                          .log($scope
                              .calculateTransportedPatients(
                                  $scope.timePeriodStart,
                                  $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                                  20, 10)[0]);
                      console.log('T2-Patients: ');
                      console
                          .log($scope
                              .calculateTransportedPatients(
                                  $scope.timePeriodStart,
                                  $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                                  20, 10)[1]);
                      console.log('T3-Patients: ');
                      console
                          .log($scope
                              .calculateTransportedPatients(
                                  $scope.timePeriodStart,
                                  $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                                  20, 10)[2]);
                      console.log('Unclassified-Patients: ');
                      console
                          .log($scope
                              .calculateTransportedPatients(
                                  $scope.timePeriodStart,
                                  $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                                  20, 10)[3]);
                     }

                     patientDataForChart = $scope
                         .calculateTransportedPatients(
                             $scope.timePeriodStart,
                             $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                             $scope.stepAmount, $scope.stepMinutes);

                     //Finally set start date to chart options.
                     chartOpts.barChartOptions.axes.xaxis.min = $scope.timePeriodStart;

                     //Finally set the tickInterval to chart options.
                     if (DEBUG) {
                       console.log($scope.stepMinutes.toString() + ' minutes');
                     }

                     $scope.chartData = patientDataForChart;
                     $scope.chartSettings = chartOpts.barChartOptions;
                     
                    });
          });
     
     $scope.$watch('stepMinutes', function() {
       if ($scope.stepMinutes.length > 0) {
         var patientDataForChart = [];
         patientDataForChart = $scope.calculateTransportedPatients(
             $scope.timePeriodStart,
             $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
             $scope.stepAmount, $scope.stepMinutes);
         $scope.chartData = patientDataForChart;
       }
     });
     
     $scope.$watch('stepAmount', function() {
       if ($scope.stepAmount.length > 0) {
         var patientDataForChart = [];
         patientDataForChart = $scope.calculateTransportedPatients(
             $scope.timePeriodStart,
             $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
             $scope.stepAmount, $scope.stepMinutes);
         $scope.chartData = patientDataForChart;
       }
     });
     
  }]);
