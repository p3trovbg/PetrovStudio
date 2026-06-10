using Microsoft.EntityFrameworkCore;
using PetrovStudio.Data;
using PetrovStudio.Data.Models;
using PetrovStudio.Endpoints.Models;
using PetrovStudio.Mappings;
using PetrovStudio.Services.Contracts;
using PetrovStudio.Services.Models;

namespace PetrovStudio.Endpoints;

public static class ProjectEndpoints
{
    public static void MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        // Define a route group to avoid repeating "/api/projects"
        var group = app.MapGroup("/api/projects");

        group.MapGet("/", GetAllProjectsAsync);
        group.MapPost("/", CreateProjectAsync);
        group.MapPut("/", UpdateProjectAsync);
        group.MapDelete("/", DeleteProjectAsync);
    }

    private static async Task<IResult> GetAllProjectsAsync(PetrovStudioDbContext context, CancellationToken ct)
    {
        var projects = await context.Projects
            .Select(p => new ShortProjectOutput()
            {
                Id = p.Id,
                Name = p.Name,
                MainImageUrl = p.MainImagePath,
                CreatedOn = p.CreatedAtUtc
            })
            .ToListAsync(ct);

        return Results.Ok(projects);
    }

    private static async Task<IResult> CreateProjectAsync(PetrovStudioDbContext context, IImageService imageService, CreateProjectInput input, CancellationToken ct)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(ct);
        
        try
        {
            var newProject = input.ToProject();
            
            context.Projects.Add(newProject);
            await context.SaveChangesAsync(ct);

            var imageDto = input.MainImage.ToImageDto(newProject.Id);
            
            var mainImagePath = await imageService.ProcessImageAsync(imageDto, ct);
            newProject.MainImagePath = mainImagePath;
            await context.SaveChangesAsync(ct);

            if (input.Images.Count != 0)
            {
                var additionalImagesList = input.Images
                    .Select(img => img.ToImageDto(newProject.Id))
                    .ToList();

                await imageService.ProcessImageListAsync(additionalImagesList, ct);
            }
        
            await transaction.CommitAsync(ct);
            
            return Results.Created($"/api/projects/{newProject.Id}", newProject);
        }
        catch (Exception exception)
        {
            await transaction.RollbackAsync(ct);
            
            return Results.BadRequest(exception.Message);
        }
    }
    
    private static async Task<IResult> UpdateProjectAsync(PetrovStudioDbContext context, Project project)
    {
        context.Projects.Add(project);
        await context.SaveChangesAsync();
        return Results.Created($"/api/projects/{project.Id}", project);
    }
    
    private static async Task<IResult> DeleteProjectAsync(PetrovStudioDbContext context, int projectId)
    {
        var targetProject = await context.Projects.FirstOrDefaultAsync(p => p.Id == projectId);
        if (targetProject == null) 
            return Results.NotFound();
        
        context.Projects.Remove(targetProject);
        await context.SaveChangesAsync();
        
        return Results.Ok("Project deleted successfully.");
    }
}