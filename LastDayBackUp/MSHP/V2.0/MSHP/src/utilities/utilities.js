import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import moment from 'moment';

function compare(a,b) {
    if (a.orderBy < b.orderBy)
      return -1;
    if (a.orderBy > b.orderBy)
      return 1;
    return 0;
}

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

    static getDateTime (theDate) {
        if(theDate === undefined || theDate === '') return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate)
            return '';
        else
            return theDate.toLocaleString();
    }
    static dateFormatter(theDate) {  
        const dcell = new Date(theDate);  
        return `${(dcell.toDateString())}`;
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

    static getODataDate(theDate){
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return "";
        const oDataDate = theDate.getUTCFullYear() + '-' +
        ('00' + (theDate.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + theDate.getUTCDate()).slice(-2) + "T05:00.000Z";

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

    static convertToDate(theDate) {
        if(theDate === undefined || theDate === '') return '';
        let  validDate = new Date(theDate);
        let yyyy = validDate.getFullYear().toString();
        let mm = (validDate.getMonth() + 1).toString(); 
        let dd = validDate.getDate().toString();
        return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy; 
    }

    static getSchoolYear() {
        let yearAsInt = 0;
        let priorYear = 0;
        let nextYear = 0;
        let  validDate = new Date();
        let yyyy = validDate.getFullYear().toString();
        let month = validDate.getMonth() + 1;
        let dd = validDate.getDate().toString();
        yearAsInt = parseInt(yyyy);//gfm set back
        if (month < 8) {
            priorYear = yearAsInt - 1;
            return priorYear.toString() + '-' + yearAsInt.toString();
        }
        else
        {
            nextYear = yearAsInt + 1;
            return yearAsInt.toString() + '-'  + nextYear.toString();
        }
        
    }

    static sortGradeLevels(rawGradeLevelsFromDW){
        let sortedGradeLevels = [];
        $.each(rawGradeLevelsFromDW, function (key, obj) {
            let newGL = {};
            switch (obj.GradeLvlTypeNaturalKey) {
                case 'PE':
                case 'EE':
                newGL.gradeLevel = 'EE';
                newGL.orderBy = 2;
                break;
                case 'PK':
                newGL.gradeLevel = 'PK';
                newGL.orderBy = 4;
                break;           
                case 'K':
                case 'KG':
                newGL.gradeLevel = 'KG';
                newGL.orderBy = 6;
                break;
                default:// this covers all the grade levels from 1 to 12
                if (obj.GradeLvlTypeNaturalKey.length > 0){
                    if (obj.GradeLvlTypeNaturalKey.length == 1){
                        newGL.orderBy = 6 + (2 * parseInt(obj.GradeLvlTypeNaturalKey)) ; //8-18
                        newGL.gradeLevel = '0' + obj.GradeLvlTypeNaturalKey;
                    } else {
                        newGL.orderBy = 6 + (2 * parseInt(obj.GradeLvlTypeNaturalKey)) ;
                        newGL.gradeLevel = obj.GradeLvlTypeNaturalKey;
                    }
                }
            }
            sortedGradeLevels.push(newGL);
        });
        return  sortedGradeLevels.sort(compare);
    }

    static getCalendarReportDatesByYearForDD(calendarReportDates, year){
        let filteredList = calendarReportDates.filter(reportDateObj => {
          return reportDateObj['SchoolYear'] === year;// in test was "2017"
        });
        let codes = filteredList.map(reportDate => {
            return {
              key: reportDate.Id.toString(),
              text: Utilities.getDateOnly(reportDate.ReportDate)
            };
          
        });
        return codes;
        
        
    }

    static getSchoolYearEnd(schoolYear) {
        //let schoolYear = Utilities.getSchoolYear();
        let schoolYears = schoolYear.split("-");
        if (schoolYears.length != 2) return;
        return schoolYears[1];
    }
    static getMostRecentReportDateID(reportDates){
        let useCalendarID = 1;
        if (reportDates && (reportDates.length > 0)){
            
                useCalendarID = reportDates[0].Id;
                for (let i=0; i < reportDates.length; i++){
                    let CalendarID = reportDates[i].Id;
                    
                    let checkDate = new Date(reportDates[i].ReportDate);
                    let today = new Date();
                    if (today < checkDate)
                        break;//so checkdate will be last accepted
                    else
                        useCalendarID = CalendarID;
                } 
          
            
        }

        return useCalendarID.toString();//because GUI using it as a string
       
    }
    static getSchoolYearFromReportDate(validDate) {
        let yearAsInt = 0;
        let priorYear = 0;
        let nextYear = 0;
        let lenValidDate = validDate.length;
        if (lenValidDate < 4) return validDate;
        let yyyy = validDate.substring(lenValidDate - 4,lenValidDate);
        yearAsInt = parseInt(yyyy);
		let month = parseInt(validDate.substring(0,2));
        if (month < 8) {
            priorYear = yearAsInt - 1;
            return priorYear.toString() + '-' + yearAsInt.toString();
            
        }
        else
        {
            nextYear = yearAsInt + 1;
            return yearAsInt.toString() + '-'  + nextYear.toString();
        }
        
    }
    static getMostRecentReportDate(reportDates){
        let useReportDate = null;
        if (reportDates && (reportDates.length > 0)){
                useReportDate = reportDates[0].ReportDate;
                for (let i=0; i < reportDates.length; i++){
                    
                    
                    let checkDate = new Date(reportDates[i].ReportDate);
                    let today = new Date();
                    if (today < checkDate)
                        break;//so checkdate in else of prior iteration will be last accepted
                    else
                        
                        useReportDate = checkDate;
                } 
          
            
        }

        return useReportDate;//because GUI using it as a string
       
    }

    static getMostRecentCompareDaySeq(reportDates, schoolYear){
        let useCompareDaySeq = null;
        let filteredList = reportDates.filter(reportDateObj => {
            return reportDateObj['SchoolYear'] === schoolYear;// in test was "2017"
          });
        if (filteredList && (filteredList.length > 0)){
            useCompareDaySeq = filteredList[0].CompareDaySeq;
                for (let i=0; i < filteredList.length; i++){
                    let cdseq = filteredList[i].CompareDaySeq;
                    let checkDate = new Date(filteredList[i].ReportDate);
                    let today = new Date();
                    if (today < checkDate)
                        break;//so checkdate in else of prior iteration will be last accepted
                    else
                        useCompareDaySeq = cdseq;
                } 
        }
        return useCompareDaySeq;//because GUI using it as a string
    }

    static isEmpty(obj) {
        for(let prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }
    static PreShapeData(gradeLevels, reportDateIDasInteger, enrollments){
        let indexOfEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(reportDateIDasInteger);
        let enrollment = enrollments[indexOfEnrollment];
        Utilities.ShapeData(gradeLevels, enrollment);
    }
    static ShapeData(gradeLevels, enrollment) {
        let returnArray = [];
        
        //calendarID is a unique identifier of enrollment rows for a given school in a given year
        let currentEnrollment = enrollment;
        let campusEnrollmentID = currentEnrollment.CampusEnrollmentID;
        let j = 0;
    
        let shortEnrollments = [];
    
    
        for (let i = 0; i < gradeLevels.length; i++) {
            let theGL = 'I' + gradeLevels[i].gradeLevel;
            let newEnrollment = {};
            newEnrollment.key = j++;
            newEnrollment.gradeLevel = theGL + '_' + currentEnrollment[theGL].toString();
            newEnrollment.campusEnrollmentID = campusEnrollmentID;
            newEnrollment.value = currentEnrollment[theGL];
            newEnrollment.valid = false;
            newEnrollment.touched = false;
            newEnrollment.createdBy = currentEnrollment.CreatedBy;
            newEnrollment.createdDate = currentEnrollment.CreatedDate;
            newEnrollment.updatedBy = currentEnrollment.UpdatedBy;
            newEnrollment.updatedDate = currentEnrollment.UpdatedDate;
    
    
            shortEnrollments.push(newEnrollment);
        }
    
        return shortEnrollments;
    }
}

export default Utilities;
