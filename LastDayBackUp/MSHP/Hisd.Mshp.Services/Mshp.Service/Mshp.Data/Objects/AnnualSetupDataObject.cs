using System;

namespace Mshp.Service
{
    public class AnnualSetupDataObject
    {
        public int Id { get; set; }   
        public string CampusNumber { get; set; }
        public string Type { get; set; }
        public int? Capacity { get; set; }
        public int? Projection { get; set; }
        public int? Snapshot { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
}


/* Annotation:
 #1) Id is required by ODataModelBuilder() to validate model --althougth it is not returned on any of the store procedures.
     This class object has no mapping to a table, only to linq or store procedures.

*/
