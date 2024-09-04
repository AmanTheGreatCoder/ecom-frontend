'use client';

import { useEffect, useState } from 'react';
import { apiManager } from '../apiManager';

interface DashboardData {
	conversionRate: string; // as it is returned as a string after using `toFixed(2)`
	commissionRate: number; // as `affiliate.commission` is a float number
	totalEarnings: string; // as it is returned as a string after using `toFixed(2)`
	totalVisits: number; // as `affiliate.visits` is an integer
	visitsToday: number; // as `visitsToday` is calculated and returned as an integer
}

export default function Page() {
	const [data, setData] = useState<DashboardData | null>(null);

	const fetchData = async () => {
		const response = await apiManager.get('dashboard?id=2');

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
			<div>Commission Rate: {data?.commissionRate}%</div>
			<div>Conversion Rate: {data?.conversionRate}%</div>
			<div>Visits: ${data?.totalVisits} </div>
			<div>Visits Today: ${data?.visitsToday} </div>
		</div>
	);
}
