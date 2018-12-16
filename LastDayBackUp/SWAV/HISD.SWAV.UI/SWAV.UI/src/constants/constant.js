export const STATUS_DEFINATION = {
    1 : "Not Started",
    2 : "Saved",
    3 : "Submitted"
};

export const PERMISSIONS = {
    "Not Started" : {"Add" : false, "Finalize": true, "Save": false },
    "Saved" : {"Add" : false, "Finalize": true, "Save": false },
    "Submitted" : {"Add" : true, "Finalize": true, "Save": true }
};

export const WAIVERS_SAVED_STATUS = "Saved";
export const WAIVERS_SUBMITTED_CONSTANTS = "Submitted";
export const TOOL_TIP = "Open";
export const PENDING = "Approval Pending";
export const APPROVED = "Approved";
export const REJECTED = "Rejected";
export const APPLICATION_ADMINISTRATION_PAGE = 'Application Administration';
export const COPY_WAIVER_HEADING = 'Copy Waivers';
export const COPY_WAIVER_MESSAGE = 'Waivers has been copied succesfully from previous School Year.';
export const DIALOG_CREATED = 'CREATED';
export const DIALOG_UPDATED = 'UPDATED';
export const ENROLLMENT_HEADING  = 'Enrollment Dates';
export const ENROLLMENT_CREATED_MESSAGE = 'All the Enrollment Dates successfully created.';
export const ENROLLMENT_UPDATED_MESSAGE = 'The Enrollement Dates successfully Updated.';
export const REPORT_DROPDOWN_LIST = [{ value : "1", label : "State" }, { value : "2", label : "Local"}];
export const HOMEMSG_DROPDOWN_LIST = [{ value : "1", label : "Admin" }, { value : "2", label : "Principal" }, { value : "3", label : "SC" }]; //For Home Messages role dropdown....
export const MODAL_STYLES = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '50%'
    },
    overlay : {
        transition: 'opacity 50ms ease-in-out',
        backgroundColor : ''
    }
};
export const DELETE_MODAL_STYLES = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        width                 : '35%',
        height                : ''
      },
    overlay : {
        transition: 'opacity 50ms ease-in-out',
        backgroundColor : ''
    }
};
export const REJECT_MODAL_STYLES = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        width                 : '40%',
        height                : ''
      },
    overlay : {
        transition: 'opacity 50ms ease-in-out',
        backgroundColor : ''
    }
};
export const DELETE_MODAL_HEADING = 'Are you sure ?';
export const DELETE_MODAL_TEXT = 'Would you like to delete';
export const NOTIFICATION_MSG = {
    title: 'Hey, it\'s something wrong is happening!',
    message: 'I think there is an API failure',
    position: 'tr',
    autoDismiss: 0,
    action: {
      label: 'Click me!!'
    }
  };
export const REPORT_TYPE = {'1' : 'State', '2' : 'Local'};
export const APPROVE_MODAL_HEADING = 'Are you sure ?';
export const APPROVE_MODAL_TEXT = 'Would you like to approve';
export const REJECT_MODAL_TEXT = 'Would you like to reject';
export const APPROVE_BUTTON = 'Approve';  
export const FINALIZE_MODAL_TEXT = 'Custom Waiver is a new waiver or resubmitting from previous year ?';
export const SDMC_APPROVED = 'SDMC APPROVED ?';
export const FACULTY_APPROVED = 'FACULTY APPROVED ?';
export const EMAIL_VALIDATION = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
export const SUCCESS_MODAL_TEXT = "School Waivers has been submitted successfully";