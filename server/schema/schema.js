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

//Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        email: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        phone: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
      },
      resolve(parent, args) {
        let client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    deleteClient: {
      type: ClientType,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLID) } },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      },
    },

    addProject: {
      type: ProjectType,
      args: {
        name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        description: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        status: {
          type: new graphql.GraphQLEnumType({
            name: "Project_Status",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: graphql.GraphQLNonNull(graphql.GraphQLID) },
      },
      resolve(parent, args) {
        let project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
    deleteProject: {
      type: ProjectType,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLID) } },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLID) },
        name: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString },
        status: {
          type: new graphql.GraphQLEnumType({
            name: "Project_Status_Update",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
