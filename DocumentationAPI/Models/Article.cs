namespace DocumentationAPI.Models
{
    public class Article
    {
        public string title { get; set; }
        public string author { get; set; }
        public string date { get; set; }
        public string category { get; set; }
        public string[] tags { get; set; }
        public IEnumerable<dynamic> content { get; set; }
    }

    public class Header : Content
    {
        public int header_level { get; set; }
    }

    public class Codeblock : Content
    {
        public int font_size { get; set; }
        public string language { get; set; }
    }

    public class Textarea : Content
    {
        public int font_size { get; set; }
        public string font_style { get; set; }
        public string color { get; set; }
        public Link link { get; set; }
    }

    public class Link
    {
        public string text { get; set; }
        public string url { get; set; }
    }

    public abstract class Content
    {
        public int index { get; set; }
        public int type { get; set; }
        public string text { get; set; }
    }
}
