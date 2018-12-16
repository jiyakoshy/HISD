let Config = {};

Config.SITE_COLLECTION = process.env.SITE_COLLECTION;
Config.REST_URL = process.env.REST_URL;
Config.SHOW_LOGIN = true;
let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'Access-Control-Request-Method': '*'
};
Config.HEADERS = headers;
Config.SERVICESTART = 'mas'; 
Config.EmailLibrary = 'https://connectapps.houstonisd.org/Shared%20Documents/Forms/AllItems.aspx';
Config.MentorAcceptanceTask = 'https://connectapps.houstonisd.org/_layouts/15/NintexWorkflow/ApproveReject.aspx?List=093acd82-3b51-47dd-889a-555c29e8813a&ID=';
Config.SiteURL = 'https://connectapps.houstonisd.org';
Config.PDFLibrary = '/Shared%20Documents/';
Config.CICEmailForTest ='JDINGAYA@houstonisd.org';
Config.ShowCICEmailCustomValue = false;

Config.CICEMailBody = '<p>Congratulations! You have been selected by your principal to serve as the' +
    'Campus Induction Coordinator (CIC) this school year. CICs are responsible for facilitating a  ' +
    'professional learning community of beginning teachers and mentors to accelerate the ' +
    'new teachers’ professional growth. In addition, your role is to monitor expectations and ensure that ' +
    'all stakeholders charged with the support of the beginning teachers are ' +
    'meeting program requirements (i.e., OneSource Online Courses ' +
    'and Forums, Tasks, CALs, MAS Logs, etc.). </p>' +

    '<p>Your first order of business is to assist your principal in completing mentor ' +
    'assignments. Remember, only beginning teachers with zero years of experience or ACP interns are ' +
    'assigned mentors and added on the Mentor Activity System (MAS). A new teacher with previous ' +
    'teaching experience is paired with a teaching buddy, not a mentor; their relationship ' +
    ' is not added on MAS. </p>' +

    '<p>To access MAS, log in to the HISD Employee Portal, find the Applications Link, and click ' +
    'on MAS. You may then click on Mentor-Mentee Relationships to add the mentoring pairs. Once this ' +
    'is done, remind your mentors to accept their Mentor Agreement. </p>' +

    '<p>You are also responsible for updating mentor pairs in cases where a relationship needs to be ' +
    'deleted or added. New teachers hired in the middle of the year must also be entered on ' +
    ' MAS. Their induction support should last for a whole year. Communicate any added pairs to  ' +
    'the Mentor Program Office by emailing Mentors@houstonisd.org. </p>' +

    '<p>This is an automated message. Do not reply to it. If you have any specific queries ' +
    'regarding HISD’s Mentor Program, please email Janice Dingayan at jdingaya@houstonisd.org. </p>'


Config.Headers = {
    'AppID': 'MAS'
};

export default Config;