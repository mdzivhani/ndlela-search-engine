using SA.Tourism.Search.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SA.Tourism.Search.Services
{
    public interface ISearchService
    {
        Task IndexAsync(BusinessIndexItem item);
        Task<IEnumerable<BusinessIndexItem>> SearchAsync(string query, string? region = null, int? minStars = null);
        Task SeedAsync(IEnumerable<BusinessIndexItem> items);
    }
}
