using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.Types;
using ChoresLib.Model;

namespace ChoresLib.Schema
{
    public class ChoreType : ObjectGraphType<Chore>
    {
        public ChoreType()
        {
            Field(c => c.ChoreDescription);
            Field(c => c.Points);
            Field(c => c.EnteredTime);
            Field(c => c.UserId, type: typeof(IdGraphType));
        }
    }
}
