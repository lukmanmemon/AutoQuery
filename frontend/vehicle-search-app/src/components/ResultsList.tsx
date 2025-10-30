import CarCard from "./CarCard";

interface Car {
  name: string;
  year: number;
  price_cad?: string;
  km_driven?: number;
  transmission?: string;
  fuel?: string;
  image_url?: string;
  seller_type?: string;
  owner?: string;
}

interface ResultsListProps {
  results: Car[],
  resultsError: string | null;
  loading: boolean,
  hasSearched: boolean,
  totalPages: number,
  page: number,
  handlePrev: () => void;
  handleNext: () => void;
  searchInput: string;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, resultsError, loading, hasSearched, totalPages, page, handlePrev, handleNext, searchInput }) => {
  const pageSize = 18;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {loading && (
          <div className="flex items-center justify-center mt-10">
            <div className="flex items-center space-x-3 text-4xl">
              <span className="animate-drive">🚗</span>
              <span className="text-gray-400 animate-drive">💨</span>
            </div>
          </div>
        )}

        {!loading && 
        results
          .slice((page - 1) * pageSize, page * pageSize)
          .map((car, index) => (
            <CarCard
              key={index}
              name={car.name}
              year={car.year}
              price={car.price_cad}
              km_driven={car.km_driven}
              transmission={car.transmission}
              fuel={car.fuel}
              image_url={car.image_url}
              seller_type={car.seller_type}
              owner={car.owner}
            />
        ))}
      </div>

      {resultsError && !loading && 
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 p-4 bg-red-50 rounded-full">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-3">
            Failed to load cars...
          </h3>
        </div>
      }
      {hasSearched && results.length === 0 && !loading && !resultsError && (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 p-4 bg-blue-50 rounded-full">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-3">
            No results found
          </h3>
          
          {searchInput &&
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn't find any cars matching your search for 
              <span className="font-semibold text-blue-500"> "{searchInput}"</span>
            </p>
          }
        </div>
      )}
      {/* Pagination */}
      {!loading && totalPages > 1 && <div className="flex justify-end items-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-400 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>}
    </div>
  );
};

export default ResultsList;

