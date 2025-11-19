using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SA.Tourism.Search.Models;
using SA.Tourism.Search.Services;
using Xunit;

namespace SA.Tourism.Search.Tests
{
    public class SearchServiceTests
    {
        [Fact]
        public async Task SeedAndSearch_ReturnsExpectedResults()
        {
            var svc = new SearchService();
            var items = new List<BusinessIndexItem>
            {
                new BusinessIndexItem { Id = Guid.NewGuid(), Name = "Coastal Lodge", RegionCode = "WC", StarRating = 4, Description = "Ocean view" },
                new BusinessIndexItem { Id = Guid.NewGuid(), Name = "Mountain Retreat", RegionCode = "EC", StarRating = 5, Description = "Hiking and trails" },
            };

            await svc.SeedAsync(items);

            var res = (await svc.SearchAsync("coastal")).ToList();
            Assert.Single(res);
            Assert.Equal("Coastal Lodge", res.First().Name);
        }
    }
}
