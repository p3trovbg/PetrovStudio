using PetrovStudio.Data.Models;
using PetrovStudio.Endpoints.Models;

namespace PetrovStudio.Mappings;

public static class CategoryMappingExtensions
{
    public static Category ToCategory(this CreateCategoryInput input)
    {
        return new Category
        {
            Name = input.Name,
            Description = input.Description
        };
    }

    public static CategoryOutput ToOutput(this Category category)
    {
        return new CategoryOutput
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };
    }

    public static void UpdateFrom(this Category category, UpdateCategoryInput input)
    {
        category.Name = input.Name;
        category.Description = input.Description;
    }
}
