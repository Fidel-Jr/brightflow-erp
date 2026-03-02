using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace asp_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDeliveryMapAddressPropertyToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "customer_lat",
                table: "orders",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "customer_lng",
                table: "orders",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "distance_km",
                table: "orders",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "duration_minutes",
                table: "orders",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "customer_lat",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "customer_lng",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "distance_km",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "duration_minutes",
                table: "orders");
        }
    }
}
