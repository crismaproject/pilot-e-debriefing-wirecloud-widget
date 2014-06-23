angular.module(
    'eu.crismaproject.pilotE.controllers'
).controller(
    'eu.crismaproject.pilotE.controllers.WirecloudController',
    [
        '$scope',
        '$modal',
        '$q',
        '$resource',
        'de.cismet.commons.angular.angularTools.AngularTools',
        'DEBUG',
        function ($scope, $modal, $q, $resource, angularTools, DEBUG) {
            'use strict';

            var dialog, initScope, mashupPlatform;

            if (DEBUG) {
                console.log('initialising wirecloud controller');
            }

            initScope = function () {
                $scope.editing = false;
                $scope.worldstate = null;
                $scope.patients = null;
                $scope.exercise = null;
                $scope.apiurl = null;
                $scope.tempcoveragefrom = null;
                $scope.tempcoverageto = null;
                $scope.tempcoverageperiod = null;
                $scope.kpi1 = '??min'; // Time until last patient is transported to the hospital
                $scope.kpi2 = '??min'; // Time until red patients are away from the incident scene
                $scope.kpi3a = '??'; // Ratio of medical responders per patient
                $scope.kpi4a = '??min'; // Time until all patients are pretriaged
                $scope.kpi4b = '??min'; // Time until all patients are triaged
                $scope.kpi6a = '??'; // Number of application of basic measures on scene
                $scope.kpi6b = '??'; // Patient / mime assessment of basic measures 
                $scope.transportationStartTime = '';
                $scope.transportationEndTime = '';
                $scope.preTriageStartTime = '';
                $scope.preTriageEndTime = '';
                $scope.triageStartTime = '';
                $scope.triageEndTime = '';
                $scope.allTacticalAreas = [
                    {
                        'name': 'Area of danger',
                        'icon': 'img/area_of_danger_16.png'
                    },
                    {
                        'name': 'Advanced Medical Post',
                        'icon': 'img/advanced_medical_post_16.png'
                    },
                    {
                        'name': 'Treatment Area',
                        'icon': 'img/treatment_area_16.png'
                    },
                    {
                        'name': 'Staging Area',
                        'icon': 'img/staging_area_16.png'
                    },
                    {
                        'name': 'Helicopter Landing Area',
                        'icon': 'img/helicopter_landing_area_16.png'
                    },
                    {
                        'name': 'Collecting Space',
                        'icon': 'img/collecting_space_16.png'
                    },
                    {
                        'name': 'Loading Area',
                        'icon': 'img/loading_area_16.png'
                    }
                ];
                $scope.stepMinutesInterval = 10;
                
                if (typeof MashupPlatform === 'undefined') {
                  if (DEBUG) {
                      console.log('mashup platform not available');
                  }
                } else {
                  // enable minification
                  mashupPlatform = MashupPlatform;
                  var stepMinInt = mashupPlatform.prefs.get('STEP_MINUTES');
                  if(stepMinInt !== null){
                   if(parseInt(stepMinInt, 10) > 0){
                     $scope.stepMinutesInterval = parseInt(stepMinInt, 10);
                   }
                  }
                }
            };

            initScope();

            $scope.processWorldstate = function () {
                var cats, dai, i, item, items, j, res;
                
                //--------
                
                var kpiItems = [];
                
                if (DEBUG) {
                  console.log('parse dataitem and fetch kpi data');
                }
                
                items = $scope.worldstate.worldstatedata;
                
                if (items) {
                  for (i = 0; i < items.length; ++i) {
                    cats = items[i].categories;
                    if (cats) {
                      for (j = 0; j < cats.length; ++j) {
                        if (cats[j].key === 'capture_data' || cats[j].key === 'indicator-value') {
                          kpiItems.push(items[i].actualaccessinfo);
                        }
                      }
                    }
                  }
                }
                
                if (kpiItems.length === 0) {
                    if (DEBUG) {
                      console.warn('the worldstate has to have a proper capture_data dataitem');
                    }
                    //throw 'the worldstate has to have a proper capture_data dataitem';
                } else {
                  
                  if (DEBUG) {
                    console.log('# kpi items: ' + kpiItems.length);
                    console.log('kpiItems[0]: ' + kpiItems[0]);
                  }
                    for (var idx = 0; idx < kpiItems.length; ++idx) {
                        var kpiItem = JSON.parse(kpiItems[idx]);
                      if (DEBUG) {
                        console.log('kpiItem.name: ' + kpiItem.name + ' | ' + 'kpiItem.type: ' + kpiItem.type);
                      }
                      if( kpiItem.type === 'timeintervals' &&
                          moment(kpiItem.data.intervals[0].endTime).isValid() &&
                          moment(kpiItem.data.intervals[0].starTtime).isValid()){
                        var periodminutes = moment(kpiItem.data.intervals[0].endTime).diff(moment(kpiItem.data.intervals[0].startTime), 'minutes');
                        if (DEBUG) {
                          console.log('timeperiod: ' + periodminutes + ' min');
                        }
                        //collect data for computation of kpi1
                        if(kpiItem.id === 'TransportationTime'){
//                          $scope.kpi1 = periodminutes + 'min';
                          $scope.transportationStartTime = kpiItem.data.intervals[0].startTime;
                          $scope.transportationEndTime = kpiItem.data.intervals[0].endTime;
                        }
                        //compute kpi4a
                        if(kpiItem.id === 'PreTriageTime'){
                          $scope.kpi4a = periodminutes + 'min';
                          $scope.preTriageStartTime = kpiItem.data.intervals[0].startTime;
                          $scope.preTriageEndTime = kpiItem.data.intervals[0].endTime;
                        }
                        //compute kpi4b
                        if(kpiItem.id === 'TriageTime'){
                          $scope.kpi4b = periodminutes + 'min';
                          $scope.triageStartTime = kpiItem.data.intervals[0].startTime;
                          $scope.triageEndTime = kpiItem.data.intervals[0].endTime;
                        }
                      }
                    }
                }
                
                  
                //--------
                

                if (DEBUG) {
                    console.log('parse dataitem and fetch patients');
                }

                items = $scope.worldstate.worldstatedata;
                if (items) {
                    for (i = 0; i < items.length && !item; ++i) {
                        cats = items[i].categories;
                        if (cats) {
                            for (j = 0; j < cats.length && !item; ++j) {
                                if (cats[j].key === 'exercise_data') {
                                    item = items[i];
                                }
                            }
                        }
                    }
                }

                if (item) {
                    $scope.tempcoveragefrom = item.temporalcoveragefrom;
                    $scope.tempcoverageto = item.temporalcoverageto;
                    if(moment($scope.tempcoveragefrom).isValid() && moment( $scope.tempcoverageto).isValid()){
                      $scope.tempcoverageperiod = moment( $scope.tempcoveragefrom).from(moment( $scope.tempcoverageto), true);
                    }
                  
                    dai = item.datadescriptor.defaultaccessinfo;
                    res = $resource(dai);
                    $scope.apiurl = dai.substr(0, dai.indexOf('icmm_api') + 8);
                    $scope.exercise = res.get({id: item.actualaccessinfo});
                    $scope.exercise.$promise.then(function () {
                        $scope.patients = $scope.exercise.patients;
                        //compute further kpis
                        computeKpi2And1();
                        computeKpi3aAnd6aAnd6b();
                    });
                } else {
                    initScope();
                    throw 'the worldstate has to have a proper exercise_data dataitem';
                }
            };
            
            
            var computeKpi2And1 = function(){
              if( $scope.patients !== null){
                var numberOfPatients = $scope.patients.length;
                if (DEBUG) {
                  console.log('numberOfPatients: ' + numberOfPatients);
                }
                var maxTime = null;
                var preTriageTimes = [];
                var triageTimes = [];
                
                for (var currPat = 0; currPat < numberOfPatients; currPat++) {
                  if($scope.patients[currPat].correctTriage === 'T1'){
                    if (DEBUG) {
                      console.log('$scope.patients[currPat].transportation_timestamp: ' + $scope.patients[currPat].transportation_timestamp);
                    }
                    if(moment($scope.patients[currPat].transportation_timestamp).isValid()){
                      if(maxTime !== null){
                        if(moment($scope.patients[currPat].transportation_timestamp).isAfter(moment(maxTime))){
                          maxTime = $scope.patients[currPat].transportation_timestamp;
                        }
                      }else{
                        maxTime = $scope.patients[currPat].transportation_timestamp;
                      }
                    }
                  }
                  
                  if(moment($scope.patients[currPat].preTriage.timestamp).isValid()){
                    preTriageTimes.push($scope.patients[currPat].preTriage.timestamp);
                  }
                  
                  if(moment($scope.patients[currPat].triage.timestamp).isValid()){
                    triageTimes.push($scope.patients[currPat].triage.timestamp);
                  }
                  
                  
                  
                }
                
//                //------ calculate kpi4a and kpi4b ------
//                preTriageTimes.sort(sortDates);
//                triageTimes.sort(sortDates);
//                
//                var ptrPeriodMinutes = moment(preTriageTimes[preTriageTimes.length - 1]).diff(moment(preTriageTimes[0]), 'minutes');
//                var trPeriodMinutes = moment(triageTimes[triageTimes.length - 1]).diff(moment(triageTimes[0]), 'minutes');
//                
//                if (DEBUG) {
//                  console.log('preTriageTimes: ' + preTriageTimes);
//                  console.log('preTriageStart: ' + preTriageTimes[0]);
//                  console.log('preTriageEnd: ' + preTriageTimes[preTriageTimes.length - 1]);
//                  console.log('preTriagePeriod: ' + ptrPeriodMinutes + 'min');
//                  
//                  console.log('triageTimes: ' + triageTimes);
//                  console.log('triageStart: ' + triageTimes[0]);
//                  console.log('triageEnd: ' + triageTimes[triageTimes.length - 1]);
//                  console.log('triagePeriod: ' + trPeriodMinutes + 'min');
//                }
//                //-----------------------------------------
                
                var periodminutes = moment(maxTime).diff(moment($scope.exercise.referenceTime), 'minutes');
                $scope.kpi2 = periodminutes + 'min';
                
                if (DEBUG) {
                  console.log('$scope.exercise.referenceTime: ' + $scope.exercise.referenceTime);
//                  console.log('$scope.exercise.incidentTime: ' + $scope.exercise.incidentTime);
//                  console.log('$scope.transportationStartTime: ' + $scope.transportationStartTime);
                  console.log('maxTime: ' + maxTime);
                  console.log('kpi2_period: ' + periodminutes + 'min');
                }
                
                
                //compute kpi1
                periodminutes = moment($scope.transportationEndTime).diff(moment($scope.exercise.referenceTime), 'minutes');
                $scope.kpi1 = periodminutes + 'min';
                
                if (DEBUG) {
                  console.log('$scope.exercise.referenceTime: ' + $scope.exercise.referenceTime);
//                  console.log('$scope.exercise.incidentTime: ' + $scope.exercise.incidentTime);
                  console.log('$scope.transportationEndTime: ' + $scope.transportationEndTime);
                  console.log('kpi1_period: ' + periodminutes + 'min');
                }
                
              }
            };
            
            
            var computeKpi3aAnd6aAnd6b = function(){
              var numberOfPatients = $scope.patients.length;
              var nuberOfResponders = 0;
              var ratioRespPerPat = null;
              
              if (DEBUG) {
                console.log('numberOfPatients: ' + numberOfPatients);
                console.log('$scope.exercise.incidentTime: ' + $scope.exercise.incidentTime);
                console.log('$scope.transportationEndTime: ' + $scope.transportationEndTime);
              }
              
              var responders = new MiniSet();
              var numberOfCareMeasures = 0;
              var sumOfRatings = 0;
              
              for (var currPat = 0; currPat < numberOfPatients; currPat++) {
                
                if($scope.patients[currPat].preTriage.treatedBy !== null &&
                    $scope.patients[currPat].preTriage.treatedBy !== ''){
                  responders.add($scope.patients[currPat].preTriage.treatedBy);
                }
                
                if($scope.patients[currPat].triage.treatedBy !== null &&
                    $scope.patients[currPat].triage.treatedBy !== ''){
                  responders.add($scope.patients[currPat].triage.treatedBy);
                }
                
                if($scope.patients[currPat].treatment_by !== null &&
                    $scope.patients[currPat].treatment_by !== ''){
                  responders.add($scope.patients[currPat].treatment_by);
                }
                
                for (var currCm = 0; currCm < $scope.patients[currPat].careMeasures.length; currCm++) {
//                  if($scope.patients[currPat].careMeasures[currCm].treatedBy !== null &&
//                      $scope.patients[currPat].careMeasures[currCm].treatedBy !== ''){
//                    responders.add($scope.patients[currPat].careMeasures[currCm].treatedBy);
                  
                    
//                    //count number of care measures for kpi6a and add ratings for kpi6b
//                    if($scope.patients[currPat].careMeasures[currCm].rating !== null &&
//                        $scope.patients[currPat].careMeasures[currCm].rating !== ''){
//                      numberOfCareMeasures++;
//                      sumOfRatings += parseInt($scope.patients[currPat].careMeasures[currCm].rating, 10);
//                    }
                    
                    
                    //count number of care measures for kpi6a
                    if($scope.patients[currPat].careMeasures.treatment_by !== null &&
                        $scope.patients[currPat].careMeasures.treatment_by !== ''){
                      
                      if($scope.patients[currPat].careMeasures[currCm].value === true){
                        numberOfCareMeasures++;
                      }
                    }
                    
                
                  }
                }

              
              if (DEBUG) {
                console.log('responders.isEmpty(): ' + responders.isEmpty());
                console.log('responders.keys(): ' + responders.keys());
              }
              
              if(!responders.isEmpty()){
                nuberOfResponders = responders.keys().length;
              }
              
              if (DEBUG) {
                console.log('nuberOfResponders: ' + nuberOfResponders);
              }
              
              ratioRespPerPat = Math.round((nuberOfResponders / numberOfPatients) * 100) / 100;
              $scope.kpi3a = ratioRespPerPat;
              
              if (DEBUG) {
                console.log('$scope.kpi3a: ' + $scope.kpi3a);
              }
              
              $scope.kpi6a = numberOfCareMeasures;
              
              if (DEBUG) {
                console.log('$scope.kpi6a: ' + $scope.kpi6a);
              }
              
              
              var averageRating = Math.round((sumOfRatings / numberOfCareMeasures) * 100) / 100;
              $scope.kpi6b = getAverageRatingString(averageRating);
              
              if (DEBUG) {
                console.log('sumOfRatings: ' + sumOfRatings);
                console.log('averageRating: ' + averageRating);
                console.log('$scope.kpi6b: ' + $scope.kpi6b);
              }
              
            };
            
            
            var getAverageRatingString = function (rating) {
                if (!rating) {
                  return '';
              }
  
              if (rating <= 1.5) {
                  return '++';
              } else if (rating <= 2.5) {
                  return '+';
              } else if (rating <= 3.5) {
                  return '0';
              } else if (rating <= 4.5) {
                  return '-';
              } else if (rating <= 6) {
                  return '--';
              }
  
              return '';
            };
            
            var sortDates = function(a, b) {
              // a < b
              if (moment(a).diff(moment(b)) < 0) {
                return -1;
              }
              // a > b
              if (moment(b).diff(moment(a)) < 0) {
                return 1;
              }
              // a must be equal to b
              return 0;
            };
            
            
            
            
            $scope.getNextId = function (classkey) {
                var def, Resource, objects;
                def = $q.defer();
                Resource = $resource($scope.apiurl + classkey, {limit: '999999999'},
                    {
                        'query': {method: 'GET', isArray: true, transformResponse: function (data) {
                            // we strip the ids of the objects only
                            var col, res, i;

                            col = JSON.parse(data).$collection;
                            res = [];

                            for (i = 0; i < col.length; ++i) {
                                res.push(col[i]);
                            }

                            return res;
                        }}
                    });
                objects = Resource.query();
                objects.$promise.then(function (data) {
                    var i, id, maxId;

                    maxId = 0;

                    for (i = 0; i < data.length; ++i) {
                        id = parseInt(data[i].$ref.substr(data[i].$ref.lastIndexOf('/') + 1), 10);
                        if (id > maxId) {
                            maxId = id;
                        }
                    }
                    def.resolve(maxId + 1);
                });

                return def.promise;
            };

            if (typeof MashupPlatform === 'undefined') {
                if (DEBUG) {
                    console.log('mashup platform not available');
                }
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;

//                mashupPlatform.wiring.registerCallback('setEditing', function (nuu) {
//
//                    if (nuu && nuu.toLowerCase() === 'true' && $scope.worldstate !== null) {
//                        angularTools.safeApply($scope, function() {
//                            $scope.editing = true;
//                        });
//                    } else {
//                        if ($scope.editing) {
//                            // modal dialog: veto finish editing
//                            dialog = $modal.open({
//                                template: '<div class="modal-header"><h3>Finish Editing</h3></div><div class="modal-body">Finish editing of exercise \'' + $scope.worldstate.name + '\'?</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
//                                scope: $scope
//                            });
//
//                            dialog.result.then(function () {
//                                var cm, i, j, pat;
//                                console.log('ok');
//
//                                // currently we have to take care of the ids ourselves
//                                $q.all(
//                                    $scope.getNextId('/CRISMA.exercises'),
//                                    $scope.getNextId('/CRISMA.capturePatients'),
//                                    $scope.getNextId('/CRISMA.preTriages'),
//                                    $scope.getNextId('/CRISMA.triages'),
//                                    $scope.getNextId('/CRISMA.consciousness'),
//                                    $scope.getNextId('/CRISMA.respirations'),
//                                    $scope.getNextId('/CRISMA.pulses'),
//                                    $scope.getNextId('/CRISMA.bloodpressures'),
//                                    $scope.getNextId('/CRISMA.positions'),
//                                    $scope.getNextId('/CRISMA.warmthpreservations'),
//                                    $scope.getNextId('/CRISMA.attendances')
//                                ).then(function (ids) {
//                                    $scope.exercise.$self = '/CRISMA.exercises/' + ids[0];
//                                    $scope.exercise.id = ids[0];
//
//                                    for (i = 0; i < $scope.exercise.patients.length; ++i) {
//                                        ids[1] += i;
//                                        pat = $scope.exercise.patients[i];
//                                        pat.id = ids[1];
//                                        pat.$self = '/CRISMA.capturePatients/' + ids[1];
//
//                                        pat.preTriage.$self = '/CRISMA.preTriages/' + ids[2]++;
//                                        pat.triage.$self = '/CRISMA.triages/' + ids[3]++;
//                                        for (j = 0; j < pat.careMeasures; ++j) {
//                                            cm = pat.careMeasures[j];
//                                            if (cm.measure === 'Consciousness') {
//                                                cm.self = '/CRISMA.consciousness/' + ids[4]++;
//                                            } else if (cm.measure === 'Respiration') {
//                                                cm.self = '/CRISMA.respirations/' + ids[5]++;
//                                            } else if (cm.measure === 'Pulse') {
//                                                cm.self = '/CRISMA.pulses/' + ids[6]++;
//                                            } else if (cm.measure === 'Blood pressure') {
//                                                cm.self = '/CRISMA.bloodpressures/' + ids[7]++;
//                                            } else if (cm.measure === 'Position') {
//                                                cm.self = '/CRISMA.positions/' + ids[8]++;
//                                            } else if (cm.measure === 'Warmth preservation') {
//                                                cm.self = '/CRISMA.warmthpreservations/' + ids[9]++;
//                                            } else if (cm.measure === 'Attendance') {
//                                                cm.self = '/CRISMA.attendances/' + ids[10]++;
//                                            }
//                                        }
//                                    }
//
////                                    $scope.exercise.save({id: id});
//
//                                    // save current state and create the dataslot without self and id
//                                    angularTools.safeApply($scope, function() {
//                                        $scope.editing = false;
//                                    });
//                                    mashupPlatform.wiring.pushEvent('getDataitem', JSON.stringify({
//                                        'name': 'Exercise Data',
//                                        'description': 'Data relevant for the exercise',
//                                        'lastmodified': new Date().toISOString(),
//                                        'temporalcoveragefrom': '', // get first capture
//                                        'temporalcoverageto': '', // get last capture
//                                        'spatialcoverage': '', // get centroid from tactical areas
//                                        'datadescriptor': {
//                                            '$ref': '/CRISMA.datadescriptors/2'
//                                        },
//                                        'actualaccessinfocontenttype': 'text/plain',
//                                        'actualaccessinfo': $scope.exercise.id,
//                                        'categories': [{
//                                            '$ref': '/CRISMA.categories/5'
//                                        }]
//                                    }));
//                                });
//                            }, function () {
//                                console.log('cancel');
//                                mashupPlatform.wiring.pushEvent('isEditing', 'true');
//                            });
//                        }
//                    }
//                });

                mashupPlatform.wiring.registerCallback('setWorldstate', function (ws) {
                    $scope.ok = function () {
                        dialog.close();
                    };

                    $scope.cancel = function () {
                        dialog.dismiss();
                    };

                    if ($scope.editing) {
                        // modal dialog: discard changes
                        dialog = $modal.open({
                            template: '<div class="modal-header"><h3>Cancel Editing</h3></div><div class="modal-body">Discard current changes?</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
                            scope: $scope
                        });

                        dialog.result.then(function () {
                            angularTools.safeApply($scope, function() {
                                $scope.editing = false;
                            });
                            $scope.worldstate = JSON.parse(ws);
                            $scope.processWorldstate();
                            mashupPlatform.wiring.pushEvent('isEditing', 'false');
                        }, function () {
                            mashupPlatform.wiring.pushEvent('isEditing', 'true');
                        });
                    } else {
                        $scope.worldstate = JSON.parse(ws);
                        $scope.processWorldstate();
                    }
                });
            }
        }
    ]
);