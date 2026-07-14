using PetrovStudio.Infrastructure.Data;

namespace PetrovStudio.Features.Images;

public interface IImageService
{
    Task<string> ProcessImageAsync(ImageDto image, CancellationToken ct);

    Task<List<string>> ProcessImageListAsync(List<ImageDto> images, CancellationToken ct);
    
    Task RemoveImagesByIdsAsync(IReadOnlyCollection<string> imageIds, CancellationToken ct);
}