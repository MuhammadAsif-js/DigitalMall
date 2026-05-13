"use client";

import React, { useState } from "react";
import AddProductModal from "@/components/inventory/AddProductModal";
import { Plus } from "lucide-react";

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {/* Placeholder for Data Table (Day 8) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
        <p className="text-slate-400 max-w-sm mb-6">
          Get started by adding your first product to the inventory system.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
        >
          Add First Product
        </button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
