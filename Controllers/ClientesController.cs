using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RumbasAPI.DTOs.Clientes;
using RumbasAPI.Services;

namespace RumbasAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class ClientesController : BaseController
    {
        private readonly IClienteService _clienteService;

        public ClientesController(IClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        /// <summary>
        /// Obtiene todos los clientes del usuario autenticado.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var clientes = await _clienteService.GetAllAsync(userId);
            return Ok(clientes);
        }

        /// <summary>
        /// Crea un nuevo cliente.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClienteDto dto)
        {
            var userId = GetUserId();
            var cliente = await _clienteService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetAll), new { id = cliente.Id }, cliente);
        }

        /// <summary>
        /// Actualiza un cliente existente.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClienteDto dto)
        {
            var userId = GetUserId();
            var cliente = await _clienteService.UpdateAsync(id, dto, userId);
            return Ok(cliente);
        }

        /// <summary>
        /// Elimina un cliente por su ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            await _clienteService.DeleteAsync(id, userId);
            return NoContent();
        }
    }
}
