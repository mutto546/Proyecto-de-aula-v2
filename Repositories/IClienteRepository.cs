using RumbasAPI.Models;

namespace RumbasAPI.Repositories
{
    public interface IClienteRepository
    {
        Task<List<Cliente>> GetAllByUserIdAsync(int userId);
        Task<Cliente?> GetByIdAsync(int id);
        Task<Cliente> CreateAsync(Cliente cliente);
        Task<Cliente> UpdateAsync(Cliente cliente);
        Task DeleteAsync(Cliente cliente);
    }
}
