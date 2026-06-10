using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using PetrovStudio.Data.Models.Contracts;

namespace PetrovStudio.Data;

public class AuditInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result,
        CancellationToken cancellationToken = new CancellationToken())
    {
        UpdateAuditEntities(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateAuditEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }
    
    private static void UpdateAuditEntities(DbContext? context)
    {
        if (context == null) return;
        var utcNow = DateTime.UtcNow;
        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry is { State: EntityState.Added, Entity: IAudit creationAudit })
            {
                creationAudit.CreatedAtUtc = utcNow;
            }
            
            if (entry is { State: EntityState.Modified, Entity: IAudit modificationAudit })
            {
                modificationAudit.LastModifiedAtUtc = utcNow;
            }
            
            // Soft Delete logic
            if (entry is { State: EntityState.Deleted, Entity: IDeletableEntity deletable })
            {
                entry.State = EntityState.Modified;
                deletable.IsDeleted = true;
                deletable.DeletedAtUtc = utcNow;
            }
        }
    }
}