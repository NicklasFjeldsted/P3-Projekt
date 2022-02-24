global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Mvc;
using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Services;
using TEC_KasinoAPI.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using System.Text.Json.Serialization;

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

// Set the configurations of the web application
IConfigurationSection appSettingsSection = builder.Configuration.GetSection("AppSettings");
builder.Services.Configure<AppSettings>(appSettingsSection);

builder.Services.AddEndpointsApiExplorer();

// Something about sharing the data within the web application
builder.Services.AddCors(options =>
{
	// Not sure, will return to comment later (maybe)
	options.AddPolicy("EnableCORS", builder =>
	{
		builder.AllowAnyOrigin()
		.AllowAnyHeader()
		.AllowAnyMethod();
	});
});

#region Add swagger to the web application and configure it
builder.Services.AddSwaggerGen(options => {
	options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
	{
		Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
		In = ParameterLocation.Header,
		Name = "Authorization",
		Type = SecuritySchemeType.ApiKey
	});

	options.OperationFilter<SecurityRequirementsOperationFilter>(); 
}); // Jwt configurations for swagger
#endregion

// JSON Serializer
builder.Services.AddControllersWithViews()
	.AddNewtonsoftJson(options =>
	options.SerializerSettings.ReferenceLoopHandling = Newtonsoft
	.Json.ReferenceLoopHandling.Ignore)
	.AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver
	= new DefaultContractResolver());

/// Encrypt the master key I.E. <see cref="AppSettings.Secret"/>
AppSettings appSettings = appSettingsSection.Get<AppSettings>();
byte[] key = Encoding.ASCII.GetBytes(appSettings.Secret);

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
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(key),
		ValidateIssuer = false,
		ValidateAudience = false,
		ClockSkew = TimeSpan.Zero
	};
});
#endregion

// Not sure, but its something about adding the IUserService & UserService linked with each other
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IBalanceService, BalanceService>();

// Build the web application
WebApplication app = builder.Build();

// Start swagger & its UI
app.UseSwagger();
app.UseSwaggerUI();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	//app.UseSwagger();
	//app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Not sure, something about child-/sub domains
app.UseCors(x => x
	.SetIsOriginAllowed(origin => true)
	.AllowAnyMethod()
	.AllowAnyHeader()
	.AllowCredentials());

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseEndpoints(x => x.MapControllers());

app.Run();
