import React from 'react';
import { Badge, Button } from 'antd';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const CartBadge = () => {
    const navigate = useNavigate();
    const { cartCount } = useCart();

    return (
        <Badge count={cartCount} showZero>
        <Button
            type="text"
            icon={<ShoppingCart style={{ fontSize: '25px', color: '#000000' }} />}
            onClick={() => navigate('/cart')}
        />
        </Badge>
    );
};

export default CartBadge;
