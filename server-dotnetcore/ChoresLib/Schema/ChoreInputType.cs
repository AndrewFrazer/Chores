using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.Types;

namespace ChoresLib.Schema
{
    public class ChoreInputType : InputObjectGraphType
    {
        public ChoreInputType()
        {
            Name = "ChoreInput";
            Field<NonNullGraphType<StringGraphType>>("choreDescription");
            Field<NonNullGraphType<IntGraphType>>("points");
        }
    }
}
