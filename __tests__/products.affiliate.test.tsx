import Page from '@/app/(pages)/products/page';
import { apiManager } from '@/app/apiManager';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

const mockUserData = {
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

describe('Product Page', () => {
	beforeEach(() => {
		localStorage.setItem('user', JSON.stringify(mockUserData));
	});

	afterEach(() => {
		jest.clearAllMocks();
		localStorage.clear();
	});

	it('should fetch and display products data', async () => {
		const mockProducts = [
			{
				id: 1,
				name: 'Test Product 1',
				description: 'Description for test product 1',
				price: 883,
				stock: 49,
				createdAt: '2024-09-05T13:52:49.586Z',
				updatedAt: '2024-09-05T13:52:49.586Z',
				affiliateLink: [
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
					},
				],
			},
		];

		jest.spyOn(apiManager, 'get').mockResolvedValue({
			status: 200,
			data: mockProducts,
		});

		render(<Page />);

		await waitFor(() => {
			expect(screen.getByText('Name: Test Product 1')).toBeInTheDocument();
			expect(
				screen.getByText('Desc: Description for test product 1')
			).toBeInTheDocument();
			expect(screen.getByText('Price: 883')).toBeInTheDocument();
			expect(screen.getByText('Stock: 49')).toBeInTheDocument();
			expect(
				screen.getByText('http://localhost:3000/products/1?code=1')
			).toBeInTheDocument();
		});
	});

	it('should create an affiliate link when button is clicked', async () => {
		const mockProducts = [
			{
				id: 1,
				name: 'Product 1',
				description: 'Desc 1',
				price: 100,
				stock: 10,
				createdAt: '2024-01-01',
				affiliateLink: [],
			},
		];

		jest.spyOn(apiManager, 'get').mockResolvedValue({
			status: 200,
			data: mockProducts,
		});

		jest.spyOn(apiManager, 'post').mockResolvedValue({
			status: 201,
			data: {
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
			},
		});

		render(<Page />);

		await waitFor(() => {
			expect(screen.getByText('Name: Product 1')).toBeInTheDocument();
		});

		const affiliateButton = screen.getByText('Create Affiliate Link');
		fireEvent.click(affiliateButton);

		await waitFor(() => {
			expect(apiManager.post).toHaveBeenCalledWith('/affiliate/link', {
				productId: 1,
				affiliateId: 1,
			});
		});
	});

	it('should navigate to product detail page when "View" button is clicked', async () => {
		const mockProducts = [
			{
				id: 1,
				name: 'Product 1',
				description: 'Desc 1',
				price: 100,
				stock: 10,
				createdAt: '2024-01-01',
				affiliateLink: [],
			},
		];

		const mockRouterPush = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockRouterPush,
		});

		jest.spyOn(apiManager, 'get').mockResolvedValue({
			status: 200,
			data: mockProducts,
		});

		render(<Page />);

		await waitFor(() => {
			expect(screen.getByText('Name: Product 1')).toBeInTheDocument();
		});

		const viewButton = screen.getByText('View');
		fireEvent.click(viewButton);

		expect(mockRouterPush).toHaveBeenCalledWith('/products/1');
	});
});
