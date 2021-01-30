using System;
using System.Collections.Generic;
using System.Text;
using GraphQL;
using GraphQL.Types;
using ChoresLib.Model;
using ChoresLib.Services;

namespace ChoresLib.Schema
{
    public class ChoreMutation : ObjectGraphType<object>
    {
        public ChoreMutation(IChoreService chores)
        {
            Name = "Mutation";
            Field<ChoreType>(
                "setChore",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" },
                    new QueryArgument<NonNullGraphType<ChoreInputType>> { Name = "chore" }),
                resolve: context =>
                {
                    var userId = context.GetArgument<Guid>("userId");
                    var choreInput = context.GetArgument<ChoreInput>("chore");
                    var chore = new Chore(Guid.NewGuid(), userId, choreInput.ChoreDescription, choreInput.Points, DateTime.UtcNow);
                    return chores.SetChoreAsync(chore);
                }
            );
        }
    }
}
