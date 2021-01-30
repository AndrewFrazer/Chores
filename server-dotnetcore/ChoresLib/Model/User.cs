using System;
using System.ComponentModel.DataAnnotations;

namespace ChoresLib.Model
{
    public class User
    {
        public User(Guid id, string name, int points)
        {
            Id = id;
            Name = name;
            Points = points;
        }

        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Points { get; set; }
    }
}
