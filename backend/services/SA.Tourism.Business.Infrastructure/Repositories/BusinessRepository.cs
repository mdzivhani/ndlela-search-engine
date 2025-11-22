using Microsoft.EntityFrameworkCore;
using SA.Tourism.Business.Infrastructure.Data;
using SA.Tourism.Business.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SA.Tourism.Business.Infrastructure.Repositories
{
    public class BusinessRepository : IBusinessRepository
    {
        private readonly BusinessDbContext _db;
        public BusinessRepository(BusinessDbContext db) { _db = db; }

        public async Task<Models.Business> AddAsync(Models.Business business)
        {
            business.Id = Guid.NewGuid();
            _db.Businesses.Add(business);
            await _db.SaveChangesAsync();
            return business;
        }

        public async Task<Models.Business?> GetAsync(Guid id)
        {
            return await _db.Businesses.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<IEnumerable<Models.Business>> GetAllAsync()
        {
            return await _db.Businesses.AsNoTracking().ToListAsync();
        }
    }
}
