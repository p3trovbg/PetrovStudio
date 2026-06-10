namespace PetrovStudio.Endpoints.Models;

public class CreateProjectInput
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required int CategoryId { get; set; }
    
    public required CreateImageInput MainImage { get; set; }
    
    public ICollection<CreateImageInput> Images { get; } = new HashSet<CreateImageInput>();
}