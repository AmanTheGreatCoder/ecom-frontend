'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();

	return (
		<div style={{ marginLeft: '20px', marginTop: '10px' }}>
			<button onClick={(e) => router.push('/products')}>Products</button>
			<button onClick={(e) => router.push('/dashboard')}>Dashboard</button>
		</div>
	);
}
