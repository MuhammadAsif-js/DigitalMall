import Link from "next/link";
import { PackageOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] p-10">
      {/* Brand Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">Digital Mall</h1>
        <p className="text-lg text-slate-400">Vendor Management Portal</p>
      </div>
      
      {/* Navigation Portal */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <PackageOpen className="w-8 h-8 text-emerald-500" />
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">Inventory System</h2>
        <p className="text-slate-400 text-center mb-8">
          Manage your digital shelf, pricing, and stock.
        </p>

        <Link 
          href="/dashboard/inventory"
          className="w-full text-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-900/20 transition-all"
        >
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}