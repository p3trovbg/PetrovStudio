using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using PetrovStudio.Data;
using PetrovStudio.Endpoints.Models;
using PetrovStudio.Mappings;
using PetrovStudio.Services.Contracts;

namespace PetrovStudio.Endpoints;

public static class AdministrationEndpoints
{
    public static void MapAdministrationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/api/admin")
            .WithTags("Administration")
            .AddEndpointFilter(async (context, next) =>
            {
                var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
                var expectedKey = configuration["AdminSettings:ApiKey"];
                           
                if (!context.HttpContext.Request.Headers.TryGetValue("Authorization", out var extractedKey) ||
                    extractedKey != $"Bearer {expectedKey}")
                {
                    return Results.Unauthorized();
                }

                return await next(context);
            });
        
        group.MapPost("/projects", CreateProjectAsync);
        group.MapPut("/projects/{id:int}", UpdateProjectAsync);
        group.MapDelete("/projects/{id:int}", DeleteProjectAsync);
        
        group.MapPost("/categories", CreateCategoryAsync);
        group.MapPut("/categories/{id:int}", UpdateCategoryAsync);
        group.MapDelete("/categories/{id:int}", DeleteCategoryAsync);
    }

    private static async Task<Created<int>> CreateProjectAsync(
        PetrovStudioDbContext context,
        IImageService imageService,
        CreateProjectInput input,
        CancellationToken ct)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(ct);

        var newProject = input.ToProject();

        context.Projects.Add(newProject);
        await context.SaveChangesAsync(ct);

        var imageDto = input.MainImage.ToImageDto(newProject.Id);
        var mainImagePath = await imageService.ProcessImageAsync(imageDto, ct);
        newProject.MainImagePath = mainImagePath;
        await context.SaveChangesAsync(ct);

        if (input.Images.Count != 0)
        {
            var additionalImages = input.Images
                .Select(img => img.ToImageDto(newProject.Id))
                .ToList();

            await imageService.ProcessImageListAsync(additionalImages, ct);
        }

        await transaction.CommitAsync(ct);

        return TypedResults.Created($"/api/projects/{newProject.Id}", newProject.Id);
    }

    private static async Task<Results<Ok, NotFound>> UpdateProjectAsync(
        PetrovStudioDbContext context,
        int id,
        UpdateProjectInput input,
        CancellationToken ct)
    {
        var project = await context.Projects.FirstOrDefaultAsync(p => p.Id == id, ct);

        if (project is null)
            return TypedResults.NotFound();

        project.UpdateFrom(input);
        await context.SaveChangesAsync(ct);

        return TypedResults.Ok();
    }

    private static async Task<Results<Ok, NotFound>> DeleteProjectAsync(
        PetrovStudioDbContext context,
        int id,
        CancellationToken ct)
    {
        var project = await context.Projects.FirstOrDefaultAsync(p => p.Id == id, ct);

        if (project is null)
            return TypedResults.NotFound();

        context.Projects.Remove(project);
        await context.SaveChangesAsync(ct);

        return TypedResults.Ok();
    }
    
    private static async Task<Created<int>> CreateCategoryAsync(
        PetrovStudioDbContext context,
        CreateCategoryInput input,
        CancellationToken ct)
    {
        var category = input.ToCategory();

        context.Categories.Add(category);
        await context.SaveChangesAsync(ct);

        return TypedResults.Created($"/api/categories/{category.Id}", category.Id);
    }

    private static async Task<Results<Ok, NotFound>> UpdateCategoryAsync(
        PetrovStudioDbContext context,
        int id,
        UpdateCategoryInput input,
        CancellationToken ct)
    {
        var category = await context.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);

        if (category is null)
            return TypedResults.NotFound();

        category.UpdateFrom(input);
        await context.SaveChangesAsync(ct);

        return TypedResults.Ok();
    }

    private static async Task<Results<Ok, NotFound>> DeleteCategoryAsync(
        PetrovStudioDbContext context,
        int id,
        CancellationToken ct)
    {
        var category = await context.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);

        if (category is null)
            return TypedResults.NotFound();

        context.Categories.Remove(category);
        await context.SaveChangesAsync(ct);

        return TypedResults.Ok();
    }
}