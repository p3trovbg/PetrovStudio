using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using PetrovStudio.Features.Categories;
using PetrovStudio.Features.Images;
using PetrovStudio.Features.Projects;

namespace PetrovStudio.Features.Images;

public class ImageConfiguration : IEntityTypeConfiguration<Image>
{
    public void Configure(EntityTypeBuilder<Image> builder)
    {
        builder.ToTable("images", schema: "public");
        
        builder.HasKey(p => p.Id);
        builder.Property(i => i.Path).IsRequired();
        builder.Property(i => i.MetaInfo)
            .HasMaxLength(500);
    }
}