import noImageFound from "../assets/no_image_found.png";

interface CarCardProps {
  name: string;
  year: number;
  price?: string;
  km_driven?: number;
  transmission?: string;
  fuel?: string;
  image_url?: string;
  seller_type?: string;
  owner?: string;
}

const CarCard: React.FC<CarCardProps> = ({name, year, price, km_driven, transmission, fuel, image_url, seller_type, owner}) => {

  const formatToCAD = (value: number): string => {
    return value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0
    });
  };

  const numberFormatter = new Intl.NumberFormat('en-US');

  return (
    <div className="bg-indigo-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full sm:w-64 md:w-72 mb-4 overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={image_url}
          alt={name}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = noImageFound;
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {year}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
          {name}
        </h3>

        <div className="space-y-2 mb-4">
          {km_driven && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mileage</span>
              <span className="font-medium">{numberFormatter.format(km_driven)} km</span>
            </div>
          )}
          {transmission && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transmission</span>
              <span className="font-medium">{transmission}</span>
            </div>
          )}
          {fuel && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fuel</span>
              <span className="font-medium">{fuel}</span>
            </div>
          )}
          {seller_type && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Seller</span>
              <span className="font-medium">{seller_type}</span>
            </div>
          )}
          {owner && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ownership</span>
              <span className="font-medium">{owner}</span>
            </div>
          )}
        </div>

          {price && (
            <div className="border-t pt-3 mt-auto">
              <p className="text-xl font-bold text-blue-600">
                {formatToCAD(parseFloat(price))}
              </p>
            </div>
          )}
      </div>
    </div>
  );


};

export default CarCard;
