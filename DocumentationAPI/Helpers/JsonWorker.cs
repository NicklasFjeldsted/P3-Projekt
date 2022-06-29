using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace DocumentationAPI.Helpers
{
    public static class JsonWorker
    {
        public static JObject Work( object content )
        {
            JObject product = new JObject();

            var local_content = (JsonElement) content;

            foreach (var prop in local_content.EnumerateObject())
            {
                if(prop.Value.ValueKind == JsonValueKind.String)
                {
                    JProperty property = new JProperty( prop.Name, prop.Value.GetValue() );
                    product.Add( property );
                    continue;
                }

                if(prop.Value.ValueKind == JsonValueKind.Array)
                {
                    JArray array = new JArray();
                    JProperty arrayProperty = new JProperty(prop.Name, array);
                    foreach(var contentObj in prop.Value.EnumerateArray())
                    {
                        JObject content_object = new JObject();
                        foreach(var contentObj_prop in contentObj.EnumerateObject())
                        {
                            if(contentObj_prop.Value.ValueKind == JsonValueKind.Object)
                            {
                                JProperty objectProperty = new JProperty( contentObj_prop.Name, Work( contentObj_prop.Value.GetValue() ) );
                                content_object.Add( objectProperty );
                                continue;
                            }

                            JProperty property = new JProperty( contentObj_prop.Name, contentObj_prop.Value.GetValue() );
                            content_object.Add( property );
                        }
                        array.Add( content_object );
                    }
                    product.Add( arrayProperty );
                }
            }

            Debug.WriteLine( $"\nFinished Working on: \n{product}\n" );
            return product;
        }

        public static object GetValue(this JsonElement element)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.String:
                return element.GetString()!;

                case JsonValueKind.Number:
                return element.GetInt32();

                case JsonValueKind.Object:
                return element;

                default:
                throw new Exception( $"JsonWorker::GetValue() - Couldn't match JsonValueKind: {element.ValueKind}" );
            }
        }
    }
}
