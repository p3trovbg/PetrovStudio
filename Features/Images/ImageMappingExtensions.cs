using PetrovStudio.Common.Models;
using PetrovStudio.Features.Categories;
using PetrovStudio.Features.Images;
using PetrovStudio.Features.Projects;

namespace PetrovStudio.Features.Images;

public static class ImageMappingExtensions
{
    public static ImageDto ToImageDto(this CreateImageInput input, int projectId)
    {
        return new ImageDto
        {
            OriginalFileName = input.File.FileName,
            Stream = input.File.OpenReadStream(),
            MetaInfo = input.MetaInfo,
            ProjectId = projectId
        };
    }
}