var controllers = angular.module('eu.crismaproject.pilotE.controllers');

    controllers.controller('careMeasuresWidgetDirectiveController',
        ['$scope',
         'DEBUG',
         
    function($scope, DEBUG) {
     'use strict';
     
     if (DEBUG) {
       console.log('initialising care measures widget directive controller');
     }

//     if (!$scope.patientsData) {
//         throw 'IllegalStateException: patientsData not provided by directive user';
//     }
     
     if (!$scope.kpiListData) {
         throw 'IllegalStateException: kpiListData not provided by directive user';
     }
          
      var chartOpts = {
          pieChartOptions : {
            // Provide a custom seriesColors array to override the default colors.
            seriesColors : [ '#FF0000', '#FFFF00', '#66FF66', '#C0C0C0' ],
            title : {
              text : 'Triage classification of all patients',
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

        $scope.$watch('patientsData', function () {
          if (DEBUG) {
            console.log('care measures: patientsData changed!');
            console.log('care measures: paintChart()!');
          }
          paintChart();
        });
        
        
        var paintChart = function() {
          
          var patientDataForChart = [];
          var numberOfPatients = 0;
          
          var colorsMap = {
              T1: '#FF0000',
              T2: '#FFFF00',
              T3: '#66FF66',
              unclassified: '#C0C0C0'
          };
        
          if($scope.patientsData){
          
            // Get number of all patients.
            numberOfPatients = $scope.patientsData.length;
            
            if (DEBUG) {
              console.log('Number of Patients: ' + numberOfPatients);
              //toSource() only works for firefox
    //          console.log('Response: ' + $scope.patientsData[0].toSource());
    //          console.log('Response: ' + $scope.patientsData[3].toSource());
            }
    
            // Get triage classification of all patients and put the data into a map.
            
            var classificationMap = {};
            var triageClassification = 'unclassified';
            
            for (var currPat = 0; currPat < numberOfPatients; currPat++) {
              
              if (DEBUG) {
                console.log($scope.patientsData[currPat]);
                console.log($scope.patientsData[currPat].correctTriage);
                console.log($scope.patientsData[currPat].triage.classification);
              }
      
              triageClassification = $scope.patientsData[currPat].triage.classification;
    
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
            }
    
            if (DEBUG) {
             console.log(classificationMap);
             console.log('classificationMap.T2: ' + classificationMap.T2);
            }
            
            
            var seriesColors = [];
            
//            classificationMap = {
//                T1: 5,
//                T2: 3,
//                T3: 2,
//                unclassified: 1
//            };

            for ( var key in classificationMap) {
              patientDataForChart.push([ key, classificationMap[key] ]);
            }
            
            if(classificationMap.T1 !== null && classificationMap.T1 !== undefined){
              seriesColors.push(colorsMap.T1);
            }
            if(classificationMap.T2 !== null && classificationMap.T2 !== undefined){
              seriesColors.push(colorsMap.T2);
            }
            if(classificationMap.T3 !== null && classificationMap.T3 !== undefined){
              seriesColors.push(colorsMap.T3);
            }
            if(classificationMap.unclassified !== null && classificationMap.unclassified !== undefined){
              seriesColors.push(colorsMap.unclassified);
            }
            
            //set correct colors (according to labels)
            chartOpts.pieChartOptions.seriesColors = seriesColors;
            
            if (DEBUG) {
              console.log('classificationMap: '+ classificationMap.toSource());
              console.log('seriesColors: '+ seriesColors);
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
    
            $scope.chartData = [ patientDataForChart ];
            $scope.chartSettings = chartOpts.pieChartOptions;
          
          }
        };
        
      
    }]);
