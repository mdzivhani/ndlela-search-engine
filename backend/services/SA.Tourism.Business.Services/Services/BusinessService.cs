using SA.Tourism.Business.Models;
using SA.Tourism.Business.Infrastructure.Repositories;
using System;
using System.Threading.Tasks;

namespace SA.Tourism.Business.Services
{
    public class BusinessService : IBusinessService
    {
        private readonly IBusinessRepository _repo;
        public BusinessService(IBusinessRepository repo) { _repo = repo; }

        public Task<Models.Business> CreateBusinessAsync(Models.Business business)
        {
            return _repo.AddAsync(business);
        }

        public Task<Models.Business?> GetBusinessAsync(Guid id)
        {
            return _repo.GetAsync(id);
        }
    }
}
