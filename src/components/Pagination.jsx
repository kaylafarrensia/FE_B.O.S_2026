import { useEffect, useState } from 'react';

export default function Pagination({
  index,
  totalItem,
  itemsPerPage,
  optionItemPerPage = [5, 10, 25, 50, 100],
  onChangeIndex,
  onChangeItemsPerPage,
  disabled = false,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItem / itemsPerPage));
  const [pageSizeInput, setPageSizeInput] = useState(itemsPerPage);

  useEffect(() => {
    setPageSizeInput(itemsPerPage);
  }, [itemsPerPage]);

  const range = (start, end) => {
    const out = [];
    for (let i = start; i <= end; i++) out.push(i);
    return out;
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) return range(1, totalPages);

    if (index === 1) return range(1, Math.min(3, totalPages));
    if (index === 2) return range(1, Math.min(4, totalPages));

    if (index === totalPages) {
      return range(Math.max(1, totalPages - 2), totalPages);
    }

    if (index === totalPages - 1) {
      return range(Math.max(1, totalPages - 3), totalPages);
    }

    const start = Math.max(1, index - 2);
    const end = Math.min(totalPages, index + 2);

    if (end - start + 1 < 5) {
      if (start === 1) {
        return range(start, Math.min(totalPages, start + 4));
      }

      if (end === totalPages) {
        return range(Math.max(1, end - 4), end);
      }
    }

    return range(start, end);
  };

  const handleJumpTo = (e) => {
    const value = Number(e.target.value);
    onChangeIndex?.(value);
  };

  const handleNav = (type) => {
    let newIndex = index;

    if (type === 'first') newIndex = 1;
    if (type === 'prev') newIndex = Math.max(1, index - 1);
    if (type === 'next') newIndex = Math.min(totalPages, index + 1);
    if (type === 'last') newIndex = totalPages;
    if (typeof type === 'number') newIndex = type;

    onChangeIndex?.(newIndex);
  };

  const handlePageSizeChange = (e) => {
    const value = Math.max(1, Number(e.target.value) || 1);

    setPageSizeInput(value);
    onChangeItemsPerPage?.(value);
    onChangeIndex?.(1);
  };

  const disabledPrev = index === 1 || disabled;
  const disabledNext = index === totalPages || disabled;

  return (
    <div className="flex flex-wrap items-center justify-end gap-4 text-sm py-2">
      <div className="flex items-center gap-2">
        <span>Show:</span>

        <select
          value={pageSizeInput}
          onChange={handlePageSizeChange}
          disabled={disabled}
          className="border rounded-[8px] w-[48px] h-8 items-center text-center"
        >
          {optionItemPerPage.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          className={`border rounded p-2 flex items-center justify-center ${
            disabledPrev
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : ''
          }`}
          disabled={disabledPrev}
          onClick={() => handleNav('first')}
          aria-label="First page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M11 13L6 8L11 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3"
              y="3"
              width="2"
              height="10"
              rx="1"
              fill="currentColor"
            />
          </svg>
        </button>

        <button
          className={`border rounded p-2 flex items-center justify-center ${
            disabledPrev
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : ''
          }`}
          disabled={disabledPrev}
          onClick={() => handleNav('prev')}
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 13L5 8L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`w-8 h-8 rounded border flex items-center justify-center text-base ${
              page === index
                ? 'border-blue-500 text-blue-600 font-bold bg-white'
                : 'border-gray-300 text-gray-700 bg-white'
            }`}
            disabled={disabled}
            onClick={() => handleNav(page)}
            aria-current={page === index ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        <button
          className={`border rounded w-8 h-8 flex items-center justify-center ${
            disabledNext
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : ''
          }`}
          disabled={disabledNext}
          onClick={() => handleNav('next')}
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          className={`border rounded w-8 h-8 flex items-center justify-center ${
            disabledNext
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : ''
          }`}
          disabled={disabledNext}
          onClick={() => handleNav('last')}
          aria-label="Last page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M5 3L10 8L5 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="11"
              y="3"
              width="2"
              height="10"
              rx="1"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span>Jump to:</span>

        <select
          value={index}
          onChange={handleJumpTo}
          disabled={disabled}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
      </div>

      <span>
        {totalItem.toLocaleString('id-ID', {
          maximumFractionDigits: 0,
        })}{' '}
        Result(s)
      </span>
    </div>
  );
}