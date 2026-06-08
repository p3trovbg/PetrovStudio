using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetrovStudio.Data.Models;

namespace PetrovStudio.Data.Configurations;

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