using System.ComponentModel.DataAnnotations;

namespace PetrovStudio.Endpoints.Models;

public class CreateProjectInput
{
    [Required]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.")]
    public required string Name { get; set; }
    [StringLength(5000, MinimumLength = 5, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.")]
    public required string Description { get; set; }
    
    [Required]
    public required int CategoryId { get; set; }
    
    [Required]
    public required CreateImageInput MainImage { get; set; }
    
    public ICollection<CreateImageInput> Images { get; } = new HashSet<CreateImageInput>();
}