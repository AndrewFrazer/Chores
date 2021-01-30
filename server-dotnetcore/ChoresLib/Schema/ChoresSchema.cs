using System;
using System.Collections.Generic;
using System.Text;
using GraphQL;
using GraphQL.Types;

namespace ChoresLib.Schema
{
    public class ChoresSchema : GraphQL.Types.Schema
    {
        public ChoresSchema(Query query, ChoreMutation mutation, IDependencyResolver resolver)
        {
            Query = query;
            Mutation = mutation;
            DependencyResolver = resolver;
        }
    }
}
