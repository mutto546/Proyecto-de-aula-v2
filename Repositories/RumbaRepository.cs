using Microsoft.EntityFrameworkCore;
using RumbasAPI.Data;
using RumbasAPI.Models;

namespace RumbasAPI.Repositories
{
    public class RumbaRepository : IRumbaRepository
    {
        private readonly AppDbContext _context;

        public RumbaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Rumba>> GetAllByUserIdAsync(int userId)
        {
            return await _context.Rumbas
                .Include(r => r.Cliente)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.FechaLimite)
                .ToListAsync();
        }

        public async Task<Rumba?> GetByIdAsync(int id)
        {
            return await _context.Rumbas
                .Include(r => r.Cliente)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Rumba> CreateAsync(Rumba rumba)
        {
            _context.Rumbas.Add(rumba);
            await _context.SaveChangesAsync();
            return rumba;
        }

        public async Task<Rumba> UpdateAsync(Rumba rumba)
        {
            _context.Rumbas.Update(rumba);
            await _context.SaveChangesAsync();
            return rumba;
        }

        public async Task DeleteAsync(Rumba rumba)
        {
            _context.Rumbas.Remove(rumba);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMultipleAsync(List<Rumba> rumbas)
        {
            _context.Rumbas.RemoveRange(rumbas);
            await _context.SaveChangesAsync();
        }
    }
}
