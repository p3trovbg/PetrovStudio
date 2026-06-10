using System.ComponentModel.DataAnnotations;

namespace PetrovStudio.Endpoints.Models;

public class CreateImageInput
{
    [StringLength(100, MinimumLength = 3)]
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? MetaInfo { get; set; }
    public required Stream ImageStream { get; set; }
    [Required]
    [StringLength(40, MinimumLength = 3)]
    public required string OriginalFileName { get; set; }
}