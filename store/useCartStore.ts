"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  licenseType: "regular" | "extended";
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { licenseType?: "regular" | "extended" }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateLicenseType: (id: string, licenseType: "regular" | "extended") => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (id: string) => boolean;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
          toast.success("Quantity updated in cart");
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: 1,
                licenseType: item.licenseType || "regular",
              },
            ],
          });
          toast.success("Added to cart");
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
        toast.success("Removed from cart");
      },

      updateQuantity: (id, quantity) => {
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

      updateLicenseType: (id, licenseType) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, licenseType } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price =
            item.licenseType === "extended"
              ? item.price * 10 // Extended license is 10x price
              : item.price;
          return total + price * item.quantity;
        }, 0);
      },

      isInCart: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "oftisoft-cart",
      version: 1,
    }
  )
);
