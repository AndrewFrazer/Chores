using ChoresLib.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ChoresLib.Postgres
{
    public class ChoresContext : DbContext
    {
        public ChoresContext(DbContextOptions<ChoresContext> options) : base(options) { }

        public DbSet<Chore> Chores { get; set; }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Chore>().ToTable("Chore");
        }
    }
}
