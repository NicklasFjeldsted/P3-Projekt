using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Services;

namespace TEC_KasinoAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DataController : ControllerBase
	{
		private readonly IDataService _dataService;

		public DataController(IDataService dataService)
		{
			_dataService = dataService;
		}

		[HttpGet("Countries")]
		public async Task<IActionResult> GetCountries()
		{
			IEnumerable<Country> countries = await _dataService.GetCountryDataAsync();

			if(countries == null)
			{
				return NotFound();
			}

			return Ok(countries);
		}

	}
}
