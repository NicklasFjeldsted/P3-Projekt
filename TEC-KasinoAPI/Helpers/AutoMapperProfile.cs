using AutoMapper;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Helpers
{
    /// <summary>
    /// This class automatically maps one class to another.
    /// It can be configured to map it in a certain way or comepletely automatic.
    /// </summary>
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Customer Maps
            // Maps Customer -> AuthenticateResponse
            // This is completely automatic
            CreateMap<Customer, AuthenticateResponse>();

            // Maps RegisterRequest -> Customer
            // This is completely automatic
            CreateMap<CustomerRegisterRequest, Customer>();

            // Maps UpdateRequest -> Customer
            // This is configured to map in a certain way
            CreateMap<CustomerUpdateRequest, Customer>()

                // Only maps properties that have a value
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) => {
                        // Returns false if the properties are null
                        if (prop == null)
                            return false;

                        // Returns false if the properties are empty
                        if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string) prop))
                            return false;

                        // Returns true if there is no issue
                        return true;
                    }
                    ));
            #endregion

            #region Account Balance Maps
            CreateMap<AccountBalance, BalanceResponse>();

            // Maps BalanceUpdateRequest -> AccountBalance
            // This is configured to map in a certain way
            CreateMap<BalanceUpdateRequest, AccountBalance>()

                // Only maps properties that have a value
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) => {
                        // Returns false if the properties are null
                        if (prop == null)
                            return false;

                        // Return false if the CustomerID or DepositLimit value is less than 0
                        if (int.Parse(prop.ToString()) < 0)
                            return false;

                        // Returns true if there is no issue
                        return true;
                    }
                    ));
            #endregion
        }
    }
}
