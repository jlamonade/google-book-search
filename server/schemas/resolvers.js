const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (await context.user._id) {
        const foundUser = await User.findById(context.user._id);
        return foundUser;
      }
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        return { message: "Failed to create user." };
      }
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({email: email});

      if (!user) {
        return { message: "Cannot find this user."}
      }

      const correctPw = await user.isCorrectPassword(password)

      if (!correctPw) {
        return { message: "Wrong password." }
      }

      const token = signToken(user)
      return { token, user }
    },

    saveBook: async (parent, { book }, context) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: book } },
          { new: true, runValidators: true }
        )
        return updatedUser
      } catch (err) {
        return { message: err }
      }
    },

    deleteBook: async (parent, { bookId }, context) => {
      console.log('[resolvers] ' + bookId)
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      )
      if (!updatedUser) {
        return { message: "Couldn't find use with this id!" }
      }
      return updatedUser
    }
  },
};

module.exports = resolvers;
