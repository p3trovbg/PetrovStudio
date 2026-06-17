using PetrovStudio.Features.Categories;
using PetrovStudio.Features.Images;
using PetrovStudio.Infrastructure.Data.Contracts;

namespace PetrovStudio.Features.Projects;

public class Project : IEntity<int>, IAudit, IDeletableEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public string? MainImagePath { get; set; }
    public bool IsFeatured  { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? LastModifiedAtUtc { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
    public required int CategoryId { get; set; }
    public virtual Category? Category { get; set; }
    public virtual ICollection<Image> Images { get; } = new HashSet<Image>();
}