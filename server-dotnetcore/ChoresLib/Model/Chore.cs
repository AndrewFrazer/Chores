using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ChoresLib.Model
{
    public class Chore
    {
        public Chore(Guid id, Guid userId, string choreDescription, int points, DateTime enteredTime)
        {
            Id = id;
            UserId = userId;
            ChoreDescription = choreDescription;
            Points = points;
            EnteredTime = enteredTime;
        }

        [Key]
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string ChoreDescription { get; set; }

        public int Points { get; set; }

        public DateTime EnteredTime { get; set; }
    }
}
