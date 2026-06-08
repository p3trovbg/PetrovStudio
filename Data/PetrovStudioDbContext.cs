using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PetrovStudio.Data.Models;
using PetrovStudio.Data.Models.Contracts;

namespace PetrovStudio.Data;

public class PetrovStudioDbContext(DbContextOptions<PetrovStudioDbContext> options) : DbContext(options)
{
    public DbSet<Project> Products => Set<Project>();
    public DbSet<Category> Categories => Set<Category>();
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PetrovStudioDbContext).Assembly);

        base.OnModelCreating(modelBuilder);

        // Apply global query filter for soft delete across ALL entities implementing IDeletableEntity
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(IDeletableEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .HasQueryFilter(ConvertFilterExpression(entityType.ClrType));
            }
        }
    }
    
    private static LambdaExpression ConvertFilterExpression(Type type)
    {
        var parameter = Expression.Parameter(type, "e");
        var property = Expression.Property(parameter, nameof(IDeletableEntity.IsDeleted));
        var notExpression = Expression.Not(property);
        
        return Expression.Lambda(notExpression, parameter);
    }
    
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries();
        var utcNow = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry is { State: EntityState.Added, Entity: IAudit creationAudit })
            {
                creationAudit.CreatedAtUtc = utcNow;
            }
            
            if (entry is { State: EntityState.Modified, Entity: IAudit modificationAudit })
            {
                modificationAudit.LastModifiedAtUtc = utcNow;
            }
            
            if (entry is { State: EntityState.Deleted, Entity: IDeletableEntity deletable })
            {
                entry.State = EntityState.Modified;
                deletable.IsDeleted = true;
                deletable.DeletedAtUtc = utcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

}