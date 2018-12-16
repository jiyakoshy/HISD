using Microsoft.SharePoint.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace ArtifactsProvisioning
{
    class Program
    {
        /// <summary>
        /// Assumptions -   Site has Finnish and Swedish language enabled in the cloud.
        ///                 Translated fields are available if the user selectes Finnish or Swedish as the default language in user profile (OneDrive site)
        /// </summary>
        /// <param name="args"></param>
        static void Main(string[] args)
        {

            string siteUrl = GetSite();
            if (string.IsNullOrEmpty(siteUrl)) siteUrl = "https://connectdevapps.houstonisd.org/";

            // Open connection to Site Collection
            ClientContext context = new ClientContext(siteUrl);
           
            // Load reference to content type collection
            Web web = context.Web;

            //
            // Ensure that we have the initial config available.
            //
            ContentType myContentType = CreateContentTypeIfDoesNotExist(context, web);
            CreateSiteColumns(context, web, GetFieldsInfo());
            AddSiteColumnsToContentType(context, web);
            CreateCustomList(context, web, myContentType);
            Console.ReadKey();
        }
        
        private static List<FieldDescription> GetFieldsInfo()
        {
            List<FieldDescription> fieldInfo = new List<FieldDescription>();
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "RelationshipID", Name = "Relationship ID", Description = "Mentor/Mentee Relationship ID", Type="Text", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "RelationshipStatus", Name = "Relationship Status", Description = "Relationship Status", Type = "Text", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "MentorAgreement", Name = "Mentor Agreement", Description = "Mentor Agreement", Type = "Text", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = " ", Name = "Principal Approval", Description = "Principal Approval", Type = "Text", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "Mentor", Name = "Mentor", Description = "Mentor", Type = "User", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "Mentee", Name = "Mentee", Description = "Mentee", Type = "User", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "Principal", Name = "Principal", Description = "Principal", Type = "User", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "CIC", Name = "CIC", Description = "Campus Contact", Type = "User", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "WebServiceURL", Name = "Web Service URL", Description = "Web Service URL", Type = "Text", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "MenteeEmployeeID", Name = "Mentee Employee ID", Description = "Mentee Employee ID", Type = "Text", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "CampusID", Name = "Campus ID", Description = "Campus ID", Type = "Text", Group = "MAS Site Columns" });
            fieldInfo.Add(new FieldDescription() { Guid = GetNewGuid(), InternalName = "TimeConfigurationID", Name = "Time Configuration ID", Description = "Time Configuration ID", Type = "Text", Group = "MAS Site Columns" });

            return fieldInfo;
        }

        private static string GetNewGuid()
        {
            Guid guid = Guid.NewGuid();
            return "{" + guid.ToString() + "}"; ;
        }

        /// <summary>
        /// Used to create custom list to demonstrate the multi-lingual capabilities with the list title and decription.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="web"></param>
        private static void CreateCustomList(ClientContext context, Web web)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Creating Relationships Requests list...");
            ListCollection listCollection = context.Web.Lists;
            context.Load(listCollection, lists => lists.Include(list => list.Title).Where(list => list.Title == "Relationship Requests"));
            context.ExecuteQuery();
            // Create the list, if it's not there...
            if (listCollection.Count == 0)
            {
                ListCreationInformation newList = new ListCreationInformation();
                newList.Title = "Relationships Requests";
                newList.QuickLaunchOption = QuickLaunchOptions.Off;
                newList.TemplateType = (int)ListTemplateType.GenericList;
                newList.Description = "Mentor/Mentee Relationships Requests";
                List list = web.Lists.Add(newList);
                context.ExecuteQuery();
            }
        }
        
        private static ContentType CreateContentTypeIfDoesNotExist(ClientContext context, Web web)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Creating Relationship Request content type...");

            ContentTypeCollection contentTypes = web.ContentTypes;
            context.Load(contentTypes);
            context.ExecuteQuery();

            foreach (var item in contentTypes)
            {
                if (item.StringId == "0x0100BDD5E43587AF469CA722FD068065DF5D")
                    return item;
            }

            // Create a Content Type Information object
            ContentTypeCreationInformation newCt = new ContentTypeCreationInformation();
            // Set the name for the content type
            newCt.Name = "Relationship Request";
            //Inherit from oob document - 0x0101 and assign 
            newCt.Id = "0x0100BDD5E43587AF469CA722FD068065DF5D";
            // Set content type to be avaialble from specific group
            newCt.Group = "MAS Content Types";
            // Create the content type
            ContentType myContentType = contentTypes.Add(newCt);
            context.ExecuteQuery();
            return myContentType;
        }
        
        private static void CreateSiteColumns(ClientContext context, Web web, List<FieldDescription> fieldDescriptions)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Creating site columns for content type...");

            // Add site column to the content type if it's not there...
            FieldCollection fields = web.Fields;
            context.Load(fields);
            context.ExecuteQuery();
            foreach (FieldDescription fd in fieldDescriptions)
            {
                bool found = false;
                foreach (var item in fields)
                {
                    if (item.InternalName == fd.InternalName)
                    {
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    string FieldAsXML = String.Format("<Field ID='{0}' Name='{1}' DisplayName='{2}' Type='{3}' Hidden='False'  Group='{4}' Description='{5}' />", fd.Guid, fd.InternalName, fd.Name, fd.Type, fd.Group, fd.Description);
                    Field fld = fields.AddFieldAsXml(FieldAsXML, true, AddFieldOptions.DefaultValue);
                    context.Load(fields);
                    context.Load(fld);
                    context.ExecuteQuery();
                }
            }
        }

        private static void AddSiteColumnsToContentType(ClientContext context, Web web)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Adding site columns to content type...");

            ContentTypeCollection contentTypes = web.ContentTypes;
            context.Load(contentTypes);
            context.ExecuteQuery();
            ContentType myContentType = contentTypes.GetById("0x0100BDD5E43587AF469CA722FD068065DF5D");
            context.Load(myContentType);
            context.ExecuteQuery();

            FieldCollection fields = web.Fields;
            
            context.Load(fields);
            context.ExecuteQuery();

            List<Field> masFields = new List<Field>();

            foreach(Field fld in fields)
            {
                if (fld.Group == "MAS Site Columns")
                    masFields.Add(fld);
            }

            FieldLinkCollection refFields = myContentType.FieldLinks;
            context.Load(refFields);
            context.ExecuteQuery();

            List<string> fieldNames = new List<string>();
            foreach(FieldLink fl in refFields)
            {
                fieldNames.Add(fl.Name);
            }

            bool updateContentType = false;
            foreach (Field fld in masFields)
            {
                string matched = (from fn in fieldNames
                               where fn == fld.InternalName
                              select fn).FirstOrDefault<string>();

                if (String.IsNullOrEmpty(matched))
                {
                    FieldLinkCreationInformation link = new FieldLinkCreationInformation();
                    link.Field = fld;
                    myContentType.FieldLinks.Add(link);
                    updateContentType = true;
                }
            }

            if (updateContentType)
            {
                myContentType.Update(true);
                context.ExecuteQuery();
            }
        }

        private static void CreateCustomList(ClientContext context, Web web, ContentType myContentType)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Creating Relationships Requests list...");

            string listTitle = "Relationships Requests";
            List myList = null;
            ListCollection lists = web.Lists;
            IEnumerable existingLists = context.LoadQuery(lists.Where(list => list.Title == listTitle));
            context.ExecuteQuery();

            IEnumerator enumerator = existingLists.GetEnumerator();
            while (enumerator.MoveNext())
            {
                myList = (List)enumerator.Current;
            }
            
            if (myList == null) {
                ListCreationInformation listCreationInfo = new ListCreationInformation();
                listCreationInfo.Title = listTitle;
                listCreationInfo.TemplateType = (int)ListTemplateType.GenericList;
                listCreationInfo.Description = "Mentor/Mentee Relationships Requests";
                listCreationInfo.QuickLaunchOption = QuickLaunchOptions.Off;
                myList = context.Web.Lists.Add(listCreationInfo);
                context.Load(myList);  
                context.ExecuteQuery();
            }
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Adding content type to Relationships Requests list...");

            //// Get the content type by id from the web site
            ContentType ct = web.ContentTypes.GetById("0x0100BDD5E43587AF469CA722FD068065DF5D");
            ContentTypeCollection contentTypes = myList.ContentTypes;
           
            //// Add the content type to the custom list
            myList.ContentTypesEnabled = true;
            context.Load(web);
            context.Load(myList);
            context.Load(contentTypes);
            context.Load(ct);
            context.ExecuteQuery();
            int count = contentTypes.Count;
            ContentType itemCT = null;
            ContentType requestCT = null;
            for (int i = 0; i < count; i++)
            {
                if(contentTypes[i].Name == "Item")
                {
                    itemCT = contentTypes[i];
                    itemCT.Hidden = true;
                    itemCT.Update(false);
                }
                else if (contentTypes[i].Name == "Relationship Request")
                {
                    requestCT = contentTypes[i];
                }
            }
            if(requestCT == null)
            {
                requestCT = contentTypes.AddExistingContentType(ct);
            }
            Folder rootFolder = myList.RootFolder;
            context.Load(rootFolder);
            if(requestCT != null)
                context.Load(requestCT);
            context.ExecuteQuery();
            List<ContentTypeId> defaultCT = new List<ContentTypeId>();
            defaultCT.Add(requestCT.Id);
            rootFolder.UniqueContentTypeOrder = defaultCT;
            context.Load(rootFolder);
            context.Load(myList);
            context.Load(rootFolder);
            context.ExecuteQuery();
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Process Completed!!!...");

        }

        #region CONNECTIVITY METHODS

        static string GetSite()
        {
            string siteUrl = string.Empty;
            try
            {
                Console.Write("Enter site URL: ");
                siteUrl = Console.ReadLine();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                siteUrl = string.Empty;
            }
            return siteUrl;
        }

        private static string URLCombine(string baseUrl, string relativeUrl)
        {
            if (baseUrl.Length == 0)
                return relativeUrl;
            if (relativeUrl.Length == 0)
                return baseUrl;
            return string.Format("{0}/{1}", baseUrl.TrimEnd(new char[] { '/', '\\' }), relativeUrl.TrimStart(new char[] { '/', '\\' }));
        }
        #endregion
    }
}
