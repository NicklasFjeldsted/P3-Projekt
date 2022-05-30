using System.Reflection;
using TEC_KasinoAPI.Services;

namespace TEC_KasinoAPI.Models
{
    public class UserData
    {
#pragma warning disable CS8632 // Nullable
#pragma warning disable IDE1006 // Naming Styles
        private string? fullName;
        private string? email;
        private int? customerID;
        private GameType? gameType;
#pragma warning restore IDE1006 // Naming Styles
#pragma warning restore CS8632 // Nullable

        public int CustomerID { get => customerID ?? -1; set => customerID = value; }
        public string FullName { get => fullName; set => fullName = value; }
        public string Email { get => email; set => email = value; }
        public GameType GameType { get => gameType ?? GameType.Undefined; set => gameType = value; }

        public async Task Update(UserData newData)
        {
            await Task.Run(() => {
                foreach (FieldInfo fi in newData.GetType().GetFields(BindingFlags.NonPublic | BindingFlags.Instance))
                {
                    object valueNewData = typeof(UserData).GetField(fi.Name, BindingFlags.NonPublic | BindingFlags.Instance).GetValue(newData);

                    if (valueNewData == null)
                        continue;

                    GetType().GetField(fi.Name, BindingFlags.NonPublic | BindingFlags.Instance).SetValue(this, valueNewData);
                }
            });
        }
    }
}
