/*jshint -W003, -W098, -W033 */
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name ngAmrsApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the ngAmrsApp
   */
  angular
    .module('app.admin')
    .controller('DataAnalyticsReportModalCtrl', DataAnalyticsReportModalCtrl);
  DataAnalyticsReportModalCtrl.$nject = ['$rootScope', '$scope', 'EtlRestService', '$loading', '$timeout',
    '$modalInstance', 'data','ClinicalAnalyticsService','$filter'];

  function DataAnalyticsReportModalCtrl($rootScope, $scope, EtlRestService, $loading, $timeout,
                                        $modalInstance, data,ClinicalAnalyticsService,$filter) {
    //non-function types scope members
    $scope.patients = [];
    $scope.isBusy = false;
    $scope.experiencedLoadingErrors = false;
    $scope.currentPage = 1;
    $scope.startDate = data.startDate;
    $scope.endDate = data.endDate;
    $scope.indicator = data.indicators;
    $scope.indicatorTags =data.selectedIndicators;
    $scope.selectedChart =data.selectedChart.name;
    $scope.chartDef =[];
    $scope.selectedxAxisIndicator =data.xAxisIndicator;
    $scope.reportName =data.reportName;
    $scope.selectedyAxisIndicator =[];
    $scope.axisTypeDefinition='';

    //Pagination Params
    $scope.nextStartIndex = 0;
    $scope.allDataLoaded = false;



    //load data

    $scope.sliderProperties = {
      min: $scope.startDate.getTime(),
      max: $scope.endDate.getTime(),
      smallStep: 8640000000,
      largeStep: 8640000000,
      tickPlacement: 'both',
      tooltip: {
        template: "#= kendo.toString(new Date(value), 'dd/MMMM/yyyy') #"
      }
    };
    for (var i = 0; i < $scope.indicator.length; ++i) {
      $scope.indicator[i].encounter_datetime=
        $filter('date')($scope.indicator[i].encounter_datetime, 'MM/y');
    }


    _.each($scope.indicatorTags, function (indicator) {
      $scope.chartDef.push({
        indicator:indicator.name,
        chartType: $scope.selectedChart,
        name: indicator.label

      });


    });

    $scope.hivComparative = {
      reportName: $scope.reportName,
      chartDefinition: $scope.chartDef ,
      groupBy: 'groupByEndDate',
      isBusy: false,
      hasLoadingError: false,
      resultIsEmpty: false
    };



    $scope.hivComparative.chart = {
      xAxis: {id: data.xAxisIndicator}, //x axis plot definition
      yAxis: '', //y axis plot definition
      y2Axis: '', //y2 axis plot definition
      min: 0, //initialize min
      max: 0, //initialize max
      dataPoints: [], //array of values to be plotted
      dataColumns: ClinicalAnalyticsService.defineXAndYAxis($scope.hivComparative.chartDefinition)
    };


    function init(){

      ClinicalAnalyticsService.generateChartObject( $scope.indicator,  $scope.hivComparative.chart,
        $scope.hivComparative.chartDefinition);
       $scope.selectedyAxisIndicator='';

      if($scope.hivComparative.chartDefinition.length>0) {
        $scope.selectedyAxisIndicator = $scope.hivComparative.chartDefinition[0].name;

        for (var i = 1; i < $scope.hivComparative.chartDefinition.length; ++i) {
          $scope.selectedyAxisIndicator = $scope.selectedyAxisIndicator + ',' +
            $scope.hivComparative.chartDefinition[i].name;
        }
      }

      if(data.xAxisIndicator==='encounter_datetime'){
        $scope.axisTypeDefinition ='category';
      }else{
        $scope.axisTypeDefinition ='indexed';

      }
    }

    //formats tooltip values
    $scope.formatTooltipValue = function (value, ratio, id, index) {
      var perc = (ratio * 100).toFixed(1);
      return value + ' ' + ' (' + perc + '%)';
    };

    //round off values to 2 dp
    $scope.roundOffValues = function (value, ratio, id, index) {
      return value;
    };

    $scope.ok = function () {
      $modalInstance.close(data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


    function isBusy(val, elem) {
      if (val === true) {
        $loading.start(elem);
      } else {
        $loading.finish(elem);
      }
    }
    init();

  }
})();
