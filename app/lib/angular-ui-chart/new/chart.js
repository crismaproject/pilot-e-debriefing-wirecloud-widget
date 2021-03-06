angular.module('ui.chart', [])
  .directive('uiChart', function ($window, $timeout) {
    return {
      restrict: 'EACM',
      template: '<div></div>',
      replace: true,
      link: function (scope, elem, attrs) {
        var renderChart = function () {
//          console.log("RENDER: " + new Date().getTime());
          var data = scope.$eval(attrs.uiChart);
          elem.html('');
          if (!angular.isArray(data)) {
            return;
          }

          var opts = {};
          if (!angular.isUndefined(attrs.chartOptions)) {
            opts = scope.$eval(attrs.chartOptions);
            if (!angular.isObject(opts)) {
              throw 'Invalid ui.chart options attribute';
            }
          }

//          elem.empty(); //delete children
          elem.jqplot(data, opts);
          //make sure there are children or maybe .jqplot didn't render
//          if (!elem.children().length) { $timeout(renderChart, 100); }
        };
        
        //responsive friendly
//        angular.element($window).bind('resize', renderChart);

        scope.$watch(attrs.uiChart, function () {
          renderChart();
        }, true);

        scope.$watch(attrs.chartOptions, function () {
          renderChart();
        });
      }
    };
  });