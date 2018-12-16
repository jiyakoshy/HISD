using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtifactsProvisioning
{
    [Serializable]
    public class FieldDescription
    {
        public string Name { get; set; }
        public string InternalName { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Guid{ get; set; }
        public string Group { get; set; }

    }
}
