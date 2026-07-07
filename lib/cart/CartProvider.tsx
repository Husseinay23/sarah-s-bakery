"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  CartItem,
  CartMiniBoxItem,
  CartPackageItem,
  CustomerDetails,
} from "@/lib/types";
import { EMPTY_CUSTOMER } from "@/lib/types";
import { getLastOrderForPhone } from "@/lib/lastOrder";

const CART_STORAGE_KEY = "sarahs-bakery-cart";
const CUSTOMER_STORAGE_KEY = "sarahs-bakery-customer";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  customer: CustomerDetails;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  updateCustomer: (details: Partial<CustomerDetails>) => void;
  addPackage: (item: Omit<CartPackageItem, "id">) => void;
  addMiniBox: (item: Omit<CartMiniBoxItem, "id">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  reorderForPhone: (phone: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadCustomer(): CustomerDetails {
  if (typeof window === "undefined") return EMPTY_CUSTOMER;
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    return raw ? { ...EMPTY_CUSTOMER, ...(JSON.parse(raw) as CustomerDetails) } : EMPTY_CUSTOMER;
  } catch {
    return EMPTY_CUSTOMER;
  }
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerDetails>(EMPTY_CUSTOMER);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setCustomer(loadCustomer());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  }, [customer, hydrated]);

  const updateCustomer = useCallback((details: Partial<CustomerDetails>) => {
    setCustomer((prev) => ({ ...prev, ...details }));
  }, []);

  const addPackage = useCallback((item: Omit<CartPackageItem, "id">) => {
    setItems((prev) => [...prev, { ...item, id: createId() }]);
    setIsOpen(true);
  }, []);

  const addMiniBox = useCallback((item: Omit<CartMiniBoxItem, "id">) => {
    setItems((prev) => [...prev, { ...item, id: createId() }]);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const reorderForPhone = useCallback((phone: string) => {
    const lastItems = getLastOrderForPhone(phone);
    if (!lastItems?.length) return false;
    setItems(lastItems);
    return true;
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.length,
      subtotal: items.reduce((sum, i) => sum + i.total, 0),
      customer,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((o) => !o),
      updateCustomer,
      addPackage,
      addMiniBox,
      removeItem,
      clearCart,
      reorderForPhone,
    }),
    [items, customer, isOpen, updateCustomer, addPackage, addMiniBox, removeItem, clearCart, reorderForPhone],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function isCustomerValid(customer: CustomerDetails): boolean {
  return (
    customer.name.trim().length >= 2 &&
    customer.phone.trim().length >= 8 &&
    customer.address.trim().length >= 3 &&
    customer.preferredDate.trim().length > 0
  );
}
