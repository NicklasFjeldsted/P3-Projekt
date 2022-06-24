using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
            Debug.WriteLine( "\nCalled Save\n" );
            string jsonData = ReadJson( path );
            if (!string.IsNullOrEmpty( jsonData ))
            {
                jsonData = jsonData.Remove( jsonData.Length - 3 );

                jsonData += "," + jsonString + "]";
            }
            else
            {
                jsonData = "[" + jsonString + "]";
            }

            var output = JsonConvert.DeserializeObject( jsonData );

            TextWriter writer;
            using(writer = new StreamWriter(path, append: false ))
            {
                writer.WriteLine( output );
            }

            return Ok( jsonData );
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
