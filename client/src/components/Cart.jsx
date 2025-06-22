import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { initCart } from "@/redux/cartActions";

const Cart = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initCart());
    }, [dispatch]);

    return null;

}

export default Cart;

