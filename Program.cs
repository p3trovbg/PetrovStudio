using Microsoft.EntityFrameworkCore;
using PetrovStudio;
using PetrovStudio.Data;
using PetrovStudio.Endpoints;
using PetrovStudio.Services;
using PetrovStudio.Services.Contracts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddSingleton<AuditInterceptor>();
builder.Services.AddDbContextPool<PetrovStudioDbContext>((sp, options) =>
{
    var interceptor = sp.GetRequiredService<AuditInterceptor>();
    
    options
        .UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
        .AddInterceptors(interceptor);
});

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();

app.Logger.LogInformation("The app started");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.MapProjectEndpoints();
app.MapAdministrationEndpoints();
app.MapCategoryEndpoints();

app.Run();