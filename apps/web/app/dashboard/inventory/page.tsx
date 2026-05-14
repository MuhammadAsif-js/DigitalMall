"use client";

import React, { useState, useEffect } from "react";
import AddProductModal from "@/components/inventory/AddProductModal";
import { Plus, Edit, Check } from "lucide-react";

interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  price: number;
  stock: number;
}

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number | string>("");
  const [editStock, setEditStock] = useState<number | string>("");

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
    setEditingId(item.id);
    setEditPrice(item.price);
    setEditStock(item.stock);
  };

  const handleSaveClick = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: Number(editPrice),
          stock: Number(editStock),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setInventory((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, price: Number(editPrice), stock: Number(editStock) }
                : item
            )
          );
          setEditingId(null);
        }
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-8">
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

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 flex items-center justify-center min-h-[400px] text-slate-400">
            Loading inventory...
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
                {inventory.length > 0 ? (
                  inventory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-300">{item.barcode}</td>
                      <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1">
                            <span>Rs.</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-20 px-2 py-1 bg-slate-950 border border-emerald-500/50 text-white rounded outline-none focus:border-emerald-400"
                            />
                          </div>
                        ) : (
                          `Rs. ${item.price}`
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-20 px-2 py-1 bg-slate-950 border border-emerald-500/50 text-white rounded outline-none focus:border-emerald-400"
                          />
                        ) : (
                          item.stock
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === item.id ? (
                          <button
                            onClick={() => handleSaveClick(item.id)}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded transition-colors inline-flex"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors inline-flex"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
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
  );
}
