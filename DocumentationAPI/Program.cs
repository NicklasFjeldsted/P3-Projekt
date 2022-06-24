var builder = WebApplication.CreateBuilder( args );

// Add services to the container.

builder.Services.AddControllers();
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
