angular.module(
    'eu.crismaproject.pilotE.controllers'
).controller(
    'eu.crismaproject.pilotE.controllers.WirecloudController',
    [
        '$scope',
        '$modal',
        '$q',
        '$resource',
        'DEBUG',
        function ($scope, $modal, $q, $resource, DEBUG) {
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
                $scope.locationMarker = null;
            };

            initScope();

            $scope.processWorldstate = function () {
                var cats, dai, ewkt, geojson, i, indexof, item, items, j, res;


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
                    dai = item.datadescriptor.defaultaccessinfo;
                    res = $resource(dai);
                    $scope.apiurl = dai.substr(0, dai.indexOf('icmm_api') + 8);
                    $scope.exercise = res.get({id: item.actualaccessinfo});
                    $scope.exercise.$promise.then(function () {
                        $scope.patients = $scope.exercise.patients;
                        ewkt = $scope.exercise.location;
                        indexof = ewkt.indexOf(';');
                        // assume 4326 point
                        geojson = Terraformer.WKT.parse(indexof > 0 ? ewkt.substr(indexof + 1) : ewkt);
                        $scope.locationMarker = new google.maps.Marker({
                            map: $scope.map.control.getGMap(),
                            position: new google.maps.LatLng(geojson.coordinates[0], geojson.coordinates[1]),
                            title: 'Exercise location',
                            visible: true,
                            zIndex: 0,
                            icon: 'img/glyphicons_185_screenshot.png'
                        });
                        $scope.map.control.getGMap().setCenter($scope.locationMarker.getPosition());
                    });
                } else {
                    initScope();
                    throw 'the worldstate has to have a proper exercise_data dataitem';
                }

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
            $scope.map = {
                center: {
                    latitude: 51.163375,
                    longitude: 10.447683
                },
                zoom: 6,
                control: {}
            };
            
            $scope.mapRepaint = function() {
                var oldcenter;
                
                oldcenter = $scope.map.control.getGMap().getCenter();
                // refresh changes the center of the map, don't know why oO
                $scope.map.control.refresh();
                $scope.map.control.getGMap().setCenter(oldcenter);
            };

            if (typeof MashupPlatform === 'undefined') {
                if (DEBUG) {
                    console.log('mashup platform not available');
                }
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;

                mashupPlatform.wiring.registerCallback('setEditing', function (nuu) {

                    if (nuu && $scope.worldstate !== null) {
                        $scope.editing = true;
                    } else {
                        if ($scope.editing) {
                            // modal dialog: veto finish editing
                            dialog = $modal.open({
                                template: '<div class="modal-header"><h3>Finish Editing</h3></div><div class="modal-body">Finish editing of exercise \'' + $scope.worldstate.name + '\'?</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
                                scope: $scope
                            });

                            dialog.result.then(function () {
                                var cm, i, j, pat;
                                console.log('ok');

                                // currently we have to take care of the ids ourselves
                                $q.all(
                                    $scope.getNextId('/CRISMA.exercises'),
                                    $scope.getNextId('/CRISMA.capturePatients'),
                                    $scope.getNextId('/CRISMA.preTriages'),
                                    $scope.getNextId('/CRISMA.triages'),
                                    $scope.getNextId('/CRISMA.consciousness'),
                                    $scope.getNextId('/CRISMA.respirations'),
                                    $scope.getNextId('/CRISMA.pulses'),
                                    $scope.getNextId('/CRISMA.bloodpressures'),
                                    $scope.getNextId('/CRISMA.positions'),
                                    $scope.getNextId('/CRISMA.warmthpreservations'),
                                    $scope.getNextId('/CRISMA.attendances')
                                ).then(function (ids) {
                                    $scope.exercise.$self = '/CRISMA.exercises/' + ids[0];
                                    $scope.exercise.id = ids[0];

                                    for (i = 0; i < $scope.exercise.patients.length; ++i) {
                                        ids[1] += i;
                                        pat = $scope.exercise.patients[i];
                                        pat.id = ids[1];
                                        pat.$self = '/CRISMA.capturePatients/' + ids[1];

                                        pat.preTriage.$self = '/CRISMA.preTriages/' + ids[2]++;
                                        pat.triage.$self = '/CRISMA.triages/' + ids[3]++;
                                        for (j = 0; j < pat.careMeasures; ++j) {
                                            cm = pat.careMeasures[j];
                                            if (cm.measure === 'Consciousness') {
                                                cm.self = '/CRISMA.consciousness/' + ids[4]++;
                                            } else if (cm.measure === 'Respiration') {
                                                cm.self = '/CRISMA.respirations/' + ids[5]++;
                                            } else if (cm.measure === 'Pulse') {
                                                cm.self = '/CRISMA.pulses/' + ids[6]++;
                                            } else if (cm.measure === 'Blood pressure') {
                                                cm.self = '/CRISMA.bloodpressures/' + ids[7]++;
                                            } else if (cm.measure === 'Position') {
                                                cm.self = '/CRISMA.positions/' + ids[8]++;
                                            } else if (cm.measure === 'Warmth preservation') {
                                                cm.self = '/CRISMA.warmthpreservations/' + ids[9]++;
                                            } else if (cm.measure === 'Attendance') {
                                                cm.self = '/CRISMA.attendances/' + ids[10]++;
                                            }
                                        }
                                    }

//                                    $scope.exercise.save({id: id});

                                    // save current state and create the dataslot without self and id
                                    $scope.editing = false;
                                    mashupPlatform.wiring.pushEvent('getDataitem', JSON.stringify({
                                        'name': 'Exercise Data',
                                        'description': 'Data relevant for the exercise',
                                        'lastmodified': new Date().toISOString(),
                                        'temporalcoveragefrom': '', // get first capture
                                        'temporalcoverageto': '', // get last capture
                                        'spatialcoverage': '', // get centroid from tactical areas
                                        'datadescriptor': {
                                            '$ref': '/CRISMA.datadescriptors/2'
                                        },
                                        'actualaccessinfocontenttype': 'text/plain',
                                        'actualaccessinfo': $scope.exercise.id,
                                        'categories': [{
                                            '$ref': '/CRISMA.categories/5'
                                        }]
                                    }));
                                });
                            }, function () {
                                console.log('cancel');
                                mashupPlatform.wiring.pushEvent('isEditing', 'true');
                            });
                        }
                    }
                });

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
                            console.log('ok');
                            $scope.editing = false;
                            $scope.worldstate = JSON.parse(ws);
                            $scope.processWorldstate();
                            mashupPlatform.wiring.pushEvent('isEditing', 'false');
                        }, function () {
                            console.log('cancel');
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