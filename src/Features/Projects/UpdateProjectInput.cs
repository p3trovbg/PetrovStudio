using System.ComponentModel.DataAnnotations;

namespace PetrovStudio.Features.Projects;

public class UpdateProjectInput
{
    [Required]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.")]
    public required string Name { get; set; }

    [Required]
    [StringLength(5000, MinimumLength = 5, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.")]
    public required string Description { get; set; }

    [Required]
    public required int CategoryId { get; set; }

    public IFormFile? MainImage { get; set; }

    public IFormFileCollection Images { get; set; } = new FormFileCollection();
}
