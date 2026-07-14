    using Microsoft.EntityFrameworkCore;
    using PetrovStudio.Infrastructure.Data;
    
    namespace PetrovStudio.Features.Images;

    public class ImageService(PetrovStudioDbContext dbContext) : IImageService
    {
        private const long MaxFileSizeInBytes = 5 * 1024 * 1024; // 5 MB
        private static readonly string[] AllowedExtensions = [".jpg", ".png", ".webp"];

        public async Task<string> ProcessImageAsync(ImageDto image, CancellationToken ct)
        {
            ArgumentNullException.ThrowIfNull(image.Stream);
            ArgumentException.ThrowIfNullOrEmpty(image.OriginalFileName);

            switch (image.Stream)
            {
                case { CanSeek: true, Length: > MaxFileSizeInBytes }:
                    throw new ArgumentException("File size exceeds the maximum allowed limit of 5MB.",
                        nameof(image.Stream));
                case { CanSeek: true, Length: 0 }:
                    throw new ArgumentException("The uploaded image stream cannot be empty.", nameof(image.Stream));
            }

            var extension = Path.GetExtension(image.OriginalFileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                throw new ArgumentException(
                    $"File type '{extension}' is not allowed. Only JPG, JPEG, PNG, and WEBP are supported.");
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var relativePath = Path.Combine("Uploads", "Projects", uniqueFileName);
            var absolutePath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

            Directory.CreateDirectory(Path.GetDirectoryName(absolutePath)!);

            await using var fileStream = File.Create(absolutePath);
            await image.Stream.CopyToAsync(fileStream, ct);

            var newImage = new Image()
            {
                Id = Guid.NewGuid().ToString(),
                Path = relativePath,
                MetaInfo = image.MetaInfo,
                ProjectId = image.ProjectId,
            };

            dbContext.Add(newImage);
            await dbContext.SaveChangesAsync(ct);

            return relativePath;
        }

        public async Task<List<string>> ProcessImageListAsync(List<ImageDto> images, CancellationToken ct)
        {
            var imagePaths = new List<string>();
            foreach (var image in images)
            {
                var imagePath = await ProcessImageAsync(image, ct);
                imagePaths.Add(imagePath);
            }

            return imagePaths;
        }

        public async Task RemoveImagesByIdsAsync(IReadOnlyCollection<string> imageIds, CancellationToken ct)
        {
            if (!imageIds.Any())
            {
                return;
            }

            var images = await dbContext.Images
                .Where(i => imageIds.Contains(i.Id))
                .ToListAsync(ct);

            foreach (var image in images)
            {
                var absolutePath = GetAbsolutePath(image.Path);

                if (File.Exists(absolutePath))
                {
                    File.Delete(absolutePath);
                }
            }

            dbContext.Images.RemoveRange(images);

            await dbContext.SaveChangesAsync(ct);
        }

        private static string GetAbsolutePath(string relativePath)
            => Path.Combine(
                Directory.GetCurrentDirectory(),
                relativePath);
    }