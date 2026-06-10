namespace PetrovStudio.Endpoints.Models;

public class ProjectDetailsOutput
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string MainImageUrl { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public int CategoryId { get; set; }
    public required string CategoryName { get; set; }
    public List<string> AdditionalImageUrls { get; set; } = [];
}
