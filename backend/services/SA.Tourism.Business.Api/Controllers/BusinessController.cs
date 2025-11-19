using Microsoft.AspNetCore.Mvc;
using SA.Tourism.Business.Models;
using SA.Tourism.Business.Services;
using System;

namespace SA.Tourism.Business.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessController : ControllerBase
    {
        private readonly IBusinessService _service;
        public BusinessController(IBusinessService service) { _service = service; }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Business>> Get(Guid id)
        {
            var b = await _service.GetBusinessAsync(id);
            if (b == null) return NotFound();
            return Ok(b);
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult<Business>> Create([FromBody] Business business)
        {
            var created = await _service.CreateBusinessAsync(business);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
    }
}
