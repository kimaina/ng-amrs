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
    .controller('ChartParamsModalCtrl', ChartParamsModalCtrl);
  ChartParamsModalCtrl.$nject = ['$rootScope', '$scope', 'EtlRestService', '$loading', '$timeout',
    '$modalInstance', 'data','ClinicalAnalyticsService','$filter'];

  function ChartParamsModalCtrl($rootScope, $scope, EtlRestService, $loading, $timeout,
                                        $modalInstance, data,ClinicalAnalyticsService,$filter) {
    //variables
    $scope.selectedAxis = {
      xAxis: '',
      yAxis: []
    };

    $scope.xAxisSource =[];
    $scope.yAxisSource = [];

    //methods
    $scope.ok = ok;
    $scope.cancel = cancel;
    init();

    function init() {
      $scope.xAxisSource = data.selectedIndicators;
      $scope.yAxisSource = data.selectedIndicators;
    }

    function ok() {
      $modalInstance.close($scope.selectedAxis);
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

  }
})();
