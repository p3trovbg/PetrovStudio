namespace PetrovStudio.Data.Models.Contracts;

public interface IDeletableEntity
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAtUtc { get; set; } 
}