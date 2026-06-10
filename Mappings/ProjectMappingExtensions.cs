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
}