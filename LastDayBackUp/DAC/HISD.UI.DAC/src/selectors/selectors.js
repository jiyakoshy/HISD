export function teacherFormattedForDropdown(teachers) {
  if (Array.isArray(teachers)) {
    return (teachers.map(teacher => {
      return {
        key: teacher.StaffNaturalKey,
        text: teacher.LastSurname + ', ' + teacher.FirstName
      };
    }));
  }
  else {
    return [];
  }
}

export function activityCodesFormattedForDropdown(actCodes) {
  if (Array.isArray(actCodes)) {
    return (actCodes.map(actCode => {
      return {
        key: actCode.ActivityCodeID,
        text: actCode.ActivityCodeName + ' - ' + actCode.ActivityCodeDescription
      };
    }));
  }
  else {
    return [];
  }
}

export function cbmStandardsFormattedForCheckbox(cbmStandards) {
  if (Array.isArray(cbmStandards)) {
    return (cbmStandards.map(cbm => {
      return {
        key: cbm.ActivityStandardItemID,
        text: cbm.ActivityStandardItemName
      };
    }));
  }
  else {
    return [];
  }
}

export function mentoringToolsFormattedForCheckbox(mentoringTools) {
  if (Array.isArray(mentoringTools)) {
    return (mentoringTools.map(mentTool => {
      return {
        key: mentTool.ActivityToolItemID,
        text: mentTool.ActivityToolName
      };
    }));
  }
  else {
    return [];
  }
}

export function campusesFormattedForDropdown(campuses, campusID, campusName, role) {

  if (campusID == "")
    campusID = "10001094";
  if (campusName == "")
    campusName = "IT - Custom Applications";

  if (Array.isArray(campuses)) {
    let newCampuses = [];
    let found = false;
    (campuses.map(campus => {
      if (campus.EducationOrgNaturalKey == campusID)
        found = true;

      let newCampus = { key: campus.EducationOrgNaturalKey, text: campus.NameOfInstitution };
      newCampuses.push(newCampus);
    }));
    if (!found)
      newCampuses.push({ key: campusID, text: campusName });
    newCampuses.sort(
      function (a, b) {
        let nameA = a.text.toLowerCase();
        let nameB = b.text.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
      });
    if (role == "Admin")
      newCampuses.unshift({ key: "00000001", text: "Central Office" });
    return removeDuplicates(newCampuses, 'key');
  }
  else {
    return [];
  }
}
export function campusesFormattedForDropdownDAC(campuses, campusID, campusName, role, userProps) {
if (Array.isArray(campuses)) {
    let newCampuses = [];
    let found = false;
    newCampuses.push({ key: userProps.user.originalCampusID, text: userProps.user.originalCampusName });
    (campuses.map(campus => {
      let newCampus = { key: campus.EducationOrgNaturalKey, text: campus.NameOfInstitution };
      newCampuses.push(newCampus);
    }));
    
    newCampuses.sort(
      function (a, b) {
        let nameA = a.text.toLowerCase();
        let nameB = b.text.toLowerCase();
        if (nameA < nameB) 
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; 
      });
   
    return removeDuplicates(newCampuses, 'key');
  }
  else {
    return [];
  }
}

export function genericFormattedForDropdown(values) {
  if (Array.isArray(values)) {
    return (values.map(value => {
      return {
        key: value,
        text: value
      };
    }));
  }
  else {
    return [];
  }
}

export function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}