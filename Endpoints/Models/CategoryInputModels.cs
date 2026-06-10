using System.ComponentModel.DataAnnotations;

namespace PetrovStudio.Endpoints.Models;

public class CreateCategoryInput
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public required string Name { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }
}

public class UpdateCategoryInput
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public required string Name { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }
}
