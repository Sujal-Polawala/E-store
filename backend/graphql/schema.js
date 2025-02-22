const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Order {
    _id: ID!
    totalPrice: Float!
    createdAt: String!
    sellerId: ID!
  }

  type Query {
    orders(sellerId: ID!): [Order]
    totalOrders: Int
    totalRevenue: Float
    totalUsers: Int
    totalSellers: Int
    sellers: [Seller]
    bestSellingProducts: [Product]
  }

  type Seller {
    _id: ID!
    name: String!
    orders: [Order] 
    totalSales: Float!
  }

  type Product {
    _id: ID!
    title: String!
    sales: Int!
  }
`;

module.exports = typeDefs;
