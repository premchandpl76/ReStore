import { LoadingButton } from '@mui/lab';
import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Typography, CardHeader } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import agent from '../../app/api/agent';
import { useStoreContext } from '../../app/context/StoreContext';
import { Product } from '../../app/models/product';
import { currencyFormat } from '../../app/util/util';
interface Props {
	product: Product;
}
export default function ProductCard({ product }: Props) {
	const [loading, setLoading] = useState(false);
	const {setBasket} = useStoreContext();

	function handleAddItem(productId: number) {
		setLoading(true);
		agent.Basket.addItem(productId)
			.then(basket=>setBasket(basket))
			.catch(error => console.log(error))
			.finally(() => setLoading(false));
	}
	return (
		<>
			<Card>
				<CardHeader
					titleTypographyProps={{
						sx: { fontWeight: 'bold', color: 'primary.main' }
					}}
					avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>{product.name.charAt(0).toUpperCase()}</Avatar>}
					title={product.name}
				/>
				<CardMedia sx={{ height: 140, backgroundSize: 'contain' }} image={product.pictureUrl} title={product.name} />
				<CardContent>
					<Typography gutterBottom color="secondary" variant="h5">
						{currencyFormat(product.price)}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{product.brand} / {product.type}
					</Typography>
				</CardContent>
				<CardActions>
					<LoadingButton size="small" loading={loading} onClick={()=>handleAddItem(product.id)}	>Add to cart</LoadingButton>
					<Button size="small" component={Link} to={`/catalog/${product.id}`}>
						View
					</Button>
				</CardActions>
			</Card>
		</>
	);
}
