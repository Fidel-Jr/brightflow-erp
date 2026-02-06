using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace asp_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationUserModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "full_name",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "image_path",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "full_name",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "image_path",
                table: "AspNetUsers");
        }
    }
}
