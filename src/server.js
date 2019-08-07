const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }

  type quickFacts {
    datePosted: String!
    author: String!
    byline: String!
    categories: [String]!
  }

  type postHighlight {
    userID: ID!
    lines: String!
  }

 type Post {
   Title: String!,
   content: String!,
   image: String!,
   contentType: String!,
   quickFacts: quickFacts,
   isFeatured: Boolean!,
	 highlighted: [postHighlight],
	 editedBy: String!
 }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
