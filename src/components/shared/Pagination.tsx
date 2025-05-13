// import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate an array of page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Show max 5 page numbers at once
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than our max, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Add first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Items per page selector */}
      {onItemsPerPageChange && (
        <div className="mb-4 md:mb-0 flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-3">
            Items per page
          </label>
          <select 
            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}

      {/* Pagination info */}
      <div className="text-sm font-medium text-gray-600 mb-4 md:mb-0">
        Showing <span className="text-blue-600">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to <span className="text-blue-600">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-blue-600">{totalItems}</span> items
      </div>

      {/* Page navigation */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
            currentPage === 1 
              ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
              : 'bg-gray-50 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
          aria-label="Previous page"
        >
          <FaChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center">
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span 
                key={`ellipsis-${index}`}
                className="px-2 py-1 mx-1 text-gray-600"
              >
                ⋯
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg mx-0.5 transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
              : 'bg-gray-50 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
          aria-label="Next page"
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// Default props
Pagination.defaultProps = {
  totalItems: 0,
  itemsPerPage: 10,
  currentPage: 1,
  onPageChange: () => {}
};

export default Pagination;