'use client';

import { useEffect, useState } from 'react';
import { apiManager } from '../apiManager';
import { DashboardData } from '@/utils/types';

export default function Page() {
	const [data, setData] = useState<DashboardData | null>(null);

	const fetchData = async () => {
		const response = await apiManager.get('dashboard');

		if (response.data) {
			setData(response.data);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (!data) {
		return <div>No data</div>;
	}

	return (
		<div>
			<div>Total Earnings: ${data?.totalEarnings}</div>
			<div>Total Sales: ${data?.totalSales}</div>
			<div>Commission Rate: {data?.commissionRate}%</div>
			<div>Conversion Rate: {data?.conversionRate}%</div>
			<div>Visits: ${data?.totalVisits} </div>
			<div>Visits Today: ${data?.visitsToday} </div>

			<table
				style={{ marginTop: '50px', width: '100%', borderCollapse: 'collapse' }}
			>
				<thead>
					<tr>
						<th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
							Product Name
						</th>
						<th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
							Comission
						</th>
						<th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
							Visits
						</th>
					</tr>
				</thead>
				<tbody>
					{data.affiliate_links.map((e) => (
						<tr key={e.id}>
							<td
								style={{
									padding: '10px',
									textAlign: 'center',
									borderBottom: '1px solid #ccc',
								}}
							>
								{e.product.name}
							</td>
							<td
								style={{
									padding: '10px',
									textAlign: 'center',
									borderBottom: '1px solid #ccc',
								}}
							>
								${e.commissionEarned}
							</td>
							<td
								style={{
									padding: '10px',
									textAlign: 'center',
									borderBottom: '1px solid #ccc',
								}}
							>
								{e.clicks}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
