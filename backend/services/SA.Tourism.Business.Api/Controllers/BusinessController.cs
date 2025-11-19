using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
    }
}
