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

export default Config;