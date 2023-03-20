import { User, bookSchema } from "../models";

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      return await User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      }).populate("savedBooks");
    },
  },

  Mutation: 
};
