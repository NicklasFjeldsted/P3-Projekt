using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace DocumentationAPI.Helpers
{
    public static class JsonWorker
    {
        public static JObject Work_Object( object content )
        {
            JObject product = new JObject();

            var local_content = (JsonElement) content;

            foreach (var content_property in local_content.EnumerateObject())
            {
                if(content_property.Value.ValueKind == JsonValueKind.String)
                {
                    JProperty property_wString_value = new JProperty( content_property.Name, content_property.Value.GetValue() );
                    product.Add( property_wString_value );
                    continue;
                }

                if(content_property.Value.ValueKind == JsonValueKind.Array)
                {
                    JArray array_value = new JArray();
                    foreach(var content_array in content_property.Value.EnumerateArray())
                    {
                        JObject object_value = new JObject();
                        foreach(var contentObj_prop in content_array.EnumerateObject())
                        {
                            if(contentObj_prop.Value.ValueKind == JsonValueKind.Object)
                            {
                                JProperty property_wObject_value = new JProperty( contentObj_prop.Name, Work_Object( contentObj_prop.Value.GetValue() ) );
                                object_value.Add( property_wObject_value );
                                continue;
                            }

                            JProperty property = new JProperty( contentObj_prop.Name, contentObj_prop.Value.GetValue() );
                            object_value.Add( property );
                        }
                        array_value.Add( object_value );
                    }

                    JProperty property_wArray_value = new JProperty(content_property.Name, array_value);
                    product.Add( property_wArray_value );
                }
            }

            Debug.WriteLine( $"\nFinished Working on: \n{product}\n" );
            return product;
        }

        private static object GetValue(this JsonElement element)
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

        public static JObject Work_AddRecursively( JToken other )
        {
            JObject product = new JObject();

            if(other.Type == JTokenType.Property)
            {
                JProperty cast_other = (JProperty) other;

                product = Work_AddRecursively( cast_other );
            }

            if(other.Type == JTokenType.String)
            {
                product.Add( other );
            }

            return product;
        }
    }
}
