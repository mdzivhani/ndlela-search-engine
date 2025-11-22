using SA.Tourism.Search.Models;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace SA.Tourism.Search.Services
{
    // Enhanced search service that queries the Business API for data
    public class SearchService : ISearchService
    {
        private readonly HttpClient? _httpClient;
        private readonly string? _businessApiUrl;

        public SearchService(IHttpClientFactory? httpClientFactory = null)
        {
            if (httpClientFactory != null)
            {
                _httpClient = httpClientFactory.CreateClient("BusinessApi");
                _businessApiUrl = null; // URL should be configured in HttpClient
            }
        }

        public async Task IndexAsync(BusinessIndexItem item)
        {
            // For now, this is a no-op as we're reading from Business API
            // In production, this would index to OpenSearch/Elasticsearch
            await Task.CompletedTask;
        }

        public async Task SeedAsync(IEnumerable<BusinessIndexItem> items)
        {
            // For now, this is a no-op as we're reading from Business API
            // In production, this would bulk index to OpenSearch/Elasticsearch
            await Task.CompletedTask;
        }

        public async Task<IEnumerable<BusinessIndexItem>> SearchAsync(string query, string? region = null, int? minStars = null)
        {
            // If HttpClient is not configured, return empty results
            if (_httpClient == null)
            {
                return Enumerable.Empty<BusinessIndexItem>();
            }

            try
            {
                // Fetch all businesses from Business API
                var businesses = await _httpClient.GetFromJsonAsync<IEnumerable<BusinessDto>>("api/business");
                
                if (businesses == null)
                {
                    return Enumerable.Empty<BusinessIndexItem>();
                }

                // Convert to BusinessIndexItem
                var indexItems = businesses.Select(b => new BusinessIndexItem
                {
                    Id = b.Id,
                    Name = b.Name,
                    Type = b.Type,
                    RegionCode = b.RegionCode,
                    Description = b.Description,
                    Latitude = b.Latitude,
                    Longitude = b.Longitude,
                    StarRating = b.StarRating
                });

                // Apply search filters
                var q = (query ?? string.Empty).Trim().ToLowerInvariant();
                var results = indexItems.AsEnumerable();

                if (!string.IsNullOrEmpty(q))
                {
                    results = results.Where(b => 
                        b.Name.ToLowerInvariant().Contains(q) || 
                        (b.Description ?? string.Empty).ToLowerInvariant().Contains(q) ||
                        (b.Type ?? string.Empty).ToLowerInvariant().Contains(q)
                    );
                }

                if (!string.IsNullOrEmpty(region))
                {
                    results = results.Where(b => b.RegionCode == region);
                }

                if (minStars.HasValue)
                {
                    results = results.Where(b => (b.StarRating ?? 0) >= minStars.Value);
                }

                return results.OrderByDescending(b => b.StarRating).ThenBy(b => b.Name).ToList();
            }
            catch (System.Exception ex)
            {
                // Log error in production
                // For now, return empty results to prevent application crashes
                // TODO: Add proper logging framework (e.g., ILogger)
                System.Console.WriteLine($"Search error: {ex.Message}");
                return Enumerable.Empty<BusinessIndexItem>();
            }
        }

        // DTO to match Business API response
        private class BusinessDto
        {
            public System.Guid Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string Type { get; set; } = string.Empty;
            public string RegionCode { get; set; } = string.Empty;
            public string? Description { get; set; }
            public double? Latitude { get; set; }
            public double? Longitude { get; set; }
            public int? StarRating { get; set; }
        }
    }
}
