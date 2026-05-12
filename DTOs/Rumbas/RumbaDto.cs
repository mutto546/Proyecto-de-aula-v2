using RumbasAPI.Models;

namespace RumbasAPI.DTOs.Rumbas
{
    public class RumbaDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaLimite { get; set; }
        public int ClienteId { get; set; }
        public string? ClienteNombre { get; set; }
    }
}
