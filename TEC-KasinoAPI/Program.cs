global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Mvc;
using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Services;
using TEC_KasinoAPI.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using System.Text.Json.Serialization;
using TEC_KasinoAPI.Hubs;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add the database context to the web application services
builder.Services.AddDbContext<DatabaseContext>(options => {
	/// Configures DbContext to use SqlServer with the connection string inside appsettings.json
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
}); 

// Add controllers and configure the json options for the web application
builder.Services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull);

// Add the AutoMapper to the services of the web application
builder.Services.AddAutoMapper(typeof(Program));

#region Get the AppSettings model & configure it to the web application
// Set the configurations of the web application
IConfigurationSection appSettingsSection = builder.Configuration.GetSection("AppSettings");
builder.Services.Configure<AppSettings>(appSettingsSection);
#endregion

#region Encrypting the master key
/// Encrypt the master key I.E. <see cref="AppSettings.Secret"/>
AppSettings appSettings = appSettingsSection.Get<AppSettings>();
byte[] key = Encoding.ASCII.GetBytes(appSettings.Secret);
#endregion

// Exposes the API to the web application
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSignalR(options =>
{
	options.EnableDetailedErrors = true;
});

#region Add and configure CORS
// CORS (Cross-Origin Resource Sharing) allows or denies access from frontend JavaScript.
// CORS is used to create security around what JavaScript is allowed to access the web application.
builder.Services.AddCors(options =>
{
	// Defines the policy for frontend JavaScript.
	options.AddPolicy("EnableCors", builder =>
	{
		// Currently any frontend JavaScript is allowed.
		builder.AllowAnyOrigin()
		.AllowAnyHeader()
		.AllowAnyMethod();
	});
});
#endregion

#region Add swagger to the web application and configure it
// Jwt configurations for swagger
builder.Services.AddSwaggerGen(options => {
	options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
	{
		Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
		In = ParameterLocation.Header,
		Name = "Authorization",
		Type = SecuritySchemeType.ApiKey
	});

	options.OperationFilter<SecurityRequirementsOperationFilter>(); 
});
#endregion

#region Add authentication to the web application and define how it should operate
builder.Services.AddAuthentication(x =>
{
	x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
	x.RequireHttpsMetadata = false;
	x.SaveToken = true;
	x.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = false,
		ValidateAudience = false,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,

		IssuerSigningKey = new SymmetricSecurityKey(key),
		ClockSkew = TimeSpan.Zero
	};
});
#endregion

// Adds the interfaces and classes in a scoped fashion, meaning they will both be destroyed together
// they share a lifetime together for the full duration of a request. (I think)
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IBalanceService, BalanceService>();
builder.Services.AddScoped<IDataService, DataService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

builder.WebHost.ConfigureLogging(logging =>
{
	logging.AddFilter("Microsoft.AspNetCore.SignalR", LogLevel.Debug);
	logging.AddFilter("Microsoft.AspNetCore.Http.Connections", LogLevel.Debug);
});

// Build the web application
WebApplication app = builder.Build();

// Enable swagger and its UI
app.UseSwagger();
app.UseSwaggerUI();


// Enable HTTPS redirection for the web application.
// app.UseHttpsRedirection();

// Enable CORS and create a new policy for a specific domain.
app.UseCors(builder =>
{
	builder.SetIsOriginAllowed(option => true)
	.AllowCredentials()
	.AllowAnyHeader()
	.AllowAnyMethod();
});

// Enables the use of static files for the current directory path.
app.UseStaticFiles();

// Enables routing from within the backend.
app.UseRouting();

// Enable authentication for the web application.
app.UseAuthentication();

// Enables API authortization capabilities.
app.UseAuthorization();

app.UseWebSockets();

// Set up the endpoints for the API using the controllers.
app.UseEndpoints(x => {
	x.MapControllers();
	x.MapHub<BlackjackHub>("Blackjack");
	});

// Run the web application.
app.Run();
