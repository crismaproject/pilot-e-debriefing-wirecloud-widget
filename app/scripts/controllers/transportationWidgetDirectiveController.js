var controllers = angular.module('eu.crismaproject.pilotE.controllers');

    controllers.controller('transportationWidgetDirectiveController',
        ['$scope',
         'DEBUG',
         
    function($scope, DEBUG) {
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
          }
        },
        axes : {
          xaxis : {
            renderer : $.jqplot.DateAxisRenderer,
            tickOptions : {
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
          labels : [ 'T1', 'T2', 'T3', 'unclassified' ],
          renderer : $.jqplot.EnhancedLegendRenderer,
          rendererOptions : {
            rowSpacing : '1.0em',
          }
        },
        cursor : {
          show : true,
          zoom : true,
        }
       }
     };
      
      
     var patientDataForChart = [];
     var numberOfPatients = 0;
     
     $scope.patientsData.$promise
         .then(function(resp) {
           //Get number of all patients.
           numberOfPatients = resp.length;
           
           if (DEBUG) {
             console.log('Number of Patients: ' + numberOfPatients);
             console.log('Response: ' + resp[0].toSource());
             console.log('Response: ' + resp[3].toSource());
           }

           //Get triage classification of all patients and put the data into a map.

           $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp = [];
           var idCorrectTriageTransportTimeCheckIncorrectTimestamp = [];
           var idCorrectTriageTransportTimeCheck = [];


           for (var currPat = 0; currPat < numberOfPatients; currPat++) {
             if (DEBUG) {
               console.log(resp[currPat]);
               console.log(resp[currPat].correctTriage);
               console.log(resp[currPat]).transportation_timestamp;
             }

             idCorrectTriageTransportTimeCheck.push([
                 resp[currPat].id, resp[currPat].correctTriage,
                 resp[currPat].preTriage.timestamp ]);

             if (moment(resp[currPat].transportation_timestamp)
                 .isValid()) {
               $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp
                   .push([
                       moment(
                           resp[currPat].transportation_timestamp)
                           .format('YYYY-MM-DD HH:mm:ss'),
                       resp[currPat].correctTriage ]);
             } else {
               idCorrectTriageTransportTimeCheckIncorrectTimestamp
                   .push([
                       resp[currPat].transportation_timestamp,
                       resp[currPat].correctTriage ]);
             }
           }

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

           //Starttime for the chart.
           $scope.timePeriodStart = moment(
               $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp[0][0])
               .format('YYYY-MM-DD HH:mm:ss');
           if (DEBUG) {
             console.log('timePeriodStart: ' + $scope.timePeriodStart);
           }

           //Endtime for the chart.
           $scope.timePeriodEnd = moment(
               $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp[$scope.idCorrectTriageTransportTimeCheckCorrectTimestamp.length - 1][0])
               .format('YYYY-MM-DD HH:mm:ss');
           if (DEBUG) {
             console.log('timePeriodEnd: ' + $scope.timePeriodEnd);
           }

           $scope.calculateTransportedPatients = function(
               startDateTimeStamp, endDateTimeStamp, dataArray, iterStepMinutes) {
             var arrT1 = [];
             var arrT2 = [];
             var arrT3 = [];
             var arrUnclassified = [];

             var currIter = 0;
             var currIterTimeStamp = moment(startDateTimeStamp);
             
             do {
               currIterTimeStamp = moment(startDateTimeStamp)
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
               
               currIter++;
               
             } while (!currIterTimeStamp.isAfter(moment(endDateTimeStamp)));

             return [ arrT1, arrT2, arrT3, arrUnclassified ];
           };

           if (DEBUG) {
            console.log('T1-Patients: ');
            console
                .log($scope
                    .calculateTransportedPatients(
                        $scope.timePeriodStart,
                        $scope.timePeriodEnd,
                        $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                        $scope.stepMinutes)[0]);
            console.log('T2-Patients: ');
            console
                .log($scope
                    .calculateTransportedPatients(
                        $scope.timePeriodStart,
                        $scope.timePeriodEnd,
                        $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                        $scope.stepMinutes)[1]);
            console.log('T3-Patients: ');
            console
                .log($scope
                    .calculateTransportedPatients(
                        $scope.timePeriodStart,
                        $scope.timePeriodEnd,
                        $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                        $scope.stepMinutes)[2]);
            console.log('Unclassified-Patients: ');
            console
                .log($scope
                    .calculateTransportedPatients(
                        $scope.timePeriodStart,
                        $scope.timePeriodEnd,
                        $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                        $scope.stepMinutes)[3]);
           }

           patientDataForChart = $scope
               .calculateTransportedPatients(
                   $scope.timePeriodStart,
                   $scope.timePeriodEnd,
                   $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
                   $scope.stepMinutes);

           //Finally set start date to chart options.
           chartOpts.barChartOptions.axes.xaxis.min = moment($scope.timePeriodStart).subtract('minutes', 30).format('YYYY-MM-DD HH:mm:ss');
           
           // Finally set end date to chart options.
           chartOpts.barChartOptions.axes.xaxis.max = moment($scope.timePeriodEnd).add('minutes', 30).format('YYYY-MM-DD HH:mm:ss');

           
           $scope.chartData = patientDataForChart;
           $scope.chartSettings = chartOpts.barChartOptions;
          });
     
     $scope.$watch('stepMinutes', function() {
       if (parseInt($scope.stepMinutes, 10) > 0) {
         var patientDataForChart = [];
         patientDataForChart = $scope.calculateTransportedPatients(
             $scope.timePeriodStart,
             $scope.timePeriodEnd,
             $scope.idCorrectTriageTransportTimeCheckCorrectTimestamp,
             $scope.stepMinutes);
         $scope.chartData = patientDataForChart;
       }
     });
     
  }]);
