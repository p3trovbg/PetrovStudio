using System.ComponentModel.DataAnnotations;

namespace PetrovStudio.Infrastructure.Data.Contracts;

public interface IEntity<TId>
{
    [Key]
    TId Id { get; set; }
}