using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using HisdAPI.DAL;
using HisdAPI.Entities;

namespace HisdAPI.Public.Controllers
{
    public class AddressEntitiesController : ApiController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: api/AddressEntities
        public IQueryable<AddressEntity> GetAddress()
        {
            return db.Address;
        }

        // GET: api/AddressEntities/5
        [ResponseType(typeof(AddressEntity))]
        public IHttpActionResult GetAddressEntity(int id)
        {
            AddressEntity addressEntity = db.Address.Find(id);
            if (addressEntity == null)
            {
                return NotFound();
            }

            return Ok(addressEntity);
        }        

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AddressEntityExists(string id)
        {
            return db.Address.Count(e => e.AddressNaturalKey == id) > 0;
        }
    }
}