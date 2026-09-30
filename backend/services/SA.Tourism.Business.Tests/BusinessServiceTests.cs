using System.Threading.Tasks;
using Xunit;
using SA.Tourism.Business.Services;
using SA.Tourism.Business.Models;
using SA.Tourism.Business.Infrastructure.Repositories;
using Moq;

namespace SA.Tourism.Business.Tests
{
    public class BusinessServiceTests
    {
        [Fact]
        public async Task CreateBusiness_ShouldReturnBusinessWithId()
        {
            // Arrange
            var repository = new Mock<IBusinessRepository>();
            var svc = new BusinessService(repository.Object);
            var model = new Models.Business { Name = "Test Lodge", Type = "Lodge", RegionCode = "WC" };
            repository.Setup(r => r.AddAsync(model)).ReturnsAsync(model);

            // Act
            var created = await svc.CreateBusinessAsync(model);

            // Assert
            Assert.NotNull(created);
            Assert.NotEqual(System.Guid.Empty, created.Id);
            Assert.Equal("Test Lodge", created.Name);
            repository.Verify(r => r.AddAsync(model), Times.Once);
        }
    }
}
