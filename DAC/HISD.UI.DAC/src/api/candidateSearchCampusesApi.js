import Config from './config';

class CandidateSearchCampusesApi {

    static loadCandidatesByEmpID(departmentID, employeeID) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('" + departmentID + "')?$expand=Staffs($filter=EmployeeNumber eq '" + employeeID + "') ";
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
    static loadCandidatesByEmpName(departmentID, employeeName) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('" + departmentID + "')?$expand=Staffs($filter=(FirstName eq '" + employeeName + "' or LastSurname eq '" + employeeName + "' or MiddleName eq '" + employeeName + "' ) ) ";
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

    static loadStaffArrayBeforeFilter(SearchResults, departmentID) {
        let staffArrayBeforeFilter = [];
        SearchResults.Staffs.map(res => {
            if (res.MiddleName == "") {
                staffArrayBeforeFilter.push(
                    {
                        "EmployeeNumber": res.EmployeeNumber,
                        "FirstName": res.FirstName,
                        "LastSurname": res.LastSurname,
                        "MiddleName": res.MiddleName,
                        "FullName": res.LastSurname + "," + res.FirstName,
                        "JobCodeNaturalKey": res.JobCodeNaturalKey,
                        "JobFamilyNaturalKey": res.JobFamilyNaturalKey,
                        "SalaryPlanTypeNaturalKey": res.SalaryPlanTypeNaturalKey,
                        "StaffActiveIndicator": res.StaffActiveIndicator,
                        "JobFunctionNaturalKey": res.JobFunctionNaturalKey,
                        "EducationOrgNaturalKey": departmentID,
                        "NameOfInstitution": SearchResults.NameOfInstitution,
                        "OrgGrpNaturalKey": SearchResults.OrgGrpNaturalKey,
                        "Eligible": false,
                        "CandidateType": "",
                        "Location": ""
                    }
                );
            }
            else {
                staffArrayBeforeFilter.push(
                    {
                        "EmployeeNumber": res.EmployeeNumber,
                        "FirstName": res.FirstName,
                        "LastSurname": res.LastSurname,
                        "MiddleName": res.MiddleName,
                        "FullName": res.LastSurname + "," + res.FirstName + "," + res.MiddleName,
                        "JobCodeNaturalKey": res.JobCodeNaturalKey,
                        "JobFamilyNaturalKey": res.JobFamilyNaturalKey,
                        "SalaryPlanTypeNaturalKey": res.SalaryPlanTypeNaturalKey,
                        "StaffActiveIndicator": res.StaffActiveIndicator,
                        "JobFunctionNaturalKey": res.JobFunctionNaturalKey,
                        "EducationOrgNaturalKey": departmentID,
                        "NameOfInstitution": SearchResults.NameOfInstitution,
                        "OrgGrpNaturalKey": SearchResults.OrgGrpNaturalKey,
                        "Eligible": false,
                        "CandidateType": "",
                        "Location": ""
                    }
                );
            }
        });
        return staffArrayBeforeFilter;
    }

}

export default CandidateSearchCampusesApi;