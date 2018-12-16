using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class StudentSectionAssociationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StudentSectionAssociations
        [EnableQuery]
        public IQueryable<StudentSectionAssociation> GetStudentSectionAssociations()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StudentSectionAssociations;
        }

        // GET: odata/StudentSectionAssociations(5)
        [EnableQuery]
        public SingleResult<StudentSectionAssociation> GetStudentSectionAssociation([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StudentSectionAssociations.Where(studentSectionAssociation => studentSectionAssociation.StudentSectionAssociationNaturalKey == key));
        }


        // GET: odata/StudentSectionAssociations(5)/Course
        [EnableQuery]
        public SingleResult<Course> GetCourse([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StudentSectionAssociations.Where(m => m.StudentSectionAssociationNaturalKey == key).Select(m => m.Course));
        }

        // GET: odata/StudentSectionAssociations(5)/EducationOrganization
        [EnableQuery]
        public SingleResult<EducationOrganization> GetEducationOrganization([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StudentSectionAssociations.Where(m => m.StudentSectionAssociationNaturalKey == key).Select(m => m.EducationOrganization));
        }

        // GET: odata/StudentSectionAssociations(5)/Section
        [EnableQuery]
        public SingleResult<Section> GetSection([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StudentSectionAssociations.Where(m => m.StudentSectionAssociationNaturalKey == key).Select(m => m.Section));
        }

        // GET: odata/StudentSectionAssociations(5)/Session
        [EnableQuery]
        public SingleResult<Session> GetSession([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StudentSectionAssociations.Where(m => m.StudentSectionAssociationNaturalKey == key).Select(m => m.Session));
        }

        // GET: odata/StudentSectionAssociations(5)/Student
        [EnableQuery]
        public SingleResult<Student> GetStudent([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StudentSectionAssociations.Where(m => m.StudentSectionAssociationNaturalKey == key).Select(m => m.Student));
        }

        // GET: odata/StudentSectionAssociations(5)/TermType
        [EnableQuery]
        public SingleResult<TermType> GetTermType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StudentSectionAssociations.Where(m => m.StudentSectionAssociationNaturalKey == key).Select(m => m.TermType));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StudentSectionAssociationExists(string key)
        {
            return db.StudentSectionAssociations.Count(e => e.StudentSectionAssociationNaturalKey == key) > 0;
        }
    }
}
