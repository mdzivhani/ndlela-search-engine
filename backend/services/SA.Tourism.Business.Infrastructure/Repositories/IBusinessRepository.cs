using SA.Tourism.Business.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SA.Tourism.Business.Infrastructure.Repositories
{
    public interface IBusinessRepository
    {
        Task<Models.Business> AddAsync(Models.Business business);
        Task<Models.Business?> GetAsync(Guid id);
        Task<IEnumerable<Models.Business>> GetAllAsync();
    }
}
