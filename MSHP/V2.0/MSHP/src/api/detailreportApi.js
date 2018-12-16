import Config from './config';

class detailreportApi {
    static getDetailLevelAllReport(SchoolYear, CompareDaySeq) {
        let serviceUrl = Config.REST_URL + "MSHP/odata/GetDetailLevelAllReport(SchoolYear='"+ SchoolYear +"',CompareDaySeq="+ CompareDaySeq +")";
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

    static getDetailLevelOrganizationGroupIdReport(SchoolYear, CompareDaySeq, OrganizationGroupId) {
        let serviceUrl = Config.REST_URL + "MSHP/odata/GetDetailLevelOrganizationGroupIdReport(SchoolYear='"+ SchoolYear +"',CompareDaySeq="+ CompareDaySeq +",OrganizationGroupId="+ OrganizationGroupId +")";
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

    static getDetailLevelCampusNumberReport(SchoolYear, CompareDaySeq, campusNumber) {
        let serviceUrl = Config.REST_URL + "MSHP/odata/GetDetailLevelCampusNumberReport(SchoolYear='"+ SchoolYear +"',CompareDaySeq="+ CompareDaySeq +",campusNumber="+ campusNumber +")";
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

export default detailreportApi;
