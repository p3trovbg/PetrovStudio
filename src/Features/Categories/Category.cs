using PetrovStudio.Features.Projects;
using PetrovStudio.Infrastructure.Data.Contracts;

namespace PetrovStudio.Features.Categories;

public class Category : IEntity<int>, IDeletableEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
    public ICollection<Project> Projects { get; set; } = new HashSet<Project>();
}