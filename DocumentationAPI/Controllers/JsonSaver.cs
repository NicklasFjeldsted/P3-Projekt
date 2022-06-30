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
        public IActionResult Save( [FromBody] object model )
        {
            string articleJsonData = ReadJson( _appSettings.ArticlePath );
            string sidebarJsonData = ReadJson( _appSettings.SidebarPath );

            var sidebarObject = JObject.Parse( sidebarJsonData );
            var newArticleObject = JsonWorker.Work_Object( model );
            var articleObject = JArray.Parse( articleJsonData );

            articleObject.Add( newArticleObject );

            sidebarObject.Work_AddRecursively( newArticleObject[ "category" ]!, newArticleObject[ "title" ]!.Value<string>()! );

            TextWriter writer;
            using (writer = new StreamWriter( _appSettings.ArticlePath, append: false ))
            {
                writer.WriteLine( articleObject );
            }

            using (writer = new StreamWriter( _appSettings.SidebarPath, append: false ))
            {
                writer.WriteLine( sidebarObject );
            }

            //return Ok( JsonConvert.SerializeObject( sidebarObject ) );
            return Ok( "Success" );
        }

        private string ReadJson( string path )
        {
            return System.IO.File.ReadAllText( path );
        }
    }
}
