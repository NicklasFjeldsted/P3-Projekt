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
            var newArticleObject = JsonWorker.Work( model );
            var articleObject = JArray.Parse( articleJsonData );

            articleObject.Add( newArticleObject );

            if (!sidebarObject.ContainsKey( newArticleObject[ "category" ].Value<string>() ))
            {
                var obj = new JObject();
                var content = new JProperty( newArticleObject[ "title" ].Value<string>(), newArticleObject[ "title" ].Value<string>() );
                obj.Add( content );
                sidebarObject.Add( newArticleObject[ "category" ].Value<string>(), obj );
            }
            else
            {
                var toExtend = sidebarObject[ newArticleObject[ "category" ].Value<string>() ].Value<JObject>();
                toExtend.Add( new JProperty( newArticleObject[ "title" ].Value<string>(), newArticleObject[ "title" ].Value<string>() ) );
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
