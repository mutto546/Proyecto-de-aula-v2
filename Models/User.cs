namespace RumbasAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation properties
        public ICollection<Rumba> Rumbas { get; set; } = new List<Rumba>();
        public ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();
    }
}
