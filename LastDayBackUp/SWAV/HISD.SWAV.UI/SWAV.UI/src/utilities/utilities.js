import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
//import { STATUS_DEFINATION } from '../constants/constant';
import _ from 'lodash';
import moment from 'moment';
import { runInThisContext } from 'vm';
import { REPORT_DROPDOWN_LIST, STATUS_DEFINATION } from '../constants/constant';
import Config from '../api/config';

class Utilities {
    static inspectObject(obj) {
        let str = ""; //variable which will hold property values
        for (let prop in obj) {
            str += prop + " value : " + obj[prop] + "\n"; //Concate prop and its value from object
        }
        alert(str); //Show all properties and its value
    }

    static getDateOnly(theDate) {
        if (theDate === undefined || theDate === '') return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate) return '';
        let validDate = new Date(theDate);
        let yyyy = validDate.getFullYear().toString();
        let mm = (validDate.getMonth() + 1).toString(); // getMonth() is zero-based
        let dd = validDate.getDate().toString();
        return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy; // padding
    }

    static getDateTime(theDate) {
        if (theDate === undefined || theDate === '') return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate)
            return '';
        else
            return moment(theDate);//theDate.toLocaleString();
    }

    static convertToDate(theDate) {
        if (theDate === undefined || theDate == '')
            return '';
        else
            return new Date(parseInt(theDate.substr(6)));
    }

    static convertToJSDate(theDate) {
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return undefined;
        else
            return "\/Date(" + theDate.getTime() + ")\/";
    }

    static convertToSQLDate(theDate) {
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return "";
        const sqlDate = theDate.getUTCFullYear() + '-' +
            ('00' + (theDate.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + theDate.getUTCDate()).slice(-2);

        return sqlDate;
    }

    static getODataDate(theDate) {
        if (theDate === undefined || theDate == '' || !(theDate instanceof Date))
            return "";
        const oDataDate = theDate.getUTCFullYear() + '-' +
            ('00' + (theDate.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + theDate.getUTCDate()).slice(-2) + "T05:00.000Z";

        return oDataDate;
    }

    static getMonthName(monthNumber) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (monthNumber >= 1 && monthNumber <= 12)
            return months[monthNumber - 1];
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
    static getStatus(statusId) {
        return STATUS_DEFINATION[statusId];
    }

    static arrayFlattener(myArray) {
        let flatArray = [];
        if (myArray && myArray.length > 0) {
            for (let i = 0; i < myArray.length; i++) {
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

    static getBooleanFromText(value) {
        if (typeof value != 'string')
            return false;
        value = value.toLowerCase();
        if (value === 'yes' || value === 'active' || value === 'true')
            return true;
        else
            return false;
    }

    static getTextFromBoolean(value, type) {
        if (typeof value != 'boolean') {
            if (type == 'YN')
                return 'No';
            else if (type == 'TF')
                return 'false';
            else if (type == 'AI')
                return 'Inactive';
        }
        if (type == 'YN') {
            if (value == true)
                return 'Yes';
            else
                return 'No';
        }
        else if (type == 'TF') {
            if (value == true)
                return 'true';
            else
                return 'false';
        }
        else if (type == 'AI') {
            if (value == true)
                return 'Active';
            else
                return 'Inactive';
        }
        return '';
    }

    static filteredArray(arr, key, id) {
        return arr.find(item => item[key] === id);
    }

    static getCurrentYear(startYear, endYear) {
        return startYear + "/" + endYear;
    }

    static getServiceUrl(type, schoolYear) {
        return "http://localhost:53830/odata/SchoolNotStartedStatusWaivers('" + schoolYear + "')?$filter=('" + type + "' eq true and WaiverTypeID eq 1 and Deleted eq false)";
    }

    static campusTypeUrl(type, schoolYear) {
        let endpoint = '';
        switch (type) {
            case "HS":
                endpoint = this.getServiceUrl("High", schoolYear);
                break;
            case "MS":
                endpoint = this.getServiceUrl("Middle", schoolYear);
                break;
            case "ES":
                endpoint = this.getServiceUrl("Elementary", schoolYear);
                break;
            default:

        }
        return endpoint;
    }
    //Patch Selected School Waiver
    static getPatchPayload(obj, campusDetails) {
        const { campusNumber, startYear, endYear } = campusDetails;
        const payload = {
            SchoolWaiverID: obj.SchoolWaiverID || '',
            CampusNumber: campusNumber || '',
            WaiverID: obj.WaiverID || '',
            Elementary: obj.Elementary,
            Middle: obj.Middle,
            High: obj.High,
            WaiverStatusID: obj.WaiverStatusID || '',
            CustomApprovalStatus: obj.CustomApprovalStatus || '',
            SchoolStartYear: startYear || '',
            SchoolEndYear: endYear || '',
            SchoolWaiverDeleted: true,
            CreatedDate: obj.CreatedDate
        };

        return payload;
    }
    //Add Selected Waiver to the School
    static getPostPayload(obj, campusDetails) {
        const { campusNumber, startYear, endYear, status } = campusDetails;
        const statusId = status === "Submitted" ? '3' : '2';
        const payload = {
            CampusNumber: campusNumber || '',
            WaiverID: obj.WaiverID || '',
            Elementary: obj.Elementary,
            Middle: obj.Middle,
            High: obj.High,
            WaiverStatusID: statusId,
            CustomApprovalStatus: '1',  //true,
            SchoolWaiverDeleted: false,
            SchoolStartYear: startYear || '',
            SchoolEndYear: endYear || ''
        };
        return payload;
    }

    static updatePostPayload(waiversCheckList, waiversPayload, campusDetails) {
        const { campusNumber, startYear, endYear, status } = campusDetails;
        const postPayload = {
            SchoolWaivers: []
        };
        if (!_.isEmpty(waiversCheckList)) {
            for (let item in waiversCheckList) {
                const getWholePayload = this.filteredArray(waiversPayload, 'WaiverID', waiversCheckList[item]);
                const payload = this.getPostPayload(getWholePayload, { campusNumber, startYear, endYear,status });
                postPayload.SchoolWaivers.push(payload);
            }
        }

        return postPayload;
    }

    static updatePostPayloadTemp(waiversCheckList, waiversPayload, campusDetails) {
        const { campusNumber, startYear, endYear, status } = campusDetails;
        let postArray = [];

        if (!_.isEmpty(waiversCheckList)) {
            for (let item in waiversCheckList) {
                const getWholePayload = this.filteredArray(waiversPayload, 'WaiverID', waiversCheckList[item]);
                const payload = this.getPostPayload(getWholePayload, { campusNumber, startYear, endYear, status });
                postArray.push(payload);
            }
        }

        return postArray;
    }




    static updatePatchPayload(waiversCheckList, waiversPayload, campusDetails) {
        const { campusNumber, startYear, endYear } = campusDetails;
        let patchArray = [];
        if (!_.isEmpty(waiversCheckList)) {
            for (let item in waiversCheckList) {
                const getWholePayload = this.filteredArray(waiversPayload, 'WaiverID', waiversCheckList[item]);
                const payload = this.getPatchPayload(getWholePayload, { campusNumber, startYear, endYear });
                patchArray.push(payload);
            }
        }

        return patchArray;
    }

    static postPatchPayload(postCheckList, patchCheckList, waiversPayload, campusDetails) {
        const { campusNumber, startYear, endYear, status } = campusDetails;
        const payload = {
            SchoolWaivers: []
        };
        let postBody = [];
        let patchBody = [];
        if (!_.isEmpty(postCheckList)) {
            postBody = this.updatePostPayloadTemp(postCheckList, waiversPayload, campusDetails);
        }
        if (!_.isEmpty(patchCheckList)) {
            patchBody = this.updatePatchPayload(patchCheckList, waiversPayload, campusDetails);
        }
        const finalPayload = postBody.concat(patchBody);
        payload.SchoolWaivers = finalPayload;

        return payload;
    }

    static getTimeOnly(time) {
        return moment().set({
            hour: moment.duration(time).hours(),
            minute: moment.duration(time).minutes(),
            second: moment.duration(time).seconds()
        });
    }

    static getTime(theDate) {
        if (theDate === undefined || theDate === '') return '';
        let oldDate = Date.parse('01/02/1900');
        if (theDate === undefined || theDate == '' || theDate < oldDate) return '';
        let validDate = new Date(theDate);
        let hours = validDate.getHours();
        let minutes = validDate.getMinutes();
        let seconds = validDate.getSeconds();
        // let ampm = hours >= 12 ? 'pm' : 'am';
        //hours = hours % 12;
        //hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        let strTime = hours + ':' + minutes + ':' + seconds;
        return strTime;
    }

    static timePayload(time) {
        //PT15H35M30S
        if (time) {
            const splitTime = time.split(':');
            return 'PT' + splitTime[0] + 'H' + splitTime[1] + 'M' + splitTime[2] + 'S';
        }
        return '';

    }

    static momentTimePayload(time){
        return time.hour() + ':' + time.minutes() + ':' + time.seconds();
    }
    //Post Application Administration:- Enrollment Dates
    static getSettingsPayload(startDate, endDate, enrollmentStTime, enrollmentEdTime, startYear, endYear) {
        const updateStartDate = startDate && moment(this.getDateOnly(startDate)).format('YYYY-MM-DD');
        const updateEndDate = endDate && moment(this.getDateOnly(endDate)).format('YYYY-MM-DD');
        const updatedStartTime = this.timePayload(this.getTime(enrollmentStTime));
        const updatedEndTime = this.timePayload(this.getTime(enrollmentEdTime));

        return {
            SchoolStartYear: startYear,
            SchoolEndYear: endYear,
            EnrollmentStartDate: updateStartDate || '',
            EnrollmentEndDate: updateEndDate || '',
            EnrollmentStartTime: updatedStartTime,
            EnrollmentEndTime: updatedEndTime
        };
    }
    //Patch Application Administration after copy waiver function
    static copyWaiversSettingsPayload(startYear, endYear) {
        return {
            SchoolStartYear: startYear,
            SchoolEndYear: endYear,
            SchoolWaiverCopyStatus: true
        };
    }
    //Copy general waivers from previous school year
    static postCopyWaiversPayload(waiversList, startYear, endYear) {
        const payload = {
            GeneralWaivers: []
        };
        if (!_.isEmpty(waiversList)) {
            waiversList.map(item => {
                let tempObj1 = {};
                let tempObj2 = {};
                tempObj1.WaiverAdministrations = [];
                tempObj1.WaiverName = item.WaiverName;
                tempObj1.WaiverDescription = item.WaiverDescription;
                tempObj1.WaiverTypeID = item.WaiverTypeID;
                tempObj1.WaiverRequestDetailStatus = item.WaiverRequestDetailStatus;
                tempObj1.UpdatedDate = moment().format();
                tempObj2.Elementary = item.Elementary;
                tempObj2.Middle = item.Middle;
                tempObj2.High = item.High;
                tempObj2.SchoolStartYear = startYear;
                tempObj2.SchoolEndYear = endYear;
                tempObj2.Deleted = item.Deleted;
                tempObj2.ReportTypeID = item.ReportTypeID;
                tempObj2.CreatedDate = moment().format();
                tempObj2.UpdatedDate = moment().format();
                tempObj1.WaiverAdministrations.push(tempObj2);
                payload.GeneralWaivers.push(tempObj1);
            });
        }

        return payload;
    }
    

    static checkWaiversEditPermission(startDate, endDate, enrollmentStartTime, enrollmentEndTime,userRole){
        let disabled = false;
        if(userRole === "Principal" || userRole === "SC"){
           const enrollmentStTime = this.momentTimePayload(this.getTimeOnly(enrollmentStartTime));
           const enrollmentEdTime = this.momentTimePayload(this.getTimeOnly(enrollmentEndTime));
           const updatedStartDateTime  = startDate+" "+enrollmentStTime;
           const updatedEndDateTime  = endDate+" "+enrollmentEdTime;
           const getCurrentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
           if(getCurrentDateTime >= updatedStartDateTime && getCurrentDateTime <= updatedEndDateTime){
               disabled = false;
               return disabled;
           }
           disabled = true;
        }
        return disabled;
    }
    //Add General Waiver........
    static addGeneralWaiverPayload(data, startYear, endYear){
        const { waiverTitle, waiverDescription ,elementaryChecked, middleChecked, highChecked, waiverRDSChecked, reportType} = data;
        const payload = {
            WaiverName : waiverTitle || '',
            WaiverDescription : waiverDescription || '',
            WaiverTypeID : '1',
            WaiverRequestDetailStatus : waiverRDSChecked,
            WaiverAdministrations : [{
                Elementary : elementaryChecked,
                Middle : middleChecked,
                High : highChecked,
                SchoolStartYear : startYear,
                SchoolEndYear : endYear,
                Deleted : false,
                ReportTypeID : reportType,
                CreatedDate : moment().format(),
                UpdatedDate : moment().format()
            }]
        };
        return payload;
    }

    //Update General Waiver........
    static updateGeneralWaiverPayload(data, startYear, endYear){
        const { wavierId, wavierAdminId, waiverTitle, waiverDescription ,elementaryChecked, middleChecked, highChecked, reportType, createdDate, waiverCreatedDate, waiverRDSChecked} = data;
        const payload = {
            WaiverID : wavierId,
            WaiverName : waiverTitle || '',
            WaiverDescription : waiverDescription || '',
            WaiverTypeID : '1',
            WaiverRequestDetailStatus : waiverRDSChecked,
            CreatedDate : waiverCreatedDate,
            UpdatedDate : moment().format(),
            WaiverAdministrations : [{
                WaiverID : wavierId,
                WaiverAdministrationID : wavierAdminId,
                Elementary : elementaryChecked,
                Middle : middleChecked,
                High : highChecked,
                SchoolStartYear : startYear,
                SchoolEndYear : endYear,
                Deleted : false,
                ReportTypeID : reportType,
                CreatedDate : createdDate,
                UpdatedDate: moment().format()
            }]
        };
        return payload;
    }
    
    static updateCustomWaiverPayload(data, startYear, endYear){
        const { wavierId,waiverAdministrationID, wavierAdminId, waiverTitle, waiverDescription ,elementaryChecked, middleChecked, highChecked, reportType, WaiverAdminCreatedDate, WaiverCreatedDate} = data;
        const payload = {
            WaiverID : wavierId,
            WaiverName : waiverTitle || '',
            WaiverDescription : waiverDescription || '',
            WaiverTypeID : '2',
            CreatedDate : WaiverCreatedDate,
            UpdatedDate : moment().format(),
            WaiverAdministrations : [{
                WaiverID : wavierId,
                WaiverAdministrationID : waiverAdministrationID,
                Elementary : elementaryChecked,
                Middle : middleChecked,
                High : highChecked,
                SchoolStartYear : startYear,
                SchoolEndYear : endYear,
                Deleted : false,
                ReportTypeID : reportType,
                CreatedDate : WaiverAdminCreatedDate,
                UpdatedDate: moment().format()
            }]
        };
        return payload;
    }

    static customWaiverPayload(data, campusDetails){
        const { waiverTitle, waiverDescription, reportType} = data;
        const { startYear, endYear, schoolType, campusNumber, status } = campusDetails;
        const statusId = status === "Submitted" ? '3' : '2';
        const payload = {
            WaiverName : waiverTitle || '',
            WaiverDescription : waiverDescription || '',
            WaiverTypeID : '2',
            WaiverAdministrations : [{
                Elementary : schoolType === 'ES',
                Middle :  schoolType === 'MS',
                High :  schoolType === 'HS',
                SchoolStartYear : startYear,
                SchoolEndYear : endYear,
                Deleted : false,
                ReportTypeID : reportType,
                CreatedDate :  moment().format(),
                UpdatedDate: moment().format()
            }],
            SchoolWaivers : [{
                CampusNumber : campusNumber,
                Elementary : schoolType === 'ES',
                Middle :  schoolType === 'MS',
                High :  schoolType === 'HS',
                SchoolStartYear : startYear,
                SchoolEndYear : endYear,
                WaiverStatusID : statusId,
                CustomApprovalStatus : '0',//false,
                SchoolWaiverDeleted : false,
                CreatedDate :  moment().format(),
                UpdatedDate: moment().format()
            }]
        };
        return payload;
    }

    static updateSchoolCustomWaiverPayload(data){
        const { waiverTitle, waiverDescription} = data;
        const payload = {
            WaiverName: waiverTitle || '',
            WaiverDescription : waiverDescription || ''
        };
        return payload;
    }

    static sendEmailTemplate(data, comment, loginId){
        const { WaiverName, WaiverDescription } = data;
        return {
            to: Config.EMAIL_IDS, //This is for only testing....
            //to : loginId+'@houstonisd.org',   //This is for Production.....
            subject: 'The Custom Waiver has been Rejected.',
            body: 'Waiver Name: '+ WaiverName + '<br> Waiver Description: ' + WaiverDescription + '<br> Comments:' + comment 
        };
    }
    static sendApprovalEmailTemplate(data, loginId){
        const { WaiverName, WaiverDescription } = data;
        return {
            to: Config.EMAIL_IDS, //This is for only testing....
            //to : loginId+'@houstonisd.org',   //This is for Production.....
            subject: 'The Custom Waiver has been Approved.',
            body: 'Waiver Name: '+ WaiverName + '<br> Waiver Description: ' + WaiverDescription 
        };
    }

    static submitWaiverRequestPayload(data){
        const payload = {
            WaiverRequestDetails : []
        };
        const { WaiverRequestDetails } = payload;
        data.map((item,index) => {
            const tempObj = {};
            tempObj.SourceOfData = item.sourceData;
            tempObj.EvidenceOfCompliance = item.evidence;
            tempObj.SchoolWaiverID = item.waiverID;
            WaiverRequestDetails.push(tempObj);
        });
        return payload;
    }

    static getManagersObj(data,key){
        const payload = {
            name : '',
            email : ''
        };
        if(data[key]){
            const { FirstName, LastSurname, LoginId} = data[key];
            payload.name = FirstName + " " + LastSurname;
            if(LoginId){
                payload.name = FirstName + " " + LastSurname;
                payload.email = LoginId+'@houstonisd.org';
            }else if(LoginId == undefined){
                payload.name = 'Not Assigned';
                payload.email = 'Not Assigned';
            }
        }else{
            payload.name = 'Not Assigned';
            payload.email = 'Not Assigned';
        }
        return payload;
    }

    static sendSubmittedEmailTemplate(campusName, emailID){
        return {
            to: Config.EMAIL_IDS, //This is for only testing....
            //to : emailID,   //This is for Production.....
            subject: 'The Waivers has been Submitted.',
            body: campusName+ ' has been Submitted the Waivers.' 
        };
    }

    static fetchEmailIDs(obj, key){

        if(!_.isEmpty(obj)){
            const emailList = _.map(obj , _.property(key));
            return emailList.toString();
        }
         return false;
       
    }
    
}
export default Utilities;
