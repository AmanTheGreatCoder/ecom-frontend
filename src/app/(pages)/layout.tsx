'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const user =
		localStorage.getItem('user') &&
		JSON.parse(localStorage.getItem('user') ?? '');

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			router.push('/');
		}
	}, [router]);

	return (
		<div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div style={{ marginTop: '20px' }}>Welcome {user?.name}</div>
				<button
					style={{ height: '30px', width: '60px' }}
					onClick={(e) => {
						localStorage.clear();
						router.push('/');
					}}
				>
					Log out
				</button>
			</div>
			{children}
		</div>
	);
}
