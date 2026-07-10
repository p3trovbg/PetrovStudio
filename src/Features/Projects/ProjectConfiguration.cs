using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using PetrovStudio.Features.Categories;
using PetrovStudio.Features.Images;
using PetrovStudio.Features.Projects;

namespace PetrovStudio.Features.Projects;

class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("projects", schema: "public");

        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(300);
        
        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(5000);
        
        builder.Property(p => p.MainImagePath)
            .HasMaxLength(300);
        
        builder
            .HasOne(p => p.Category)
            .WithMany(c => c.Projects)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(p => p.Images)
            .WithOne()
            .HasForeignKey(p => p.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}