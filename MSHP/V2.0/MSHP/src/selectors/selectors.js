import Utilities from '../utilities/utilities';
export function teacherFormattedForDropdown(teachers) {
  if(Array.isArray(teachers)){
    return (teachers.map(teacher => {
      return {
        key: teacher.StaffNaturalKey,
        text: teacher.LastSurname + ', ' + teacher.FirstName 
      };
    }));
  }
  else{
    return [];
  }
}

export function campusesFormattedForDropdown(campuses, campusID, campusName) {
  if(Array.isArray(campuses)){
    let newCampuses = [];
    let found = false;
    (campuses.map(campus => {
      if(campus.EducationOrgNaturalKey == campusID) found = true;
      let newCampus = { key: campus.EducationOrgNaturalKey, text: campus.NameOfInstitution };
      newCampuses.push(newCampus);
    }));
    if(!found)
      newCampuses.push({ key: campusID, text: campusName });
    // newCampuses.sort(
    //   function(a, b){
    //     let nameA=a.text.toLowerCase();
    //     let nameB=b.text.toLowerCase();
    //     if (nameA < nameB) //sort string ascending
    //       return -1;
    //     if (nameA > nameB)
    //       return 1;
    //     return 0; //default return value (no sorting)
    // });
    
    return removeDuplicates(newCampuses, 'key');
  }
  else{
    return [];
  }
}

export function genericFormattedForDropdown(values) {
  if(Array.isArray(values)){
    return (values.map(value => {
      return {
        key: value,
        text: value
      };
    }));
  }
  else{
    return [];
  }
}

export function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

export function calendarReportDatesFormattedForDropdown(reportDates) {
  if(Array.isArray(reportDates)){
    let codes = reportDates.map(reportDate => {
        return {
          key: reportDate.Id.toString(),
          text: Utilities.getDateOnly(reportDate.ReportDate)
        };
      
    });
    return codes;
  }
  else{
    return [];
  }
}

export function enrollmentsMaxCalendarID(enrollments) {
  if(Array.isArray(enrollments)){
    let priorCalendarID = 0;
    let currentCalendarID = 0;
    for(let i=0;i < enrollments.length;i++){
      currentCalendarID = enrollments[i].CalendarID;
        if(currentCalendarID > priorCalendarID){
          priorCalendarID = currentCalendarID;
        }
    }
    return priorCalendarID;
  }
  else{
    return 0;
  }
}

export function reportDateYearsFormattedForDropdown(reportDates) {
  let years = [];
  let priorSY = '0';
  if(Array.isArray(reportDates)){
    let codes = reportDates.map(reportDate => {
    
  if(reportDate.SchoolYear !==  priorSY){
    priorSY = reportDate.SchoolYear;
    let small = {calendarID: priorSY, year: priorSY};//no particular need for cal ID but might as well
    years.push(small);
    
  }
    
  });
    //return codes;
  
  let outputYears = years.map(yr => {
  return {
        key: yr.calendarID,
        text: yr.year
      };
  });
  
  return outputYears;
  
  }else{
    return [];
  }
  }

  export function currentYearKey(){
    let result = 0;
    let  validDate = new Date(Date());
          let yyyy = validDate.getFullYear();
          let mm = (validDate.getMonth() + 1);
          if(mm < 8){
            result =  yyyy;
          } else {
              result =  yyyy + 1;
          
          }
          return result - 2000;//to match yearsFormattedForDropdown key
          //18 points to 2018
  }

  export function campusesFormattedForDropdownGeneric(campuses) {
    if(Array.isArray(campuses)){
      let newCampuses = [];
      
      (campuses.map(campus => {
       
        let newCampus = { key: campus.EducationOrgNaturalKey, text: campus.NameOfInstitution };
        newCampuses.push(newCampus);
      }));
      newCampuses.sort(
        function(a, b){
          let nameA=a.text.toLowerCase();
          let nameB=b.text.toLowerCase();
          if (nameA < nameB) //sort string ascending
            return -1;
          if (nameA > nameB)
            return 1;
          return 0; //default return value (no sorting)
      });
         return removeDuplicates(newCampuses, 'key');
    }
    else{
      return [];
    }
  }