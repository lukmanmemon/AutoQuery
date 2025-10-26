import noImageFound from "../assets/no_image_found.png";

interface CarCardProps {
  name: string;
  year: number;
  price?: string;
  km_driven?: number;
  transmission?: string;
  fuel?: string;
  image_url?: string;
}

const CarCard: React.FC<CarCardProps> = ({ name, year, price, km_driven, transmission, fuel, image_url }) => {

  const  formatToCAD = (value: number): string => {
    return value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0
    });
  }

  return (
    <div className="bg-indigo-100 rounded-xl shadow hover:shadow-lg p-4 transition">
      <img
        src={image_url}
        alt={name}
        className="w-64 h-48 object-cover rounded-md mb-3 mx-auto"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = noImageFound;
        }}
      />
      <h3 className="text-lg font-semibold">{year + " " + name}</h3>
      {km_driven && <p className="">{"Mileage: " + km_driven + " km"}</p>}
      {transmission && <p className="">{"Transmission: " + transmission}</p>}
      {fuel && <p className="">{"Fuel: " + fuel}</p>}
      {price && <p className="text-blue-600 font-medium mt-1">{formatToCAD(+price)}</p>}
    </div>
  );
};

export default CarCard;
