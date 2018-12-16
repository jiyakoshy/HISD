using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HISD.DAC.Web.Models
{
    public class VotingSettingModel
    {
        public int VotingSettingID { get; set; }
        public DateTime VotingStartDate { get; set; }

        public DateTime VotingEndDate { get; set; }

    }
}