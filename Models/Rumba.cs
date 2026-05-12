namespace RumbasAPI.Models
{
    public class Rumba
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public RumbaEstado Estado { get; set; } = RumbaEstado.Pendiente;
        public DateTime FechaLimite { get; set; }

        // Foreign keys
        public int ClienteId { get; set; }
        public int UserId { get; set; }

        // Navigation properties
        public Cliente? Cliente { get; set; }
        public User? User { get; set; }
    }
}
