using Microsoft.EntityFrameworkCore;
using SA.Tourism.Business.Models;

namespace SA.Tourism.Business.Infrastructure.Data
{
    public class BusinessDbContext : DbContext
    {
        public BusinessDbContext(DbContextOptions<BusinessDbContext> options) : base(options) { }

        public DbSet<Business> Businesses => Set<Business>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Business>(b => {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name).IsRequired().HasMaxLength(200);
                b.Property(x => x.Type).HasMaxLength(100);
                b.Property(x => x.RegionCode).HasMaxLength(10);
            });
        }
    }
}
