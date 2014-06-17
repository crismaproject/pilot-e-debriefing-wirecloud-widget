var controllers = angular.module('eu.crismaproject.pilotE.controllers');

    controllers.controller('alertsAndRequestsWidgetDirectiveController',
        ['$scope',
         'DEBUG',
    function($scope, DEBUG) {
     'use strict';
     
     if (DEBUG) {
       console.log('initialising alerts and requests widget directive controller');
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
             text : 'Alerts-and-Requests',
             fontFamily : 'Helvetica',
             fontSize : '14pt',
             show : true,
           },
//           seriesColors : [ '#800000', '#008000', '#000080', '#00FFFF', 'FF8230' ],
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
               label : 'Amount of Vehicles',
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
             labels : [ 'RTW', //intensive care ambulance
                        'NEF', //emergency doctor vehicle
                        'MTW', //personnel transport vehicle
                        'RTH', //intensive care helicopter
                        'GW-SAN', //service vehicle for loading area and treatment area
                        'SAN-EL', //command vehicle ambulance services
                        'UG-SAN-EL', //supporting leading personnel
                        'KID', //crisis intervention service, for the care of posttraumatic stressed persons
                        'KDOW', //command vehicle
                        'KTW', //patient transport ambulance
                        'PV', //police vehicle
                        'FT', //fire truck
                        'TRV'], //technical rescue vehicle
             renderer : $.jqplot.EnhancedLegendRenderer,
             rendererOptions : {
               rowSpacing : '0.5em',
//               numberRows: 6
             }
           },
           cursor : {
             show: true,
             zoom: true,
           }
          }
        };
      
      
      var alertsAndRequestsDataForChart = [];
      var numberOfAlertsRequests = 0;
      
      
      
    $scope.alertsAndRequestsData.$promise
    .then(function(resp) {
      // Get number of all patients.
      numberOfAlertsRequests = resp.alertsRequests.length;
      
      if (DEBUG) {
//        console.log('Response: ' + resp.toSource());
        console.log('Number of Alerts: ' + numberOfAlertsRequests);
      }

      // Get requested vehicles of all alerts and put the
      // data into a map.

      $scope.alertsRequestsCheckCorrectTimestamp = [];
      var alertsRequestsCheckIncorrectTimestamp = [];
//      var alertsRequestsCheck = [];

      for (var currAlert = 0; currAlert < numberOfAlertsRequests; currAlert++) {
         var numerOfRescueMeans = resp.alertsRequests[currAlert].rescueMeans.length;
         if (DEBUG) {
           console.log('time: ' + resp.alertsRequests[currAlert].time);
           console.log('alert: ' + resp.alertsRequests[currAlert].alert);
           console.log('#rescueMeans: ' + numerOfRescueMeans);
         }
         var vehicles = [];
         
         if (moment(resp.alertsRequests[currAlert].time).isValid()) {
           $scope.alertsRequestsCheckCorrectTimestamp[currAlert] =
             [moment(resp.alertsRequests[currAlert].time).format('YYYY-MM-DD HH:mm:ss'), vehicles];
         }else {
           alertsRequestsCheckIncorrectTimestamp[currAlert] = [resp.alertsRequests[currAlert].time, vehicles];
         }
         
         
         for (var currRescueMeans = 0; currRescueMeans < numerOfRescueMeans; currRescueMeans++) {
           var vehicleType = resp.alertsRequests[currAlert].rescueMeans[currRescueMeans].type;
           var vehicleQuantity = resp.alertsRequests[currAlert].rescueMeans[currRescueMeans].quantity;
           if (DEBUG) {
             console.log('rescueMeans index: ' + currRescueMeans);
             console.log('type: ' + vehicleType);
             console.log('quantity: ' + vehicleQuantity);
           }
           
           var vehicle = {
               type: vehicleType,
               quantity: vehicleQuantity
           };
           
           $scope.alertsRequestsCheckCorrectTimestamp[currAlert][1].push(vehicle);
         }
     }
      
//      var testvehicle = {
//          type: 'RTW',
//          quantity: 6
//      };
//      var testvehicle2 = {
//          type: 'KID',
//          quantity: 2
//      };
//      
//      $scope.alertsRequestsCheckCorrectTimestamp.push(['2014-05-27 18:33:03', [testvehicle, testvehicle2]]);
      
         
      if (DEBUG) {
//        console.log('$scope.alertsRequestsCheckCorrectTimestamp: ' + $scope.alertsRequestsCheckCorrectTimestamp.toSource());
      }
         


      
      
      
      
      // Sort array by date ascending.
      $scope.alertsRequestsCheckCorrectTimestamp
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
        console.log('alertsRequestsCheckCorrectTimestamp: ' + $scope.alertsRequestsCheckCorrectTimestamp);
        console.log('alertsRequestsCheckIncorrectTimestamp: ' + alertsRequestsCheckIncorrectTimestamp);
      }
      
      
      

      // Starttime for the chart.
      $scope.timePeriodStart = moment(
          $scope.alertsRequestsCheckCorrectTimestamp[0][0]).format('YYYY-MM-DD HH:mm:ss');
      if (DEBUG) {
        console.log('timePeriodStart: ' + $scope.timePeriodStart);
      }

      // Endtime for the chart.
      $scope.timePeriodEnd = moment(
          $scope.alertsRequestsCheckCorrectTimestamp[$scope.alertsRequestsCheckCorrectTimestamp.length - 1][0]).format('YYYY-MM-DD HH:mm:ss');
      if (DEBUG) {
        console.log('timePeriodEnd: ' +  $scope.timePeriodEnd);
      }
      
      
      
      

      $scope.calculateAlertsAndRequests = function(
          startDateTimeStamp, endDateTimeStamp, dataArray, iterStepMinutes) {
        
        var arrRtw = [];
        var arrNef = [];
        var arrMtw = [];
        var arrRth = [];
        var arrGwSan = [];
        var arrSanEl = [];
        var arrUgSanEl = [];
        var arrKid = [];
        var arrKdow = [];
        var arrKtw = [];
        var arrPv = [];
        var arrFt = [];
        var arrTrv = [];
        
        var currIter = 0;
        var currIterTimeStamp = moment(startDateTimeStamp);
        
        while (!currIterTimeStamp.isAfter(moment(endDateTimeStamp))){
        currIterTimeStamp = moment(startDateTimeStamp)
        .add('minutes', iterStepMinutes * currIter);

          var nbrRtw = 0;
          var nbrNef = 0;
          var nbrMtw = 0;
          var nbrRth = 0;
          var nbrGwSan = 0;
          var nbrSanEl = 0;
          var nbrUgSanEl = 0;
          var nbrKid = 0;
          var nbrKdow = 0;
          var nbrKtw = 0;
          var nbrPv = 0;
          var nbrFt = 0;
          var nbrTrv = 0;

          for (var i = 0; i < dataArray.length; i++) {
            // Only consider time until dateTimeStamp.
            if (moment(dataArray[i][0]).diff(
                currIterTimeStamp) <= 0) {
              
              //TODO: switch vehicle type
              var vehicles = dataArray[i][1];
              for (var j = 0; j < vehicles.length; j++) {
                if (vehicles[j] !== null){
                  switch (vehicles[j].type.toUpperCase()){
                    case 'RTW'.toUpperCase():
                      nbrRtw += vehicles[j].quantity;
                      break;
                    case 'NEF'.toUpperCase():
                      nbrNef += vehicles[j].quantity;
                      break;
                    case 'MTW'.toUpperCase():
                      nbrMtw += vehicles[j].quantity;
                    break;
                    case 'RTH'.toUpperCase():
                      nbrRth += vehicles[j].quantity;
                    break;
                    case 'GW-SAN'.toUpperCase():
                      nbrGwSan += vehicles[j].quantity;
                    break;
                    case 'SAN-EL'.toUpperCase():
                      nbrSanEl += vehicles[j].quantity;
                    break;
                    case 'UG-SAN-EL'.toUpperCase():
                      nbrUgSanEl += vehicles[j].quantity;
                    break;
                    case 'KID'.toUpperCase():
                      nbrKid += vehicles[j].quantity;
                    break;
                    case 'KDOW'.toUpperCase():
                      nbrKdow += vehicles[j].quantity;
                    break;
                    case 'KTW'.toUpperCase():
                      nbrKtw += vehicles[j].quantity;
                    break;
                    case 'PV'.toUpperCase():
                      nbrPv += vehicles[j].quantity;
                    break;
                    case 'FT'.toUpperCase():
                      nbrFt += vehicles[j].quantity;
                    break;
                    case 'TRV'.toUpperCase():
                      nbrTrv += vehicles[j].quantity;
                    break;
                    default:
                      //no match
                      if (DEBUG) {
                        console.log('Vehicle type unknown!');
                      }
                      break;
                  }
                }
              }
            }
          }

          var currIterTimeStampFormatted = currIterTimeStamp.format('YYYY-MM-DD HH:mm:ss');
          
          arrRtw.push([currIterTimeStampFormatted, nbrRtw ]);
          arrNef.push([currIterTimeStampFormatted, nbrNef]);
          arrMtw.push([currIterTimeStampFormatted, nbrMtw]);
          arrRth.push([currIterTimeStampFormatted, nbrRth]);
          arrGwSan.push([currIterTimeStampFormatted, nbrGwSan]);
          arrSanEl.push([currIterTimeStampFormatted, nbrSanEl]);
          arrUgSanEl.push([currIterTimeStampFormatted, nbrUgSanEl]);
          arrKid.push([currIterTimeStampFormatted, nbrKid]);
          arrKdow.push([currIterTimeStampFormatted, nbrKdow]);
          arrKtw.push([currIterTimeStampFormatted, nbrKtw]);
          arrPv.push([currIterTimeStampFormatted, nbrPv]);
          arrFt.push([currIterTimeStampFormatted, nbrFt]);
          arrTrv.push([currIterTimeStampFormatted, nbrTrv]);
          
          currIter++;
        }
        
        
        var result = [];
        var legendlabels = [];
        
        var hasValToDisplay = function(arr){
          if (arr instanceof Array){
            for (var i = 0; i < arr.length; i++) {
              if (arr[i][1] > 0){
                return true;
              }
            }
            return false;
          }else{
            return false;
          }
        };
        
        if(hasValToDisplay(arrRtw)){ result.push(arrRtw); legendlabels.push('RTW');}
        if(hasValToDisplay(arrNef)){ result.push(arrNef); legendlabels.push('NEF');}
        if(hasValToDisplay(arrMtw)){ result.push(arrMtw); legendlabels.push('MTW');}
        if(hasValToDisplay(arrRth)){ result.push(arrRth); legendlabels.push('RTH');}
        if(hasValToDisplay(arrGwSan)){ result.push(arrGwSan); legendlabels.push('GW-SAN');}
        if(hasValToDisplay(arrSanEl)){ result.push(arrSanEl); legendlabels.push('SAN-EL');}
        if(hasValToDisplay(arrUgSanEl)){ result.push(arrUgSanEl); legendlabels.push('UG-SAN-EL');}
        if(hasValToDisplay(arrKid)){ result.push(arrKid); legendlabels.push('KID');}
        if(hasValToDisplay(arrKdow)){ result.push(arrKdow); legendlabels.push('KDOW');}
        if(hasValToDisplay(arrKtw)){ result.push(arrKtw); legendlabels.push('KTW');}
        if(hasValToDisplay(arrPv)){ result.push(arrPv); legendlabels.push('PV');}
        if(hasValToDisplay(arrFt)){ result.push(arrFt); legendlabels.push('FT');}
        if(hasValToDisplay(arrTrv)){ result.push(arrTrv); legendlabels.push('TRV');}
        
        //Only show legend labels of data series, that has values.
        chartOpts.barChartOptions.legend.labels = legendlabels;

        return result;
      };
      
      
      
      var logData  = function(){
        if (DEBUG) {
         console.log('labels: ' + chartOpts.barChartOptions.legend.labels.toSource());
         var rtwIdx =  $.inArray('RTW', chartOpts.barChartOptions.legend.labels);
         var nefIdx =  $.inArray('NEF', chartOpts.barChartOptions.legend.labels);
         var mtwIdx =  $.inArray('MTW', chartOpts.barChartOptions.legend.labels);
         var rthIdx =  $.inArray('RTH', chartOpts.barChartOptions.legend.labels);
         var gwSanIdx =  $.inArray('GW-SAN', chartOpts.barChartOptions.legend.labels);
         var sanElIdx =  $.inArray('SAN-EL', chartOpts.barChartOptions.legend.labels);
         var ugSanElIdx =  $.inArray('UG-SAN-EL', chartOpts.barChartOptions.legend.labels);
         var kidIdx =  $.inArray('KID', chartOpts.barChartOptions.legend.labels);
         var kdowIdx =  $.inArray('KDOW', chartOpts.barChartOptions.legend.labels);
         var ktwIdx =  $.inArray('KTW', chartOpts.barChartOptions.legend.labels);
         var pvIdx =  $.inArray('PV', chartOpts.barChartOptions.legend.labels);
         var ftIdx =  $.inArray('FT', chartOpts.barChartOptions.legend.labels);
         var trvIdx =  $.inArray('TRV', chartOpts.barChartOptions.legend.labels);
         
         if(rtwIdx > -1){
          console.log('RTW: ');
          console.log($scope.calculateAlertsAndRequests(
              $scope.timePeriodStart,
              $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[rtwIdx]);
         }
         if(nefIdx > -1){
           console.log('NEF: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[nefIdx]);
         }
         if(mtwIdx > -1){
           console.log('MTW: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[mtwIdx]);
         }
         if(rthIdx > -1){
           console.log('RTH: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[rthIdx]);
         }
         if(gwSanIdx > -1){
           console.log('GW-SAN: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[gwSanIdx]);
         }
         if(sanElIdx > -1){
           console.log('SAN-EL: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[sanElIdx]);
         }
         if(ugSanElIdx > -1){
           console.log('UG-SAN-EL: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[ugSanElIdx]);
         }
         if(kidIdx > -1){
           console.log('KID: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[kidIdx]);
         }
         if(kdowIdx > -1){
           console.log('KDOW: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[kdowIdx]);
         }
         if(ktwIdx > -1){
           console.log('KTW: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[ktwIdx]);
         }
         if(pvIdx > -1){
           console.log('PV: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[pvIdx]);
         }
         if(ftIdx > -1){
           console.log('FT: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[ftIdx]);
         }
         if(trvIdx > -1){
           console.log('TRV: ');
           console.log($scope.calculateAlertsAndRequests(
               $scope.timePeriodStart,
               $scope.timePeriodEnd, $scope.alertsRequestsCheckCorrectTimestamp, $scope.stepMinutes)[trvIdx]);
         }
        }
      };
      
      
      
      alertsAndRequestsDataForChart = $scope.calculateAlertsAndRequests(
          $scope.timePeriodStart,
          $scope.timePeriodEnd,
          $scope.alertsRequestsCheckCorrectTimestamp,
          $scope.stepMinutes);
      
      logData();

      // Finally set start date to chart options.
      chartOpts.barChartOptions.axes.xaxis.min = moment($scope.timePeriodStart).subtract('minutes', 30).format('YYYY-MM-DD HH:mm:ss');

      // Finally set end date to chart options.
      chartOpts.barChartOptions.axes.xaxis.max = moment($scope.timePeriodEnd).add('minutes', 30).format('YYYY-MM-DD HH:mm:ss');
      
      $scope.chartData = alertsAndRequestsDataForChart;
      $scope.chartSettings = chartOpts.barChartOptions;
    });
      
      
      $scope.$watch('stepMinutes', function() {
        if (parseInt($scope.stepMinutes, 10) > 0) {
          var alertsAndRequestsDataForChart = [];
          alertsAndRequestsDataForChart = $scope.calculateAlertsAndRequests(
              $scope.timePeriodStart,
              $scope.timePeriodEnd,
              $scope.alertsRequestsCheckCorrectTimestamp,
              $scope.stepMinutes);
          $scope.chartData = alertsAndRequestsDataForChart;
        }
      });
    
    }]);
