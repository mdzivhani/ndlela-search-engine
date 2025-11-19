using System.Threading.Tasks;
using Xunit;
using SA.Tourism.Business.Services;
using SA.Tourism.Business.Models;

namespace SA.Tourism.Business.Tests
{
    public class BusinessServiceTests
    {
        [Fact]
        public async Task CreateBusiness_ShouldReturnBusinessWithId()
        {
            // Arrange
            var svc = new BusinessService();
            var model = new Business { Name = "Test Lodge", Type = "Lodge", RegionCode = "WC" };

            // Act
            var created = await svc.CreateBusinessAsync(model);

            // Assert
            Assert.NotNull(created);
            Assert.NotEqual(System.Guid.Empty, created.Id);
            Assert.Equal("Test Lodge", created.Name);
        }
    }
}
