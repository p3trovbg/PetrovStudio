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

        modelBuilder
            .ApplySoftDeleteFilters()
            .DisableCascadeDelete();
    }
}