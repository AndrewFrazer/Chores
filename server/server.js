/* eslint-disable no-console */
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const uuidv4 = require('uuid/v4');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  input ChoreInput {
    chore: String
    points: Int
  }

  type User {
    id: ID!
    name: String
  }

  type Query {
    getUsers: [User]
    getPoints(id: ID): Int
    getChores(id: ID): [String]
  }

  type Mutation {
    setChore(id: ID, input: ChoreInput): Int
  }
`);

class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class Chore {
  constructor(id, {chore, points}) {
    this.userId = id;
    this.chore = chore;
    this.points = points;
  }
}

var userDb = {};
userDb[uuidv4()] = "Andy";
userDb[uuidv4()] = "Torie";
var choreDb = [];

// The root provides a resolver function for each API endpoint
const root = {
  getUsers: () => {
    var userArray = [];
    for (const userId in userDb) {
      var user = new User(userId, userDb[userId])
      userArray.push(user);
    }
    return userArray;
  },
  getPoints: function ({id}) {
    let chores = choreDb.filter(x => x.userId == id);
    let totalPoints = 0;
    chores.forEach(chore => {
      totalPoints += chore.points
    });
    return totalPoints;
  },
  getChores: function ({id}) {
    let chores = choreDb.filter(x => x.userId == id);
    let choreNames = [];
    chores.forEach(chore => {
      choreNames.push(chore.chore);
    });
    return choreNames;
  },
  setChore: function ({id, input}) {
    choreDb.push(new Chore(id, input));
    return input.points;
  },
};

const app = express();
app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');