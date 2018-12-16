import Config from './config';
import detailreportApi from '../api/detailreportApi';
import campusApi from '../api/campusApi';
class adminApi {

    static getAnnualSetup(SchoolYear, CompareDaySeq) {
        return new Promise((resolve, reject) => {
        let summaryProps= [];
        let summary = [{ CampusNumber: '', SchoolYear: '',  LevelGroup: '', Total:'', Capacity:'',Projection:'',
        PrevSnapshot:'',LastYear:'', LastYearCapacity:'',LastYearEnrollment:'',CreatedDate:'', UpdatedDate:'', CampusName:'', CSO:''}];
        let summaryPromise = detailreportApi.getDetailLevelAllReport(SchoolYear, CompareDaySeq);
        summaryPromise.then(
            function (currentsummaryPromise) {
                // for (let k = 0; k < currentsummaryPromise.value.length; k++) {
                //     summary.CampusNumber = currentsummaryPromise.value[k].CampusNumber;
                //     summary.SchoolYear = currentsummaryPromise.value[k].SchoolYear;
                //     summary.LevelGroup = currentsummaryPromise.value[k].LevelGroup;
                //     summary.Total = currentsummaryPromise.value[k].Total;
                //     summary.Capacity = currentsummaryPromise.value[k].Capacity;
                //     summary.Projection = currentsummaryPromise.value[k].Projection;
                //     summary.PrevSnapshot = currentsummaryPromise.value[k].PrevSnapshot;
                //     summary.LastYear = currentsummaryPromise.value[k].LastYear;
                //     summary.LastYearCapacity = currentsummaryPromise.value[k].LastYearCapacity;
                //     summary.LastYearEnrollment = currentsummaryPromise.value[k].LastYearEnrollment;
                //     summary.CreatedDate = currentsummaryPromise.value[k].CreatedDate;
                //     summary.UpdatedDate = currentsummaryPromise.value[k].UpdatedDate;
                    
                    // let campusInfoPromise = campusApi.getCSOByCampus(summary.CampusNumber);
                    // campusInfoPromise.then(
                    //     function(campusInfo){
                    //         summary.CampusName = campusInfo.NameOfInstitution;
                    //         summary.CSO = campusInfo.FirstName + ' '+ campusInfo.MiddleName + ' ' + campusInfo.LastName;

                    //     });
                    //summaryProps.push(summary);
                //}
                resolve(currentsummaryPromise);
            });
            summaryPromise.catch(function (error) {
                reject(error);
            });
        });  
    } 
}
export default adminApi;