using ChoresLib.Model;
using ChoresLib.Postgres;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChoresLib.Services
{
    public class UserService : IUserService
    {
        private ChoresContext _context;

        public UserService(ChoresContext ctx)
        {
            _context = ctx;
        }

        public User GetUserById(Guid id)
        {
            Console.WriteLine($"GetUserById: {id}");
            return GetUserByIdAsync(id).Result;
        }

        public Task<User> GetUserByIdAsync(Guid id)
        {
            Console.WriteLine($"GetUserByIdAsync: {id}");
            return Task.FromResult(_context.Users.Single(u => Equals(u.Id, id)));
        }

        public Task<IEnumerable<User>> GetUsersAsync()
        {
            Console.WriteLine("GetUsersAsync");
            return Task.FromResult(_context.Users.AsEnumerable());
        }
    }

    public interface IUserService
    {
        User GetUserById(Guid id);
        Task<User> GetUserByIdAsync(Guid id);
        Task<IEnumerable<User>> GetUsersAsync();
    }
}
