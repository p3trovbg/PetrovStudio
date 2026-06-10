using PetrovStudio.Endpoints.Models;
using PetrovStudio.Services.Models;

namespace PetrovStudio.Mappings;

public static class ImageMappingExtensions
{
    public static ImageDto ToImageDto(this CreateImageInput input, int projectId)
    {
        return new ImageDto
        {
            OriginalFileName = input.OriginalFileName,
            Stream = input.ImageStream,
            MetaInfo = input.MetaInfo,
            ProjectId = projectId
        };
    }
}