/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .directive('reportAnalyticsVisualization', directive);

  function directive() {
    return {
      restrict: "E",
      scope: {
        startDate: "=",
        endDate: "=",
        enabledCharts: "=",
        selectedLocations: "=",
        isBusy: "=",
        indicators: "=",
        selectedIndicatorTags: "=",
        reportName: "=",
        chartFilters: "=",
        //selectedAxis:"="
      },
      controller: dataAnalyticsVisualizations,
      link: dataAnalyticsLink,
      templateUrl: "views/admin/data-analytic-chart-modal.html"
    };
  }

  dataAnalyticsVisualizations.$inject = ['$scope', 'moment',
    '$loading', '$stateParams', 'ClinicalAnalyticsService', 'EtlRestService', '$modal', '$filter'];

  function dataAnalyticsVisualizations($scope, moment, $loading,
                                       $stateParams, ClinicalAnalyticsService, EtlRestService, $modal, $filter) {
    $scope.selectedLocation = $stateParams.locationuuid || '';
    $scope.startDate = new Date(new Date().setYear(new Date().getFullYear() - 1));
    $scope.endDate = new Date();
    $scope.generateGraph = generateGraph;
    $scope.width = 0;
    $scope.chartDef = [];
    $scope.axisTypeDefinition = '';
    $scope.selectedxAxisIndicator = '';
    //$scope.selectedxAxisIndicator = '';
    /// $scope.selectedyAxisIndicator =$scope.selectedAxis.yAxis;
    $scope.selectedAxis = {
      xAxis: '',
      yAxis: []
    };

    $scope.chart = {
      bindto: '#chart1',
      data: {
        x: 'encounter_datetime',
        columns: []
      },
      axis: {
        x: {
          label: 'Month',
          type: 'category',
        },
        y: {
          label: 'Y Label'
        },
        y2: {
          show: true,
          label: 'Y2 Label'
        }
      }
    };



    $scope.xAxisSource = [];
    $scope.yAxisSource = [];

    $scope.chartType = [
      {name: 'spline'},
      {name: 'bar'},
      {name: 'donut'}

    ];

    $scope.$on("patient", function (event, data) {
      //use the data

    });


    function init() {

      $scope.xAxisSource = $scope.selectedIndicatorTags.indicatorTags;
      $scope.yAxisSource = $scope.selectedIndicatorTags.indicatorTags;

      if ($scope.reportName === 'hiv-summary-monthly-report') {
        $scope.selectedIndicatorTags.indicatorTags.unshift({name: 'encounter_datetime'});
      }
      if ($scope.reportName === 'hiv-summary-report') {
        $scope.selectedIndicatorTags.indicatorTags.unshift({name: 'location'});
      }

      for (var i = 0; i < $scope.indicators.length; ++i) {
        $scope.indicators[i].encounter_datetime =
          $filter('date')($scope.indicators[i].encounter_datetime, 'MM/y');
      }

    }

    function generateGraph() {
      $scope.chart.data.x = $scope.selectedAxis.xAxis.name;
      $scope.chart.axis.x.label = $scope.selectedAxis.xAxis.label;
      $scope.chart.axis.x.type = $scope.selectedAxis.xAxis.name === 'encounter_datetime'?'category':'indexed';
      //generate columns
      var col = [];
      console.log('i wanna know what is in herer', $scope.selectedAxis.yAxis);
      //y-axis
      _.each( $scope.selectedAxis.yAxis, function (indicator) {
        var columnRow = [indicator.name];
        _.each($scope.indicators, function (row) {
          columnRow.push(row[indicator.name]);
        });
        col.push(columnRow);
      });
      //x-axis
      var columnRow = [$scope.selectedAxis.xAxis.name];
      _.each($scope.indicators, function (row) {
        columnRow.push(row[$scope.selectedAxis.xAxis.name]);
      });
      col.push(columnRow);
      console.log('-------<', col);
      $scope.chart.data.columns = col;
      //create chart
      c3.generate($scope.chart);

    }

    function intializeChartAxises() {
      $scope.selectedChart = $scope.chartType.name.name;
      $scope.selectedxAxisIndicator = $scope.selectedAxis.xAxis.name;
      $scope.selectedyAxisIndicator = $scope.selectedAxis.yAxis;
      chartDefinition();
    }


    function chartDefinition() {
      $scope.chartDef = [];
      console.log('hey', $scope.selectedxAxisIndicator)
      _.each($scope.selectedyAxisIndicator, function (indicator) {
        //
        $scope.chartDef.push({
          indicator: indicator.name,
          chartType: $scope.selectedChart,
          name: indicator.label
        });

      });

      $scope.hivComparative = {
        reportName: $scope.reportName,
        chartDefinition: $scope.chartDef,
        groupBy: 'groupByEndDate',
        isBusy: false,
        hasLoadingError: false,
        resultIsEmpty: false
      };

      $scope.hivComparative.chart = {
        xAxis: {id: $scope.selectedxAxisIndicator}, //x axis plot definition
        yAxis: $scope.selectedyAxisIndicator, //y axis plot definition
        y2Axis: '', //y2 axis plot definition
        labels: true,
        min: 0, //initialize min
        max: 0, //initialize max
        dataPoints: [], //array of values to be plotted
        dataColumns: ClinicalAnalyticsService.defineXAndYAxis($scope.hivComparative.chartDefinition)
      };

    }

    chartDefinition();

    // $scope.axisTypeDefinition ='category';


    //formats tooltip values
    $scope.formatTooltipValue = function (value, ratio, id, index) {
      var perc = (ratio * 100).toFixed(1);
      return value + ' ' + ' (' + perc + '%)';
    };

    //round off values to 2 dp
    $scope.roundOffValues = function (value, ratio, id, index) {
      return value;
    };
    $scope.$watch('indicators', function (newValue, oldValue) {
      //generateCharts('encounter_datetime','Month', 'category');
    }, true);
    $scope.$watch('selectedxAxisIndicator', function (newValue, oldValue) {
      // console.log('Being watched=================>',newValue.xAxis.name);
      console.log('Being watched=================>', newValue);
      $scope.selectedChart = newValue;
      //console.log('this one',$scope.selectedIndicator);
    }, true);


    $scope.$watchGroup(['startDate', 'endDate', 'isBusy', 'selectedIndicatorTags', 'indicators'], function (newValues, oldValues, scope) {
      var startDate = newValues[0];
      var endDate = newValues[1];
      if (endDate > startDate) {

      }
      init();

    });


    function isBusy(val, elem) {
      if (val === true) {
        $loading.start(elem);
      } else {
        $loading.finish(elem);
      }
    }


  }

  function dataAnalyticsLink(scope, element, attrs, vm) {
  }
})();
