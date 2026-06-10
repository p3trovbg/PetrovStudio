using PetrovStudio.Data;
using PetrovStudio.Services.Models;

namespace PetrovStudio.Services.Contracts;

public interface IImageService
{
    Task<string> ProcessImageAsync(ImageDto image, CancellationToken ct);

    Task<List<string>> ProcessImageListAsync(List<ImageDto> images, CancellationToken ct);
}