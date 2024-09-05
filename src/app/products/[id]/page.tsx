'use client';

import { apiManager } from '@/app/apiManager';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
	createdAt: string;
	updatedAt: string;
}

export default function Page() {
	const [data, setData] = useState<Product | null>(null);
	const [code, setCode] = useState<number | null>(null);
	const searchParams = useSearchParams();
	const params = useParams();

	const fetchData = async () => {
		const response = await apiManager.get(`products/${params.id}`);

		if (response.status === 200) {
			setData(response.data);
		}
	};

	const buy = async () => {
		const response = await apiManager.post(`products/buy/${data?.id}`);

		if (response.status === 201) {
			toast.success('Product purchased successfully');
		}
	};

	const sendClick = async (code: number) => {
		await apiManager.post(`affiliate/click/${code}`);
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (searchParams?.get('code')) {
			const code = parseInt(searchParams.get('code') as string);
			setCode(code);

			sendClick(code);
		}
	}, [searchParams]);

	if (!data?.id) {
		return <div>Product not found</div>;
	}

	return (
		<div style={{ marginLeft: '20px', marginTop: '10px' }}>
			<div
				style={{
					marginBottom: '20px',
					gap: '5px',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<div>
					<div>Name: {data.name}</div>
					<div>Desc: {data.description}</div>
					<div>Price: {data.price}</div>
					<div>Stock: {data.stock}</div>
					<div>Created : {data.createdAt}</div>
				</div>
			</div>
			<button onClick={(e) => buy()}>Buy</button>
		</div>
	);
}
