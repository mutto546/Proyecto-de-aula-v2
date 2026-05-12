using RumbasAPI.DTOs.Clientes;

namespace RumbasAPI.Services
{
    public interface IClienteService
    {
        Task<List<ClienteDto>> GetAllAsync(int userId);
        Task<ClienteDto> CreateAsync(CreateClienteDto dto, int userId);
        Task<ClienteDto> UpdateAsync(int id, UpdateClienteDto dto, int userId);
        Task DeleteAsync(int id, int userId);
    }
}
