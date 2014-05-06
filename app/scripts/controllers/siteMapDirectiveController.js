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

            if (DEBUG) {
                console.log('initialising site map directive controller');
            }

            $scope.locationMarker = null;
            $scope.areaMarkers = [];
            $scope.initMap = function () {
                var ewkt, geojson, indexof;

                ewkt = $scope.location;
                indexof = ewkt.indexOf(';');
                // assume 4326 point
                geojson = Terraformer.WKT.parse(indexof > 0 ? ewkt.substr(indexof + 1) : ewkt);
                $scope.locationMarker = new google.maps.Marker({
                    map: $scope.map.control.getGMap(),
                    position: new google.maps.LatLng(geojson.coordinates[0], geojson.coordinates[1]),
                    title: $scope.locationTitle,
                    visible: true,
                    zIndex: 0,
                    icon: $scope.locationIcon ? $scope.locationIcon : 'img/glyphicons_185_screenshot.png'
                });
                $scope.coordinateMarker = new google.maps.Marker({
                    title: 'Coordinate Marker',
                    visible: true,
                    zIndex: 1000,
                    icon: $scope.locationIcon ? $scope.locationIcon : 'img/glyphicons_242_google_maps.png'
                });
                $scope.coordinateMarkerListener = google.maps.event.addListener(
                    $scope.map.control.getGMap(), 
                    'click', 
                    function(me) {
                        $scope.coordinateMarker.setMap($scope.map.control.getGMap());
                        $scope.coordinateMarker.setPosition(me.latLng);
                        angularTools.safeApply($scope, function() {
                            $scope.selectedCoordinate = me.latLng;
                        });
                    });
                
                $scope.map.control.getGMap().setCenter($scope.locationMarker.getPosition());
                $scope.map.control.getGMap().setZoom(15);
            };

            $scope.resetMap = function () {
                google.maps.event.removeListener($scope.coordinateMarkerListener);
                $scope.map.control.getGMap().setCenter(new google.maps.LatLng(51.163375, 10.447683));
                $scope.map.control.getGMap().setZoom(6);
                if ($scope.locationMarker) {
                    $scope.locationMarker.setMap(null);
                    $scope.coordinateMarker.setMap(null);
                }
            };

            $scope.processAreas = function () {
                var area, i, marker;
                
                for(i = 0; i < $scope.tacticalAreas.length; ++i) {
                    area = $scope.tacticalAreas[i];
                    // only points supported currently
                    marker = new google.maps.Marker({
                        map: $scope.map.control.getGMap(),
                        position: new google.maps.LatLng(area.coordinates[0], area.coordinates[1]),
                        title: area.name,
                        visible: true,
                        zIndex: 0,
                        icon: area.icon
                    });
                    $scope.areaMarkers.push(marker);
                }
            };

            $scope.resetAreas = function () {
                var i;
                
                for(i = 0; $scope.areaMarkers.length; ++i) {
                    $scope.areaMarkers[i].setMap(null);
                }
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
                    $scope.resetAreas();    
                }

            }, true);
            
            $scope.$watch('visible', function (n, o) {
                if (n && !o) {
                    $scope.mapRepaint();
                }
            });
            
            $scope.$watch('selectedCoordinate', function (n, o) {
                if(n !== o) {
                    $scope.coordinateMarker.setMap($scope.map.control.getGMap());
                    $scope.coordinateMarker.setPosition(n);
                }
            });

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
        }
    ]
);
