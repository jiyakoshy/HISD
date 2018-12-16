import Config from './config';

class VoteEligibilityApi {    

    static CheckEligibilityNonCampus(payGradeLevel,JobFamilyNaturalKey) {
        return new Promise((resolve, reject) => {
            let voteEligibility = "No";
            Config.IT_CANDIDATES.map(f => {
                if (payGradeLevel === f.PayGradeLevel && JobFamilyNaturalKey === f.JobFamilyNaturalKey)
                    voteEligibility = "Yes";
            });
    
            Config.NONIT_CANDIDATES.map(f => {
                if (payGradeLevel === f.PayGradeLevel)
                    voteEligibility = "Yes";
            });
            resolve(voteEligibility);
        });      
    }
}

export default VoteEligibilityApi;