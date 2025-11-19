using Microsoft.EntityFrameworkCore;
using SA.Tourism.Business.Infrastructure.Data;
using SA.Tourism.Business.Infrastructure.Repositories;
using SA.Tourism.Business.Models;
using System;
using System.Threading.Tasks;
using Xunit;

namespace SA.Tourism.Business.Tests
{
    public class BusinessRepositoryTests
    {
        [Fact]
        public async Task AddAndGetBusiness_WorksWithInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<BusinessDbContext>()
                .UseInMemoryDatabase(databaseName: "test_db")
                .Options;

            await using var db = new BusinessDbContext(options);
            var repo = new BusinessRepository(db);

            var b = new Business { Name = "Test Inn", Type = "B&B", RegionCode = "GP" };
            var created = await repo.AddAsync(b);

            var fetched = await repo.GetAsync(created.Id);
            Assert.NotNull(fetched);
            Assert.Equal("Test Inn", fetched!.Name);
        }
    }
}
