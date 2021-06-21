const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async (parent, { user = null, params }) => {
      const foundUser = await User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      });

      if (!foundUser) {
        return { message: "Cannot find a user with this id!" };
      }
      return foundUser;
    },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
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

    saveBook: async (parent, {user, body}) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        )
        return updatedUser
      } catch (err) {
        return { message: err }
      }
    },

    deleteBook: async (parent, { user, params }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
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
