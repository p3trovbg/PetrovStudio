using Microsoft.EntityFrameworkCore;
using PetrovStudio.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<AuditInterceptor>();
builder.Services.AddDbContextPool<PetrovStudioDbContext>((sp, options) =>
{
    var interceptor = sp.GetRequiredService<AuditInterceptor>();
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")).AddInterceptors(interceptor);
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.Logger.LogInformation("The app started");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();