using DocumentationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace DocumentationAPI.Controllers
{
    [Route( "api/[controller]" )]
    [ApiController]
    public class JsonSaver : ControllerBase
    {
        private const string path = @"C:\Users\ave\Documents\GitHub\P3-Projekt\Website\Documentation\src\assets\data\articles.json";
        private const string sidebar = @"C:\Users\ave\Documents\GitHub\P3-Projekt\Website\Documentation\src\assets\data\sidebar-content.json";

        [ HttpPost("save") ]
        public IActionResult Save( string jsonString )
        {
            string articleJsonData = ReadJson( path );
            string sidebarJsonData = ReadJson( sidebar );

            var sidebarObject = JObject.Parse( sidebarJsonData );

            var articleObject = JArray.Parse( articleJsonData );
            var newArticle = JObject.Parse( jsonString );

            articleObject.Add( newArticle );

            var toExtend = (JObject) sidebarObject.SelectToken( (string) newArticle[ "category" ] );
            toExtend.Add( new JProperty( (string) newArticle[ "title" ], (string) newArticle[ "title" ] ) );

            TextWriter writer;
            using (writer = new StreamWriter( path, append: false ))
            {
                writer.WriteLine( articleObject );
            }

            using (writer = new StreamWriter(sidebar, append: false ))
            {
                writer.WriteLine( sidebarObject );
            }

            return Ok( "Success" );
        }

        [HttpGet("read")]
        public IActionResult Read()
        {
            string jsonString = System.IO.File.ReadAllText( path );
            return Ok( jsonString );
        }

        private string ReadJson( string path )
        {
            return System.IO.File.ReadAllText( path );
        }
    }
}
