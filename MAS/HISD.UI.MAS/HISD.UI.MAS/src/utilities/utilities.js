import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import moment from 'moment';
import { debuglog } from 'util';
import _ from 'lodash';

class Utilities {
    static inspectObject(obj) {
        let str = ""; //variable which will hold property values
        for (let prop in obj) {
            str += prop + " value : " + obj[prop] + "\n"; //Concate prop and its value from object
        }
        alert(str); //Show all properties and its value
    }

    static getDateOnly(theDate) {
        if(theDate === undefined || theDate === '') return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate) return '';
        let  validDate = new Date(theDate);
        let yyyy = validDate.getFullYear().toString();
        let mm = (validDate.getMonth() + 1).toString(); // getMonth() is zero-based
        let dd = validDate.getDate().toString();
        return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy; // padding
    }

    

    static getTimeOnly(theDate) {
        if(theDate === undefined || theDate === '') return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate) return '';
        let  validDate = new Date(theDate);
        let hours = validDate.getHours();
        let minutes = validDate.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    static getDateTime (theDate) {
        if(theDate === undefined || theDate === '' || theDate == null) return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate)
            return '';
        else
            return theDate.toLocaleString();
    }

    static convertToDate (theDate) {
        if (theDate === undefined || theDate == '')
            return '';
        else
            return new Date(parseInt(theDate.substr(6)));
    }
  
    static convertToJSDate (theDate) {
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return undefined;
        else
            return "\/Date(" + theDate.getTime() + ")\/";
    }

    static convertToSQLDate (theDate) {
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return "";
        const sqlDate = theDate.getUTCFullYear() + '-' +
            ('00' + (theDate.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + theDate.getUTCDate()).slice(-2);

        return sqlDate;
    }

    static convertToSQLDateTime (theDate) {
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return "";
        let  validDateTime = new Date(theDate);
        const sqlDateTime = theDate.getUTCFullYear() + '-' +
            ('00' + (theDate.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + theDate.getUTCDate()).slice(-2)+ 'T15:06:07.647-05:00';
        return sqlDateTime;    
    }

    static getODataDate(theDate){
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return "";
        const oDataDate = theDate.getUTCFullYear() + '-' +
        ('00' + (theDate.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + theDate.getUTCDate()).slice(-2) + "T05:00.000Z";

        return oDataDate;
    }
    static getODataDate23hours(theDate){
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return "";
        const oDataDate = theDate.getUTCFullYear() + '-' +
        ('00' + (theDate.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + theDate.getUTCDate()).slice(-2) + "T23:59.000Z";

        return oDataDate;
    }

    static getMonthName(monthNumber){
        const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        if(monthNumber >= 1 && monthNumber <= 12)
            return months[monthNumber-1];
        else
            return "";
    }

    static validateIPAddress(ipAddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress)) {
            return (true);
        }
        return (false);
    }

    static validateNumber(evt) {
        let theEvent = evt || window.event;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        let regex = /[0-9]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }


    static getDayPickerStrings() {
        let dayPickerStrings = {
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],

            shortMonths: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],

            days: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],

            shortDays: [
                'S',
                'M',
                'T',
                'W',
                'T',
                'F',
                'S'
            ],

            goToToday: 'Go to today',
            prevMonthAriaLabel: 'Go to previous month',
            nextMonthAriaLabel: 'Go to next month',
            prevYearAriaLabel: 'Go to previous year',
            nextYearAriaLabel: 'Go to next year'
        };
        return dayPickerStrings;
    }

    static arrayFlattener(myArray){
        let flatArray = [];
        if(myArray && myArray.length > 0){
            for(let i = 0; i < myArray.length; i++){
                flatArray.push(this.objectFlattener(myArray[i]));
            }
        }
        return flatArray;
    }

    static objectFlattener(ob) {
        const toReturn = {};

        for (const key in ob) {
            if (!ob.hasOwnProperty(key)) {
                continue;
            }
            if ((typeof ob[key]) === 'object') {
                const flatObject = this.objectFlattener(ob[key]);
                for (const key2 in flatObject) {
                    if (!flatObject.hasOwnProperty(key2)) {
                        continue;
                    }
                    // this.logger.debug(`adding ${key + '.' + key2}:${flatObject[key2]}`);
                    toReturn[key + '.' + key2] = flatObject[key2];
                }
            } else {
                // this.logger.debug(`adding ${key}:${ob[key]}`);
                toReturn[key] = ob[key];
            }
        }
        return toReturn;
    }

    static getBooleanFromText(value){
        if(typeof value != 'string')
            return false;
        value = value.toLowerCase();
        if(value === 'yes' || value === 'active' || value === 'true')
            return true;
        else
            return false;
    }

    static getTextFromBoolean(value, type){
        if(typeof value != 'boolean'){
            if(type == 'YN')
                return 'No';
            else if(type == 'TF')
                return 'false';
            else if(type == 'AI')
                return 'Inactive';
        }
        if(type == 'YN'){
            if(value == true)
                return 'Yes';
            else
                return 'No';
        }
        else if(type == 'TF'){
            if(value == true)
                return 'true';
            else
                return 'false';
        }
        else if(type == 'AI'){
            if(value == true)
                return 'Active';
            else
                return 'Inactive';
        }
        return '';
    }

    static getLoginId(userName){
        const comp = userName.split('\\');
        if(comp.length > 1)
           return comp[1];
        else
            return userName;
    }

    static getTimeSpent(minutes){
        const hours = parseInt(minutes/60);
        const min = minutes % 60;
        let time = moment().set({hour: hours, minute: min, second: 0, millisecond: 0});
        return time;
    }

    static filteredArray(arr, key, id) {
        return arr.find(item => item[key] === id);
    }

    static getFilteredMentees(mentee, alreadyExistMentee){
        const newFilteredArr = [];

        mentee.map(item => {
            const getExistedMentee = this.filteredArray(alreadyExistMentee, 'MenteeEmployeeID', item.StaffNaturalKey);
            if(!getExistedMentee){
                newFilteredArr.push(item);
            }
        });

        return newFilteredArr;
    }

    static getInstructionPlanning(activityStandard){
        const newArr = [];
        if(activityStandard){
            activityStandard.map(item => {
                const obj = {};
                obj.ActivityStandardItemID = item.ActivityStandardItemID;
                obj.ActivityStandardItemName = item.ActivityStandardItemName;
                obj.EffectiveEndDate = new Date(this.getDateTime(item.EffectiveEndDate)) || '';
                obj.EffectiveStartDate = new Date(this.getDateTime(item.EffectiveStartDate)) || '';
                obj.ActivityStandardGroupID = item.ActivityStandardGroupID;
                newArr.push(obj);
            });
        }
        return newArr;
    }

    static getAllActivityStandards(obj){
        const newArr = [];
        if(!_.isEmpty(obj)){
            Object.keys(obj).forEach(item =>{
                obj[item] && newArr.push(item);
            });
            return newArr;
        }
        return newArr;        
    }

    static getSelectedActivities(selectedItems,key){
        let obj = {};
        if(!_.isEmpty(selectedItems)){
            selectedItems.map(item => {
                obj[item[key]] = true;
            });
            return obj;
        }
        return obj;
    }

    static getCustomDateFormat(theDate) {
        if(theDate === undefined || theDate === '') return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate) return '';
        let  validDate = new Date(theDate);
        let yyyy = validDate.getFullYear().toString();
        let mm = (validDate.getMonth() + 1).toString();
        let dd = validDate.getDate().toString();
        return (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + '-' + yyyy; 
    }

    static getFormattedDate(theDate) {
        if(theDate === undefined || theDate === '') return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate) return '';
       let  validDate = new Date(theDate);
        let currentDay = validDate.getDate().toString();        
        validDate.setDate(validDate.getDate() + 365);
        let yyyy = validDate.getFullYear().toString();
        let mm = (validDate.getMonth() + 1).toString();
        let dd = validDate.getDate().toString();
        if(currentDay == dd){
            dd = (validDate.getDate() - 1).toString();
        }else {
            dd;
        }
        return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy; 
    }

}

export default Utilities;
