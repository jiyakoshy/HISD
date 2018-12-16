using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;
using System.Web.OData.Routing;
using System;

namespace HisdAPI.Controllers
{
    public class EducationOrganizationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/EducationOrganizations
        [EnableQuery]
        public IQueryable<EducationOrganization> GetEducationOrganizations()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.EducationOrganizations;
        }

        // GET: odata/EducationOrganizations(5)
        [EnableQuery]
        public SingleResult<EducationOrganization> GetEducationOrganization([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.EducationOrganizations.Where(educationOrganization => educationOrganization.EducationOrgNaturalKey == key));
        }

        [HttpGet]
        [ODataRoute("CampusType(CampusID={campusID})")]
        public IHttpActionResult CampusType(string campusID)
        {
            return Ok(GetCampusType(campusID, DateTime.Now.Year.ToString()));
        }

        [HttpGet]
        [ODataRoute("CampusTypeForYear(CampusID={campusID},YearID={yearID})")]
        public IHttpActionResult CampusTypeForYear(string campusID, string yearID)
        {
            return Ok(GetCampusType(campusID, yearID));
        }

        [HttpGet]
        [ODataRoute("EducationOrganizationsByCampusType(CampusTypeID={campusTypeID},YearID={yearID})")]
        public IHttpActionResult EducationOrganizationsByCampusType(string campusTypeID, string yearID)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var schoolGradeLevelAssociationsForYear = db.SchoolGradeLevelAssociations
                .Where(sgas => sgas.SchoolYearNaturalKey == yearID);
            
            if(campusTypeID == "HS")
            {
                return Ok(schoolGradeLevelAssociationsForYear
                    .Where(sgla => sgla.GradeLvlTypeNaturalKey == "12")
                    .Select(sg => sg.EducationOrgNaturalKey));
            }
            else if(campusTypeID == "MS")
            {
                return Ok(schoolGradeLevelAssociationsForYear
                    .Where(sgla => sgla.GradeLvlTypeNaturalKey == "7" || sgla.GradeLvlTypeNaturalKey == "6")
                    .Select(sg => sg.EducationOrgNaturalKey)
                    .Distinct());
            }
            else if(campusTypeID == "ES")
            {
                return Ok(schoolGradeLevelAssociationsForYear
                    .Where(sgla => sgla.GradeLvlTypeNaturalKey == "EE" 
                                        || sgla.GradeLvlTypeNaturalKey == "PK"
                                        || sgla.GradeLvlTypeNaturalKey == "K"
                                        || sgla.GradeLvlTypeNaturalKey == "1"
                                        || sgla.GradeLvlTypeNaturalKey == "2"
                                        || sgla.GradeLvlTypeNaturalKey == "3"
                                        || sgla.GradeLvlTypeNaturalKey == "4"
                                        || sgla.GradeLvlTypeNaturalKey == "5")
                    .Select(sg => sg.EducationOrgNaturalKey)
                    .Distinct());
            }

            return Ok("NA");
        }

        private string GetCampusType(string campusID, string yearID)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var selectedGrades = 
                db.SchoolGradeLevelAssociations
                .Where(sga => sga.EducationOrgNaturalKey == campusID && sga.SchoolYearNaturalKey == yearID)
                .Select(sgl => sgl.GradeLvlTypeNaturalKey);

            if (selectedGrades.Contains("12"))
                return "HS";
            else if (selectedGrades.Contains("8") || selectedGrades.Contains("7"))
                return "MS";
            else if (selectedGrades.Contains("EE") || selectedGrades.Contains("PK") 
                        || selectedGrades.Contains("K") || selectedGrades.Contains("6")
                        || (selectedGrades.Contains("1") && selectedGrades.Contains("2") && selectedGrades.Contains("3") &&selectedGrades.Contains("4") && selectedGrades.Contains("5")))
                return "ES";
            return "NA";
        }

        private bool IsHighSchool(IQueryable<string> selectedGrades)
        {
            return false;
        }

        [HttpGet]
        [ODataRoute("AllHFWESchools(YearID={yearID})")]
        public IHttpActionResult AllHFWESchools(string yearID)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var hfweSchools = db.SchoolGradeLevelAssociations
                .Where(sgas => sgas.SchoolYearNaturalKey == yearID)
                .Where(sga => sga.GradeLvlTypeNaturalKey == "1" || sga.GradeLvlTypeNaturalKey == "2")
                .Select(s => s.EducationOrgNaturalKey);
            
            return Ok(db.EducationOrganizations.Where(eo => hfweSchools.Contains(eo.EducationOrgNaturalKey)));
        }        

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EducationOrganizationExists(string key)
        {
            return db.EducationOrganizations.Count(e => e.EducationOrgNaturalKey == key) > 0;
        }
    }
}
