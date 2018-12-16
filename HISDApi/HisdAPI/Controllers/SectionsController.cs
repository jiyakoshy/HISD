using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{

    public class SectionsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/Sections
        [EnableQuery]
        public IQueryable<Section> GetSections()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.Sections;
        }

        // GET: odata/Sections(5)
        [EnableQuery]
        public SingleResult<Section> GetSection([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Sections.Where(section => section.SectionNaturalKey == key));
        }        

        // GET: odata/Sections(5)/Course
        [EnableQuery]
        public SingleResult<Course> GetCourse([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Sections.Where(m => m.SectionNaturalKey == key).Select(m => m.Course));
        }

        // GET: odata/Sections(5)/EducationOrganization
        [EnableQuery]
        public SingleResult<EducationOrganization> GetEducationOrganization([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Sections.Where(m => m.SectionNaturalKey == key).Select(m => m.EducationOrganization));
        }

        // GET: odata/Sections(5)/SectionSchedulingType
        [EnableQuery]
        public SingleResult<SectionSchedulingType> GetSectionSchedulingType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Sections.Where(m => m.SectionNaturalKey == key).Select(m => m.SectionSchedulingType));
        }

        // GET: odata/Sections(5)/Session
        [EnableQuery]
        public SingleResult<Session> GetSession([FromODataUri] string key)
        {
            return SingleResult.Create(db.Sections.Where(m => m.SectionNaturalKey == key).Select(m => m.Session));
        }

        // GET: odata/Sections(5)/TermType
        [EnableQuery]
        public SingleResult<TermType> GetTermType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Sections.Where(m => m.SectionNaturalKey == key).Select(m => m.TermType));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SectionExists(string key)
        {
            return db.Sections.Count(e => e.SectionNaturalKey == key) > 0;
        }
    }
}
