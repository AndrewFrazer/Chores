using ChoresLib.Model;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using ChoresLib.Postgres;

namespace ChoresLib.Services
{
    public class ChoreService : IChoreService
    {
        private ChoresContext _context;

        public ChoreService(ChoresContext ctx, IUserService _userService)
        {
            _context = ctx;
        }

        public IEnumerable<Chore> GetChoresByUserId(Guid userId)
        {
            Console.WriteLine($"GetChoresByUserId: {userId}");
            return GetChoresByUserIdAsync(userId).Result;
        }

        public Task<IEnumerable<Chore>> GetChoresByUserIdAsync(Guid userId)
        {
            Console.WriteLine($"GetChoresByUserIdAsync: {userId}");
            return Task.FromResult(_context.Chores.Where(c => Equals(c.UserId, userId)).AsEnumerable());
        }

        public Task<Chore> SetChoreAsync(Chore chore)
        {
            Console.WriteLine($"GetChoresByUserIdAsync: {chore.UserId}");
            _context.Chores.Add(chore);
            SetPoints(chore.UserId, chore.Points);
            return Task.FromResult(chore);
        }

        public User SetPoints(Guid userId, int points)
        {
            User user = _context.Users.Single(u => Equals(u.Id, userId));
            user.Points += points;
            return user;
        }
    }
    public interface IChoreService
    {
        IEnumerable<Chore> GetChoresByUserId(Guid userId);
        Task<IEnumerable<Chore>> GetChoresByUserIdAsync(Guid userId);
        Task<Chore> SetChoreAsync(Chore chore);
        User SetPoints(Guid userId, int points);
    }
}
