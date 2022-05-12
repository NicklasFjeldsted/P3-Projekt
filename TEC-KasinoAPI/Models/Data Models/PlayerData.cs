using System.Diagnostics;
using System.Reflection;

namespace TEC_KasinoAPI.Models
{
    public class PlayerData
    {
        private string? fullName;
        private string? email;
        private int? seatIndex;
        private int? customerID;
        private bool? seated;
        private bool? stand;
        private bool? busted;
        private bool? winner;
        private bool? blackjack;
        private List<Card>? cards;

        public string FullName { get => fullName; set => fullName = value; }
        public string Email { get => email; set => email = value; }
        public int SeatIndex { get => seatIndex ?? -1; set => seatIndex = value; }
        public int CustomerID { get => customerID ?? -1; set => customerID = value; }
        public bool Seated { get => seated ?? false; set => seated = value; }
        public bool Stand { get => stand ?? false; set => stand = value; }
        public bool Busted { get => busted ?? false; set => busted = value; }
        public bool Winner { get => winner ?? false; set => winner = value; }
        public bool Blackjack { get => blackjack ?? false; set => blackjack = value; }
        public List<Card> Cards { get => cards; set => cards = value; }

        public PlayerData() { }
        public PlayerData(PlayerData newData)
        {
            fullName = newData.fullName;
            email = newData.email;
            customerID = newData.customerID;
            seatIndex = newData.seatIndex;
            seated = newData.seated;
            stand = newData.stand;
            busted = newData.busted;
            winner = newData.winner;
            cards = newData.cards.ToList();
        }

        public void Reset()
        {
            busted = false;
            stand = false;
            winner = false;
            blackjack = false;
            if(cards != null)
            {
                cards.Clear();
            }
        }

        public async Task Update(PlayerData newData)
        {
            await Task.Run(() =>
            {
                foreach (FieldInfo fi in newData.GetType().GetFields(BindingFlags.NonPublic | BindingFlags.Instance))
                {
                    object valueNewData = typeof(PlayerData).GetField(fi.Name, BindingFlags.NonPublic | BindingFlags.Instance).GetValue(newData);

                    if (valueNewData == null) continue;

                    GetType().GetField(fi.Name, BindingFlags.NonPublic | BindingFlags.Instance).SetValue(this, valueNewData);
                }
            });
        }
    }
}
