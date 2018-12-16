import Config from './config';
import Utilities from '../utilities/utilities';

class CampusApi {

    //Get All Schools
    static getAllCampuses() {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations?$filter=(OperationalStatusNaturalKey eq 'A' and EducationOrgNaturalKey ne '000' and OrgGrpNaturalKey eq 'Campus')&orderby=NameOfInstitution";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :{
                    'AppId': 'SWAV'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get Principal Details by ID for a School...
    static getCampusesByManager(managerStaffNaturalKey) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs('" + managerStaffNaturalKey + "')?$expand=SchoolManagers($expand=EducationOrganization)";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :{
                    'AppId': 'SWAV'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get School Waivers Status....
    static getAllSchools(schoolYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolStatus(SchoolStartYear="+ schoolYear +")";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get Campus Type(ES,MS,HS)
    static getCampusTypes(schoolId,schoolYear) {
        let serviceUrl = Config.REST_URL + "common/odata/CampusTypeForYear(CampusID='"+schoolId+"',YearID='"+schoolYear+"')";     
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :{
                    'AppId': 'SWAV'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get School Waivers for CUrrent School Year...
    static getSchooolStatusAPI(schoolYear,schoolId) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolStatus(SchoolStartYear="+schoolYear+")?$filter=(CampusNumber eq '"+schoolId+"')";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get Current School Year....
    static geCurrentSchoolYearAPI(year) {
        let serviceUrl = Config.REST_URL + "common/odata/SchoolYearTypes?$filter=CurrentSchoolYear eq true";       
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :{
                    'AppId': 'SWAV'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get HS General Waivers...
    static getHighSchoolDetails(schoolYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolNotStartedStatusWaivers(SchoolStartYear="+schoolYear+")?$filter=(High eq true and WaiverTypeID eq 1 and Deleted eq false)&$orderby=WaiverName asc";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get ES General Waivers...
    static getElementarySchoolDetails(schoolYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolNotStartedStatusWaivers(SchoolStartYear="+schoolYear+")?$filter=(Elementary eq true and WaiverTypeID eq 1 and Deleted eq false)&$orderby=WaiverName asc"; 
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get MS General Waivers...
    static getMiddleSchoolDetails(schoolYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolNotStartedStatusWaivers(SchoolStartYear="+schoolYear+")?$filter=(Middle eq true and WaiverTypeID eq 1 and Deleted eq false)&$orderby=WaiverName asc";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get School Waivers by Current School Year and Campus Number
    static getSavedWaiver(schoolId,schoolYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolStatusWaivers(SchoolStartYear='"+schoolYear+"')?$filter=(CampusNumber eq '"+schoolId+"' and SchoolWaiverDeleted eq false)";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    static getSavedSchoolWaivers(schoolId,schoolYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolStatusWaivers(SchoolStartYear="+schoolYear+")?$filter=(CampusNumber eq '"+schoolId+"' and SchoolWaiverDeleted eq false)";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Update School Waivers
    static updateWaiversAPI(payload) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/UpdateSchoolWaivers";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static addWaiversAPI(payload) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/AddSchoolWaivers";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static addCustomWaiverAPI(payload) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/AddCustomWaiver";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static updatedCustomWaiverAPI(payload,ID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/Waivers("+ID+")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static deleteCustomWaivers(schoolWaiverId) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/SchoolWaivers("+schoolWaiverId+")";
        const payload = {
            SchoolWaiverID : schoolWaiverId,
            SchoolWaiverDeleted : true
        };
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }
    //Waiver Request Details Form API
    static getAllWaiverRequestsAPI(schoolYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetWaiverRequestSchools(SchoolStartYear="+schoolYear+")";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }
    //Waiver Request Details Form API
    static getRequestsFormAPI(schoolYear, campusNumber) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetWaiverRequestDetail(SchoolStartYear="+schoolYear+")?$filter=CampusNumber eq '"+campusNumber+"'";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }
    //Waiver Request Details Form API
    static updateRequestFormAPI(data) {
        const { requestID, sourceData, evidence} = data;
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/WaiverRequestDetails("+requestID+")";
        const payload = {
            SourceOfData : sourceData,
            EvidenceOfCompliance : evidence
        };
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }
    //Waiver Request Details Form API
    static getAddRequestDetailsAPI(schoolYear, campusNumber) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolStatusWaivers(SchoolStartYear="+schoolYear+")?$filter=(CampusNumber eq '"+campusNumber+"' and SchoolWaiverDeleted eq false and WaiverRequestDetailStatus eq true)&$orderby=WaiverName asc";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    static submitWaiverRequestAPI(payload) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/AddWaiverRequestDetailsForm";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static getSSODetailsAPI(campusNumber) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('"+campusNumber+"')?$expand=SchoolManagers($expand=Up1Manager)&$select=SchoolManagers";       
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :{
                    'AppId': 'SWAV'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    static getSUPDetailsAPI(campusNumber) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('"+campusNumber+"')?$expand=SchoolManagers($expand=Up2Manager)&$select=SchoolManagers";       
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :{
                    'AppId': 'SWAV'
                }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Reset or Delete all School Waivers by campus id and current school year....
    static resetSchoolWaivers(startYear, campusNumber){
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/ResetSchoolWaivers(SchoolStartYear="+startYear+",CampusNumber='"+campusNumber+"')";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "DELETE",
                mode: 'cors',
                body: '',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    //Patch: Changing the Status of School from Saved to Submitted.....
    static finalizeWaiverRequestAPI(campusNumber,startYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/FinalizeSchoolWaivers(SchoolStartYear="+startYear+",CampusNumber='"+campusNumber+"')";
        const payload = {
            WaiverStatusID : 3
        };
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static getCustomWaiversAPI(campusNumber,year) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetSchoolStatusWaivers(SchoolStartYear="+year+")?$filter=(CampusNumber eq '"+campusNumber+"' and SchoolWaiverDeleted eq false and WaiverTypeID eq 2)&$orderby=WaiverName asc";       
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    //Get SWAV Admin Email Id's to send Waiver Submitted notifications....
    static getSWAVAdminLoginIDApi(){
        let serviceUrl = Config.REST_URL + "common/api/UsersForGroup?groupname=SWAV_Admin";       
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        }); 
    }

    //Post SDMC Details by Campus ID.....
    static addSDMCDetailsAPI(campusNumber, data){
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/SDMC";
        const payload = {
            CampusNumber : campusNumber,
            SDMCName : data.name,
            SDMCEmailAddress : data.email
        };
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "POST",
                mode: 'cors',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }
}
export default CampusApi;
