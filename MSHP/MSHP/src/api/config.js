let Config = {};

Config.SITE_COLLECTION = process.env.SITE_COLLECTION;
Config.REST_URL = process.env.REST_URL;
Config.SHOW_LOGIN = true;
Config.EARLIEST_YEAR = '2011-2012';//Likely will change
let headers = { 
    'Content-Type': 'application/json', 
   
   
    'Access-Control-Request-Headers': '*',
    'Access-Control-Request-Method': '*' 
};
Config.HEADERS = headers;
// 'Access-Control-Allow-Origin': 'http://localhost:3000',
export default Config;