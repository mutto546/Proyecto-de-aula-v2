using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RumbasAPI.DTOs.Rumbas;
using RumbasAPI.Services;

namespace RumbasAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class RumbasController : BaseController
    {
        private readonly IRumbaService _rumbaService;

        public RumbasController(IRumbaService rumbaService)
        {
            _rumbaService = rumbaService;
        }

        /// <summary>
        /// Obtiene todas las rumbas del usuario autenticado.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var rumbas = await _rumbaService.GetAllAsync(userId);
            return Ok(rumbas);
        }

        /// <summary>
        /// Crea una nueva rumba.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRumbaDto dto)
        {
            var userId = GetUserId();
            var rumba = await _rumbaService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetAll), new { id = rumba.Id }, rumba);
        }

        /// <summary>
        /// Actualiza una rumba existente.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRumbaDto dto)
        {
            var userId = GetUserId();
            var rumba = await _rumbaService.UpdateAsync(id, dto, userId);
            return Ok(rumba);
        }

        /// <summary>
        /// Elimina una rumba por su ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            await _rumbaService.DeleteAsync(id, userId);
            return NoContent();
        }

        /// <summary>
        /// Elimina múltiples rumbas por sus IDs.
        /// </summary>
        [HttpDelete]
        public async Task<IActionResult> DeleteMultiple([FromBody] DeleteMultipleRumbasDto dto)
        {
            var userId = GetUserId();
            await _rumbaService.DeleteMultipleAsync(dto.Ids, userId);
            return NoContent();
        }

        /// <summary>
        /// Marca una rumba como completada.
        /// </summary>
        [HttpPatch("{id}/completar")]
        public async Task<IActionResult> Completar(int id)
        {
            var userId = GetUserId();
            var rumba = await _rumbaService.CompletarAsync(id, userId);
            return Ok(rumba);
        }
    }
}
