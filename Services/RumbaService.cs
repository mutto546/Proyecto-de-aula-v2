using AutoMapper;
using RumbasAPI.DTOs.Rumbas;
using RumbasAPI.Models;
using RumbasAPI.Repositories;

namespace RumbasAPI.Services
{
    public class RumbaService : IRumbaService
    {
        private readonly IRumbaRepository _rumbaRepository;
        private readonly IClienteRepository _clienteRepository;
        private readonly IMapper _mapper;

        public RumbaService(
            IRumbaRepository rumbaRepository,
            IClienteRepository clienteRepository,
            IMapper mapper)
        {
            _rumbaRepository = rumbaRepository;
            _clienteRepository = clienteRepository;
            _mapper = mapper;
        }

        public async Task<List<RumbaDto>> GetAllAsync(int userId)
        {
            var rumbas = await _rumbaRepository.GetAllByUserIdAsync(userId);
            return _mapper.Map<List<RumbaDto>>(rumbas);
        }

        public async Task<RumbaDto> CreateAsync(CreateRumbaDto dto, int userId)
        {
            // Verificar que el cliente pertenece al usuario
            var cliente = await _clienteRepository.GetByIdAsync(dto.ClienteId);
            if (cliente == null || cliente.UserId != userId)
            {
                throw new ApplicationException("El cliente no existe o no te pertenece.");
            }

            var rumba = _mapper.Map<Rumba>(dto);
            rumba.UserId = userId;
            rumba.Estado = RumbaEstado.Pendiente;

            var created = await _rumbaRepository.CreateAsync(rumba);

            // Recargar con Include para obtener el nombre del cliente
            var result = await _rumbaRepository.GetByIdAsync(created.Id);
            return _mapper.Map<RumbaDto>(result);
        }

        public async Task<RumbaDto> UpdateAsync(int id, UpdateRumbaDto dto, int userId)
        {
            var rumba = await _rumbaRepository.GetByIdAsync(id);

            if (rumba == null || rumba.UserId != userId)
            {
                throw new ApplicationException("Rumba no encontrada o no tienes permisos.");
            }

            // Verificar que el nuevo cliente pertenece al usuario
            var cliente = await _clienteRepository.GetByIdAsync(dto.ClienteId);
            if (cliente == null || cliente.UserId != userId)
            {
                throw new ApplicationException("El cliente no existe o no te pertenece.");
            }

            rumba.Nombre = dto.Nombre;
            rumba.Descripcion = dto.Descripcion;
            rumba.FechaLimite = dto.FechaLimite;
            rumba.ClienteId = dto.ClienteId;

            await _rumbaRepository.UpdateAsync(rumba);

            var result = await _rumbaRepository.GetByIdAsync(rumba.Id);
            return _mapper.Map<RumbaDto>(result);
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var rumba = await _rumbaRepository.GetByIdAsync(id);

            if (rumba == null || rumba.UserId != userId)
            {
                throw new ApplicationException("Rumba no encontrada o no tienes permisos.");
            }

            await _rumbaRepository.DeleteAsync(rumba);
        }

        public async Task DeleteMultipleAsync(List<int> ids, int userId)
        {
            var rumbas = new List<Rumba>();

            foreach (var id in ids)
            {
                var rumba = await _rumbaRepository.GetByIdAsync(id);

                if (rumba == null || rumba.UserId != userId)
                {
                    throw new ApplicationException($"Rumba con Id {id} no encontrada o no tienes permisos.");
                }

                rumbas.Add(rumba);
            }

            await _rumbaRepository.DeleteMultipleAsync(rumbas);
        }

        public async Task<RumbaDto> CompletarAsync(int id, int userId)
        {
            var rumba = await _rumbaRepository.GetByIdAsync(id);

            if (rumba == null || rumba.UserId != userId)
            {
                throw new ApplicationException("Rumba no encontrada o no tienes permisos.");
            }

            rumba.Estado = RumbaEstado.Completada;
            await _rumbaRepository.UpdateAsync(rumba);

            var result = await _rumbaRepository.GetByIdAsync(rumba.Id);
            return _mapper.Map<RumbaDto>(result);
        }
    }
}
