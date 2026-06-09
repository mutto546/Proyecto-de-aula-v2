using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RumbaAPIv2.Migrations
{
    public partial class AddResetPassword : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResetCode",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetCodeExpiry",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MustChangePassword",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "ResetCode",          table: "Users");
            migrationBuilder.DropColumn(name: "ResetCodeExpiry",    table: "Users");
            migrationBuilder.DropColumn(name: "MustChangePassword", table: "Users");
        }
    }
}
