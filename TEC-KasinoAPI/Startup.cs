using Microsoft.AspNetCore.Builder;
using Microsoft.OpenApi.Models;

namespace TEC_KasinoAPI
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; set; }

		public void ConfigureServices(IServiceCollection services) 
		{
			services.AddControllers();
			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new OpenApiInfo { Title = "TEC-Kasino" Version = "v1" });
			}
		}
	}
}
