export interface Basket {
	id: number;
	buyerId: string;
	items: BaskteItem[];
}

export interface BaskteItem {
	productId: number;
	name: string;
	price: number;
	pictureUrl: string;
	brand: string;
	type: string;
	quantity: number;
}
