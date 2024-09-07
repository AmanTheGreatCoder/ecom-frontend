'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiManager } from './apiManager';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await apiManager.post('/auth/login', {
				email,
				password,
			});

			if (response.data) {
				localStorage.setItem('token', response.data.access_token);
				localStorage.setItem('user', JSON.stringify(response.data.user));

				if (response.data.user.role === 'user') {
					router.push('/products');
				} else if (response.data.user.role === 'affiliate') {
					router.push('/dashboard');
				}
			} else {
				toast.error('Something went wrong');
			}
		} catch (error) {
			setError('An error occurred. Please try again.');
		}
	};

	return (
		<div className='login-container'>
			<h1>Login</h1>
			<form onSubmit={handleLogin}>
				<div>
					<label>Email:</label>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				<button type='submit'>Login</button>
			</form>
		</div>
	);
}
