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

        publicGroup.MapGet("/", GetAllCategoriesAsync);
        publicGroup.MapGet("/{id:int}", GetCategoryByIdAsync);
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
}