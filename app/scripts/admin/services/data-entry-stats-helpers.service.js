/*jshint -W003, -W117, -W098, -W026 */
(function () {
	'use strict';

	angular
		.module('app.admin')
		.factory('DataEntryStatsHelpersService', DataEntryStatsHelpersService);
	DataEntryStatsHelpersService.$inject = ['moment'];
	function DataEntryStatsHelpersService(moment) {
		var serviceDefinition;
		serviceDefinition = {
			generateEndDate: generateEndDate,
			getSelectedLocations: getSelectedLocations,
			getSelectedEncounterTypes: getSelectedEncounterTypes,
			getSelectedForms: getSelectedForms,
			getSelectedProvider: getSelectedProvider,
			getSelectedCreator: getSelectedCreator,
			groupByX_ThenByY: groupByX_ThenByY,
			findItemByXandY: findItemByXandY,
			extractUniqueElementsByProperty: extractUniqueElementsByProperty,
			getDateArrayFrom: getDateArrayFrom,
			areDateObjectsEqual: areDateObjectsEqual,
			generateEndMonth: generateEndMonth,
			getMonthArrayFrom: getMonthArrayFrom
        };
		return serviceDefinition;

		function generateEndDate(startDate, daysToAdd) {
			var day = moment(startDate).startOf('day');
			return day.add(daysToAdd, 'days').endOf('day');
		}
		
		function generateEndMonth(startDate, monthsToAdd) {
			var day = moment(startDate).startOf('day');
			return day.add(monthsToAdd, 'months').endOf('day');
		}

		function getSelectedLocations(selectedLocationObject) {
			if (selectedLocationObject.selectedAll === true)
				return;
			var locations;
			if (selectedLocationObject.locations)
				for (var i = 0; i < selectedLocationObject.locations.length; i++) {
					if (i === 0) {
						locations = '' + selectedLocationObject.locations[i].uuId();
					}
					else {
						locations = 
						locations + ',' + selectedLocationObject.locations[i].uuId();
					}
				}

			return locations;
		}

		function getSelectedEncounterTypes(selectedEncounterTypeObject) {
			var encounterTypes;
			if (selectedEncounterTypeObject.selected)
				for (var i = 0; i < selectedEncounterTypeObject.selected.length; i++) {
					if (i === 0) {
						encounterTypes = 
						'' + selectedEncounterTypeObject.selected[i].encounterTypeUuid;
					}
					else {
						encounterTypes = 
						encounterTypes + ',' + 
						selectedEncounterTypeObject.selected[i].encounterTypeUuid;
					}
				}

			return encounterTypes;
		}

		function getSelectedForms(selectedFormObject) {
			var forms;
			if (selectedFormObject.selected)
				for (var i = 0; i < selectedFormObject.selected.length; i++) {
					if (i === 0) {
						forms = '' + selectedFormObject.selected[i].uuid;
					}
					else {
						forms = forms + ',' + selectedFormObject.selected[i].uuid;
					}
				}

			return forms;
		}

		function getSelectedProvider(selectedProviderObject) {
			var providerUuid;
			if (selectedProviderObject.selected && selectedProviderObject.selected.uuId)
				providerUuid = selectedProviderObject.selected.uuId();

			return providerUuid;
		}
		
		function getSelectedCreator(selectedCreatorObject) {
			var creatorUuid;
			if (selectedCreatorObject.selected && selectedCreatorObject.selected.uuid)
				creatorUuid = selectedCreatorObject.selected.uuid;

			return creatorUuid;
		}

		function groupByX_ThenByY(uniqueXarray, uniqueYarray, xPropName, yPropName,
		 arrayOfObjectsToGroup, extraYpropNameColumn) {
			var groupedItems = [];

			for (var y = 0; y < uniqueYarray.length; y++) {
				var row = {};
				row[yPropName] = uniqueYarray[y];
				row['value'] = [];

				for (var x = 0; x < uniqueXarray.length; x++) {
					var cell = {};
					cell[xPropName] = uniqueXarray[x];
					cell[yPropName] = uniqueYarray[y];


					cell['value'] = findItemByXandY(xPropName, yPropName, 
					uniqueXarray[x], uniqueYarray[y], arrayOfObjectsToGroup);
					
					row['value'].push(cell);
					if (cell.value && extraYpropNameColumn)
						row[extraYpropNameColumn] = cell.value[extraYpropNameColumn];
				}
				groupedItems.push(row);
			}

			return groupedItems;
		}

		function findItemByXandY(xPropName, yPropName, xValue, yValue, 
		arrayOfObjectsToSearch) {
			var found;
			_.each(arrayOfObjectsToSearch, function (item) {
				if (found === undefined && item[xPropName] === xValue && 
				item[yPropName] === yValue) {
					found = item;
				}
			});

			return found;
		}

		function extractUniqueElementsByProperty(arrayOfObjects, field) {
			var array = _(arrayOfObjects).pluck(field).unique().value();
			return array;
		}

		function getDateArrayFrom(startDate, count) {

			var arrayOfDates = [];

			for (var i = 0; i <= count; i++) {
				var added = moment(startDate).add(i, 'days').utc().toDate();
				arrayOfDates.push(added);
			}
			return arrayOfDates;
		}
		
		function getMonthArrayFrom(startDate, count) {

			var arrayOfDates = [];

			for (var i = 0; i <= count; i++) {
				var added = moment(startDate).add(i, 'months').utc().toDate();
				arrayOfDates.push(added);
			}
			return arrayOfDates;
		}

		function areDateObjectsEqual(date1, date2) {
			return moment(date1).utc().toDate().toUTCString() ===
			 moment(date2).utc().toDate().toUTCString();
		}

	}

})();
