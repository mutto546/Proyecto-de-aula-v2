using RumbasAPI.DTOs.Users;

namespace RumbasAPI.Services
{
    public interface IUserService
    {
        Task<UserDto> GetCurrentUserAsync(int userId);
    }
}
