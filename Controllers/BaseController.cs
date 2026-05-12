using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace RumbasAPI.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        /// <summary>
        /// Obtiene el ID del usuario autenticado desde los claims del JWT.
        /// </summary>
        protected int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("No se pudo identificar al usuario.");
            }

            return userId;
        }
    }
}
