const {
	UserInputError,
	AuthenticationError,
} = require('apollo-server-core');
const { PubSub } = require('graphql-subscriptions');
const jwt = require('jsonwebtoken');

const Author = require('../models/Author');
const Book = require('../models/Book');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const pubsub = new PubSub();

const resolvers = {
	Query: {
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: async () => Author.collection.countDocuments(),
		allBooks: async (_root, args) => {
			if (args.genre) {
				return Book.find({ genres: { $in: [args.genre] } }).populate(
					'author'
				);
			}

			return Book.find({}).populate('author');
		},
		allAuthors: async () => {
			return Author.find({});
		},
		me: (_root, _args, context) => {
			return context.currentUser;
		},
		recommendation: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}

			try {
				const book = await Book.find({
					genres: { $in: [currentUser.favouriteGenre] },
				}).populate('author');

				return book;
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
		},
	},
	Mutation: {
		addBook: async (_root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}

			const authorExists = await Author.findOne({
				name: args.author,
			});

			let book;
			try {
				if (args.author && authorExists) {
					book = new Book({ ...args, author: authorExists });
					await book.save();
				} else {
					const author = new Author({
						name: args.author,
						born: null,
					});
					book = new Book({ ...args, author });
					await author.save();
					await book.save();
				}
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			pubsub.publish('BOOK_ADDED', { bookAdded: book });

			return book;
		},
		editAuthor: async (_root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}

			try {
				const author = await Author.findOne({
					name: args.name,
				});

				if (!author) {
					return null;
				}

				author.born = args.setBornTo;
				await author.save();
				return author;
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
		},
		createUser: async (_root, args) => {
			const user = await User.findOne({ username: args.username });
			if (user) {
				throw new UserInputError(
					'User already exists. Please try another name'
				);
			}

			const newUser = new User({ ...args });
			return newUser.save().catch((error) => {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			});
		},
		login: async (_root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== 'secret') {
				throw new UserInputError('wrong credentials');
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, JWT_SECRET) };
		},
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
		},
	},
};

module.exports = resolvers;
