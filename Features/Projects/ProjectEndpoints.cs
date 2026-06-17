using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using PetrovStudio.Common.Models;
using PetrovStudio.Features.Categories;
using PetrovStudio.Features.Images;
using PetrovStudio.Features.Projects;
using PetrovStudio.Infrastructure.Data;

namespace PetrovStudio.Features.Projects;

public static class ProjectEndpoints
{
    public static void MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects").WithTags("Projects");

        group.MapGet("/", GetAllProjectsAsync);
        group.MapGet("/{id:int}", GetProjectByIdAsync);
    }

    private static async Task<Ok<PaginatedResult<ShortProjectOutput>>> GetAllProjectsAsync(
        PetrovStudioDbContext context,
        int page = 1,
        int pageSize = 10,
        int? categoryId = null,
        CancellationToken ct = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 50);
        page = Math.Max(1, page);

        var query = context.Projects.AsNoTracking();

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(p => p.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ShortProjectOutput
            {
                Id = p.Id,
                Name = p.Name,
                MainImageUrl = p.MainImagePath!,
                CreatedOn = p.CreatedAtUtc,
                IsFeatured = p.IsFeatured,
            })
            .ToListAsync(ct);

        var result = new PaginatedResult<ShortProjectOutput>(items, totalCount, page, pageSize);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<ProjectDetailsOutput>, NotFound>> GetProjectByIdAsync(
        PetrovStudioDbContext context,
        int id,
        CancellationToken ct)
    {
        var project = await context.Projects
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        if (project is null)
            return TypedResults.NotFound();

        return TypedResults.Ok(project.ToDetailsOutput());
    }
}