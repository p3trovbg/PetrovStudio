using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PetrovStudio.Data.Models.Contracts;

namespace PetrovStudio.Data;

public static class ModelBuilderExtensions
{
    /// <summary>
    /// Automatically applies a global query filter to ignore soft-deleted entities.
    /// </summary>
    public static ModelBuilder ApplySoftDeleteFilters(this ModelBuilder modelBuilder)
    {
        var entityTypes = modelBuilder.Model.GetEntityTypes();

        var deletableTypes = entityTypes
            .Where(et => et.ClrType != null && 
                         typeof(IDeletableEntity).IsAssignableFrom(et.ClrType) && 
                         et.BaseType == null);

        foreach (var entityType in deletableTypes)
        {
            modelBuilder.Entity(entityType.ClrType)
                .HasQueryFilter(ConvertFilterExpression(entityType.ClrType));
        }

        return modelBuilder;
    }

    /// <summary>
    /// Switches default database cascade deletes to Restrict to protect data integrity.
    /// </summary>
    public static ModelBuilder DisableCascadeDelete(this ModelBuilder modelBuilder)
    {
        var foreignKeys = modelBuilder.Model
            .GetEntityTypes()
            .SelectMany(e => e.GetForeignKeys().Where(f => f.DeleteBehavior == DeleteBehavior.Cascade));

        foreach (var foreignKey in foreignKeys)
        {
            foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
        }

        return modelBuilder;
    }

    private static LambdaExpression ConvertFilterExpression(Type type)
    {
        var parameter = Expression.Parameter(type, "e");
        var property = Expression.Property(parameter, nameof(IDeletableEntity.IsDeleted));
        var notExpression = Expression.Not(property);
        
        return Expression.Lambda(notExpression, parameter);
    }
}