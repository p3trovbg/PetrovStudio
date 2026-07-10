using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using PetrovStudio.Features.Administration;
using PetrovStudio.Features.Categories;
using PetrovStudio.Features.Images;
using PetrovStudio.Features.Projects;
using PetrovStudio.Infrastructure.Data;
using PetrovStudio;

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
builder.Services.AddHealthChecks();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<PetrovStudioDbContext>();
    dbContext.Database.Migrate();
}

app.UseExceptionHandler();

app.Logger.LogInformation("The app started");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads")),
    RequestPath = "/Uploads"
});

app.MapHealthChecks("/health");

app.MapProjectEndpoints();
app.MapAdministrationEndpoints();
app.MapCategoryEndpoints();

app.Run();