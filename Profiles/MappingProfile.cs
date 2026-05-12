using AutoMapper;
using RumbasAPI.DTOs.Auth;
using RumbasAPI.DTOs.Clientes;
using RumbasAPI.DTOs.Rumbas;
using RumbasAPI.DTOs.Users;
using RumbasAPI.Models;

namespace RumbasAPI.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User -> UserDto
            CreateMap<User, UserDto>();

            // Rumba mappings
            CreateMap<Rumba, RumbaDto>()
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado.ToString()))
                .ForMember(dest => dest.ClienteNombre, opt => opt.MapFrom(src => src.Cliente != null ? src.Cliente.Nombre : null));

            CreateMap<CreateRumbaDto, Rumba>();
            CreateMap<UpdateRumbaDto, Rumba>();

            // Cliente mappings
            CreateMap<Cliente, ClienteDto>();
            CreateMap<CreateClienteDto, Cliente>();
            CreateMap<UpdateClienteDto, Cliente>();
        }
    }
}
