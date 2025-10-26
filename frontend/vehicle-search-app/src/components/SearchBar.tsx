import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(input);
    onSearch(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl mb-8 bg-white rounded-xl shadow-md"
    >
      <input
        type="text"
        placeholder="Search cars..."
        className="flex-1 p-3 rounded-l-xl outline-none text-white bg-gray-600"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 rounded-r-xl hover:bg-blue-600 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
