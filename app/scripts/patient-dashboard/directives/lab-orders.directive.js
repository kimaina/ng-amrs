/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('labOrders', labOrders);

  function labOrders() {
    return {
      restict: 'E',
      scope: {patientUuid: '@'},
      controller: labOrdersController,
      link: labOrdersLink,
      templateUrl: 'views/patient-dashboard/lab-orders-pane.html'
    };
  }

  labOrdersController.$inject = ['$scope', 'IdentifierResService', 'UtilService', '$http', 'OpenmrsRestService'];

  function labOrdersController($scope, IdentifierResService, UtilService, $http, OpenmrsRestService) {
    $scope.loadIdentifiers = loadIdentifiers;
    $scope.fetchEidServers =fetchEidServers;
    $scope.postOrderToEid=postOrderToEid;
    $scope.fetchAllLabOrders=fetchAllLabOrders;

    $scope.selectedEidServer = null;
    $scope.eidServers = [];
    $scope.labOrders =[];

    function postOrderToEid() {

    }
    function fetchEidServers() {
      if ($scope.isBusy === true) return;
      $scope.isBusy=true;
      $http.get('eid.config.json').
        success(function(data, status, headers, config) {
          $scope.isBusy=false;
          console.log('so this is the config', data);
          $scope.eidServers = data;
        }).
        error(function(data, status, headers, config) {
          $scope.isBusy=false;
          $scope.eidServers=[];
          // log error
        });
    }

    function fetchAllLabOrders(patientUuid) {
      OpenmrsRestService.getOrderResService().getOrdersByPatientUuid(patientUuid,
        function(result) {
          $scope.isBusy=false;
          console.log('--->', result);
          $scope.labOrders = result.results||[];
        },
        function(error) {
          $scope.isBusy=false;
          $scope.labOrders=[];
        }
      );
    }

    function loadIdentifiers() {
      if ($scope.isBusy === true) return;

      $scope.isBusy = true;
      $scope.experiencedLoadingError = false;

      if ($scope.patientUuid && $scope.patientUuid !== '') {
        IdentifierResService.getPatientIdentifiers($scope.patientUuid,
          onFetchIdentifiersSuccess, onFetchIdentifiersFailed);
      }
    }

    function onFetchIdentifiersSuccess(identifiers) {
      $scope.isBusy = false;
      $scope.identifiers = identifiers.results;
    }

    function onFetchIdentifiersFailed(error) {
      $scope.experiencedLoadingError = true;
      $scope.isBusy = false;
    }
  }

  function labOrdersLink(scope, element, attrs, vm) {
    attrs.$observe('patientUuid', onPatientUuidChanged);
    function onPatientUuidChanged(newVal, oldVal) {
      if (newVal && newVal != "") {
        scope.isBusy = false;
        scope.fetchEidServers();
        scope.fetchAllLabOrders(newVal);
      }
    }
  }

})();
