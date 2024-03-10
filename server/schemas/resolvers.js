const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');


const resolvers = {
    // gets database information
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).select('-__v -password');
            }
            throw new AuthenticationError('Please log in to do this.');
        },
        // shows all users with attached books schema
        users: async () => {
            return User.find();
        },
        // shows specific user with attached books schema
        user: async (parent, { username }) => {
            return User.findOne({ username });
        },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const newUser = await User.create({ username, email, password });
            if (!newUser)
            throw new AuthenticationError('User already exists. Please try again.');
            const token = signToken(newUser);
            return { token, newUser };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            // verifies user with this email address exists
            if (!user) {
                throw new AuthenticationError('No user found with that email. Please try again')
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Password or Email are in correct. Please try again.');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { savedBook }, context) => {
                  if (context.user) {
                    return User.findOneAndUpdate(
                      { _id: context.user._id },
                      { $push: { savedBooks: savedBook } },
                      { new: true }
                    );
                  }
                  throw AuthenticationError;
                },
                removeBook: async (parent, { bookId }, context) => {
                  if (context.user) {
                    return User.findOneAndUpdate(
                      { _id: context.user._id },
                      { $pull: { savedBooks: { bookId } } },
                      { new: true }
                    );
                  }
                  throw AuthenticationError;
                },
              },
            };
module.exports = resolvers;