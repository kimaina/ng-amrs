/*jshint -W003, -W117, -W098, -W026 */
(function(){
    'use strict';

    angular
            .module('app.admin')
            .factory('Moh731ReportService',Moh731ReportService);
    Moh731ReportService.$inject=[];
    function Moh731ReportService(){
        var reportSchema;
        var reportSections={};
        var reportDataInSections={};
        var indicatorSections={};
        var sectionSchema={};
        var sectionKeys={};
        var setUp=false;
        var serviceDefinition;
        var startDate=new Date();
        var endDate=new Date();

        serviceDefinition={
            getReportSchema:getReportSchema,
            setReportSchema:setReportSchema,
            generateReportDataSections:generateReportDataSections,
            isSetUp:isSetUp,
            getReportSections:getReportSections,
            generateReport:generateReport,
            getSectionSchema:getSectionSchema,
            setSectionSchema:setSectionSchema
        };
        return serviceDefinition;

        function  getSectionSchema(){
            return  sectionSchema;
        }
        function setSectionSchema(schema){
            sectionSchema=schema;
        }
        function  getReportSections(){
            return reportSections;
        }


        function getReportSchema(){
            return reportSchema;
        }

        function setReportSchema(schema){
            reportSchema=schema;
        }
        /**
         * generate  an  object  of  indicator   section
         * @param {type} reportSchema
         * @returns {undefined}
         */
        function generateIndicatorSection(reportSchema){
            angular.forEach(reportSchema,function(value,key){
                try{
                    console.log("ndicaor  key"+value.indicator_key.name+">.section key"+value.section_key);
                    indicatorSections[value.indicator_key.name]=value.section_key;
                }catch(e){
                    //  console.log(e+"Exception  at generate  indicator  sections");
                }
            },[]);
            //  console.log(indicatorSections)
        }

        function getIndicatorSection(indicatorLabel){
            return  indicatorSections[indicatorLabel];
        }
        /**
         * Method to filter  moh 731 report data to the correct  sections  
         * @param {type} reportData
         * @param {type} reportSchema
         * @returns {undefined}
         */
        function generateReportDataSections(reportData,reportSchema){
            //test  if indicatorsSection variable  is  populated

            //attemp to load indicator section  variable
            generateIndicatorSection(reportSchema);

            if(angular.isDefined(reportData)&&angular.isDefined(reportSchema)){
                angular.forEach(reportSchema,function(value,key){
                    //Get all fields  in a row  in  this  section
                    console.log(value);
                    console.log("++++++++++");
                    if(angular.isDefined(value.indicator_key)){
                        reportSections[value.section_key]=[];
                        var indicatorPosition=0;
                        angular.forEach(reportData[0],function(value_2,key_2){
                            //Get all fields  in a row  in  this  section
                            if(getIndicatorSection(key_2)===value.section_key)
                            {
                                reportSections[value.section_key].push(key_2);
                            }
                            indicatorPosition++;
                        },[]);
                    }
                },[]);
                //create report date   in  sections

                //  reportSchema.sections
                setUp=true;
            }else{
                setUp=false;
                return false;
            }

        }
        function getReportSectionLabel(sectionKey){
            if(!angular.isDefined(sectionKeys[sectionKey])){
                angular.forEach(getSectionSchema(),function(value,key){
                    try{
                        if(value.label===sectionKey){
                            sectionKeys[sectionKey]=sectionKey+" "+value.description;
                            return sectionKey+" "+value.description;
                            ;
                        }else{

                        }
                    }catch(e){
                        console.log(e);
                    }
                },[]);
                return "";
            }else
                console.log("return  section  key  from cache");
            return sectionKeys[sectionKey];
        }
        function generateReport(reportData){
            angular.forEach(reportSections,function(value,key){
                if(!angular.isDefined(reportDataInSections[getReportSectionLabel(key)])){
                    reportDataInSections[getReportSectionLabel(key)]=[];
                }
                reportDataInSections[getReportSectionLabel(key)]=[];
                //get  section  data
                angular.forEach(value,function(value_2,key_2){
                    reportDataInSections[getReportSectionLabel(key)].push({value_2:reportData[value_2+""]});
                },[]);
//

            },[]);
            console.log(reportDataInSections);
            return reportDataInSections;
        }
        function getindicatorSections(){
            return indicatorSections;
        }
        function getStartDate(){
            return startDate;
        }

        function setStartDate(date){
            startDate=date;
        }

        function getEndDate(){
            return endDate;
        }

        function setEndDate(date){
            endDate=date;
        }
        function isSetUp(){
            return setUp;
        }

    }

})();
