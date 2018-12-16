import Config from './config';

class CandidateSearchCOApi {

    static loadCandidatesByEmpID(employeeID) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=EmployeeNumber eq '" + employeeID + "'  and StaffActiveIndicator eq true and SalaryPlanTypeNaturalKey ne 'CON' &$expand=EducationOrganization ";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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

    static loadCandidatesByEmpName(employeeName) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=((FirstName eq '" + employeeName + "' or LastSurname eq  '" + employeeName + "'  or MiddleName eq '" + employeeName + "')  and StaffActiveIndicator eq true and SalaryPlanTypeNaturalKey ne 'CON')&$expand=EducationOrganization";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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
    static loadCandidatesByDepartmentID(departmentID) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('" + departmentID + "')?$select=EducationOrgNaturalKey,OrgGrpNaturalKey,NameOfInstitution&$expand=Staffs($select=StaffNaturalKey,LoginId,ERPEmployeeNumber,JobFamilyNaturalKey,FirstName,LastSurname,MiddleName,SalaryPlanTypeNaturalKey,EmployeeNumber;$filter=SalaryPlanTypeNaturalKey ne 'CON')";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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
}

export default CandidateSearchCOApi;