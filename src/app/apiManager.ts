import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
} from 'axios';

function handleApiResponse(response: AxiosResponse): AxiosResponse {
	return response;
}

function handleApiError(error: any): any {
	console.error('API Error:', error.response);
	console.log('error resposne ', error.response);
	throw new AxiosError(error.response?.data?.error ?? 'Something went wrong!');
}

class ApiManager {
	private readonly api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
		try {
			console.log('urll', url);
			const response = await this.api.get(url, config);
			return handleApiResponse(response);
		} catch (error: any) {
			return handleApiError(error);
		}
	}

	// Method to handle POST requests
	async post(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			console.log('urrrl', url, 'dataaa', data);
			const response = await this.api.post(url, data, config);
			return handleApiResponse(response);
		} catch (error: any) {
			return handleApiError(error);
		}
	}

	async put(
		url: string,
		data: any,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			const response = await this.api.put(url, data, config);
			return handleApiResponse(response);
		} catch (error: any) {
			return handleApiError(error);
		}
	}

	async patch(
		url: string,
		data: any,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			const response = await this.api.patch(url, data, config);
			return handleApiResponse(response);
		} catch (error: any) {
			return handleApiError(error);
		}
	}

	async delete(
		url: string,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			const response = await this.api.delete(url, config);
			return handleApiResponse(response);
		} catch (error: any) {
			return handleApiError(error);
		}
	}

	async postForm(
		url: string,
		formData: FormData,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			const response = await this.api.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				...config,
			});
			return handleApiResponse(response);
		} catch (error: any) {
			return handleApiError(error);
		}
	}

	// Method to handle PUT form requests
	async putForm(
		url: string,
		formData: FormData,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			const response = await this.api.put(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				...config,
			});
			return handleApiResponse(response);
		} catch (error: any) {
			return handleApiError(error);
		}
	}
}

// Export an instance of ApiManager
export const apiManager = new ApiManager();
