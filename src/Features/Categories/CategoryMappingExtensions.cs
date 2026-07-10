using PetrovStudio.Common.Models;
using PetrovStudio.Features.Categories;
using PetrovStudio.Features.Images;
using PetrovStudio.Features.Projects;

namespace PetrovStudio.Features.Categories;

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
