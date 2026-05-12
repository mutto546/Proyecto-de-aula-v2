using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RumbasAPI.Services;

namespace RumbasAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : BaseController
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Obtiene la información del usuario autenticado.
        /// </summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = GetUserId();
            var user = await _userService.GetCurrentUserAsync(userId);
            return Ok(user);
        }
    }
}
