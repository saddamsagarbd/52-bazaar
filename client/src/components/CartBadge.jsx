import React from 'react';
import { Badge, Button } from 'antd';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CartBadge = () => {
    const count = useSelector((state) => state.cart.count);
    const navigate = useNavigate();

    return (
        <Badge count={count} showZero>
        <Button
            type="text"
            icon={<ShoppingCart style={{ fontSize: '25px', color: '#000000' }} />}
            onClick={() => navigate('/cart')}
        />
        </Badge>
    );
};

export default CartBadge;
