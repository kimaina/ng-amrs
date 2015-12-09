/*jshint -W003, -W098, -W033 */
(function(){
    'use strict';

    angular
            .module('app.admin')
            .controller('moh731ReportCtrl',moh731ReportCtrl);
    moh731ReportCtrl.$nject=
            ['$rootScope','$scope','$stateParams','EtlRestService','moment','$filter','$state','Moh731ReportService'];

    function moh731ReportCtrl($rootScope,$scope,$stateParams,EtlRestService,moment,$filter,$state,Moh731ReportService){
        //Patient List Directive Properties & Methods
        $scope.startDate=new Date("January 1, 2015 12:00:00");
        $scope.endDate=new Date();
        $scope.selectedLocation=$stateParams.locationuuid||'';
        $scope.selectedIndicatorBox=$stateParams.indicator||'';
        $scope.selectedSearchLocations=[];
        $scope.reportGeneration=false;
        $scope.reportName='moh-731-report';
        $scope.countBy='num_persons';
        $scope.reportData=[];
        $scope.getReportData=getReportData;
        $scope.getReportSectionLabel=getReportSectionLabel;

        //UX Scope Params
        $scope.isBusy=false;
        $scope.experiencedLoadingError=false;

        //Dynamic DataTable Params
        $scope.indicators=[];  //set filtered indicators to []
        $scope.currentPage=1;
        $scope.defaultIndicators=[]; //initialize unfiltered indicators to []
        $scope.counter=0;


        ///Multi-Select Properties/ Params
        $scope.selectedIndicatorTags={};
        $scope.selectedIndicatorTags.selectedAll=false;
        $scope.selectedIndicatorTags.indicatorTags=[];
        $scope.indicatorTags=[];
        $scope.onSelectedIndicatorTagChanged=onSelectedIndicatorTagChanged;
        $scope.isBusy=false;


        init();

        //scope methods
        function init(){
            if(!Moh731ReportService.isSetUp())loadIndicatorsSchema();
        }

        function loadIndicatorsSchema(){
            console.log('being  called');
            $scope.experiencedLoadingErrors=false;
            if($scope.isBusy===true)return;
            $scope.indicatorTags=[];
            $scope.isBusy=true;
            if($scope.reportName&&$scope.reportName!=='')
                EtlRestService.getIndicatorsSchemaWithSections($scope.reportName,onFetchIndicatorsSchemaSuccess,
                        onFetchIndicatorsSchemaError);

        }
        function onFetchIndicatorsSchemaSuccess(result){
            $scope.isBusy=false;
            $scope.indicatorTags=result.result[0];
            Moh731ReportService.setReportSchema(result.result[0]);
            Moh731ReportService.setSectionSchema(result.result[1]);
        }

        function onFetchIndicatorsSchemaError(error){
            $scope.isBusy=false;
            $scope.experiencedLoadingErrors=true;
        }

        function getReportData(){
            $scope.experiencedLoadingErrors=false;
            $scope.noresults=false;
            $scope.reportGeneration=false;
            if($scope.isBusy===true)
                return;
            $scope.isBusy=true;
            $scope.indicators=[];
            if($scope.reportName&&$scope.reportName!==''
                    &&$scope.startDate&&$scope.startDate!=='')
                EtlRestService.getMoh731Report($scope.reportName,moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                        moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                        $scope.selectedSearchLocations,$scope.countBy,onFetchMoh731ReportSuccess,onFetchMoh731ReportError);
        }

        function onFetchMoh731ReportSuccess(result){
            $scope.reportGeneration=true;
            $scope.isBusy=false;
            if(angular.isDefined(result.result)&&result.result.length>0){
                $scope.moh731ReportData=result.result;
                //process the  date
                Moh731ReportService.generateReportDataSections(result.result,Moh731ReportService.getReportSchema());
                Moh731ReportService.getReportSections();
                $scope.reportData=Moh731ReportService.generateReport(result.result[0]);

            }
        }
        function getReportSectionLabel(sectionKey){
            angular.forEach(Moh731ReportService.setSectionSchema(),function(value,key){
                try{
                  if(value.label===sectionKey){
                      console.log("about  to return"+ value.description);
                      return value.description;
                  }else{
                      console.log(value.label+"The  section Key"+sectionKey+"Missing  match")
                  }
                }catch(e){
                      console.log(e);
                }
            },[]);
            return "";
        }







        function onSelectedIndicatorTagChanged(tag){
            filterIndicators();
        }



        function getIndicatorDetails(name){
            var found=$filter('filter')($scope.indicatorTags,{name:name})[0];
            if(found)
                return found;
        }


        //get  Hiv  summary  flat table  error
        function onFetchMoh731ReportError(error){
            $scope.isBusy=false;
            $scope.experiencedLoadingErrors=true;
        }




    }
})();
