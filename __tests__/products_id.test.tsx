import Page from '@/app/(pages)/products/[id]/page';
import { apiManager } from '@/app/apiManager';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';

jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
	useSearchParams: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
	success: jest.fn(),
}));

describe('Product Page', () => {
	const mockParams = { id: 1 };
	const mockProduct = {
		id: 1,
		name: 'Test Product',
		description: 'Test Description',
		price: 100,
		stock: 10,
		createdAt: '2024-01-01',
		updatedAt: '2024-01-02',
	};

	beforeEach(() => {
		const { useParams } = require('next/navigation');
		useParams.mockReturnValue(mockParams);
		localStorage.setItem(
			'user',
			JSON.stringify({
				id: 1,
				name: 'User 1',
				email: 'user1@gmail.com',
				password: '1234',
				role: 'user',
				createdAt: '2024-09-05T13:52:49.597Z',
				updatedAt: '2024-09-05T13:52:49.597Z',
				affiliate: null,
			})
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
		localStorage.clear();
	});

	it('should render product details after fetching data', async () => {
		const mockAxiosResponse: any = {
			data: {
				id: 1,
				name: 'Test Product',
				description: 'Test Description',
				price: 100,
				stock: 10,
			},
			status: 200,
			statusText: 'OK',
		};

		jest.spyOn(apiManager, 'get').mockResolvedValue(mockAxiosResponse);

		render(<Page />);

		expect(screen.getByText('Product not found')).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByText('Name: Test Product')).toBeInTheDocument();
			expect(screen.getByText('Desc: Test Description')).toBeInTheDocument();
			expect(screen.getByText('Price: 100')).toBeInTheDocument();
			expect(screen.getByText('Stock: 10')).toBeInTheDocument();
		});
	});

	it('should handle the "Buy" button click and call the buy function', async () => {
		jest.spyOn(apiManager, 'get').mockResolvedValue({
			status: 200,
			data: mockProduct,
		});

		jest.spyOn(apiManager, 'post').mockResolvedValueOnce({
			status: 201,
		});

		jest.spyOn(apiManager, 'post').mockResolvedValueOnce({
			status: 201,
		});

		render(<Page />);

		await waitFor(() => {
			expect(screen.getByText('Name: Test Product')).toBeInTheDocument();
		});

		const buyButton = screen.getByText('Buy');
		fireEvent.click(buyButton);

		await waitFor(() => {
			expect(apiManager.post).toHaveBeenCalledWith('/products/buy', {
				productId: 1,
			});
		});

		// Check if the success toast was shown
		expect(toast.success).toHaveBeenCalledWith(
			'Product purchased successfully'
		);
	});

	it('should send click data when the code is in searchParams', async () => {
		const { useSearchParams } = require('next/navigation');
		const mockSearchParams = new URLSearchParams({ code: '2' });
		useSearchParams.mockReturnValue(mockSearchParams);

		render(<Page />);

		await waitFor(() => {
			expect(screen.getByText('Name: Test Product')).toBeInTheDocument();
		});

		await waitFor(() => {
			expect(apiManager.post).toHaveBeenCalledWith('/affiliate/click', {
				affiliateId: 2,
				productId: 1,
			});
		});
	});

	it('should show "Product not found" when no product data is available', async () => {
		render(<Page />);

		await waitFor(() => {
			expect(screen.getByText('Product not found')).toBeInTheDocument();
		});
	});
});
