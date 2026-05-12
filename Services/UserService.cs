using AutoMapper;
using RumbasAPI.DTOs.Users;
using RumbasAPI.Repositories;

namespace RumbasAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<UserDto> GetCurrentUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                throw new ApplicationException("Usuario no encontrado.");
            }

            return _mapper.Map<UserDto>(user);
        }
    }
}
