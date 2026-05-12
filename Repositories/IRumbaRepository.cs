using RumbasAPI.Models;

namespace RumbasAPI.Repositories
{
    public interface IRumbaRepository
    {
        Task<List<Rumba>> GetAllByUserIdAsync(int userId);
        Task<Rumba?> GetByIdAsync(int id);
        Task<Rumba> CreateAsync(Rumba rumba);
        Task<Rumba> UpdateAsync(Rumba rumba);
        Task DeleteAsync(Rumba rumba);
        Task DeleteMultipleAsync(List<Rumba> rumbas);
    }
}
