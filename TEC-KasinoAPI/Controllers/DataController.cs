using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Text;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Models.Data_Models;
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

		[Route("SendEmail")]
		[HttpPost]
		public async Task<IActionResult> SendMail([FromBody] MailDataRequest mailData)
		{
			MailMessage mail = new MailMessage();
			mail.From = new MailAddress(mailData.Email, mailData.Fullname, Encoding.UTF8);
			mail.To.Add("nicklasfjeldstedosbeck@gmail.com");
			mail.Subject = mailData.Subject;
			mail.SubjectEncoding = Encoding.UTF8;
			mail.Body = mailData.Message;
			mail.BodyEncoding = Encoding.UTF8;
			mail.Priority = MailPriority.High;

			SmtpClient client = new SmtpClient()
			{
				Host = "10.0.6.2",
				Port = 25,
				UseDefaultCredentials = true,
			};
			try
			{
				await client.SendMailAsync(mail);
				return Ok("Mail sent!");
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

	}
}
