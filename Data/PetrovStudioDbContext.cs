using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using PetrovStudio.Data.Models;
using PetrovStudio.Data.Models.Contracts;

namespace PetrovStudio.Data;

public class PetrovStudioDbContext(DbContextOptions<PetrovStudioDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Category> Categories => Set<Category>();
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PetrovStudioDbContext).Assembly);

        base.OnModelCreating(modelBuilder);

        var entityTypes = modelBuilder.Model.GetEntityTypes().ToList();

        var deletableTypes = entityTypes
            .Where(et => et.ClrType != null && 
                         typeof(IDeletableEntity).IsAssignableFrom(et.ClrType) && 
                         et.BaseType == null);

        foreach (var entityType in deletableTypes)
        {
            modelBuilder.Entity(entityType.ClrType)
                .HasQueryFilter(ConvertFilterExpression(entityType.ClrType));
        }

        DisableCascadeDelete(entityTypes);
    }

    private static void DisableCascadeDelete(List<IMutableEntityType> entityTypes)
    {
        var foreignKeys = entityTypes
            .SelectMany(e => e.GetForeignKeys().Where(f => f.DeleteBehavior == DeleteBehavior.Cascade));

        foreach (var foreignKey in foreignKeys)
        {
            foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
        }
    }
    
    private static LambdaExpression ConvertFilterExpression(Type type)
    {
        var parameter = Expression.Parameter(type, "e");
        var property = Expression.Property(parameter, nameof(IDeletableEntity.IsDeleted));
        var notExpression = Expression.Not(property);
        
        return Expression.Lambda(notExpression, parameter);
    }
}