using RumbasAPI.DTOs.Rumbas;

namespace RumbasAPI.Services
{
    public interface IRumbaService
    {
        Task<List<RumbaDto>> GetAllAsync(int userId);
        Task<RumbaDto> CreateAsync(CreateRumbaDto dto, int userId);
        Task<RumbaDto> UpdateAsync(int id, UpdateRumbaDto dto, int userId);
        Task DeleteAsync(int id, int userId);
        Task DeleteMultipleAsync(List<int> ids, int userId);
        Task<RumbaDto> CompletarAsync(int id, int userId);
    }
}
