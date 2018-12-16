using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.DAL;
using HisdAPI.Entities;

namespace HisdAPI.Controllers
{
    public class CoursesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/Courses
        [EnableQuery]
        public IQueryable<Course> GetCourses()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.Courses;
        }

        // GET: odata/Courses(5)
        [EnableQuery]
        public SingleResult<Course> GetCourse([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Courses.Where(course => course.CourseNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CourseExists(string key)
        {
            return db.Courses.Count(e => e.CourseNaturalKey == key) > 0;
        }
    }
}
