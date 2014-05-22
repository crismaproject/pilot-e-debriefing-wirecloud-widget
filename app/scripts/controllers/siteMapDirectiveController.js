angular.module(
    'eu.crismaproject.pilotE.controllers'
).controller(
    'eu.crismaproject.pilotE.controllers.siteMapDirectiveController',
    [
        '$scope',
        'de.cismet.commons.angular.angularTools.AngularTools',
        'DEBUG',
        function ($scope, angularTools, DEBUG) {
            'use strict';
            
            var getIcon32;

            if (DEBUG) {
                console.log('initialising site map directive controller');
            }
            
            getIcon32 = function (icon) {
                return icon.replace(/(\w+_)(\d+)(\.\w+)/, '$132$3');
            };

            $scope.locationMarker = null;
            $scope.areaMarkers = [];
            $scope.infoWindow = null;
            $scope.initMap = function () {
                var ewkt, geojson, indexof;

                ewkt = $scope.location;
                $scope.infoWindow = new google.maps.InfoWindow();
                indexof = ewkt.indexOf(';');
                // assume 4326 point
                geojson = Terraformer.WKT.parse(indexof > 0 ? ewkt.substr(indexof + 1) : ewkt);
                $scope.locationMarker = new google.maps.Marker({
                    map: $scope.map.control.getGMap(),
                    position: new google.maps.LatLng(geojson.coordinates[0], geojson.coordinates[1]),
                    title: $scope.locationTitle,
                    visible: true,
                    zIndex: 0,
                    icon: $scope.locationIcon || 'img/glyphicons_185_screenshot.png'
                });
                $scope.coordinateMarker = new google.maps.Marker({
                    title: 'Coordinate Marker',
                    visible: true,
                    zIndex: 1000,
                    icon: $scope.locationIcon || 'img/glyphicons_242_google_maps.png'
                });
                $scope.coordinateMarkerListener = google.maps.event.addListener(
                    $scope.map.control.getGMap(),
                    'click',
                    function (me) {
                        if($scope.editing) {
                            $scope.coordinateMarker.setMap($scope.map.control.getGMap());
                            $scope.coordinateMarker.setPosition(me.latLng);
                            angularTools.safeApply($scope, function () {
                                $scope.selectedCoordinate = me.latLng;
                            });
                        }
                    }
                );

                $scope.map.control.getGMap().setCenter($scope.locationMarker.getPosition());
                $scope.map.control.getGMap().setZoom(15);
            };

            $scope.resetMap = function () {
                google.maps.event.removeListener($scope.coordinateMarkerListener);
                $scope.map.control.getGMap().setCenter(new google.maps.LatLng(51.163375, 10.447683)); // center of ger
                $scope.map.control.getGMap().setZoom(6);
                if ($scope.locationMarker) {
                    $scope.locationMarker.setMap(null);
                    $scope.coordinateMarker.setMap(null);
                }
            };

            $scope.processAreas = function () {
                var add, area, i, j, marker, markerFound, showInfo, zMinus, zPlus;

                // first mark them all for removal
                for (j = 0; j < $scope.areaMarkers.length; ++j) {
                    $scope.areaMarkers[j].remove = true;
                }
                
                showInfo = function() {
                    $scope.infoWindow.setContent(this.getTitle());
                    $scope.infoWindow.open($scope.map.control.getGMap(), this);
                };

                zMinus = function() {
                    this.setZIndex(0);
                };

                zPlus = function() {
                    this.setZIndex(1000);
                };

                add = [];
                for (i = 0; i < $scope.tacticalAreas.length; ++i) {
                    area = $scope.tacticalAreas[i];
                    
                    markerFound = false;
                    for (j = 0; j < $scope.areaMarkers.length && !markerFound; ++j) {
                        marker = $scope.areaMarkers[j];
                        
                        if (marker.getTitle() === area.name) {
                            marker.remove = false;
                            markerFound = true;
                        }
                    }
                    
                    if (!markerFound) {
                        // only points supported currently
                        marker = new google.maps.Marker({
                            map: $scope.map.control.getGMap(),
                            position: new google.maps.LatLng(area.coordinates[0], area.coordinates[1]),
                            title: area.name,
                            visible: true,
                            zIndex: 0,
                            icon: getIcon32(area.icon),
                            clickable: true
                        });
                        google.maps.event.addListener(marker, 'mouseover', zPlus);
                        google.maps.event.addListener(marker, 'mouseout', zMinus);
                        google.maps.event.addListener(marker, 'click', showInfo);
                        add.push(marker);
                    }
                }
                
                // remove all markers that were marked as removed
                i = $scope.areaMarkers.length;
                while (i--) {
                    if ($scope.areaMarkers[i].remove) {
                        $scope.areaMarkers[i].setMap(null);
                        $scope.areaMarkers.splice(i, 1);
                    }
                }
                
                // add the new markers
                for(i = 0; i < add.length; ++i) {
                    $scope.areaMarkers.push(add[i]);
                }
            };
            
            $scope.clearAreas = function () {
                var i;

                i = $scope.areaMarkers.length;
                while (i--) {
                    $scope.areaMarkers[i].setMap(null);
                    $scope.areaMarkers.pop();
                }
            };

            $scope.map = {
                center: {
                    latitude: 51.163375,
                    longitude: 10.447683
                },
                zoom: 6,
                control: {}
            };

            $scope.mapRepaint = function () {
                var oldcenter;

                oldcenter = $scope.map.control.getGMap().getCenter();
                // refresh changes the center of the map, don't know why oO
                $scope.map.control.refresh();
                $scope.map.control.getGMap().setCenter(oldcenter);
            };

            $scope.$watch('location', function (location) {
                if (location) {
                    $scope.initMap();
                } else {
                    $scope.resetMap();
                }
            });

            $scope.$watch('tacticalAreas', function (areas) {
                if (areas) {
                    $scope.processAreas();
                } else {
                    $scope.clearAreas();
                }

            }, true);

            $scope.$watch('visible', function (n, o) {
                if (n && !o) {
                    $scope.mapRepaint();
                }
            });

            $scope.$watch('selectedCoordinate', function (n, o) {
                if (n !== o) {
                    $scope.coordinateMarker.setMap($scope.map.control.getGMap());
                    $scope.coordinateMarker.setPosition(n);
                }
            });
        }
    ]
);
