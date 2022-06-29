using DocumentationAPI.Helpers;
using DocumentationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace DocumentationAPI.Controllers
{
    [Route( "api/[controller]" )]
    [ApiController]
    public class JsonSaver : ControllerBase 
    {
        private readonly AppSettings _appSettings;

        public JsonSaver(IOptions<AppSettings> appSettings )
        {
            _appSettings = appSettings.Value;
        }

        [ HttpPost("save") ]
        public IActionResult Save( string jsonString )
        {
            string articleJsonData = ReadJson( _appSettings.ArticlePath );
            string sidebarJsonData = ReadJson( _appSettings.SidebarPath );

            var sidebarObject = JObject.Parse( sidebarJsonData );

            var articleObject = JArray.Parse( articleJsonData );
            var newArticle = JObject.Parse( jsonString );

            articleObject.Add( newArticle );

            if (!sidebarObject.ContainsKey( (string) newArticle["category"] ))
            {
                var obj = new JObject();
                var content = new JProperty( (string) newArticle[ "title" ], (string) newArticle[ "title" ] );
                obj.Add( content );
                sidebarObject.Add((string) newArticle["category"], obj );
            }
            else
            {
                var toExtend = (JObject) sidebarObject.SelectToken( (string) newArticle[ "title" ] );
                toExtend.Add( new JProperty( (string) newArticle[ "title" ], (string) newArticle[ "title" ] ) );
            }

            TextWriter writer;
            using (writer = new StreamWriter( _appSettings.ArticlePath, append: false ))
            {
                writer.WriteLine( articleObject );
            }

            using (writer = new StreamWriter( _appSettings.SidebarPath, append: false ))
            {
                writer.WriteLine( sidebarObject );
            }

            return Ok( "Success" );
        }

        private string ReadJson( string path )
        {
            return System.IO.File.ReadAllText( path );
        }
    }
}
