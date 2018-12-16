import Config from './config';

class nonreportingschoolsApi {
    static getNonReportingCampusesReport(SchoolYear, CompareDaySeq) {
        let serviceUrl = Config.REST_URL + "MSHP/odata/GetNonReportingCampusesReport(SchoolYear='"+ SchoolYear +"',CompareDaySeq="+ CompareDaySeq +")";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
                  }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });        
    }

    static getCompareDaySeq(SchoolYear) {
        let serviceUrl = Config.REST_URL + "MSHP/odata/Calendar?$filter=SchoolYear eq '"+ SchoolYear + "'";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
                  }
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });        
    }
}

export default nonreportingschoolsApi;
