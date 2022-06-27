namespace DocumentationAPI.Models
{
    public class Article
    {
        public string title = "<EMPTY STRING>";
        public string author = "<EMPTY STRING>";
        public string date = "<EMPTY STRING>";
        public string category = "<EMPTY STRING>";
        public string[] tags = { "<EMPTY STRING>" };
        public object[]? content;
    }
}
