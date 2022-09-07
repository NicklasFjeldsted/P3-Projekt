using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Services
{
    public interface IDataService
    {
        Task<IEnumerable<Country>> GetCountryDataAsync();
    }
    public class DataService : IDataService
    {
        private readonly DatabaseContext _context;

        public DataService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Country>> GetCountryDataAsync()
        {
            return await _context.Countries.ToListAsync();
        }
    }
}
