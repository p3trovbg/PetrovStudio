

namespace PetrovStudio.Infrastructure.Data.Contracts;

public interface IAudit
{
    DateTime CreatedAtUtc { get; set; }
    DateTime? LastModifiedAtUtc { get; set; }
}