using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.Types;
using ChoresLib.Services;

namespace ChoresLib.Schema
{
    public class Query : ObjectGraphType<object>
    {
        public Query(IUserService users)
        {
            Name = "Query";
            Field<ListGraphType<UserType>>(
                "users",
                resolve: context => users.GetUsersAsync()
                );
            Field<UserType>(
                "user",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }),
                resolve: context =>
                {
                    var id = context.GetArgument<Guid>("id");
                    return users.GetUserByIdAsync(id);
                }
            );
        }
    }
}
