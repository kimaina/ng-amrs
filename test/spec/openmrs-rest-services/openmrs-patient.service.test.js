/* global afterEach */
/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('Patient Service Unit Tests', function () {
    beforeEach(function () {
      module('app.openmrsRestServices');
      module('mock.data');
    });

    var callbacks;
    var httpBackend;
    var patientService;
    var settingsService;
    var mockData;
    var url ='custom:(uuid,identifiers:ref,person:(uuid,gender,birthdate,dead,age,deathDate,preferredName:(givenName,middleName,familyName),attributes:(uuid,value,attributeType:ref),preferredAddress:(preferred,address1,address2,cityVillage,stateProvince,country,postalCode,countyDistrict,address3,address4,address5,address6)))'

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      patientService = $injector.get('PatientResService');
      settingsService = $injector.get('OpenmrsSettings');
      mockData = $injector.get('mockData');
    }));

    beforeEach(inject(function () {
      callbacks = {
        onSuccessCalled: false,
        onFailedCalled: false,
        message: null,
        onSuccess: function () {
          callbacks.onSuccessCalled = true;
        },

        onFailure: function (message) {
          callbacks.onFailedCalled = true;
          callbacks.message = message;
        }
      };
    }));

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();
    });

    it('should have drug service defined', function () {
      expect(patientService).to.exist;
    });

    it('patientService should have getPatientByUuid method defined', function () {
      expect(patientService.getPatientByUuid).to.be.an('function');
    });

    it('patientService should have getPatientQuery method defined', function () {
      expect(patientService.getPatientQuery).to.be.an('function');
    });

    it('should make an api call to the patient resource with right url when getPatientByUuid is invoked with a uuid', function () {

      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient?v='+url).respond(mockData.getMockPatient());
      patientService.getPatientByUuid('xxxx',  function (data){
        expect(data.uuid).to.exit;
        expect(data).to.be.an('object');
        console.log(data.uuid)
      });
      httpBackend.flush();
    });

    it('should make an api call with right url when getPatientByUuid is invoked', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient?v='+url).respond(mockData.getMockPatient());
      patientService.getPatientByUuid('xxxx',  function (data){
        expect(data).to.be.an('object');
        expect(data.uuid).to.exit;
      });
      httpBackend.flush();
    });

    it('should call the onSuccess callback when getPatientByUuid request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient?v='+url).respond(mockData.getMockPatient());
      patientService.getPatientByUuid('passed-uuid',callbacks.onSuccess);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
    });

    it('should not call the onSuccess callback when getPatientByUuid request is not successful', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient?v='+url).respond(500);
      patientService.getPatientByUuid('passed-uuid',callbacks.onSuccess);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
    });

    it('should call the onSuccess callback getPatientQuery request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient?v='+url).respond(mockData.getMockPatient());
      patientService.getPatientQuery('search-text', callbacks.onSuccess);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);

    });

    it('should  not call the onFailed callback when getPatientQuery request is not successful', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient?v='+url).respond(500);
      patientService.getPatientQuery('search-text', callbacks.onSuccess);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
    });

  });
})();
