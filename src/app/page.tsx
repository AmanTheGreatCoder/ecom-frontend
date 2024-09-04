'use client';
import { useEffect, useRef, useState } from 'react';
import { apiManager } from './apiManager';
import io from 'socket.io-client';

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
	createdAt: string;
	updatedAt: string;
}

interface StockData {
	id: number;
	stock: number;
}

export default function Home() {
	const [data, setData] = useState<Product[] | []>([]);
	const socketRef: any = useRef();

	useEffect(() => {
		console.log('socketRef current');

		socketRef.current = io('http://localhost:3001');

		socketRef?.current?.on('disconnect', () => {
			console.log('Socket.IO connection closed');
		});

		return () => {
			socketRef?.current?.disconnect();
		};
	}, [socketRef]);

	useEffect(() => {
		const handleStockUpdate = (stockData: StockData[] | any) => {
			console.log('socket dataaa', stockData);
			// Convert the current state data to a Map for efficient lookup
			const dataMap = new Map<number, Product>(
				data.map((item) => [item.id, item])
			);

			// Update the map with the new stock data
			stockData.forEach(({ id, stock }: StockData) => {
				const oldData = dataMap.get(id);
				if (oldData?.id) {
					dataMap.set(id, { ...oldData, stock });
				}
			});

			// Convert the updated map back to an array
			const updatedData = Array.from(dataMap.values());

			// Update the state with the new data
			setData(updatedData);
		};

		if (socketRef.current) {
			socketRef.current.on('stockUpdate', handleStockUpdate);
		}

		return () => {
			socketRef.current.off('stockUpdate', handleStockUpdate);
		};
	}, [socketRef, data]);

	const fetchData = async () => {
		const response = await apiManager.get('products');

		if (response.status === 200) {
			setData(response.data);
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
								flexDirection: 'column',
							}}
						>
							<div>Name: {e.name}</div>
							<div>Desc: {e.description}</div>
							<div>Price: {e.price}</div>
							<div>Stock: {e.stock}</div>
							<div>Created : {e.createdAt}</div>
						</div>
					);
				})
			) : (
				<div>No data</div>
			)}
		</div>
	);
}
