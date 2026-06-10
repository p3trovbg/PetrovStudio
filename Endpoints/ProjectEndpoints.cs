using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using PetrovStudio.Data;
using PetrovStudio.Data.Models;
using PetrovStudio.Endpoints.Models;
using PetrovStudio.Mappings;
using PetrovStudio.Services.Contracts;

namespace PetrovStudio.Endpoints;

public static class ProjectEndpoints
{
    public static void MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects");

        group.MapGet("/", GetAllProjectsAsync);
        group.MapPost("/", CreateProjectAsync);
        group.MapPut("/", UpdateProjectAsync);
        group.MapDelete("/", DeleteProjectAsync);
    }

    private static async Task<Ok<List<ShortProjectOutput>>> GetAllProjectsAsync(PetrovStudioDbContext context, CancellationToken ct)
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

        return TypedResults.Ok(projects);
    }

    private static async Task<Created<Project>> CreateProjectAsync(
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
            var additionalImagesList = input.Images
                .Select(img => img.ToImageDto(newProject.Id))
                .ToList();

            await imageService.ProcessImageListAsync(additionalImagesList, ct);
        }
    
        await transaction.CommitAsync(ct);
        
        return TypedResults.Created($"/api/projects/{newProject.Id}", newProject);
    }
    
    private static async Task<Created<Project>> UpdateProjectAsync(PetrovStudioDbContext context, Project project)
    {
        context.Projects.Update(project);
        await context.SaveChangesAsync();
        return TypedResults.Created($"/api/projects/{project.Id}", project);
    }
    
    private static async Task<Results<Ok<string>, NotFound>> DeleteProjectAsync(PetrovStudioDbContext context, int projectId)
    {
        var targetProject = await context.Projects.FirstOrDefaultAsync(p => p.Id == projectId);
        if (targetProject == null) 
            return TypedResults.NotFound();
        
        context.Projects.Remove(targetProject);
        await context.SaveChangesAsync();
        
        return TypedResults.Ok("Project deleted successfully.");
    }
}