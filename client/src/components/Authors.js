import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';
import EditAuthor from './EditAuthor';

const Authors = (props) => {
	const result = useQuery(ALL_AUTHORS);

	if (result.loading) {
		return <div>loading...</div>;
	}

	if (!props.show) {
		return null;
	}

	const authors = result.data.allAuthors;

	return (
		<>
			<div>
				<h2>authors</h2>
				<table>
					<tbody>
						<tr>
							<th></th>
							<th>born</th>
							<th>books</th>
						</tr>
						{authors.map((a) => (
							<tr key={a.name}>
								<td>{a.name}</td>
								<td>{a.born}</td>
								<td>{a.bookCount}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{props.token && (
				<div>
					<h2>Set Birthyear</h2>
					<EditAuthor />
				</div>
			)}
		</>
	);
};

export default Authors;
