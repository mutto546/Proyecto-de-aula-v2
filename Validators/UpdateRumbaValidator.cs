using FluentValidation;
using RumbasAPI.DTOs.Rumbas;

namespace RumbasAPI.Validators
{
    public class UpdateRumbaValidator : AbstractValidator<UpdateRumbaDto>
    {
        public UpdateRumbaValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es requerido.")
                .MaximumLength(200).WithMessage("El nombre no puede exceder 200 caracteres.");

            RuleFor(x => x.Descripcion)
                .MaximumLength(1000).WithMessage("La descripción no puede exceder 1000 caracteres.");

            RuleFor(x => x.FechaLimite)
                .GreaterThan(DateTime.Now).WithMessage("La fecha límite debe ser futura.");

            RuleFor(x => x.ClienteId)
                .GreaterThan(0).WithMessage("Debe asignar un cliente válido.");
        }
    }
}
