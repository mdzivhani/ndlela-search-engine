using SA.Tourism.Business.Models;
using System;
using System.Threading.Tasks;

namespace SA.Tourism.Business.Infrastructure.Repositories
{
    public interface IBusinessRepository
    {
        Task<Business> AddAsync(Business business);
        Task<Business?> GetAsync(Guid id);
    }
}
