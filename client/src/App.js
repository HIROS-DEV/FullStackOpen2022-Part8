import { useState } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';
import { ALL_BOOKS, BOOK_ADDED, updateCache } from './queries';
import Authors from './components/Authors';
import Books from './components/Books';
import LoginForm from './components/LoginForm';
import NewBook from './components/NewBook';
import Recommendation from './components/Recommendation';

const App = () => {
	const [page, setPage] = useState('authors');
	const [token, setToken] = useState(null);
	const client = useApolloClient();

	useSubscription(BOOK_ADDED, {
		onSubscriptionData: ({ subscriptionData }) => {
			const addedBook = subscriptionData.data.bookAdded;
			window.alert(`${addedBook.title} added!!!`);
			updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
		},
	});

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	if (!token) {
		return (
			<div>
				<div>
					<button onClick={() => setPage('authors')}>authors</button>
					<button onClick={() => setPage('books')}>books</button>
					<button onClick={() => setPage('login')}>log in</button>
				</div>

				<Authors show={page === 'authors'} />

				<Books show={page === 'books'} />

				<LoginForm show={page === 'login'} setToken={setToken} />
			</div>
		);
	}

	return (
		<div>
			<div>
				<button onClick={() => setPage('authors')}>authors</button>
				<button onClick={() => setPage('books')}>books</button>
				<button onClick={() => setPage('add')}>add book</button>
				<button onClick={() => setPage('recommend')}>
					recommend
				</button>
				<button onClick={logout}>log out</button>
			</div>

			<Authors show={page === 'authors'} token={token} />
			<Books show={page === 'books'} />
			<NewBook show={page === 'add'} />
			<Recommendation show={page === 'recommend'} />
		</div>
	);
};

export default App;
