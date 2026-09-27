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

type ApiCartItem = {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: string;
        imageUrl: string | null;
        stock: number;
    };
};

type ApiCart = {
    items: ApiCartItem[];
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => Promise<void>;
    updateQuantity: (
        id: number,
        quantity: number
    ) => Promise<void>;
    removeFromCart: (id: number) => Promise<void>;
    clearCart: () => Promise<void>;
};

const CartContext = createContext<
    CartContextType | undefined
>(undefined);

type CartProviderProps = {
    children: React.ReactNode;
};

function convertApiCart(cart: ApiCart): CartItem[] {
    return cart.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        stock: item.product.stock,
    }));
}

export function CartProvider({
    children,
}: CartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        let active = true;

        fetch("/api/cart", {
            method: "GET",
            cache: "no-store",
        })
            .then(async (response) => {
                if (response.status === 401) {
                    return null;
                }

                if (!response.ok) {
                    throw new Error("Failed to load cart.");
                }

                return (await response.json()) as ApiCart;
            })
            .then((cart) => {
                if (active && cart) {
                    setCartItems(convertApiCart(cart));
                }
            })
            .catch((error) => {
                console.error("Failed to load cart:", error);
            });

        return () => {
            active = false;
        };
    }, []);

    async function addToCart(item: CartItem) {
        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: item.id,
                    quantity: item.quantity,
                }),
            });

            if (!response.ok) {
                console.error("Failed to add product to cart.");
                return;
            }

            const cart: ApiCart = await response.json();

            setCartItems(convertApiCart(cart));
        } catch (error) {
            console.error(
                "Failed to add product to cart:",
                error
            );
        }
    }

    async function updateQuantity(
        id: number,
        quantity: number
    ) {
        try {
            const response = await fetch("/api/cart", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: id,
                    quantity,
                }),
            });

            if (!response.ok) {
                console.error("Failed to update cart.");
                return;
            }

            const cart: ApiCart = await response.json();

            setCartItems(convertApiCart(cart));
        } catch (error) {
            console.error(
                "Failed to update cart:",
                error
            );
        }
    }

    async function removeFromCart(id: number) {
        try {
            const response = await fetch("/api/cart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: id,
                }),
            });

            if (!response.ok) {
                console.error("Failed to remove product.");
                return;
            }

            const cart: ApiCart = await response.json();

            setCartItems(convertApiCart(cart));
        } catch (error) {
            console.error(
                "Failed to remove product from cart:",
                error
            );
        }
    }

    async function clearCart() {
        try {
            const response = await fetch("/api/cart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                console.error("Failed to clear cart.");
                return;
            }

            const cart: ApiCart = await response.json();

            setCartItems(convertApiCart(cart));
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
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
        throw new Error(
            "useCart must be used within a CartProvider"
        );
    }

    return context;
}