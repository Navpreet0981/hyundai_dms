import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";
import { useDealerInventory, useCars, useVariants } from "../../hooks/useQueries";
import { PlusCircle, X, Package, Search } from "lucide-react";

// Modal sub-component for adding new stock — handles car/variant selection and quantity
function AddStockModal({ cars, onClose, onSave }) {
  const [selectedCarId, setSelectedCarId]       = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity]                 = useState(1);

  // Fetch variants only when a car is selected — enabled: !!carId prevents premature query
  const { data: variants = [] } = useVariants(selectedCarId || null);

  // Validate and call parent's onSave with variantId and quantity
  const handleSave = () => {
    if (!selectedVariantId || quantity < 1) return;
    onSave(Number(selectedVariantId), quantity);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="apple-card w-full max-w-sm p-6 space-y-4 shadow-apple-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Add to Inventory</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Step 1: select car model */}
        <select value={selectedCarId} onChange={e => { setSelectedCarId(e.target.value); setSelectedVariantId(""); }}
          className="apple-input">
          <option value="">Select Car Model</option>
          {cars.map(c => <option key={c.carId} value={c.carId}>{c.modelName}</option>)}
        </select>

        {/* Step 2: select variant — only shown after car is selected */}
        {selectedCarId && (
          <select value={selectedVariantId} onChange={e => setSelectedVariantId(e.target.value)} className="apple-input">
            <option value="">Select Variant</option>
            {variants.map(v => <option key={v.variantId} value={v.variantId}>{v.variantName} — ₹{v.price?.toLocaleString()}</option>)}
          </select>
        )}

        <div>
          <label className="block text-xs font-medium text-[#86868b] mb-1.5">Quantity</label>
          <input type="number" min="0" value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="apple-input" />
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="apple-btn-secondary flex-1">Cancel</button>
          {/* Disabled until a variant is selected */}
          <button onClick={handleSave} disabled={!selectedVariantId}
            className="apple-btn-primary flex-1 disabled:opacity-50">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DealerCars() {
  const qc = useQueryClient();

  // Fetch dealer's current inventory and all available car models
  const { data: inventory = [], isLoading } = useDealerInventory();
  const { data: cars = [] }                 = useCars();

  const [showModal, setShowModal]   = useState(false);
  const [editingId, setEditingId]   = useState(null);  // variantId of row being inline-edited
  const [editQty, setEditQty]       = useState(0);
  const [search, setSearch]         = useState("");

  // Client-side filter — searches model name and variant name
  const filtered = inventory.filter(item =>
    item.modelName?.toLowerCase().includes(search.toLowerCase()) ||
    item.variantName?.toLowerCase().includes(search.toLowerCase())
  );

  // Client-side pagination — inventory is small enough to not need server pagination
  const PAGE_SIZE = 10;
  const [page, setPage]   = useState(0);
  const totalPages        = Math.ceil(filtered.length / PAGE_SIZE);
  const paged             = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // Reset to page 0 whenever search changes so results start from the beginning
  useEffect(() => { setPage(0); }, [search]);

  // Invalidate inventory cache after any stock mutation
  const invalidate = () => qc.invalidateQueries({ queryKey: ['dealer-inventory'] });

  // Calls PUT /dealer/inventory/{variantId} to upsert stock, then refreshes table
  const handleAddStock = (variantId, quantity) => {
    api.put(`/dealer/inventory/${variantId}`, { quantity })
      .then(() => { setShowModal(false); invalidate(); })
      .catch(err => console.log(err));
  };

  // Saves inline quantity edit for a specific variant row
  const handleInlineUpdate = (variantId) => {
    api.put(`/dealer/inventory/${variantId}`, { quantity: editQty })
      .then(() => { setEditingId(null); invalidate(); })
      .catch(err => console.log(err));
  };

  // Returns badge color class based on stock level: red=0, orange=low, green=ok
  const stockBadge = (qty) => {
    if (qty === 0) return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
    if (qty <= 2) return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
    return "bg-[#d1fae5] dark:bg-[#052e16] text-[#065f46] dark:text-[#34d399]";
  };

  return (
    <DealerLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="apple-title">Inventory</h1>
            <p className="apple-subtitle mt-0.5">Manage car stock for your dealership</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                type="text"
                placeholder="Search model or variant…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                  bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                  placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]
                  w-52 transition-all"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="apple-btn-primary flex items-center gap-2">
              <PlusCircle size={15} /> Add Stock
            </button>
          </div>
        </div>

        {isLoading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            {/* Empty state — no inventory at all */}
            {inventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
                <Package size={40} className="mb-3 opacity-30" />
                <p className="text-sm">No inventory yet. Add stock to get started.</p>
              </div>
            ) : filtered.length === 0 ? (
              // Empty state — search returned no results
              <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
                <p className="text-sm">No results for "{search}"</p>
              </div>
            ) : (
              <>
              <table className="w-full text-left min-w-[600px]">
                <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                  <tr>
                    {["Model","Variant","Engine","Price","Stock",""].map((h, i) => (
                      <th key={i} className="apple-table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map(item => (
                    <tr key={item.inventoryId} className="apple-table-row">
                      <td className="apple-table-cell font-medium">{item.modelName}</td>
                      <td className="apple-table-cell text-[#86868b]">{item.variantName}</td>
                      <td className="apple-table-cell text-[#86868b]">{item.engineType}</td>
                      <td className="apple-table-cell text-[#86868b]">₹{item.price?.toLocaleString()}</td>
                      <td className="apple-table-cell">
                        {/* Inline edit mode — shows number input with save/cancel */}
                        {editingId === item.variantId ? (
                          <div className="flex items-center gap-2">
                            <input type="number" min="0" value={editQty}
                              onChange={e => setEditQty(Number(e.target.value))}
                              className="w-20 text-sm rounded-lg border border-[#e5e5ea] dark:border-[#3a3a3c]
                                bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                                px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                            />
                            <button onClick={() => handleInlineUpdate(item.variantId)}
                              className="text-xs text-[#0071e3] font-medium">Save</button>
                            <button onClick={() => setEditingId(null)}
                              className="text-xs text-[#86868b]">Cancel</button>
                          </div>
                        ) : (
                          // Stock badge — color reflects stock level
                          <span className={`apple-badge ${stockBadge(item.quantity)}`}>
                            {item.quantity === 0 ? "Out of Stock" : `${item.quantity} units`}
                          </span>
                        )}
                      </td>
                      <td className="apple-table-cell">
                        {/* Edit button — enters inline edit mode for this row */}
                        {editingId !== item.variantId && (
                          <button onClick={() => { setEditingId(item.variantId); setEditQty(item.quantity); }}
                            className="text-xs text-[#0071e3] border border-[#0071e3]/30 hover:bg-[#0071e3]/5 px-3 py-1 rounded-lg transition-colors">
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Client-side pagination controls — only shown when more than one page */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e5ea] dark:border-[#2c2c2e]">
                  <p className="text-xs text-[#86868b]">
                    Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                      className="apple-btn-secondary !px-3 !py-1.5 !text-xs disabled:opacity-40">
                      Previous
                    </button>
                    <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
                      className="apple-btn-secondary !px-3 !py-1.5 !text-xs disabled:opacity-40">
                      Next
                    </button>
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Add stock modal — passes car list and callbacks */}
      {showModal && (
        <AddStockModal
          cars={cars}
          onClose={() => setShowModal(false)}
          onSave={handleAddStock}
        />
      )}
    </DealerLayout>
  );
}
