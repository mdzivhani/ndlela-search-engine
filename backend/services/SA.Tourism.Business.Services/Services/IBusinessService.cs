using SA.Tourism.Business.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SA.Tourism.Business.Services
{
    public interface IBusinessService
    {
        Task<Models.Business> CreateBusinessAsync(Models.Business business);
        Task<Models.Business?> GetBusinessAsync(Guid id);
        Task<IEnumerable<Models.Business>> GetAllBusinessesAsync();
    }
}
