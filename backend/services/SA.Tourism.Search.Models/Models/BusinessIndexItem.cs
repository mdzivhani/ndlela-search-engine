using System;

namespace SA.Tourism.Search.Models
{
    public class BusinessIndexItem
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string RegionCode { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Description { get; set; }
        public int? StarRating { get; set; }
    }
}
