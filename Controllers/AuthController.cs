using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RumbasAPI.DTOs.Auth;
using RumbasAPI.Services;

namespace RumbasAPI.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : BaseController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Registra un nuevo usuario.
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Inicia sesión y devuelve un JWT.
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Cierra sesión (invalidación del token en el cliente).
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // En JWT stateless, el logout se maneja eliminando el token en el cliente.
            return Ok(new { Message = "Sesión cerrada correctamente." });
        }
    }
}
