var controllers = angular.module('eu.crismaproject.pilotE.controllers');

    controllers.controller('triageWidgetDirectiveController',
        ['$scope',
         'DEBUG',
         
    function($scope, DEBUG) {
     'use strict';
     
     if (DEBUG) {
       console.log('initialising triage widget directive controller');
     }

//     if (!$scope.patientsData) {
//         throw 'IllegalStateException: patientsData not provided by directive user';
//     }
     
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
              text : 'Triage',
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
              labels : [ 'correct triage of patients', 'wrong triage of patients' ],
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
      var numberOfPatients = 0;
      
      $scope.$watch('patientsData', function () {
        if (DEBUG) {
          console.log('triage: patientsData changed!');
          console.log('triage: paintChart()!');
        }
        paintChart();
      });
      
      var paintChart = function() {
        
        if($scope.patientsData){
            // Get number of all patients.
            numberOfPatients = $scope.patientsData.length;
            
            if (DEBUG) {
              console.log('Number of Patients: ' + numberOfPatients);
            //toSource() only works for firefox
//              console.log('Response: ' + $scope.patientsData[0].toSource());
//              console.log('Response: ' + $scope.patientsData[3].toSource());
            }

            // Get triage classification of all patients and put the data
            // into a map.

            $scope.patientTriageCheckCorrectTimestamp = [];
            var patientTriageCheckIncorrectTimestamp = [];
            var patientTriageCheck = [];
            
            for (var currPat = 0; currPat < numberOfPatients; currPat++) {
               
               if (DEBUG) {
                console.log($scope.patientsData[currPat]);
                console.log($scope.patientsData[currPat].correctTriage);
                console.log($scope.patientsData[currPat].triage.classification);
               }

               var correctTriage = $scope.patientsData[currPat].correctTriage === $scope.patientsData[currPat].triage.classification;
               if (DEBUG) {
                 console.log('correctTriage: ' + correctTriage);
               }

               patientTriageCheck.push([ $scope.patientsData[currPat].id,
                   correctTriage, $scope.patientsData[currPat].triage.timestamp ]);

               if (moment($scope.patientsData[currPat].triage.timestamp).isValid()) {
                 $scope.patientTriageCheckCorrectTimestamp.push([
                     moment($scope.patientsData[currPat].triage.timestamp).format(
                         'YYYY-MM-DD HH:mm:ss'),
                     correctTriage ]);
               } else {
                 patientTriageCheckIncorrectTimestamp
                     .push([ $scope.patientsData[currPat].triage.timestamp,
                         correctTriage ]);
               }
            }

            // Sort array by date ascending.
            $scope.patientTriageCheckCorrectTimestamp
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
              console.log($scope.patientTriageCheckCorrectTimestamp);
            }

            // Starttime for the chart 
            $scope.timePeriodStart = moment(
                $scope.patientTriageCheckCorrectTimestamp[0][0]).format('YYYY-MM-DD HH:mm:ss');
            if (DEBUG) {
              console.log('timePeriodStart: ' + $scope.timePeriodStart);
            }

            // Endtime for the chart
            $scope.timePeriodEnd = moment(
                $scope.patientTriageCheckCorrectTimestamp[$scope.patientTriageCheckCorrectTimestamp.length - 1][0]).format('YYYY-MM-DD HH:mm:ss');
            if (DEBUG) {
              console.log('timePeriodEnd: ' + $scope.timePeriodEnd);
            }
            
            //Check if the timeperiod defined by start and endtime is realistic for an exercise (i.e. is not longer than 5 days).
            //Otherwise take the precalculated bounds (temporalcoveragefrom /-to) and set them as start-/endtime.
            //If flag "useprecalculatedbounds" is true in parent controller, use the bounds as start-/endtime.
            
            var perioddays = moment($scope.timePeriodEnd).diff(moment($scope.timePeriodStart), 'days');
            
            if (DEBUG) {
              console.log('perioddays: ' + perioddays);
            }
            
            if(perioddays > 5 || $scope.$parent.useprecalculatedbounds){
              $scope.timePeriodStart = moment($scope.$parent.tempcoveragefrom).format('YYYY-MM-DD HH:mm:ss');
              $scope.timePeriodEnd = moment($scope.$parent.tempcoverageto).format('YYYY-MM-DD HH:mm:ss');
              
              if (DEBUG) {
                console.log('triage widget is now using precalculated bounds for start and endtime.');
                console.log('timePeriodStart (new): ' + $scope.timePeriodStart);
                console.log('timePeriodEnd (new): ' + $scope.timePeriodEnd);
              }
            }
            
            $scope.calculateTriagedPatients = function(
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
                    nbrCorrectClassifiedPatients ]);
                
                currIter++;
              }

              return [ arrCorrectClassifiedPatients,
                  arrWrongClassifiedPatients ];
            };

            
            if (DEBUG) {
             console.log('WrongClassifiedPatients: ');
             console.log($scope.calculateTriagedPatients(
                 $scope.timePeriodStart,
                 $scope.timePeriodEnd, $scope.patientTriageCheckCorrectTimestamp, $scope.stepMinutes)[1]);
             console.log('CorrectClassifiedPatients: ');
             console.log($scope.calculateTriagedPatients(
                 $scope.timePeriodStart,
                 $scope.timePeriodEnd, $scope.patientTriageCheckCorrectTimestamp, $scope.stepMinutes)[0]);
            }
            
            patientDataForChart = $scope.calculateTriagedPatients(
                $scope.timePeriodStart,
                $scope.timePeriodEnd,
                $scope.patientTriageCheckCorrectTimestamp,
                $scope.stepMinutes);

            // Finally set start date to chart options.
            chartOpts.barChartOptions.axes.xaxis.min = moment($scope.timePeriodStart).subtract('minutes', 30).format('YYYY-MM-DD HH:mm:ss');
            
            // Finally set end date to chart options.
            chartOpts.barChartOptions.axes.xaxis.max = moment($scope.timePeriodEnd).add('minutes', 30).format('YYYY-MM-DD HH:mm:ss');

            $scope.chartData = patientDataForChart;
            $scope.chartSettings = chartOpts.barChartOptions;
            
          }
        };
      
      $scope.$watch('stepMinutes', function() {
        if (parseInt($scope.stepMinutes, 10) > 0) {
          var patientDataForChart = [];
          patientDataForChart = $scope.calculateTriagedPatients(
              $scope.timePeriodStart,
              $scope.timePeriodEnd, $scope.patientTriageCheckCorrectTimestamp,
              $scope.stepMinutes);
          $scope.chartData = patientDataForChart;
          
        }
      });
      
    }]);
