using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class User
{
    public string Email { get; private set; }
    public string FullName { get; private set; }

    public User(User oldUserObject)
    {
        Email = oldUserObject.Email;
        FullName = oldUserObject.FullName;
    }

    public User(string email)
    {
        Email = email;
    }

    public User(string email, string fullName)
    {
        Email = email;
        FullName = fullName;
    }
}
