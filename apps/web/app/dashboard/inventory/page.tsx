"use client";

import React, { useState, useEffect } from "react";
import AddProductModal from "@/components/inventory/AddProductModal";
import { Plus, Edit, Check, Search, X, Minus, ShoppingCart } from "lucide-react";

interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
}

interface CartItem extends InventoryItem {
  cartQuantity: number;
  customPrice: number;
}

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editPrice, setEditPrice] = useState<number | string>("");
  const [editCostPrice, setEditCostPrice] = useState<number | string>("");
  const [editStock, setEditStock] = useState<number | string>("");

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch('/api/inventory');
        if (response.ok) {
          const data = await response.json();
          setInventory(data);
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setEditPrice(item.price);
    setEditCostPrice(item.costPrice);
    setEditStock(item.stock);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      const response = await fetch(`/api/inventory/${editingItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingItem.name,
          price: Number(editPrice),
          costPrice: Number(editCostPrice),
          stock: Number(editStock),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setInventory((prev) =>
            prev.map((item) =>
              item.id === editingItem.id
                ? { ...item, price: Number(editPrice), costPrice: Number(editCostPrice), stock: Number(editStock) }
                : item
            )
          );
          setIsEditModalOpen(false);
          setEditingItem(null);
        }
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleAddToCart = (item: InventoryItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, cartQuantity: c.cartQuantity + 1 } : c
        );
      }
      return [...prev, { ...item, cartQuantity: 1, customPrice: item.price }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newQty = Math.max(1, c.cartQuantity + delta);
          return { ...c, cartQuantity: newQty };
        }
        return c;
      })
    );
  };

  const updateCartPrice = (id: string, newPrice: string) => {
    setCart((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, customPrice: Number(newPrice) } : c
      )
    );
  };

  const handleCheckout = () => {
    let totalProfit = 0;
    cart.forEach((c) => {
      totalProfit += (c.customPrice - c.costPrice) * c.cartQuantity;
    });
    console.log(`Checkout Complete! Total Profit: Rs. ${totalProfit}`);

    // Deduct quantities from main inventory state
    setInventory((prev) =>
      prev.map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);
        if (cartItem) {
          return { ...item, stock: Math.max(0, item.stock - cartItem.cartQuantity) };
        }
        return item;
      })
    );

    setCart([]);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.barcode.includes(searchQuery)
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.customPrice * item.cartQuantity, 0);

  return (
    <div className="min-h-screen bg-[#020617] p-8 flex gap-6">
      <div className="flex-1 w-[70%] flex flex-col">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Inventory Management</h1>
          <p className="text-slate-400">Manage your pharmacy products, pricing, and stock levels.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search and Table */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or barcode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500"
        />
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-800/50 rounded-lg w-full"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Barcode</th>
                  <th className="px-6 py-4 font-medium">Product Name</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-300">{item.barcode}</td>
                      <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-slate-300">Rs. {item.price}</td>
                      <td className="px-6 py-4 text-slate-300">{item.stock}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded flex items-center gap-1 text-xs font-medium transition-colors"
                          title="Add to Cart"
                          onClick={() => handleAddToCart(item)}
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors inline-flex"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      </div>

      {/* POS Cart Sidebar */}
      <div className="w-[30%] bg-slate-900 border border-slate-800 rounded-xl flex flex-col shadow-lg overflow-hidden h-[calc(100vh-64px)] sticky top-8">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-500" />
            Current Sale
          </h2>
          <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded">
            {cart.length} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <ShoppingCart className="w-12 h-12 text-slate-800" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map((c) => (
              <div key={c.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium text-sm">{c.name}</h3>
                    <p className="text-slate-500 text-xs">Stock: {c.stock}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => updateCartQuantity(c.id, -1)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white text-xs font-medium w-4 text-center">{c.cartQuantity}</span>
                    <button
                      onClick={() => updateCartQuantity(c.id, 1)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Rs.</span>
                  <input
                    type="number"
                    value={c.customPrice}
                    onChange={(e) => updateCartPrice(c.id, e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-emerald-400 font-medium rounded-lg outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-950/50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-medium">Total</span>
            <span className="text-2xl font-bold text-white">Rs. {cartTotal}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
          >
            Complete Sale
          </button>
        </div>
      </div>

      {/* Edit Item Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Product</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 text-slate-500 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Cost Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editCostPrice}
                    onChange={(e) => setEditCostPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
