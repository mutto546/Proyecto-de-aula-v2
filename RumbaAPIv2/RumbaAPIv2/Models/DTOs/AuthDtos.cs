using System.ComponentModel.DataAnnotations;

namespace RumbaAPI.Models.DTOs
{
    // --- REGISTRO ---
    public class RegisterDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El username es obligatorio")]
        [MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Solo letras, números y guión bajo")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [MinLength(6, ErrorMessage = "Mínimo 6 caracteres")]
        public string Password { get; set; } = string.Empty;
    }

    // --- LOGIN ---
    public class LoginDto
    {
        [Required(ErrorMessage = "El email es obligatorio")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        public string Password { get; set; } = string.Empty;
    }

    // --- RESPUESTA DE AUTH (lo que se devuelve al frontend) ---
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }

    // --- INFO DEL USUARIO (sin password) ---
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

    // --- SOLICITAR CÓDIGO DE RESET ---
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

    // --- VERIFICAR CÓDIGO Y CAMBIAR CONTRASEÑA ---
    public class ResetPasswordDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }

    // --- CAMBIO FORZADO (primer login tras reset) ---
    public class ChangePasswordDto
    {
        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }
