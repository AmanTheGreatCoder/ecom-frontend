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
	role: 'user',
	createdAt: '2024-09-05T13:52:49.603Z',
	updatedAt: '2024-09-05T13:52:49.603Z',
	affiliate: null,
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
				affiliateLink: [],
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
