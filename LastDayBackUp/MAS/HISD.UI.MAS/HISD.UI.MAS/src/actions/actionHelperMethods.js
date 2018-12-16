import SharedApi from '../api/sharedApi';

class actionHelperMethods {
    static getMentorName(employees) {
        return new Promise((resolve, reject) => {
            employees.value.map(employee => {
                employee.MentorFirstName = "";
                employee.MentorLastSurname = "";
                employee.MentorMiddleName = "";
                employee.MentorElectronicMailAddress = "";
                employee.MentorJobCodeDescription = "";
                employee.MentorLatestHireDate = "";
                employee.MentorName = "";
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
                        QueryStaffID = QueryStaffID + "StaffNaturalKey  eq '" + employee.MentorEmployeeID + "' or ";

                    }
                    else {
                        QueryStaffID = QueryStaffID + "StaffNaturalKey  eq '" + employee.MentorEmployeeID + "' or ";

                    }
                });
                QueryArrayStaffID.push(QueryStaffID);

                if (QueryArrayStaffID.length > 0) {
                    let NewArrayStaffNAme = QueryArrayStaffID.map((val, i, arr) => {
                        let StaffNamePromise = SharedApi.getStaffFromStaffNaturalKey(QueryArrayStaffID[i].slice(0, -4));
                        return StaffNamePromise.then(StaffNameRes => {
                            StaffNameRes.value.map(staff => {
                                employees.value.map(employee => {
                                    if (employee.MentorEmployeeID == staff.StaffNaturalKey) {
                                        employee.MentorFirstName = staff.FirstName;
                                        employee.MentorLastSurname = staff.LastSurname;
                                        employee.MentorMiddleName = staff.MiddleName;
                                        employee.MentorElectronicMailAddress = staff.StaffElectronicEmail.ElectronicMailAddress;
                                        employee.MentorJobCodeDescription = staff.JobCode.JobCodeDescription;
                                        employee.MentorLatestHireDate = staff.LatestHireDate;
                                        employee.MentorName = staff.FirstName + ' ' + staff.LastSurname;
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

    static getMenteeName(employees) {
        return new Promise((resolve, reject) => {
            employees.value.map(employee => {
                employee.MenteeFirstName = "";
                employee.MenteeLastSurname = "";
                employee.MenteeMiddleName = "";
                employee.MenteeLatestHireDate = "";
                employee.MenteeElectronicMailAddress = "";
                employee.MenteeJobCodeDescription = "";
                employee.FullName = "";
                employee.MenteeFullName = "";
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
                        QueryStaffID = QueryStaffID + "StaffNaturalKey  eq '" + employee.MenteeEmployeeID + "' or ";

                    }
                    else {
                        QueryStaffID = QueryStaffID + "StaffNaturalKey  eq '" + employee.MenteeEmployeeID + "' or ";

                    }
                });
                QueryArrayStaffID.push(QueryStaffID);

                if (QueryArrayStaffID.length > 0) {
                    let NewArrayStaffNAme = QueryArrayStaffID.map((val, i, arr) => {
                        let StaffNamePromise = SharedApi.getStaffFromStaffNaturalKey(QueryArrayStaffID[i].slice(0, -4));
                        return StaffNamePromise.then(StaffNameRes => {
                            StaffNameRes.value.map(staff => {
                                employees.value.map(employee => {
                                    if (employee.MenteeEmployeeID == staff.StaffNaturalKey) {

                                        employee.MenteeFirstName = staff.FirstName;
                                        employee.MenteeLastSurname = staff.LastSurname;
                                        employee.MenteeMiddleName = staff.MiddleName;
                                        employee.MenteeLatestHireDate = staff.LatestHireDate;
                                        employee.MenteeElectronicMailAddress = staff.StaffElectronicEmail.ElectronicMailAddress;
                                        employee.MenteeJobCodeDescription =  staff.JobCode.JobCodeDescription;
                                        employee.FullName = staff.LastSurname +","+ staff.FirstName;
                                        employee.MenteeFullName = staff.FirstName +' '+ staff.LastSurname;
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

export default actionHelperMethods;