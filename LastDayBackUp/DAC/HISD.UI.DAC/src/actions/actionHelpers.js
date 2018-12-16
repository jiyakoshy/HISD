import SharedApi from '../api/sharedApi';

class actionHelpers {

    static getDepartmentName(employees) {
        return new Promise((resolve, reject) => {
            employees.value.map(employee => {
                employee.NameOfInstitution = "";
                employee.EducationOrgNaturalKey = "";
            });
            let QueryDepID = '';
            let QueryArrayDepID = [];
            let employeesCount = employees.value.length;
            if (employeesCount > 0) {
                employees.value.map((employee, i, arr) => {
                    if ((i % 15) == 0) {
                        if (i != 0) {
                            QueryArrayDepID.push(QueryDepID);
                        }
                        QueryDepID = '';
                        QueryDepID = QueryDepID + "EducationOrgNaturalKey  eq '" + employee.CampusID + "' or ";

                    }
                    else {
                        QueryDepID = QueryDepID + "EducationOrgNaturalKey  eq '" + employee.CampusID + "' or ";

                    }
                });
                QueryArrayDepID.push(QueryDepID);

                if (QueryArrayDepID.length > 0) {
                    let NewArrayDepNAme = QueryArrayDepID.map((val, i, arr) => {
                        let DepNamePromise = SharedApi.getDepartmentsFromDepartmentID(QueryArrayDepID[i].slice(0, -4));
                        return DepNamePromise.then(DepNameRes => {
                            DepNameRes.value.map(staff => {
                                employees.value.map(employee => {
                                    if (employee.CampusID == staff.EducationOrgNaturalKey) {
                                        employee.NameOfInstitution = staff.NameOfInstitution;
                                        employee.EducationOrgNaturalKey = staff.EducationOrgNaturalKey;

                                    }
                                });
                            });
                        });

                    });

                    return Promise.all(NewArrayDepNAme).then(function () {
                        resolve(employees);
                    });

                }
            }
        });
    }

    static getCandidateName(employees) {
        return new Promise((resolve, reject) => {
            employees.value.map(employee => {               
                employee.CandidateName = "";
            });
            let QueryStaffID = '';
            let QueryArrayStaffID = [];
            let employeesCount = employees.value.length;
            if (employeesCount > 0) {
                employees.value.map((employee, i, arr) => {
                    if ((i % 15) == 0) {
                        if (i != 0) {
                            QueryArrayStaffID.push(QueryStaffID);
                        }
                        QueryStaffID = '';
                        QueryStaffID = QueryStaffID + "EmployeeNumber  eq '" + employee.EmployeeID + "' or ";

                    }
                    else {
                        QueryStaffID = QueryStaffID + "EmployeeNumber  eq '" + employee.EmployeeID + "' or ";

                    }
                });
                QueryArrayStaffID.push(QueryStaffID);

                if (QueryArrayStaffID.length > 0) {
                    let NewArrayStaffNAme = QueryArrayStaffID.map((val, i, arr) => {
                        let StaffNamePromise = SharedApi.getStaffFromEmployeeNumber(QueryArrayStaffID[i].slice(0, -4));
                        return StaffNamePromise.then(StaffNameRes => {
                            StaffNameRes.value.map(staff => {
                                employees.value.map(employee => {
                                    if (employee.EmployeeID == staff.EmployeeNumber) {
                                        if (staff.MiddleName == "") {
                                            employee.CandidateName = staff.LastSurname + "," + staff.FirstName;
                                        }
                                        else {
                                            employee.CandidateName = staff.LastSurname + "," + staff.FirstName + "," + staff.MiddleName;
                                        }
                                    }
                                   
                                });
                            });
                        });

                    });

                    return Promise.all(NewArrayStaffNAme).then(function () {
                        resolve(employees);
                    });

                }
            }
        });
    }

}

export default actionHelpers;