using PetrovStudio.Data.Models.Contracts;

namespace PetrovStudio.Data.Models;

public class Image : IEntity<string>, IAudit
{
    public required string Id { get; set; }
    public required string Path { get; set; }
    public int ProjectId { get; set; }
    public string? MetaInfo { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? LastModifiedAtUtc { get; set; }
}