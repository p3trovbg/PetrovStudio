

namespace PetrovStudio.Infrastructure.Data.Contracts;

public interface IDeletableEntity
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAtUtc { get; set; } 
}