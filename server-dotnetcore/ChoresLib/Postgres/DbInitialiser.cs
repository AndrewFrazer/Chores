using ChoresLib.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChoresLib.Postgres
{
    public static class DbInitializer
    {
        public static void Initialize(ChoresContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return;   // DB has been seeded
            }

            var andyId = Guid.NewGuid();
            int points = 0;

            var first = 153744120;
            var last = 155636280;
            var day = 8641;

            for (var i = first; i < last; i += day)
            {
                if (!Equals(i%2, 0))
                {
                    context.Chores.Add(new Chore(Guid.NewGuid(), andyId, "Washing Up", 1, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse("" + i.ToString() + "0000")).DateTime));
                    context.Chores.Add(new Chore(Guid.NewGuid(), andyId, "Putting Away", 1, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse("" + (i + 16).ToString() + "0000")).DateTime));
                    points += 2;
                }
                if (!Equals(i%3, 0))
                {
                    context.Chores.Add(new Chore(Guid.NewGuid(), andyId, "Cleaning the Surfaces", 1, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse("" + i.ToString() + "0000")).DateTime));
                    points++;
                }
                if (!Equals(i%10, 0))
                {
                    context.Chores.Add(new Chore(Guid.NewGuid(), andyId, "Setting off Laundry", 1, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse("" + i.ToString() + "0000")).DateTime));
                    context.Chores.Add(new Chore(Guid.NewGuid(), andyId, "Taking down Laundry", 1, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse("" + (i + 16).ToString() + "0000")).DateTime));
                    context.Chores.Add(new Chore(Guid.NewGuid(), andyId, "Hanging up Laundry", 1, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse("" + (i + 54).ToString() + "0000")).DateTime));
                    points += 3;
                }
                if (!Equals(i%11, 0))
                {
                    context.Chores.Add(new Chore(Guid.NewGuid(), andyId, "Vacuuming", 1, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse("" + i.ToString() + "0000")).DateTime));
                    points++;
                }
                if (!Equals(i%19, 0))
                {
                    context.Chores.Add(new Chore(Guid.NewGuid(), andyId, "Cleaning the Hob", 1, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse("" + i.ToString() + "0000")).DateTime));
                    points++;
                }
            }
            context.SaveChanges();

            var users = new List<User>()
            {
                new User(andyId, "Andy", points),
                new User(Guid.NewGuid(), "Torie", 0)
            };

            foreach (var user in users)
            {
                context.Users.Add(user);
            }
            context.SaveChanges();
        }
    }
}