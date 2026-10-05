/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Check,
  ArrowUpRight,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  CAFE_PRODUCTS,
  CRAFT_CAPABILITIES,
  HERO_IMAGE,
  CafeProduct,
  MenuCategory,
} from './data/cafeData';
import { SmartImage } from './components/SmartImage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { BrewCalculator } from './components/BrewCalculator';

export default function App() {
  // Filtering & Search state
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'plant-based' | 'gluten-free'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Cart state
  const [activeProductModal, setActiveProductModal] = useState<CafeProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Pre-seed cart with 1 signature item so user can test checkout immediately or modify it
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'ethiopia-worka-v60::hot-carafe|hario-v60::',
      product: CAFE_PRODUCTS[0],
      quantity: 1,
      selectedOptions: {
        'serve-temp': { id: 'hot-carafe', name: 'Hot Borosilicate Carafe (93.5°C)', priceDelta: 0 },
        'water-profile': {
          id: 'hario-v60',
          name: 'Hario V60 Conical (High Clarity)',
          priceDelta: 0,
        },
      },
      specialNote: '',
      unitPrice: 7.5,
    },
  ]);

  // Tasting & Table Reservation Form State
  const [resExperience, setResExperience] = useState<
    'atrium-table' | 'pour-over-bar' | 'cupping-flight'
  >('pour-over-bar');
  const [resDate, setResDate] = useState('2026-10-09');
  const [resTime, setResTime] = useState('09:30');
  const [resGuests, setResGuests] = useState(2);
  const [resName, setResName] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resNotes, setResNotes] = useState('');
  const [resError, setResError] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<{
    code: string;
    name: string;
    experienceLabel: string;
    date: string;
    time: string;
    guests: number;
    email: string;
  } | null>(null);

  const filteredProducts = useMemo(() => {
    return CAFE_PRODUCTS.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const matchesDiet =
        dietaryFilter === 'all' || item.dietaryTags.includes(dietaryFilter);
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.tastingNotes.toLowerCase().includes(q) ||
        item.originOrProcess.toLowerCase().includes(q);
      return matchesCat && matchesDiet && matchesSearch;
    });
  }, [activeCategory, dietaryFilter, searchQuery]);

  const totalBagCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = (
    product: CafeProduct,
    quantity: number,
    selectedOptions: Record<string, { id: string; name: string; priceDelta: number }>,
    specialNote: string
  ) => {
    const optionKey = Object.keys(selectedOptions)
      .sort()
      .map((k) => selectedOptions[k].id)
      .join('|');
    const cartItemId = `${product.id}::${optionKey}::${specialNote}`;
    const extraCost = Object.values(selectedOptions).reduce(
      (sum, o) => sum + (o?.priceDelta || 0),
      0
    );
    const unitPrice = product.price + extraCost;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          quantity,
          selectedOptions,
          specialNote,
          unitPrice,
        },
      ];
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product.id ? null : prev));
    }, 1200);
  };

  const handleQuickAdd = (product: CafeProduct) => {
    const defaults: Record<string, { id: string; name: string; priceDelta: number }> = {};
    product.customizationGroups.forEach((group) => {
      const def =
        group.options.find((o) => o.id === group.defaultOptionId) || group.options[0];
      if (def) defaults[group.id] = def;
    });
    handleAddToCart(product, 1, defaults, '');
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResError('');

    if (!resName.trim() || resName.trim().length < 2) {
      setResError('Please provide your full name for the tasting host list.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resEmail.trim())) {
      setResError('Please enter a valid email address for calendar confirmation.');
      return;
    }
    if (resPhone.replace(/\D/g, '').length < 7) {
      setResError('Please enter a valid contact phone number.');
      return;
    }

    const experienceMap = {
      'pour-over-bar': 'Monolithic Limestone Pour-Over Bar Seating',
      'atrium-table': 'Sunlit Architectural Atrium Table',
      'cupping-flight': 'Roastery Single-Origin Cupping Flight ($18/guest)',
    };

    const randomCode = `SR-${Math.floor(400 + Math.random() * 599)}`;
    setConfirmedReservation({
      code: randomCode,
      name: resName.trim(),
      experienceLabel: experienceMap[resExperience],
      date: resDate,
      time: resTime,
      guests: resGuests,
      email: resEmail.trim(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] text-[#141413]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#F9F9F8]/95 backdrop-blur-xs border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="font-display text-2xl font-semibold tracking-tight text-[#141413] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          >
            Sorel Roastery
          </a>

          {/* Zone 2: 4 clean navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-xs font-medium text-[#575753]"
          >
            <a
              href="#daily-menu"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Daily Menu
            </a>
            <a
              href="#single-origins"
              onClick={() => setActiveCategory('beans')}
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Single Origins
            </a>
            <a
              href="#craft-lab"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Craft & Lab
            </a>
            <a
              href="#visit-reserve"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Visit & Reserve
            </a>
          </nav>

          {/* Zone 3: 2 primary actions */}
          <div className="flex items-center gap-3">
            <a
              href="#visit-reserve"
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-xs font-medium text-[#141413] border border-stone-300 rounded-lg hover:bg-[#F1F1EE] transition-colors whitespace-nowrap shrink-0"
            >
              Reserve Table
            </a>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#133124] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order Bag</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{totalBagCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* SECTION 1: Storefront Architectural Hero */}
        <section className="border-b border-stone-200/90">
          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Narrative Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#575753]">
                  <span>412 NW Flanders St, Portland</span>
                  <span aria-hidden="true">·</span>
                  <span>Loring S15 Convection Roastery</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">Open Daily 06:30 – 18:00</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-semibold text-[#141413] leading-[1.08] tracking-tight text-balance">
                  Precision-roasted single origins & naturally leavened morning viennoiserie.
                </h1>

                <p className="text-base text-[#383835] leading-relaxed max-w-xl">
                  We contract directly with 14 high-altitude partner farms in Ethiopia, Colombia,
                  and Peru, roasting every Tuesday on a closed-loop Loring S15 Falcon alongside
                  36-hour cold-fermented sourdough pastries milled from Skagit Valley grains.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#daily-menu"
                    className="px-6 py-3 bg-[#1B4332] hover:bg-[#133124] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-2"
                  >
                    <span>Explore Daily Menu & Order</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#craft-lab"
                    className="px-5 py-3 bg-[#F1F1EE] hover:bg-[#E6E6E1] text-[#141413] border border-stone-300/80 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Open Brew Ratio Calculator
                  </a>
                </div>

                {/* Unboxed Provenance Fact Bar */}
                <div className="pt-6 border-t border-stone-200/90 grid grid-cols-3 gap-6">
                  <div>
                    <div className="font-mono text-xl sm:text-2xl font-semibold text-[#141413] tabular-nums">
                      93.5°C
                    </div>
                    <div className="text-xs text-[#575753] mt-0.5">
                      Remineralized 45 ppm Brew Water
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-xl sm:text-2xl font-semibold text-[#141413] tabular-nums">
                      36 Hours
                    </div>
                    <div className="text-xs text-[#575753] mt-0.5">
                      Cold Levain Pastry Fermentation
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-xl sm:text-2xl font-semibold text-[#141413] tabular-nums">
                      100%
                    </div>
                    <div className="text-xs text-[#575753] mt-0.5">
                      Published Farm-Gate Receipts
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 16:9 Architectural Showcase */}
              <div className="lg:col-span-6">
                <div className="relative rounded-xl overflow-hidden border border-stone-300/80 bg-[#EFEFED] aspect-[16/10]">
                  <SmartImage
                    src={HERO_IMAGE}
                    alt="Sorel Roastery monolithic limestone espresso bar and sunlit oak interior"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-6">
                    <div className="w-full flex flex-wrap items-end justify-between gap-4 text-white">
                      <div>
                        <div className="text-xs text-stone-200">
                          Today on the Conical Hand-Pour Bar
                        </div>
                        <div className="font-display text-xl font-medium">
                          Gedeb Worka Sakaro Lot 04 · Anaerobic Washed Ethiopia
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveProductModal(CAFE_PRODUCTS[0])}
                        className="px-3.5 py-2 bg-white text-[#141413] hover:bg-stone-100 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Order Carafe · $7.50
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Featured Menu & Single-Origin Roastery Storefront */}
        <section id="daily-menu" className="py-16 lg:py-24 border-b border-stone-200/90">
          <div id="single-origins" className="max-w-7xl mx-auto px-6">
            {/* Section Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200/90">
              <div>
                <div className="text-xs text-[#575753] mb-1.5">
                  Prepared to Order · Express Bar Pickup or Local Insulated Courier
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413] text-balance">
                  Daily Bar Menu, Viennoiserie & Whole Bean Micro-Lots
                </h2>
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-[#575753] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search origin, note, pastry..."
                  aria-label="Search menu offerings"
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-stone-300/90 rounded-lg text-[#141413] placeholder:text-stone-400 focus:outline-none focus:border-[#1B4332]"
                />
              </div>
            </div>

            {/* Interactive Filter Bar (Functional Segmented Buttons) */}
            <div className="py-5 flex flex-wrap items-center justify-between gap-4">
              <div
                className="flex flex-wrap items-center gap-1 p-1 bg-[#F1F1EE] rounded-lg"
                role="tablist"
                aria-label="Menu Categories"
              >
                {(
                  [
                    { id: 'all', label: 'All Offerings (6)' },
                    { id: 'coffee', label: 'Filter & Espresso Bar' },
                    { id: 'bakery', label: 'Sourdough Viennoiserie' },
                    { id: 'beans', label: 'Whole Bean Micro-Lots' },
                  ] as const
                ).map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#141413] shadow-xs'
                          : 'text-[#575753] hover:text-[#141413]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Dietary Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#575753]" />
                <span className="text-xs text-[#575753]">Preference:</span>
                <div className="flex items-center gap-1 p-1 bg-[#F1F1EE] rounded-lg">
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'plant-based', label: 'Plant-Based' },
                      { id: 'gluten-free', label: 'Gluten-Friendly' },
                    ] as const
                  ).map((diet) => (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setDietaryFilter(diet.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        dietaryFilter === diet.id
                          ? 'bg-white text-[#141413] shadow-xs'
                          : 'text-[#575753] hover:text-[#141413]'
                      }`}
                    >
                      {diet.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3-Column Uniform Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-[#F1F1EE] rounded-xl border border-stone-200/90 p-8">
                <p className="font-display text-2xl text-[#141413] mb-2">
                  No offerings match your current filter
                </p>
                <p className="text-xs text-[#575753] mb-4">
                  Try clearing your search query or switching back to All Offerings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setDietaryFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#141413] text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Reset Menu Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
                {filteredProducts.map((product) => {
                  const isAdded = recentlyAddedId === product.id;

                  return (
                    <article
                      key={product.id}
                      className="group bg-[#F1F1EE] border border-stone-200/90 rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                    >
                      <div>
                        {/* Card Image Container (70% visual dominance) */}
                        <div
                          onClick={() => setActiveProductModal(product)}
                          className="aspect-[4/3] w-full bg-[#E7E7E2] overflow-hidden cursor-pointer relative"
                        >
                          <SmartImage
                            src={product.image}
                            alt={product.name}
                            fallbackTitle={product.name}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          />
                        </div>

                        {/* Card Body with Zero-Pill Metadata */}
                        <div className="p-6 pb-4">
                          {/* Clean unboxed metadata with typographic separators */}
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#575753] mb-2">
                            <span>{product.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.elevationOrBatch}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.availabilityNote}</span>
                          </div>

                          <div className="flex items-baseline justify-between gap-4 mb-2">
                            <h3 className="text-base font-semibold text-[#141413] leading-snug">
                              <button
                                type="button"
                                onClick={() => setActiveProductModal(product)}
                                className="text-left hover:underline underline-offset-4 cursor-pointer"
                              >
                                {product.name}
                              </button>
                            </h3>
                            <span className="font-mono text-[15px] font-medium text-[#141413] tabular-nums shrink-0">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

                          <p className="text-xs text-[#575753] mb-3">{product.tastingNotes}</p>

                          <p className="text-xs text-[#383835] leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-6 pb-6 pt-3 border-t border-stone-200/80 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveProductModal(product)}
                          className="px-3.5 py-2 text-xs font-medium text-[#141413] bg-[#F9F9F8] hover:bg-white border border-stone-300/90 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Configure & Spec
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickAdd(product)}
                          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                            isAdded
                              ? 'bg-[#141413] text-white'
                              : 'bg-[#1B4332] hover:bg-[#133124] text-white'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <span>Quick Add</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: Craft, Farm-Gate Provenance & Interactive Brew Calculator */}
        <section id="craft-lab" className="py-16 lg:py-24 border-b border-stone-200/90">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="max-w-2xl">
              <div className="text-xs text-[#575753] mb-1.5">
                 Agronomic Transparency · Thermal Engineering · Grain Fermentation
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413] text-balance">
                Verifiable Sourcing & Roastery Architecture
              </h2>
            </div>

            {/* Numbered Editorial Capabilities with Adjacent Quantified Proof & Attributable Testimonials */}
            <div className="divide-y divide-stone-200/90 border-t border-b border-stone-200/90">
              {CRAFT_CAPABILITIES.map((cap) => (
                <div
                  key={cap.index}
                  className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Capability Claim */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="text-xs font-semibold text-[#1B4332]">{cap.index}</div>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413] text-balance">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-[#383835] leading-relaxed max-w-xl">
                      {cap.description}
                    </p>
                    <div className="pt-2">
                      <div className="text-xs font-mono tabular-nums text-[#141413] font-medium">
                        Verified Benchmark: {cap.proofMetric}
                      </div>
                    </div>
                  </div>

                  {/* Adjacent Proof & Attributable Testimonial */}
                  <blockquote className="lg:col-span-6 bg-[#F1F1EE] border border-stone-200/90 rounded-xl p-6 space-y-4">
                    <p className="text-sm text-[#141413] leading-relaxed italic">
                      “{cap.testimonial.quote}”
                    </p>
                    <footer className="text-xs text-[#575753] flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 border-t border-stone-200/80">
                      <strong className="font-semibold text-[#141413] not-italic">
                        {cap.testimonial.author}
                      </strong>
                      <span aria-hidden="true">·</span>
                      <span>{cap.testimonial.role}</span>
                      <span aria-hidden="true">·</span>
                      <span>{cap.testimonial.organization}</span>
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>

            {/* Interactive Precision Brew Ratio Calculator */}
            <BrewCalculator />
          </div>
        </section>

        {/* SECTION 4: Flagship Tasting Room & Table / Cupping Reservation */}
        <section id="visit-reserve" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Flagship Location & Hours */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="text-xs text-[#575753] mb-1.5">
                    Pearl District Flagship · Architectural Tasting Room
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413] text-balance mb-4">
                    Visit the Roastery or Reserve a Tasting Seat
                  </h2>
                  <p className="text-sm text-[#383835] leading-relaxed">
                    Our NW Flanders tasting room features a 9-meter poured limestone brew bar with
                    dedicated seating for guided single-origin flights, alongside quiet oak atrium
                    tables designed for unhurried morning reading and pastry pairings.
                  </p>
                </div>

                <div className="space-y-5 border-t border-stone-200/90 pt-6 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#141413]">Address & Transit</div>
                      <div className="text-[#575753] mt-0.5">
                        412 NW Flanders St, Portland, OR 97209 · 2 blocks from NW 10th & Couch
                        Streetcar Stop · Covered bicycle courtyard on 5th Ave.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#141413]">Service & Bake Schedule</div>
                      <div className="text-[#575753] mt-0.5 font-mono tabular-nums">
                        Monday – Friday: 06:30 – 18:00 · Saturday – Sunday: 07:00 – 18:00
                      </div>
                      <div className="text-[#575753] mt-0.5">
                        First sourdough viennoiserie bake exits deck oven at 06:30; second warm
                        batch at 10:15.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#141413]">
                        Friday Public Roastery Cuppings
                      </div>
                      <div className="text-[#575753] mt-0.5">
                        Every Friday at 11:00 and 14:00, our Head of Coffee leads a comparative
                        blind cupping of 5 seasonal harvest lots at the lab table.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Interactive Reservation Module */}
              <div className="lg:col-span-7 bg-[#F1F1EE] border border-stone-300/80 rounded-xl p-6 sm:p-8">
                {confirmedReservation ? (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#1B4332] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-mono text-[#1B4332] font-medium">
                          Reservation #{confirmedReservation.code} Confirmed
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-[#141413] mt-0.5">
                          We look forward to hosting you, {confirmedReservation.name}
                        </h3>
                        <p className="text-xs text-[#575753] mt-1">
                          A calendar invitation and tasting notes dossier have been dispatched to{' '}
                          <span className="text-[#141413] font-medium">
                            {confirmedReservation.email}
                          </span>
                          .
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F9F9F8] border border-stone-200/90 rounded-lg p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#575753] block">Seating / Experience</span>
                        <span className="font-semibold text-[#141413] mt-0.5 block">
                          {confirmedReservation.experienceLabel}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#575753] block">Date & Arrival Time</span>
                        <span className="font-mono tabular-nums font-semibold text-[#141413] mt-0.5 block">
                          {confirmedReservation.date} at {confirmedReservation.time}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#575753] block">Party Size</span>
                        <span className="font-mono tabular-nums font-semibold text-[#141413] mt-0.5 block">
                          {confirmedReservation.guests}{' '}
                          {confirmedReservation.guests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#575753] block">Location</span>
                        <span className="font-semibold text-[#141413] mt-0.5 block">
                          412 NW Flanders St · Host Desk
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setConfirmedReservation(null)}
                      className="px-4 py-2.5 bg-[#141413] text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Modify or Book Another Seating
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReservationSubmit} className="space-y-5">
                    <div className="border-b border-stone-300/80 pb-4">
                      <h3 className="font-display text-2xl font-semibold text-[#141413]">
                        Reserve Bar Seating or Roastery Cupping
                      </h3>
                      <p className="text-xs text-[#575753] mt-0.5">
                        Walk-ins are always welcome; reservations guarantee seating for guided
                        pour-over flights and morning bakery pairings.
                      </p>
                    </div>

                    {/* Seating Experience Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-[#141413] mb-2">
                        Select Seating or Tasting Format
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {(
                          [
                            {
                              id: 'pour-over-bar',
                              title: 'Pour-Over Bar',
                              sub: 'Barista-guided flight seat',
                            },
                            {
                              id: 'atrium-table',
                              title: 'Atrium Oak Table',
                              sub: 'Sunlit dining & pastry table',
                            },
                            {
                              id: 'cupping-flight',
                              title: 'Roastery Cupping',
                              sub: '5-lot comparative tasting',
                            },
                          ] as const
                        ).map((exp) => {
                          const active = resExperience === exp.id;
                          return (
                            <button
                              key={exp.id}
                              type="button"
                              onClick={() => setResExperience(exp.id)}
                              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                                active
                                  ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#141413]'
                                  : 'border-stone-300/90 bg-[#F9F9F8] text-[#575753] hover:text-[#141413]'
                              }`}
                            >
                              <div className="text-xs font-semibold text-[#141413]">
                                {exp.title}
                              </div>
                              <div className="text-[11px] text-[#575753] mt-0.5">{exp.sub}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date, Time, Party Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="res-date"
                          className="block text-xs font-semibold text-[#141413] mb-1"
                        >
                          Date
                        </label>
                        <input
                          id="res-date"
                          type="date"
                          required
                          value={resDate}
                          onChange={(e) => setResDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-stone-300 rounded-lg text-[#141413] font-mono tabular-nums focus:outline-none focus:border-[#1B4332]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="res-time"
                          className="block text-xs font-semibold text-[#141413] mb-1"
                        >
                          Time Slot
                        </label>
                        <select
                          id="res-time"
                          value={resTime}
                          onChange={(e) => setResTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-stone-300 rounded-lg text-[#141413] font-mono tabular-nums focus:outline-none focus:border-[#1B4332]"
                        >
                          <option value="08:00">08:00 AM</option>
                          <option value="09:30">09:30 AM</option>
                          <option value="11:00">11:00 AM (Cupping)</option>
                          <option value="13:00">01:00 PM</option>
                          <option value="14:00">02:00 PM (Cupping)</option>
                          <option value="15:30">03:30 PM</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="res-guests"
                          className="block text-xs font-semibold text-[#141413] mb-1"
                        >
                          Guests
                        </label>
                        <select
                          id="res-guests"
                          value={resGuests}
                          onChange={(e) => setResGuests(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-stone-300 rounded-lg text-[#141413] font-mono tabular-nums focus:outline-none focus:border-[#1B4332]"
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Guest Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="res-name"
                          className="block text-xs font-semibold text-[#141413] mb-1"
                        >
                          Full Name *
                        </label>
                        <input
                          id="res-name"
                          type="text"
                          required
                          value={resName}
                          onChange={(e) => setResName(e.target.value)}
                          placeholder="Henrik Lindholm"
                          className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-stone-300 rounded-lg text-[#141413] focus:outline-none focus:border-[#1B4332]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="res-email"
                          className="block text-xs font-semibold text-[#141413] mb-1"
                        >
                          Email Address *
                        </label>
                        <input
                          id="res-email"
                          type="email"
                          required
                          value={resEmail}
                          onChange={(e) => setResEmail(e.target.value)}
                          placeholder="henrik@studio.org"
                          className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-stone-300 rounded-lg text-[#141413] focus:outline-none focus:border-[#1B4332]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="res-phone"
                          className="block text-xs font-semibold text-[#141413] mb-1"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="res-phone"
                          type="tel"
                          required
                          value={resPhone}
                          onChange={(e) => setResPhone(e.target.value)}
                          placeholder="(503) 555-0148"
                          className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-stone-300 rounded-lg text-[#141413] font-mono tabular-nums focus:outline-none focus:border-[#1B4332]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="res-notes"
                        className="block text-xs font-semibold text-[#141413] mb-1"
                      >
                        Dietary Notes or Origin Preferences (Optional)
                      </label>
                      <input
                        id="res-notes"
                        type="text"
                        value={resNotes}
                        onChange={(e) => setResNotes(e.target.value)}
                        placeholder="e.g., Interested in tasting washed Ethiopian lots, oat milk preference..."
                        className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-stone-300 rounded-lg text-[#141413] focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>

                    {resError && (
                      <p className="text-xs text-red-700 font-medium" role="alert">
                        {resError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 px-5 bg-[#1B4332] hover:bg-[#133124] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Confirm Tasting & Table Reservation
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#F1F1EE] border-t border-stone-200/90 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#575753]">
          <div className="space-y-1">
            <div className="font-display text-xl font-semibold text-[#141413]">
              Sorel Roastery & Viennoiserie
            </div>
            <div>
              412 NW Flanders St, Portland, OR 97209 · Direct-Trade Specialty Coffee & Natural
              Levain Bakery
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#daily-menu" className="hover:text-[#141413] transition-colors">
              Daily Menu
            </a>
            <a href="#single-origins" className="hover:text-[#141413] transition-colors">
              Micro-Lot Beans
            </a>
            <a href="#craft-lab" className="hover:text-[#141413] transition-colors">
              Brew Calculator
            </a>
            <a href="#visit-reserve" className="hover:text-[#141413] transition-colors">
              Reservations
            </a>
            <span>© {new Date().getFullYear()} Sorel Roastery LLC</span>
          </div>
        </div>
      </footer>

      {/* Contiguous Product Customization Modal */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
