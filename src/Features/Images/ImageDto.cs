

namespace PetrovStudio.Features.Images;

public class ImageDto
{
    public required Stream Stream { get; set; }
    public required string OriginalFileName { get; set; }

    public string? MetaInfo { get; set; }
    
    public required int ProjectId  { get; set; }
}