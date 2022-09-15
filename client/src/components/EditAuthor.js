import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import Select from 'react-select';

const EditAuthor = () => {
	const [name, setName] = useState('');
	const [born, setBorn] = useState('');
	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	});

	const result = useQuery(ALL_AUTHORS);

	const submit = (event) => {
		event.preventDefault();

		editAuthor({
			variables: {
				name,
				setBornTo: Number(born),
			},
		});

		setName('');
		setBorn('');
	};

	const options = result.data.allAuthors.map((author) => {
		return {
			value: author.name,
			label: author.name,
		};
	});

	if (result.loading) {
		return <div>loading...</div>;
	}

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					name
					<Select
						options={options}
						onChange={(e) => setName(e.value)}
					/>
				</div>
				<div>
					born
					<input
						type='text'
						value={born}
						onChange={(e) => setBorn(e.target.value)}
					/>
				</div>
				<button type='submit'>update author</button>
			</form>
		</div>
	);
};
export default EditAuthor;
