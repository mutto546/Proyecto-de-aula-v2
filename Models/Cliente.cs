namespace RumbasAPI.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;

        // Foreign key
        public int UserId { get; set; }

        // Navigation properties
        public User? User { get; set; }
        public ICollection<Rumba> Rumbas { get; set; } = new List<Rumba>();
    }
}
