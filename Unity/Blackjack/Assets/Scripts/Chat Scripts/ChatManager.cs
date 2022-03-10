using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEditor;

public class ChatManager : MonoBehaviour
{
    #region Singleton Pattern
    private static ChatManager _instance;
    public static ChatManager Instance { get { return _instance; } }
    private void Awake()
    {
        if(_instance != null && _instance != this)
        {
            Destroy(this);
        }
        else
        {
            _instance = this;
        }
    }
    #endregion

    private List<Message> _chatMessages = new List<Message>();

    [Header("Settings")]
    public int maxMessages = 25;

    [Header("References")]
    public GameObject messageGameObjectPrefab;
    public GameObject chatPanelGameObject;

    public void HandleMessages(Message newMessage)
    {
        if(_chatMessages.Count >= maxMessages)
        {
            _chatMessages.Remove(_chatMessages[0]);
        }

        GameObject newMessageObject = Instantiate(messageGameObjectPrefab, chatPanelGameObject.transform);

        newMessageObject.GetComponentInChildren<TextMeshProUGUI>().text = newMessage.message;

        _chatMessages.Add(newMessage);
    }
}
#if UNITY_EDITOR
[CustomEditor(typeof(ChatManager))]
public class ChatManagerEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();

        ChatManager myScript = (ChatManager)target;
        if (GUILayout.Button("Send Message"))
        {
            myScript.HandleMessages(new Message("Alexander", "Hello world!"));
        }
    }
}
#endif
