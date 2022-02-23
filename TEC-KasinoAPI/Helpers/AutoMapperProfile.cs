using AutoMapper;
using TEC_KasinoAPI.Entities;
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
            // Maps Customer -> AuthenticateResponse
            // This is completely automatic
            CreateMap<Customer, AuthenticateResponse>();

            // Maps RegisterRequest -> Customer
            // This is completely automatic
            CreateMap<RegisterRequest, Customer>();

            // Maps UpdateRequest -> Customer
            // This is configured to map in a certain way
            CreateMap<UpdateRequest, Customer>()
                // Something about how it maps and when it maps
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        // Returns false if the properties are null
                        if (prop == null) return false;
                        // Returns false if the properties are empty
                        if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

                        // Returns true if there is no issue
                        return true;
                    }
                    ));
        }
    }
}
