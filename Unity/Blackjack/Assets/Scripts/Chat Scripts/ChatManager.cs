using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class ChatManager : MonoBehaviour
{
    #region Singleton Pattern
    private static ChatManager _instance;
    public static ChatManager Instance { get { return _instance; } }
    #endregion

    private List<Message> _chatMessages = new List<Message>();
    private ChatSystem _chatSystem;

    [Header("Settings")]
    public int maxMessages = 25;
    public int maxMessageLength = 255;

    [Header("References")]
    public GameObject messageGameObjectPrefab;
    public GameObject chatPanelGameObject;
    public GameObject characterInfoGameObject;
    public GameObject messageInputFieldGameObject;

    [Header("Character Info References")]
    private TextMeshProUGUI characterInfoText;
    private CanvasGroup characterInfoCanvasGroup;

    private TMP_InputField messageInputField;

    private Transform chatPanelTransform;

    private void Awake()
    {
        #region Singleton Pattern
        if (_instance != null && _instance != this)
        {
            Destroy(this);
        }
        else
        {
            _instance = this;
        }
        #endregion

        #region Character Info References
        characterInfoText = characterInfoGameObject.GetComponentInChildren<TextMeshProUGUI>();
        characterInfoCanvasGroup = characterInfoGameObject.GetComponentInChildren<CanvasGroup>();
        #endregion

        _chatSystem = ChatSystem.Instance;

        chatPanelTransform = chatPanelGameObject.transform;
        messageInputField = messageInputFieldGameObject.GetComponentInChildren<TMP_InputField>();
    }

    private void Start()
    {
        characterInfoCanvasGroup.alpha = 0;
    }

    public void ReceiveNewMessage(Message newMessage)
    {
        if(_chatMessages.Count >= maxMessages)
        {
            _chatMessages.Remove(_chatMessages[0]);
            Destroy(chatPanelTransform.GetChild(0));
        }

        GameObject newMessageObject = Instantiate(messageGameObjectPrefab, chatPanelTransform);

        newMessageObject.GetComponentInChildren<TextMeshProUGUI>().text = newMessage.message;

        _chatMessages.Add(newMessage);
    }

    public void OnInputFieldChange(string value)
    {
        characterInfoCanvasGroup.alpha = ((float)value.Length / maxMessageLength);

        characterInfoText.text = $"{value.Length}/{maxMessageLength}";
    }

    public void OnInputFieldEditEnd(string value)
    {
        _chatSystem.SendMessage("Unity", value);
        messageInputField.text = "";
    }
}
