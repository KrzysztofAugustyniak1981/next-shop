"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

export type CartItem = {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
    stock: number;
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
    children: React.ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cartItems)
        );
    }, [cartItems, isLoaded]);

    function addToCart(item: CartItem) {
        setCartItems((previousItems) => {
            const existingItem = previousItems.find(
                (cartItem) => cartItem.id === item.id
            );

            if (existingItem) {
                return previousItems.map((cartItem) =>
                    cartItem.id === item.id
                        ? {
                            ...cartItem,
                            quantity: Math.min(
                                cartItem.quantity + item.quantity,
                                cartItem.stock
                            ),
                        }
                        : cartItem
                );
            }

            return [...previousItems, item];
        });
    }

    function updateQuantity(id: number, quantity: number) {
        setCartItems((previousItems) =>
            previousItems.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: Math.max(
                            1,
                            Math.min(quantity, item.stock)
                        ),
                    }
                    : item
            )
        );
    }

    function removeFromCart(id: number) {
        setCartItems((previousItems) =>
            previousItems.filter((item) => item.id !== id)
        );
    }

    function clearCart() {
    setCartItems([]);
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );

}

export function useCart() {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
}