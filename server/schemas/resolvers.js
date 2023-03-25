const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const findUser = await User.findOne({ _id: context.user._id }).select(
          "__v"
        );
        return findUser;
      }
      throw new AuthenticationError("Login Failed!");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parents, { email, password }) => {
      const checkUser = await User.findOne({ email });
      if (!checkUser) {
        throw new AuthenticationError("User not found");
      }
      const checkPassword = await checkUser.isCorrectPassword(password);
      if (!checkPassword) {
        throw new AuthenticationError("Incorrect password");
      }
      const token = signToken(checkUser);
      return { token, checkUser };
    },
    addBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const update = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return update;
      }
      throw new AuthenticationError("You need to be logged in to save books!");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const deleteBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return deleteBook;
      } else {
        throw new AuthenticationError(
          "You need to be logged in to remove saved books!"
        );
      }
    },
  },
};

module.exports = resolvers;
