using System.ComponentModel.DataAnnotations;

namespace PetrovStudio.Endpoints.Models;

public class CreateImageInput
{
    [StringLength(100, MinimumLength = 3)]
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? MetaInfo { get; set; }
    public required IFormFile File { get; set; }
}