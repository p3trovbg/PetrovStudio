using PetrovStudio.Common.Models;
using PetrovStudio.Features.Categories;
using PetrovStudio.Features.Images;
using PetrovStudio.Features.Projects;

namespace PetrovStudio.Features.Projects;

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
            MainImageUrl = $"/{project.MainImagePath}",
            CreatedAtUtc = project.CreatedAtUtc,
            CategoryId = project.CategoryId,
            CategoryName = project.Category?.Name ?? string.Empty,
            AdditionalImageUrls = project.Images.Select(i => new ImageOutput
            {
                Id = i.Id,
                Url = $"/{i.Path}"
            }).ToList()
        };
    }

    public static void UpdateFrom(this Project project, UpdateProjectInput input)
    {
        project.Name = input.Name;
        project.Description = input.Description;
        project.CategoryId = input.CategoryId;
    }
}