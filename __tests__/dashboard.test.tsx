import Page from '@/app/(pages)/dashboard/page';
import { apiManager } from '@/app/apiManager';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

const mockAffiliateUser = {
	id: 3,
	name: 'Affiliate 1',
	email: 'affiliate1@gmail.com',
	password: '1234',
	role: 'affiliate',
	createdAt: '2024-09-05T13:52:49.603Z',
	updatedAt: '2024-09-05T13:52:49.603Z',
	affiliate: {
		id: 1,
		userId: 3,
		commission: 15,
		visits: 91,
		visits_today: 91,
		conversion_rate: 25,
		total_sales: 4760,
		totalEarnings: 714,
		createdAt: '2024-09-05T13:52:49.607Z',
		updatedAt: '2024-09-06T15:44:45.927Z',
	},
};

describe('Dashboard Page', () => {
	const mockDashboardData = {
		conversionRate: 25,
		commissionRate: 15,
		totalEarnings: '714.00',
		totalVisits: 91,
		totalSales: 4760,
		visitsToday: 91,
		affiliate_links: [
			{
				id: 12,
				affiliateId: 1,
				link: 'http://localhost:3000/products/10?code=1',
				productId: 10,
				clicks: 13,
				sales: 3,
				conversionRate: 25,
				totalRevenue: 2349,
				commissionEarned: 352.35,
				createdAt: '2024-09-06T15:23:45.331Z',
				product: {
					id: 10,
					name: 'Test Product 10',
					description: 'Description for test product 10',
					price: 783,
					stock: 72,
					createdAt: '2024-09-05T13:52:49.586Z',
					updatedAt: '2024-09-05T13:52:49.586Z',
				},
			},
			{
				id: 11,
				affiliateId: 1,
				link: 'http://localhost:3000/products/6?code=1',
				productId: 6,
				clicks: 0,
				sales: 0,
				conversionRate: 0,
				totalRevenue: 0,
				commissionEarned: 0,
				createdAt: '2024-09-06T15:23:42.635Z',
				product: {
					id: 6,
					name: 'Test Product 6',
					description: 'Description for test product 6',
					price: 108,
					stock: 8,
					createdAt: '2024-09-05T13:52:49.586Z',
					updatedAt: '2024-09-05T13:52:49.586Z',
				},
			},
			{
				id: 13,
				affiliateId: 1,
				link: 'http://localhost:3000/products/9?code=1',
				productId: 9,
				clicks: 0,
				sales: 0,
				conversionRate: 0,
				totalRevenue: 0,
				commissionEarned: 0,
				createdAt: '2024-09-07T09:52:42.811Z',
				product: {
					id: 9,
					name: 'Test Product 9',
					description: 'Description for test product 9',
					price: 450,
					stock: 89,
					createdAt: '2024-09-05T13:52:49.586Z',
					updatedAt: '2024-09-05T13:52:49.586Z',
				},
			},
			{
				id: 1,
				affiliateId: 1,
				link: 'http://localhost:3000/products/1?code=1',
				productId: 1,
				clicks: 44,
				sales: 1,
				conversionRate: 2.325581395348837,
				totalRevenue: 883,
				commissionEarned: 132.45,
				createdAt: '2024-09-05T13:55:32.855Z',
				product: {
					id: 1,
					name: 'Test Product 1',
					description: 'Description for test product 1',
					price: 883,
					stock: 49,
					createdAt: '2024-09-05T13:52:49.586Z',
					updatedAt: '2024-09-05T13:52:49.586Z',
				},
			},
		],
	};

	beforeEach(() => {
		localStorage.setItem('user', JSON.stringify(mockAffiliateUser));
	});

	afterEach(() => {
		jest.clearAllMocks();
		localStorage.clear();
	});

	it('should fetch and display dashboard data for an affiliate user', async () => {
		jest.spyOn(apiManager, 'get').mockResolvedValue({
			status: 200,
			data: mockDashboardData,
		});

		render(<Page />);

		await waitFor(() => {
			expect(screen.getByText(/Total Earnings: \$\d+/)).toBeInTheDocument();
			expect(screen.getByText(/Total Sales: \$\d+/)).toBeInTheDocument();
			expect(screen.getByText(/Commission Rate: \d+%/)).toBeInTheDocument();
			expect(screen.getByText(/Conversion Rate: \d+%/)).toBeInTheDocument();
			expect(screen.getByText(/Visits: \$\d+/)).toBeInTheDocument();
			expect(screen.getByText(/Visits Today: \$\d+/)).toBeInTheDocument();
		});
	});

	it('should redirect to /products if user is not an affiliate', async () => {
		const mockRouterPush = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockRouterPush,
		});

		localStorage.setItem(
			'user',
			JSON.stringify({
				id: 2,
				name: 'User 2',
				email: 'user2@gmail.com',
				role: 'user',
			})
		);

		render(<Page />);

		await waitFor(() => {
			expect(mockRouterPush).toHaveBeenCalledWith('/products');
		});
	});

	it('should show "No data" if no dashboard data is available', async () => {
		jest.spyOn(apiManager, 'get').mockResolvedValue({
			status: 200,
			data: null,
		});

		render(<Page />);

		await waitFor(() => {
			expect(screen.getByText('No data')).toBeInTheDocument();
		});
	});
});
