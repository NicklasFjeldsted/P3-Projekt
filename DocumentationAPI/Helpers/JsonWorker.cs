using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace DocumentationAPI.Helpers
{
    public static class JsonWorker
    {
        public static string TemporaryPropertyName = "Temporary_Property_Here_43";

        public static JObject Work_Object( object content )
        {
            JObject product = new JObject();

            JsonElement local_content = (JsonElement) content;

            foreach (JsonProperty content_property in local_content.EnumerateObject())
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
                    foreach(JsonElement content_array_property in content_property.Value.EnumerateArray())
                    {
                        if(content_array_property.ValueKind == JsonValueKind.Object)
                        {
                            JObject object_value = new JObject();
                            foreach(JsonProperty array_object_property in content_array_property.EnumerateObject())
                            {
                                if(array_object_property.Value.ValueKind == JsonValueKind.Object)
                                {
                                    JProperty property_wObject_value = new JProperty( array_object_property.Name, Work_Object( array_object_property.Value.GetValue() ) );
                                    object_value.Add( property_wObject_value );
                                    continue;
                                }

                                JProperty property = new JProperty( array_object_property.Name, array_object_property.Value.GetValue() );
                                object_value.Add( property );
                            }
                            array_value.Add( object_value );
                        }

                        if(content_array_property.ValueKind == JsonValueKind.String)
                        {
                            array_value.Add( content_array_property.GetValue() );
                        }
                    }

                    JProperty property_wArray_value = new JProperty(content_property.Name, array_value);
                    product.Add( property_wArray_value );
                }

                if(content_property.Value.ValueKind == JsonValueKind.Object)
                {
                    JObject object_value = new JObject();
                    foreach(JsonProperty content_object_property in content_property.Value.EnumerateObject())
                    {
                        if(content_object_property.Value.ValueKind == JsonValueKind.Object)
                        {
                            JProperty property_wObject_value = new JProperty( content_object_property.Name, Work_Object( content_object_property.Value.GetValue() ) );
                            object_value.Add( property_wObject_value );
                            continue;
                        }

                        if(content_object_property.Value.ValueKind == JsonValueKind.String)
                        {
                            JProperty property_wString_value = new JProperty( content_object_property.Name, content_object_property.Value.GetValue() );
                            object_value.Add(property_wString_value );
                            continue;
                        }
                    }

                    JProperty property = new JProperty( content_property.Name, object_value );
                    product.Add( property );
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

        public static JObject Work_AddRecursively(this JObject self, object content, string endpoint )
        {
            if (content.GetType() == typeof( JValue ))
            {
                JValue cast_content = (JValue) content;
                JObject object_value = new JObject();

                JProperty endpoint_property = new JProperty( endpoint, endpoint );
                object_value.Add( endpoint_property );

                JProperty property_wString_value = new JProperty( (string) cast_content.Value!, object_value );
                self.Add( endpoint_property );
                return self;
            }

            if (content.GetType() == typeof( JObject ))
            {
                JObject cast_content = (JObject) content;
                foreach(JProperty content_property in cast_content.Properties())
                {
                    if (self.ContainsKey( content_property.Name ))
                    {
                        if (self[content_property.Name].GetType() == typeof( JObject ))
                        {
                            self[ content_property.Name ]!.Value<JObject>()!.Work_AddRecursively( content_property.Value, endpoint );
                        }
                    }
                    else
                    {
                        if (content_property.Value.GetType() == typeof( JObject ))
                        {
                            self.Value<JObject>()!.Work_AddRecursively( content_property.Value, endpoint );
                        }

                        if (content_property.Value.GetType() == typeof( string ))
                        {
                            self.Add( content_property );
                        }
                    }
                }
                return self;
            }
            return self;
        }
    }
}
