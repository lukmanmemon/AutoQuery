import CarCard from "./CarCard";

interface Car {
  name: string;
  year: number;
  price_cad?: string;
  km_driven?: number;
  transmission?: string;
  fuel?: string;
  image_url?: string;
}

interface ResultsListProps {
  results: Car[],
  loading: boolean,
  totalPages: number,
  page: number,
  handlePrev: () => void;
  handleNext: () => void;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, loading, totalPages, page, handlePrev, handleNext }) => {
  const pageSize = 20;

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
            />
        ))}
      </div>
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

