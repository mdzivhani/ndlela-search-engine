using SA.Tourism.Search.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SA.Tourism.Search.Services
{
    // Simple in-memory index for development and tests. Replace with OpenSearch/Elasticsearch for production.
    public class SearchService : ISearchService
    {
        private readonly ConcurrentDictionary<System.Guid, BusinessIndexItem> _index = new();

        public Task IndexAsync(BusinessIndexItem item)
        {
            _index[item.Id] = item;
            return Task.CompletedTask;
        }

        public Task SeedAsync(IEnumerable<BusinessIndexItem> items)
        {
            foreach (var it in items) _index[it.Id] = it;
            return Task.CompletedTask;
        }

        public Task<IEnumerable<BusinessIndexItem>> SearchAsync(string query, string? region = null, int? minStars = null)
        {
            var q = (query ?? string.Empty).Trim().ToLowerInvariant();
            var results = _index.Values.AsEnumerable();
            if (!string.IsNullOrEmpty(q))
            {
                results = results.Where(b => b.Name.ToLowerInvariant().Contains(q) || (b.Description ?? string.Empty).ToLowerInvariant().Contains(q));
            }
            if (!string.IsNullOrEmpty(region)) results = results.Where(b => b.RegionCode == region);
            if (minStars.HasValue) results = results.Where(b => (b.StarRating ?? 0) >= minStars.Value);
            return Task.FromResult(results.OrderByDescending(b => b.StarRating).ThenBy(b => b.Name).AsEnumerable());
        }
    }
}
