import { useQuery } from '@apollo/client';
import { RECOMMENDATION } from '../queries';

const Recommendation = (props) => {
	const result = useQuery(RECOMMENDATION);

	if (!props.show) {
		return null;
	}

	if (result.loading) {
		return <div>loading...</div>;
	}

	const books = result.data.recommendation;

	return (
		<div>
			<h2>recommendations</h2>
			<p>
				books in your favorite genre{' '}
				<strong>{books[0].genres}</strong>{' '}
			</p>
			<table>
				<tbody>
					<tr>
						<th>title</th>
						<th>author</th>
						<th>published</th>
					</tr>
					<tr key={books[0].title}>
						<td>{books[0].title}</td>
						<td>{books[0].author.name}</td>
						<td>{books[0].published}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
export default Recommendation;
