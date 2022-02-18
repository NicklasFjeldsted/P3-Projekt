using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using TEC_KasinoAPI.Data;

var builder = WebApplication.CreateBuilder(args);

//var host = new WebHostBuilder()
//	.UseKestrel()
//	.UseContentRoot(Directory.GetCurrentDirectory())
//	.UseIISIntegration()
//	.UseStartup<WebHostBuilder>()
//	.Build();
//host.Run();

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DatabaseContext>(options => { // Configures DbContext to use SqlServer with the connection string inside appsettings.json
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(e =>
{
	e.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

//JSON Serializer
builder.Services.AddControllersWithViews()
	.AddNewtonsoftJson(options =>
	options.SerializerSettings.ReferenceLoopHandling = Newtonsoft
	.Json.ReferenceLoopHandling.Ignore)
	.AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver
	= new DefaultContractResolver());


var app = builder.Build();
app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseSwagger();
app.UseSwaggerUI();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	//app.UseSwagger();
	//app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
