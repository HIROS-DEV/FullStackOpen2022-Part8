import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { LOGIN } from '../queries';

const LoginForm = (props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [login, result] = useMutation(LOGIN);

	const submit = (event) => {
		event.preventDefault();
		login({ variables: { username, password } });
	};

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value;
			props.setToken(token);
			localStorage.setItem('library-token', token);
		}
	}, [result.data]); // eslint-disable-line

	if (!props.show) {
		return null;
	}

	return (
		<form onSubmit={submit}>
			<div>
				username{' '}
				<input
					value={username}
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				password{' '}
				<input
					type='password'
					value={password}
					autoComplete='password'
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type='submit'>login</button>
		</form>
	);
};
export default LoginForm;
