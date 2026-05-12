using AutoMapper;
using RumbasAPI.DTOs.Clientes;
using RumbasAPI.Models;
using RumbasAPI.Repositories;

namespace RumbasAPI.Services
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly IMapper _mapper;

        public ClienteService(IClienteRepository clienteRepository, IMapper mapper)
        {
            _clienteRepository = clienteRepository;
            _mapper = mapper;
        }

        public async Task<List<ClienteDto>> GetAllAsync(int userId)
        {
            var clientes = await _clienteRepository.GetAllByUserIdAsync(userId);
            return _mapper.Map<List<ClienteDto>>(clientes);
        }

        public async Task<ClienteDto> CreateAsync(CreateClienteDto dto, int userId)
        {
            var cliente = _mapper.Map<Cliente>(dto);
            cliente.UserId = userId;

            var created = await _clienteRepository.CreateAsync(cliente);
            return _mapper.Map<ClienteDto>(created);
        }

        public async Task<ClienteDto> UpdateAsync(int id, UpdateClienteDto dto, int userId)
        {
            var cliente = await _clienteRepository.GetByIdAsync(id);

            if (cliente == null || cliente.UserId != userId)
            {
                throw new ApplicationException("Cliente no encontrado o no tienes permisos.");
            }

            cliente.Nombre = dto.Nombre;
            cliente.Email = dto.Email;
            cliente.Telefono = dto.Telefono;

            await _clienteRepository.UpdateAsync(cliente);
            return _mapper.Map<ClienteDto>(cliente);
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var cliente = await _clienteRepository.GetByIdAsync(id);

            if (cliente == null || cliente.UserId != userId)
            {
                throw new ApplicationException("Cliente no encontrado o no tienes permisos.");
            }

            await _clienteRepository.DeleteAsync(cliente);
        }
    }
}
