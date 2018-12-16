let Config = {};

//Config.SITE_COLLECTION = process.env.SITE_COLLECTION;
//Config.REST_URL = process.env.REST_URL;

Config.SITE_COLLECTION = window._spPageContextInfo.SITE_COLLECTION;
Config.REST_URL = window._spPageContextInfo.REST_URL;
Config.SERVICESTART = window._spPageContextInfo.SERVICESTART;
Config.SHOW_LOGIN = window._spPageContextInfo.SHOW_LOGIN;
Config.EMAIL_IDS = window._spPageContextInfo.EMAIL_IDS;

let headers = { 
    'Content-Type': 'application/json', 
    'Access-Control-Request-Headers': '*',
    'Access-Control-Request-Method': '*' 
};
Config.HEADERS = headers;

export default Config;