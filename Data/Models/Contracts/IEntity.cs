using System.ComponentModel.DataAnnotations;

namespace PetrovStudio.Data.Models.Contracts;

public interface IEntity<TId>
{
    [Key]
    TId Id { get; set; }
}