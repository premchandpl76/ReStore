import { LoadingButton } from '@mui/lab';
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../../app/api/agent';
import { useStoreContext } from '../../app/context/StoreContext';
import NotFound from '../../app/errors/NotFound';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { Product } from '../../app/models/product';
import { currencyFormat } from '../../app/util/util';

export default function ProductDetails() {
	const { id } = useParams<{ id: string }>();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(0);
	const [submitting, setSubmitting] = useState(false);
	const { basket, setBasket, removeItem } = useStoreContext();
	const item = basket?.items.find(i => i?.productId === product?.id);

	useEffect(() => {
		if (item) {
			setQuantity(item.quantity);
		}
		agent.Catalog.details(+id)
			.then(response => setProduct(response))
			.catch(error => console.log(error))
			.finally(() => setLoading(false));
	}, [id, item]);
	if (loading) return <LoadingComponent message="Loading Product ..." />;
	if (!product) return <NotFound />;

	function handleInputChange(event: any) {
		setQuantity(parseInt(event.target.value) >= 0 ? parseInt(event.target.value) : 0);
	}

	function handleUpdateCart() {
		setSubmitting(true);
		if (!item || quantity > item.quantity) {
			const updatedQuantity = item ? quantity - item.quantity : quantity;
			agent.Basket.addItem(product?.id!, updatedQuantity)
				.then(basket => setBasket(basket))
				.catch(error => console.log(error))
				.finally(() => setSubmitting(false));
		} else {
			const updatedQuantity = item.quantity - quantity;
			agent.Basket.removeItem(product?.id!, updatedQuantity)
				.then(() => removeItem(product?.id!, updatedQuantity))
				.catch(error => console.log(error))
				.finally(() => setSubmitting(false));
		}
	}

	return (
		<Grid container spacing={6}>
			<Grid item xs={6}>
				<img src={product?.pictureUrl} alt={product?.name} style={{ width: '100%' }} />
			</Grid>
			<Grid item xs={6}>
				<Typography variant="h3">{product?.name}</Typography>
				<Divider sx={{ mb: 2 }} />
				<Typography variant="h5" color="secondary">
					{product?.price ? currencyFormat(product?.price) : '0.00'}
				</Typography>
				<TableContainer>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>{product?.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Description</TableCell>
								<TableCell>{product?.description}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Type</TableCell>
								<TableCell>{product?.type}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Brand</TableCell>
								<TableCell>{product?.brand}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Quantity in stock</TableCell>
								<TableCell>{product?.quantityInStock}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField variant="outlined" type="number" label="Quantity in cart" fullWidth value={quantity} onChange={handleInputChange} />
					</Grid>
					<Grid item xs={6}>
						<LoadingButton sx={{ height: '55px' }} color="primary" 
						size="large" 
						variant="contained" 
						fullWidth 
						loading={submitting} 
						onClick={handleUpdateCart} 
						disabled={item?.quantity===quantity || !item && quantity===0}>
							{item ? 'Update quantity' : 'Add to cart'}
						</LoadingButton>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
