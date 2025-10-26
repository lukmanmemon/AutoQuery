import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";

interface Car {
  name: string;
  year: number;
  price?: string;
  km_driven?: number;
  transmission?: string;
  fuel?: string;
  image_url?: string;
}

function App() {
  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const getCars = async (query: string) => {
  setLoading(true);
  
  await fetch(`/api/search?query=${query}&limit=${50}`)
    .then((res) => res.json())
    .then((data) => {
      const cars = data.results.map((item: any) => item.car);
      setResults(cars);
      setTotalPages(Math.ceil(cars.length / pageSize));
      
    })
    .catch((err) => console.error("Error fetching cars:", err))
    .finally(() => setLoading(false));
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    getCars(query);
    setPage(1);
  };

  const handlePrev = () => {
    setPage(page => Math.max(page - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleNext = () => {
    setPage(page => Math.min(page + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center px-6 py-10">
      <h1 className="text-4xl font-bold text-blue-500 mb-6">AutoQuery</h1>
      <SearchBar onSearch={handleSearch} />
      <ResultsList 
        results={results} 
        loading={loading} 
        totalPages={totalPages} 
        page={page}
        handlePrev={handlePrev} 
        handleNext={handleNext} 
      />
    </div>
  );
}

export default App;

