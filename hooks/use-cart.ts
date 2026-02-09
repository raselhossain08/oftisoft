
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    type?: 'product' | 'service';
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    total: () => number;
}

export const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (data: CartItem) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === data.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === data.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true
                    });
                } else {
                    set({ items: [...get().items, { ...data, quantity: 1 }], isOpen: true });
                }
            },
            removeItem: (id: string) => {
                set({ items: [...get().items.filter((item) => item.id !== id)] });
            },
            updateQuantity: (id: string, quantity: number) => {
                if (quantity < 1) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            total: () => {
                return get().items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
            }
        }),
        {
            name: 'cart-storage-v2',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
