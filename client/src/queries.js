import { gql } from '@apollo/client';

const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
		title
		author {
			name
		}
		published
		genres
	}
`;

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			name
			born
		}
	}
`;

export const ALL_BOOKS = gql`
	query ($genre: String) {
		allBooks(genre: $genre) {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const RECOMMENDATION = gql`
	query {
		recommendation {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const ADD_BOOK = gql`
	mutation createBook(
		$title: String!
		$published: Int!
		$author: String!
		$genres: [String!]!
	) {
		addBook(
			title: $title
			published: $published
			author: $author
			genres: $genres
		) {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const EDIT_AUTHOR = gql`
	mutation editAuthor($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			name
			born
		}
	}
`;

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const updateCache = (cache, query, addedBooks) => {
	const uniqByTitle = (a) => {
		let seen = new Set();
		return a.filter((item) => {
			let k = item.title;
			return seen.has(k) ? false : seen.add(k);
		});
	};
	cache.updateQuery(query, ({ allBooks }) => {
		return {
			allBooks: uniqByTitle(allBooks.concat(addedBooks)),
		};
	});
};
