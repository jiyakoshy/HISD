import Config from './config';

class summarydetailreportApi {
    static getSummaryDetailReport(SchoolYear, CompareDaySeq) {
        let serviceUrl = Config.REST_URL + "MSHP/odata/GetSummaryReport(SchoolYear='"+ SchoolYear +"',CompareDaySeq="+ CompareDaySeq +")";
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

export default summarydetailreportApi;
