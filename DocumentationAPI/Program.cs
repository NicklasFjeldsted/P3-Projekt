using DocumentationAPI.Helpers;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder( args );

// Add services to the container.

builder.Services.AddControllers();

IConfigurationSection appSettingsSection = builder.Configuration.GetSection( "AppSettings" );
builder.Services.Configure<AppSettings>( appSettingsSection );

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors( options => {
    options.AddDefaultPolicy( builder => {
        builder.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    } );
} );

builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enables the use of static files for the current directory path.
app.UseStaticFiles();

// Enables routing from within the backend.
app.UseRouting();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors( builder => {
    builder.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod();
} );

app.UseAuthorization();

app.MapControllers();

app.Run();
