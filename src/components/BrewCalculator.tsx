import React, { useState } from 'react';
import { BREW_PRESETS, BrewMethodPreset } from '../data/cafeData';

export const BrewCalculator: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(BREW_PRESETS[0].id);
  const currentPreset: BrewMethodPreset =
    BREW_PRESETS.find((p) => p.id === selectedPresetId) || BREW_PRESETS[0];

  const [doseGrams, setDoseGrams] = useState<number>(currentPreset.defaultDoseGrams);
  const [customRatio, setCustomRatio] = useState<number>(currentPreset.ratioMultiplier);

  const handleSelectMethod = (preset: BrewMethodPreset) => {
    setSelectedPresetId(preset.id);
    setDoseGrams(preset.defaultDoseGrams);
    setCustomRatio(preset.ratioMultiplier);
  };

  const totalWaterGrams = Math.round(doseGrams * customRatio);

  return (
    <div className="bg-[#F1F1EE] border border-stone-300/80 rounded-xl p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-stone-300/80">
        <div>
          <div className="text-xs text-[#575753] mb-1">
            Interactive Extraction Laboratory · Custom Water Profile 45 ppm GH
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413] text-balance">
            Home Roastery Brew Ratio & Pour Calculator
          </h3>
        </div>

        {/* Method Selector Tabs */}
        <div
          className="flex flex-wrap items-center gap-1 p-1 bg-[#E5E5E0] rounded-lg"
          role="tablist"
          aria-label="Brewing method presets"
        >
          {BREW_PRESETS.map((preset) => {
            const active = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectMethod(preset)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#F9F9F8] text-[#141413] shadow-xs'
                    : 'text-[#575753] hover:text-[#141413]'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Controls & Live Readout */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <label htmlFor="coffee-dose-slider" className="font-semibold text-[#141413]">
                  Dry Coffee Dose
                </label>
                <span className="font-mono tabular-nums font-medium text-[#1B4332]">
                  {doseGrams}g
                </span>
              </div>
              <input
                id="coffee-dose-slider"
                type="range"
                min={12}
                max={45}
                step={1}
                value={doseGrams}
                onChange={(e) => setDoseGrams(Number(e.target.value))}
                className="w-full accent-[#1B4332] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono tabular-nums text-[#575753] mt-1">
                <span>12g (Single Cup)</span>
                <span>25g</span>
                <span>45g (Shared Carafe)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <label htmlFor="brew-ratio-slider" className="font-semibold text-[#141413]">
                  Extraction Ratio (Coffee : Water)
                </label>
                <span className="font-mono tabular-nums font-medium text-[#1B4332]">
                  1 : {customRatio.toFixed(1)}
                </span>
              </div>
              <input
                id="brew-ratio-slider"
                type="range"
                min={currentPreset.id === 'espresso-modern' ? 1.8 : 13.0}
                max={currentPreset.id === 'espresso-modern' ? 3.2 : 18.5}
                step={0.1}
                value={customRatio}
                onChange={(e) => setCustomRatio(Number(e.target.value))}
                className="w-full accent-[#1B4332] cursor-pointer"
              />
            </div>
          </div>

          {/* Calculated Telemetry Grid */}
          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-stone-300/80">
            <div className="p-3.5 bg-[#F9F9F8] rounded-lg border border-stone-200/90">
              <span className="text-xs text-[#575753] block">Target Brew Water</span>
              <span className="font-mono text-2xl font-semibold text-[#141413] tabular-nums">
                {totalWaterGrams}g
              </span>
            </div>
            <div className="p-3.5 bg-[#F9F9F8] rounded-lg border border-stone-200/90">
              <span className="text-xs text-[#575753] block">Water Temperature</span>
              <span className="font-mono text-2xl font-semibold text-[#141413] tabular-nums">
                {currentPreset.tempCelsius}°C
              </span>
            </div>
            <div className="p-3.5 bg-[#F9F9F8] rounded-lg border border-stone-200/90">
              <span className="text-xs text-[#575753] block">Burr Micron Target</span>
              <span className="font-mono text-sm font-medium text-[#141413] tabular-nums mt-1 block">
                {currentPreset.micronRange}
              </span>
            </div>
            <div className="p-3.5 bg-[#F9F9F8] rounded-lg border border-stone-200/90">
              <span className="text-xs text-[#575753] block">Total Contact Time</span>
              <span className="font-mono text-sm font-medium text-[#141413] tabular-nums mt-1 block">
                {currentPreset.totalTime}
              </span>
            </div>
          </div>
        </div>

        {/* Right Step-by-Step Pour Schedule */}
        <div className="lg:col-span-7 bg-[#F9F9F8] rounded-lg border border-stone-200/90 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <span className="text-xs font-semibold text-[#141413]">
                Stage-by-Stage Scale Target Schedule
              </span>
              <span className="text-xs text-[#575753] font-mono tabular-nums">
                Grind: {currentPreset.grindSetting}
              </span>
            </div>

            <div className="divide-y divide-stone-200/80">
              {currentPreset.pours.map((pour, idx) => {
                const cumulativeFraction = currentPreset.pours
                  .slice(0, idx + 1)
                  .reduce((acc, p) => acc + p.waterPercentage, 0);
                const cumulativeWater = Math.round(totalWaterGrams * cumulativeFraction);

                return (
                  <div key={pour.stage} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-[#141413]">{pour.stage}</span>
                      <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
                        <span className="text-[#575753]">{pour.timeWindow}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#1B4332] font-medium">
                          Scale @ {cumulativeWater}g
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#575753] leading-relaxed">{pour.instruction}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-[#575753]">
            <span>All single-origin bags include a QR recipe card calibrated to your brewer.</span>
            <span className="font-mono tabular-nums text-[#141413]">TDS Target: 1.38% – 1.44%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
