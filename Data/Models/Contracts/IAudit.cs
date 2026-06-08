namespace PetrovStudio.Data.Models.Contracts;

public interface IAudit
{
    DateTime CreatedAtUtc { get; set; }
    DateTime? LastModifiedAtUtc { get; set; }
}