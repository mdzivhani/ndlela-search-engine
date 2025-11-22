using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SA.Tourism.Business.Models;
using SA.Tourism.Business.Services;
using System;
using System.Collections.Generic;

namespace SA.Tourism.Business.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessController : ControllerBase
    {
        private readonly IBusinessService _service;
        public BusinessController(IBusinessService service) { _service = service; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Models.Business>>> GetAll()
        {
            var businesses = await _service.GetAllBusinessesAsync();
            return Ok(businesses);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Models.Business>> Get(Guid id)
        {
            var b = await _service.GetBusinessAsync(id);
            if (b == null) return NotFound();
            return Ok(b);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Models.Business>> Create([FromBody] Models.Business business)
        {
            var created = await _service.CreateBusinessAsync(business);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPost("seed")]
        [AllowAnonymous]
        public async Task<ActionResult> Seed()
        {
            // Seed with sample tourism data
            var sampleBusinesses = new List<Models.Business>
            {
                new Models.Business
                {
                    Name = "Kruger Game Lodge",
                    Type = "Accommodation",
                    RegionCode = "MP",
                    Description = "Luxury safari lodge offering guided game drives and accommodation.",
                    Latitude = -24.0045,
                    Longitude = 31.4659,
                    StarRating = 5
                },
                new Models.Business
                {
                    Name = "Table Mountain Tours",
                    Type = "Tours",
                    RegionCode = "WC",
                    Description = "Guided hiking and cable car tours with stunning views.",
                    Latitude = -33.9628,
                    Longitude = 18.4098,
                    StarRating = 5
                },
                new Models.Business
                {
                    Name = "Cape Town Spa & Wellness",
                    Type = "Wellness",
                    RegionCode = "WC",
                    Description = "Full-service spa with traditional African treatments.",
                    Latitude = -33.9249,
                    Longitude = 18.4241,
                    StarRating = 5
                },
                new Models.Business
                {
                    Name = "Winelands Wine Tasting",
                    Type = "Food & Drink",
                    RegionCode = "WC",
                    Description = "Premium wine tasting experiences in Stellenbosch.",
                    Latitude = -33.9321,
                    Longitude = 18.8602,
                    StarRating = 5
                },
                new Models.Business
                {
                    Name = "Garden Route Adventure Park",
                    Type = "Activities",
                    RegionCode = "WC",
                    Description = "Outdoor activities including zip-lining, hiking, and rock climbing.",
                    Latitude = -34.0407,
                    Longitude = 23.0526,
                    StarRating = 4
                },
                new Models.Business
                {
                    Name = "East London Beach Resort",
                    Type = "Accommodation",
                    RegionCode = "EC",
                    Description = "Beachfront resort with water sports and entertainment.",
                    Latitude = -33.0153,
                    Longitude = 27.9116,
                    StarRating = 4
                },
                new Models.Business
                {
                    Name = "Durban Aquarium & Museum",
                    Type = "Attractions",
                    RegionCode = "KZN",
                    Description = "Interactive aquarium and cultural museum experiences.",
                    Latitude = -29.8587,
                    Longitude = 31.0218,
                    StarRating = 5
                },
                new Models.Business
                {
                    Name = "Knysna Oyster Farm Tour",
                    Type = "Food & Drink",
                    RegionCode = "WC",
                    Description = "Oyster farming demonstrations and seafood restaurants.",
                    Latitude = -34.0361,
                    Longitude = 23.0471,
                    StarRating = 5
                },
                new Models.Business
                {
                    Name = "Mpumalanga Hiking Trail",
                    Type = "Tours",
                    RegionCode = "MP",
                    Description = "Multi-day hiking expeditions through Drakensberg Mountains.",
                    Latitude = -25.4753,
                    Longitude = 30.9694,
                    StarRating = 5
                },
                new Models.Business
                {
                    Name = "Johannesburg Arts District",
                    Type = "Attractions",
                    RegionCode = "GP",
                    Description = "Gallery tours, street art, and cultural performances.",
                    Latitude = -26.2041,
                    Longitude = 28.0473,
                    StarRating = 4
                }
            };

            foreach (var business in sampleBusinesses)
            {
                await _service.CreateBusinessAsync(business);
            }

            return Ok(new { message = "Database seeded successfully", count = sampleBusinesses.Count });
        }
    }
}
