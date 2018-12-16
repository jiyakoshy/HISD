import Utilities from '../utilities/utilities';

export function teacherFormattedForDropdown(teachers) {
  if(Array.isArray(teachers)){
    let people = teachers.map(teacher => {
      return {
        key: teacher.StaffNaturalKey,
        text: teacher.FirstName + " " + teacher.LastSurname
      };
    });
    return people.sort(
      function(a, b){
        let nameA=a.text.toLowerCase();
        let nameB=b.text.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
    });
  }
  else{
    return [];
  }
}

export function teacherFormattedForDropdownLoginID(teachers) {
  if(Array.isArray(teachers)){
    let people = teachers.map(teacher => {
      return {
        key: teacher.LoginId + '|' + teacher.StaffNaturalKey,
        text: teacher.FirstName + " " + teacher.LastSurname 
      };
    });
    return people.sort(
      function(a, b){
        let nameA=a.text.toLowerCase();
        let nameB=b.text.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
    });
  }
  else{
    return [];
  }
}

export function activityCodesFormattedForDropdown(actCodes) {
  if(Array.isArray(actCodes)){
    let codes = actCodes.map(actCode => {
      return {
        key: actCode.ActivityCodeID,
        text: actCode.ActivityCodeName + ' - ' + actCode. ActivityCodeDescription
      };
    });
    return codes.sort(
      function(a, b){
        let nameA=a.text.toLowerCase();
        let nameB=b.text.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
    });
  }
  else{
    return [];
  }
}

export function verificationCodesFormattedForDropdown(verifCodes) {
  if(Array.isArray(verifCodes)){
    let codes = verifCodes.map(verifCode => {
      return {
        key: verifCode.MultiChoiceListItemID,
        text: verifCode.MultiChoiceListItemCode + ' - ' + verifCode. MultiChoiceListItemDescription
      };
    });
    return codes.sort(
      function(a, b){
        let nameA=a.text.toLowerCase();
        let nameB=b.text.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
    });
  }
  else{
    return [];
  }
}

export function cbmStandardsFormattedForCheckbox(cbmStandards) {
  if(Array.isArray(cbmStandards)){
    return (cbmStandards.map(cbm => {
      return {
        key: cbm.ActivityStandardItemID,
        text: cbm.ActivityStandardItemName
      };
    }));
  }
  else{
    return [];
  }
}

export function mentoringToolsFormattedForCheckbox(mentoringTools) {
  if(Array.isArray(mentoringTools)){
    return (mentoringTools.map(mentTool => {
      return {
        key: mentTool.ActivityToolItemID,
        text: mentTool.ActivityToolItemName
      };
    }));
  }
  else{
    return [];
  }
}

//new 7/2
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
}else{
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
  }else{
    return 0;
  
  }
  }
  

/* for MSHP only... gfm notice sort is on keys rather than on text since dates here are strings */
export function reportDatesFormattedForDropdown(reportDates) {
  if(Array.isArray(reportDates)){
    let codes = reportDates.map(reportDate => {
      return {
        key: reportDate.reportDateID,
        text: reportDate.theDate
      };
    });
    return codes.sort(
      function(a, b){
        let nameA=a.key.toLowerCase();
        let nameB=b.key.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
    });
  }
  else{
    return [];
  }
}


  export function reportDateYearsFormattedForDropdown(reportDates) {
    //EXTRACTS ONLY UNIQUE YEARS FROM > 400 calendarReportDates
    let years = [];
    let priorSY = '0';
    if(Array.isArray(reportDates)){
      let codes = reportDates.map(reportDate => {
      const yearEnd = parseInt(reportDate.SchoolYear.substring(5,9));
      const currYear = parseInt(Utilities.getSchoolYear().substring(5,9));
      const diff = currYear - yearEnd;
    if(diff < 7 && reportDate.SchoolYear !==  priorSY){
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
  
export function yearsFormattedForDropdown (key){
debugger;
  let formattedYears = Array(50).fill().map((v,i)=>i);//gets 0-49
  let outputYears = [];
  $.each(formattedYears, function (index, value) {
    
    
    let numYear = value + 2001;
    let numYearPrior = numYear -1;
    let yearAsString = numYear.toString();
    let yearPriorAsString = numYearPrior.toString();
    let newSchoolYear = yearPriorAsString + '-' + yearAsString;
    let newSYObject = {key: newSchoolYear, text: newSchoolYear};//only text is usable elsewhere
    outputYears.push(newSYObject);
    
    if(numYear >= key) return false;//to exit loop
    
  });
  return outputYears;
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