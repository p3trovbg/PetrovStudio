using PetrovStudio.Endpoints.Models;
using PetrovStudio.Services.Models;

namespace PetrovStudio.Mappings;

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