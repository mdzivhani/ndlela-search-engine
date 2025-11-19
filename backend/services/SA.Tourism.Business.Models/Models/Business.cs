using System;

namespace SA.Tourism.Business.Models
{
    public class Business
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string RegionCode { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
