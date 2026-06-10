using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using PetrovStudio.Data;
using PetrovStudio.Endpoints.Models;
using PetrovStudio.Mappings;

namespace PetrovStudio.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var publicGroup = app.MapGroup("/api/categories").WithTags("Categories");
        var adminGroup = app.MapGroup("/api/admin/categories").WithTags("Administration");

        // Public read endpoints
        publicGroup.MapGet("/", GetAllCategoriesAsync);
        publicGroup.MapGet("/{id:int}", GetCategoryByIdAsync);

        // Admin write endpoints
        adminGroup.MapPost("/", CreateCategoryAsync);
        adminGroup.MapPut("/{id:int}", UpdateCategoryAsync);
        adminGroup.MapDelete("/{id:int}", DeleteCategoryAsync);
    }

    private static async Task<Ok<List<CategoryOutput>>> GetAllCategoriesAsync(
        PetrovStudioDbContext context,
        CancellationToken ct)
    {
        var categories = await context.Categories
            .AsNoTracking()
            .Select(c => new CategoryOutput
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            })
            .OrderBy(c => c.Name)
            .ToListAsync(ct);

        return TypedResults.Ok(categories);
    }

    private static async Task<Results<Ok<CategoryOutput>, NotFound>> GetCategoryByIdAsync(
        PetrovStudioDbContext context,
        int id,
        CancellationToken ct)
    {
        var category = await context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        if (category is null)
            return TypedResults.NotFound();

        return TypedResults.Ok(category.ToOutput());
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