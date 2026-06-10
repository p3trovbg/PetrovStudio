using PetrovStudio.Data.Models;
using PetrovStudio.Endpoints.Models;

namespace PetrovStudio.Mappings;

public static class ProjectMappingExtensions
{
    public static Project ToProject(this CreateProjectInput input)
    {
        return new Project
        {
            Name = input.Name,
            Description = input.Description,
            CategoryId =  input.CategoryId,
        };
    }

    public static ProjectDetailsOutput ToDetailsOutput(this Project project)
    {
        return new ProjectDetailsOutput
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            MainImageUrl = project.MainImagePath,
            CreatedAtUtc = project.CreatedAtUtc,
            CategoryId = project.CategoryId,
            CategoryName = project.Category?.Name ?? string.Empty,
            AdditionalImageUrls = project.Images.Select(i => i.Path).ToList()
        };
    }

    public static void UpdateFrom(this Project project, UpdateProjectInput input)
    {
        project.Name = input.Name;
        project.Description = input.Description;
        project.CategoryId = input.CategoryId;
    }
}