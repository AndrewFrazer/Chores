/* eslint-disable no-console */
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

// Setup type defs, using GraphQL schema language
const typeDefs = `
  input ChoreInput {
    chore: String
    points: Int
    time: Float
  }

  type User {
    id: ID
    name: String
    points: Int
  }

  type Chore {
    userId: ID
    chore: String
    points: Int
    time: Float
  }

  type Query {
    user(id: ID!): User
    users: [User]
    chores(userId: ID): [Chore]
  }

  type Mutation {
    setChore(userId: ID, input: ChoreInput): Int
  }
`;

// Classes could be moved to another file
class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class Chore {
  constructor(id, { chore, points, time }) {
    this.userId = id;
    this.chore = chore;
    this.points = points;
    this.time = time;
  }
}

// Setup fake DBs
let userDb = {};
userDb[uuidv4()] = "Andy";
userDb[uuidv4()] = "Torie";
let choreDb = [];

// Define functions for the resolver
const getUser = (id) => {
  console.log('getUser: ' + id);
  return new User(id, userDb[id]);
}

const getUserPoints = (id) => {
  console.log('getUserPoints: ' + id);
  let chores = choreDb.filter(x => x.userId == id);
  let totalPoints = 0;
  chores.forEach(chore => {
    totalPoints += chore.points;
  });
  return totalPoints;
}

const getUsers = () => {
  console.log('getUsers');
  let userArray = [];
  for (const userId in userDb) {
    let user = new User(userId, userDb[userId]);
    userArray.push(user);
  }
  return userArray;
}

const getChores = (userId) => {
  console.log('getChores: ' + userId);
  let chores = [];
  if (userId) {
    chores = choreDb.filter(x => x.userId == userId);
  } else {
    chores = choreDb;
  }
  return chores;
}

const setChore = (userId, input) => {
  console.log('setChore: ' + userId);
  console.log('input: ' + input.chore + ' ' + input.time);
  choreDb.push(new Chore(userId, input));
  return input.points;
}

const setChores = (userId, input) => {
  console.log('setChores: ' + userId)
  input.forEach(chore => {
    choreDb.push(new Chore(userId, chore));
  });
  console.log('Chores set: ' + input.length)
}

// Setup the resolver
const resolvers = {
  Query: {
    user: async (root, { id }) => await getUser(id),
    users: async (root, { id }) => await getUsers(),
    chores: async (root, { userId }) => await getChores(userId),
  },
  Mutation: {
    setChore: async (root, { userId, input }) => await setChore(userId, input),
    //setChores: async (root, {userId, input}) => await setChores(userId, input),
  },
  User: {
    points: async ({ id }) => await getUserPoints(id),
  },
}

// Create schema using type defs and resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Setup app
const app = express();
app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
// Some server info
console.log('Running a GraphQL API server at localhost:4000/graphql');
for (const userId in userDb) {
  console.log(userDb[userId] + ':' + userId);
}
if (fs.existsSync('server/chores.json')) {
  console.log('reading chores.json')
  let rawdata = fs.readFileSync('server/chores.json');
  let chores = JSON.parse(rawdata);
  andyId = Object.keys(userDb)[0];
  setChores(andyId, chores);
}