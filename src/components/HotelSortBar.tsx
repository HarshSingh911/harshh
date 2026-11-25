import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  formatHotelCountLabel,
  HOTEL_SORT_OPTIONS,
  HotelSortOption,
} from '../utils/hotelResultsUtils';

interface HotelSortBarProps {
  sortBy: HotelSortOption;
  onChangeSort: (nextSort: HotelSortOption) => void;
  hotelCount: number;
  isFiltersOpen: boolean;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

export const HotelSortBar: React.FC<HotelSortBarProps> = ({
  sortBy,
  onChangeSort,
  hotelCount,
  isFiltersOpen,
  activeFilterCount,
  onOpenFilters,
}) => {
  return (
    <div className="space-y-2.5" data-testid="hotel-sort-section">
      {/* Grey-page utility strip directly above the sort block */}
      <div
        data-testid="hotel-results-meta-strip"
        className="flex flex-wrap items-center justify-between gap-2 px-0.5 text-xs sm:text-[13px] text-slate-500"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-medium text-slate-500">
            Taxes and fees not included
          </span>
          <span aria-hidden="true" className="text-slate-300 select-none">
            |
          </span>
          <span
            data-testid="hotel-results-count-label"
            className="font-semibold text-slate-700 tabular-nums"
          >
            {formatHotelCountLabel(hotelCount)}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenFilters}
          data-testid="sort-by-filters-button"
          title="Open Filters"
          aria-label="Open hotel filters"
          aria-expanded={isFiltersOpen}
          className={`inline-flex items-center gap-1.5 px-2 py-1 -mr-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            isFiltersOpen || activeFilterCount > 0
              ? 'text-blue-700 bg-blue-50/90 hover:bg-blue-100/90'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span
              data-testid="hotel-active-filter-count"
              className="min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold leading-4 text-center tabular-nums"
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Partition-wise sort block containing ONLY the 4 hotel sort options */}
      <div
        role="tablist"
        aria-label="Sort hotels"
        data-testid="hotel-sort-partition-box"
        className="bg-slate-200/90 rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden grid grid-cols-2 sm:grid-cols-4 gap-px"
      >
        {HOTEL_SORT_OPTIONS.map((option) => {
          const isSelected = sortBy === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              data-testid={`hotel-sort-tab-${option.id}`}
              onClick={() => onChangeSort(option.id)}
              className={`relative px-3 py-3.5 text-xs sm:text-[13px] text-center whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${
                isSelected
                  ? 'bg-blue-50/60 text-blue-700 font-bold'
                  : 'bg-white text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{option.label}</span>
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[2.5px] bg-blue-600"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
