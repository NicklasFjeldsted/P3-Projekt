using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    private static GameManager _instance;
    public static GameManager Instance { get { return _instance; } }
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

    private Connector _connector;

    private void Start()
    {
        StartCoroutine(nameof(StartAsync));
    }

    public async Task StartAsync()
    {
        _connector = new Connector();
        _connector.OnDeal += OnDeal;

        await _connector.InitAsync();
    }

    public void OnDeal()
    {

    }
}
