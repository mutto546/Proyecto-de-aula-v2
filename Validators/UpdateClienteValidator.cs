using FluentValidation;
using RumbasAPI.DTOs.Clientes;

namespace RumbasAPI.Validators
{
    public class UpdateClienteValidator : AbstractValidator<UpdateClienteDto>
    {
        public UpdateClienteValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es requerido.")
                .MaximumLength(100).WithMessage("El nombre no puede exceder 100 caracteres.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("El email es requerido.")
                .EmailAddress().WithMessage("El formato del email no es válido.")
                .MaximumLength(200).WithMessage("El email no puede exceder 200 caracteres.");

            RuleFor(x => x.Telefono)
                .MaximumLength(20).WithMessage("El teléfono no puede exceder 20 caracteres.");
        }
    }
}
