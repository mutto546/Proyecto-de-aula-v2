namespace RumbasAPI.DTOs.Rumbas
{
    public class CreateRumbaDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaLimite { get; set; }
        public int ClienteId { get; set; }
    }
}
