// const { projects, clients } = require("../sampleData");

//Mongoose Models
const Project = require("../models/Project");
const Client = require("../models/Client");

const graphql = require("graphql");

const { GraphQLObjectType } = graphql;

//Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
    phone: { type: graphql.GraphQLString },
  }),
});

//Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
    status: { type: graphql.GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        console.log(parent);
        return Client.findById(parent.clientId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    client: {
      type: ClientType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
    clients: {
      type: new graphql.GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find({});
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    projects: {
      type: new graphql.GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find({});
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
