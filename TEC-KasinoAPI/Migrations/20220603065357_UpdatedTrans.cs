using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TEC_KasinoAPI.Migrations
{
    public partial class UpdatedTrans : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UN_Customers_Email",
                table: "Customers");

            migrationBuilder.AddColumn<bool>(
                name: "IsInternal",
                table: "Transactions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Customers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsInternal",
                table: "Transactions");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Customers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "UN_Customers_Email",
                table: "Customers",
                column: "Email",
                unique: true);
        }
    }
}
