namespace PetrovStudio.Endpoints.Models;

public class ShortProjectOutput
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string MainImageUrl { get; set; }
    public required bool IsFeatured { get; set; }
    public DateTime CreatedOn { get; set; }
}