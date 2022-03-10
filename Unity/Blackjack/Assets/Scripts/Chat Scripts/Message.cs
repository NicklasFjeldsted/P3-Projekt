[System.Serializable]
public class Message
{
    public string _Author { get; private set; }
    public string _Message { get; private set; }
    public string message { get { return $"{_Author}: {_Message}"; } }

    public Message(string author, string message)
    {
        _Author = author;
        _Message = message;
    }
}
