import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
	const [books, setBooks] = useState([]);
	const { data, loading, error, refetch } = useQuery(ALL_BOOKS);

	useEffect(() => {
		if (data?.allBooks) {
			setBooks(data?.allBooks);
		}
	}, [data]);

	if (!props.show) {
		return null;
	}

	if (loading) {
		return <div>loading...</div>;
	}

	if (error) return <div>error</div>;

	return loading ? (
		<div>loading...</div>
	) : (
		<div>
			<h2>books</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>

					{books.map((book) => (
						<tr key={book.title}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			{books.map((book) =>
				book.genres.map((genre) => (
					<button
						key={genre}
						onClick={() =>
							refetch({
								genre,
							})
						}
					>
						{genre}
					</button>
				))
			)}
			<button
				onClick={() =>
					refetch({
						genre: '',
					})
				}
			>
				all genres
			</button>
		</div>
	);
};

export default Books;
