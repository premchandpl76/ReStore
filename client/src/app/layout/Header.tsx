import { ShoppingCart } from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import { useStoreContext } from '../context/StoreContext';

interface Props {
	darkMode: boolean;
	handleThemeChange: () => void;
}
const midLinks = [
	{ title: 'catalog', path: '/catalog' },
	{ title: 'about', path: '/about' },
	{ title: 'contact', path: '/contact' }
];

const rightLinks = [
	{ title: 'login', path: '/login' },
	{ title: 'register', path: '/register' }
];

const navStyles = {
	color: 'inherit',
	textDecoration: 'none',
	typography: 'h6',
	'&:hover': {
		color: 'grey.500'
	},
	'&.active': {
		color: 'text.secondary'
	}
};

export default function Header({ darkMode, handleThemeChange }: Props) {
	const {basket} = useStoreContext();
	const itemCount = basket?.items.reduce((sum, item)=>sum + item.quantity,0);
	return (
		<AppBar position="static" sx={{ mb: 4, flexDirection:'row' }}>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Box display="flex" alignItems="center">
					<Typography component={NavLink} to="/" sx={navStyles} exact>
						RE-STORE
					</Typography>
					<Switch checked={darkMode} onChange={handleThemeChange} />
				</Box>
			</Toolbar>
			
      <List sx={{ display: 'flex' }}>
        {midLinks.map(({ title, path }) => (
          <ListItem component={NavLink} key={path} to={path} sx={navStyles}>
            {title.toUpperCase()}
          </ListItem>
        ))}
      </List>
			
			<Box display="flex" marginLeft={'auto'}>
				<IconButton size="large" color="inherit">
					<Badge badgeContent={itemCount} color="secondary" component={Link } to='/basket'>
						<ShoppingCart />
					</Badge>
				</IconButton>
				<List sx={{ display: 'flex' }}>
					{rightLinks.map(({ title, path }) => (
						<ListItem component={NavLink} key={path} to={path} sx={navStyles}>
							{title.toUpperCase()}
						</ListItem>
					))}
				</List>
			</Box>
		</AppBar>
	);
}
