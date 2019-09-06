const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {DateTimeResolver, URLResolver, EmailAddressResolver, JSONResolver} = require('graphql-scalars')
const {MongoClient, ObjectID} = require('mongodb').MongoClient;

const MONGO = "mongodb+srv://tech-team:BRmeMeSRkewl@website-87fht.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(MONGO, { useNewUrlParser: true });
client.connect(err => {
  db = client.db("website");
  const Posts = db.collection("posts");
  client.close();
});

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

  type quickFacts {
    datePosted: String!
    author: String!
    byline: String!
    categories: [String]!
  }

  type postHighlight {
    userId: ID!
    lines: String!
  }

 type Post {
   _id: ID!
   title: String!
   content: String!
   imgUrl: String!
   contentType: String!
   quickFacts: quickFacts
   isFeatured: Boolean!
	 highlighted: [postHighlight]
	 editedBy: String!
 }

 type Query {
   posts: [Post]
   post(postId: ID!): Post
 }

 type Mutation {
   createPost(title: String!, content: String!, imgUrl: String!, contentType: String!,
     quickFacts: quickFacts, isFeatured: Boolean!, highlighted: [postHighlight], editedBy: String!): Post
   updatePost(postId: ID!, title: String!, content: String!, imgUrl: String!, contentType: String!,
     quickFacts: quickFacts, isFeatured: Boolean!, highlighted: [postHighlight], editedBy: String!): Post
 }

`;


// Provide resolver functions for your schema fields
const resolvers = {
  Query : {
    posts: async() => {
      return await Posts.find({}).toArray();
    },

    post: async(root, {postId}) => {
      return await Posts.findOne({_id: postId});
    }

  },

 Mutation : {
   createPost: async(root, args) => {
      const newPost = { title: args.title, content: args.content, imgUrl: args.imgUrl,
        contentType: args.contentType, quickFacts: args.quickFacts, isFeatured: args.isFeatured,
        highlighted: args.highlighted, editedBy: args.editedBy};

      let newlyCreatedPost = await Posts.insertOne( {newPost} );
      try {
        return newlyCreatedPost.ops[0];
      }
      catch(e) {
        console.error(e);
      }
    },

/*
  updatePost: async(root, args) => {
    const updatedPost = {_id: args.postId, title: args.title, content: args.content, imgUrl: args.imgUrl,
      contentType: args.contentType, quickFacts: args.quickFacts, isFeatured: args.isFeatured,
      highlighted: args.highlighted, editedBy: args.editedBy};

    let newlyUpdatedPost = await Posts.findOneAndUpdate( {_id: ObjectID(args.postId)}, {updatedPost })

  }
*/
   }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
