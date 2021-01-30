using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.Types;
using ChoresLib.Model;
using ChoresLib.Services;

namespace ChoresLib.Schema
{
    public class UserType : ObjectGraphType<User>
    {
        public UserType(IChoreService chores)
        {
            Field(u => u.Id, type: typeof(IdGraphType));
            Field(u => u.Name);
            Field(u => u.Points);
            Field<ListGraphType<ChoreType>, IEnumerable<Chore>>()
                .Name("chores")
                .ResolveAsync(context =>
                {
                    return chores.GetChoresByUserIdAsync(context.Source.Id);
            });
        }
    }
}
