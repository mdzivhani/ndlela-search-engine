using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SA.Tourism.Business.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStarRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StarRating",
                table: "Businesses",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StarRating",
                table: "Businesses");
        }
    }
}
