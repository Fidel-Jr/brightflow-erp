using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace asp_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTotalAmountPropertyToOrderModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "total_amount",
                table: "orders",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "total_amount",
                table: "orders");
        }
    }
}
