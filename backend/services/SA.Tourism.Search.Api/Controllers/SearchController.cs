using Microsoft.AspNetCore.Mvc;
using SA.Tourism.Search.Models;
using SA.Tourism.Search.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SA.Tourism.Search.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _search;
        public SearchController(ISearchService search) { _search = search; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusinessIndexItem>>> Get([FromQuery] string? q, [FromQuery] string? region, [FromQuery] int? minStars)
        {
            var results = await _search.SearchAsync(q ?? string.Empty, region, minStars);
            return Ok(results);
        }

        [HttpPost("seed")]
        public async Task<IActionResult> Seed([FromBody] IEnumerable<BusinessIndexItem> items)
        {
            await _search.SeedAsync(items);
            return Accepted();
        }

        [HttpPost("index")]
        public async Task<IActionResult> Index([FromBody] BusinessIndexItem item)
        {
            await _search.IndexAsync(item);
            return CreatedAtAction(nameof(Get), new { q = item.Name }, item);
        }
    }
}
