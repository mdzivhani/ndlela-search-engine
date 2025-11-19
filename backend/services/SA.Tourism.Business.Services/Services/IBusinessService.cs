using SA.Tourism.Business.Models;
using System;
using System.Threading.Tasks;

namespace SA.Tourism.Business.Services
{
    public interface IBusinessService
    {
        Task<Business> CreateBusinessAsync(Business business);
        Task<Business?> GetBusinessAsync(Guid id);
    }
}
