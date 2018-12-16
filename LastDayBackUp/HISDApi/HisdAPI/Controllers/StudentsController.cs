using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class StudentsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/Students
        [EnableQuery]
        public IQueryable<Student> GetStudents()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.Students;
        }

        // GET: odata/Students(5)
        [EnableQuery]
        public SingleResult<Student> GetStudent([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Students.Where(student => student.StudentNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StudentExists(string key)
        {
            return db.Students.Count(e => e.StudentNaturalKey == key) > 0;
        }
    }
}
