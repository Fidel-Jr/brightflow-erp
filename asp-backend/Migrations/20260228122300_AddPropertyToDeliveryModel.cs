using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace asp_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyToDeliveryModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_deliveries_application_user_driver_id",
                table: "deliveries");

            migrationBuilder.DropTable(
                name: "driver_vehicles");

            migrationBuilder.DropColumn(
                name: "created_date",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "updated_date",
                table: "categories");

            migrationBuilder.AlterColumn<int>(
                name: "status",
                table: "orders",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "driver_id",
                table: "deliveries",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<DateOnly>(
                name: "scheduled_date",
                table: "deliveries",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<TimeOnly>(
                name: "scheduled_time",
                table: "deliveries",
                type: "time without time zone",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));

            migrationBuilder.AddForeignKey(
                name: "fk_deliveries_application_user_driver_id",
                table: "deliveries",
                column: "driver_id",
                principalTable: "AspNetUsers",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_deliveries_application_user_driver_id",
                table: "deliveries");

            migrationBuilder.DropColumn(
                name: "scheduled_date",
                table: "deliveries");

            migrationBuilder.DropColumn(
                name: "scheduled_time",
                table: "deliveries");

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "orders",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "driver_id",
                table: "deliveries",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_date",
                table: "categories",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_date",
                table: "categories",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "driver_vehicles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    driver_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    vehicle_number = table.Column<string>(type: "text", nullable: false),
                    vehicle_type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_driver_vehicles", x => x.id);
                    table.ForeignKey(
                        name: "fk_driver_vehicles_application_user_driver_id",
                        column: x => x.driver_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_driver_vehicles_driver_id",
                table: "driver_vehicles",
                column: "driver_id");

            migrationBuilder.AddForeignKey(
                name: "fk_deliveries_application_user_driver_id",
                table: "deliveries",
                column: "driver_id",
                principalTable: "AspNetUsers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
