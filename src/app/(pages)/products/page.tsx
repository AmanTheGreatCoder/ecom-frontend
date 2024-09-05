'use client';
import { useEffect, useRef, useState } from 'react';
import { apiManager } from '../../apiManager';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { Product } from '@/utils/types';

export default function Page() {
	const [data, setData] = useState<Product[] | []>([]);
	const user =
		localStorage.getItem('user') &&
		JSON.parse(localStorage.getItem('user') as string);
	const router = useRouter();

	const fetchData = async () => {
		const response = await apiManager.get(
			user.role === 'affiliate'
				? `/products?affiliateId=${user?.affiliate.id}`
				: '/products'
		);

		if (response.status === 200) {
			setData(response.data);
		}
	};

	const createAffiliateLink = async (id: number) => {
		const response = await apiManager.post(`/affiliate/link`, {
			productId: id,
			affiliateId: user?.affiliate?.id,
		});

		if (response.data) {
			fetchData();
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div style={{ marginLeft: '20px', marginTop: '10px' }}>
			<h1 style={{ marginBottom: '20px' }}>Products</h1>

			{data?.length > 0 ? (
				data.map((e) => {
					return (
						<div
							key={e.id}
							style={{
								marginBottom: '20px',
								gap: '5px',
								display: 'flex',
								flexDirection: 'row',
							}}
						>
							<div>
								<div>Name: {e.name}</div>
								<div>Desc: {e.description}</div>
								<div>Price: {e.price}</div>
								<div>Stock: {e.stock}</div>
								<div>Created : {e.createdAt}</div>
							</div>
							<button
								style={{ height: '30px', width: '80px' }}
								onClick={(event) => router.push(`/products/${e.id}`)}
							>
								View
							</button>
							{user?.role !== 'user' &&
								(e?.affiliateLink?.length > 0 && e?.affiliateLink[0].link ? (
									<div>{e.affiliateLink[0].link}</div>
								) : (
									<button
										style={{ height: '30px', width: '80px' }}
										onClick={(event) => createAffiliateLink(e.id)}
									>
										Create Affiliate Link
									</button>
								))}
						</div>
					);
				})
			) : (
				<div>No data</div>
			)}
		</div>
	);
}
