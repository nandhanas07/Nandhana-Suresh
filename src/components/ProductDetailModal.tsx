import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { CafeProduct } from '../data/cafeData';
import { SmartImage } from './SmartImage';

interface ProductDetailModalProps {
  product: CafeProduct | null;
  onClose: () => void;
  onAddToCart: (
    product: CafeProduct,
    quantity: number,
    selectedOptions: Record<string, { id: string; name: string; priceDelta: number }>,
    specialNote: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<
    Record<string, { id: string; name: string; priceDelta: number }>
  >({});
  const [specialNote, setSpecialNote] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product) {
      const initial: Record<string, { id: string; name: string; priceDelta: number }> = {};
      product.customizationGroups.forEach((group) => {
        const found =
          group.options.find((o) => o.id === group.defaultOptionId) || group.options[0];
        if (found) {
          initial[group.id] = found;
        }
      });
      setSelections(initial);
      setQuantity(1);
      setSpecialNote('');
      setJustAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const extraCost = Object.values(selections).reduce(
    (sum, opt) => sum + (opt?.priceDelta || 0),
    0
  );
  const unitPrice = product.price + extraCost;
  const totalPrice = unitPrice * quantity;

  const handleConfirmAdd = () => {
    onAddToCart(product, quantity, selections, specialNote.trim());
    setJustAdded(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#F9F9F8] border border-stone-300/80 rounded-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product configuration"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-lg bg-[#F9F9F8]/90 text-[#141413] hover:bg-[#EFEFED] transition-colors focus-visible:outline-2 focus-visible:outline-[#1B4332]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Sticky Gallery & Extraction Spec */}
          <div className="md:col-span-6 bg-[#F1F1EE] flex flex-col justify-between p-6 sm:p-8 border-b md:border-b-0 md:border-r border-stone-200/90">
            <div>
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#E7E7E2] mb-6">
                <SmartImage
                  src={product.image}
                  alt={product.name}
                  fallbackTitle={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-xs text-[#575753] flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                <span>{product.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{product.originOrProcess}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{product.elevationOrBatch}</span>
              </div>

              <p className="text-sm text-[#383835] leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            <div className="pt-5 border-t border-stone-300/70">
              <div className="text-xs text-[#575753] mb-2">
                Tasting Notes: <span className="text-[#141413] font-medium">{product.tastingNotes}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-stone-200/80 text-xs">
                <div>
                  <span className="text-[#575753] block">Thermal Spec</span>
                  <span className="font-mono tabular-nums text-[#141413] font-medium">
                    {product.extractionSpec.temp}
                  </span>
                </div>
                <div>
                  <span className="text-[#575753] block">Target Ratio</span>
                  <span className="font-mono tabular-nums text-[#141413] font-medium">
                    {product.extractionSpec.ratio}
                  </span>
                </div>
                <div>
                  <span className="text-[#575753] block">Contact Time</span>
                  <span className="font-mono tabular-nums text-[#141413] font-medium">
                    {product.extractionSpec.time}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-[#F9F9F8]">
            <div>
              <div className="flex items-center justify-between text-xs text-[#575753] mb-2">
                <span>{product.unitLabel}</span>
                <span>{product.availabilityNote}</span>
              </div>

              <h2
                id="modal-product-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#141413] leading-tight mb-2 text-balance"
              >
                {product.name}
              </h2>

              <div className="font-mono text-xl font-medium text-[#141413] tabular-nums mb-6 pb-4 border-b border-stone-200">
                ${unitPrice.toFixed(2)}
                {extraCost > 0 && (
                  <span className="text-xs text-[#575753] ml-2 font-sans">
                    (Base ${product.price.toFixed(2)} + ${extraCost.toFixed(2)} selection)
                  </span>
                )}
              </div>

              {/* Customization Groups */}
              <div className="space-y-5 mb-6">
                {product.customizationGroups.map((group) => {
                  const currentSelection = selections[group.id];
                  return (
                    <div key={group.id}>
                      <label className="block text-xs font-semibold text-[#141413] mb-2">
                        {group.label}
                      </label>
                      <div className="space-y-2">
                        {group.options.map((opt) => {
                          const isSelected = currentSelection?.id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() =>
                                setSelections((prev) => ({
                                  ...prev,
                                  [group.id]: opt,
                                }))
                              }
                              className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#141413] font-medium'
                                  : 'border-stone-200/90 bg-white text-[#383835] hover:border-stone-300'
                              }`}
                            >
                              <span className="truncate">{opt.name}</span>
                              <span className="font-mono tabular-nums shrink-0 text-[#575753]">
                                {opt.priceDelta > 0
                                  ? `+$${opt.priceDelta.toFixed(2)}`
                                  : 'Included'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div>
                  <label
                    htmlFor="barista-note"
                    className="block text-xs font-semibold text-[#141413] mb-1.5"
                  >
                    Barista / Baker Preparation Note (Optional)
                  </label>
                  <input
                    id="barista-note"
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="e.g., Extra hot carafe, split pastry in half..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200/90 rounded-lg text-[#141413] placeholder:text-stone-400 focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>
            </div>

            {/* Contiguous Quantity + Primary Buy Action */}
            <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-lg bg-white h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-[#141413] hover:bg-stone-100 transition-colors rounded-l-lg"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center font-mono text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-[#141413] hover:bg-stone-100 transition-colors rounded-r-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 h-11 px-5 rounded-lg bg-[#1B4332] hover:bg-[#133124] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Order Bag</span>
                  </>
                ) : (
                  <>
                    <span>Add to Order Bag</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">${totalPrice.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
