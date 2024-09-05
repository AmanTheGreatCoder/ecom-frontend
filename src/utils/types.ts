export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
	createdAt: string;
	updatedAt: string;
	affiliateLink: AffiliateLink[];
}

export interface AffiliateLink {
	id: number;
	affiliateId: number;
	link: string;
	productId: number;
	product: Product;
	clicks: number;
	sales: number;
	conversionRate: number;
	totalRevenue: number;
	commissionEarned: number;
	createdAt: string;
}

export interface DashboardData {
	conversionRate: string;
	commissionRate: number;
	totalEarnings: string;
	totalSales: number;
	totalVisits: number;
	visitsToday: number;
	affiliate_links: AffiliateLink[];
}
