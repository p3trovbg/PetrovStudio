using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetrovStudio.Migrations
{
    /// <inheritdoc />
    public partial class AddIsFeatureProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MainImagePath",
                schema: "public",
                table: "projects",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                schema: "public",
                table: "projects",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFeatured",
                schema: "public",
                table: "projects");

            migrationBuilder.AlterColumn<string>(
                name: "MainImagePath",
                schema: "public",
                table: "projects",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(300)",
                oldMaxLength: 300,
                oldNullable: true);
        }
    }
}
