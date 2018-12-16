let Config = {};

//Config.SITE_COLLECTION = process.env.SITE_COLLECTION;
//Config.REST_URL = process.env.REST_URL;

Config.SITE_COLLECTION = window._spPageContextInfo.SITE_COLLECTION;
Config.REST_URL = window._spPageContextInfo.REST_URL;
Config.SHOW_LOGIN = window._spPageContextInfo.SHOW_LOGIN;
let headers = { 
    'Content-Type': 'application/json', 
    'Access-Control-Request-Headers': '*',
    'Access-Control-Request-Method': '*' 
};
Config.HEADERS = headers;

export default Config;