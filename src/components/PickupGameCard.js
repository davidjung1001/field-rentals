import { useNavigate } from "react-router-dom";

const PickupGameCard = ({ game }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/pickup-game/${game.id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 overflow-hidden cursor-pointer"
    >
      {/* Image with Price Overlay */}
      <div className="relative h-44">
        <img src={game.imageURL} alt="Pickup game" className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-green-600 text-white text-sm px-3 py-1 rounded-full shadow">
          ${game.price || "Free"}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Host & Size */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-semibold">{game.hostUsername || "Unknown Host"}</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
            {game.gameSize || "5v5"}
          </span>
        </div>

        {/* Location and Time */}
        <h2 className="text-lg font-bold text-gray-800">{game.location}</h2>
        <p className="text-sm text-gray-500">{game.date} | {game.startTime} - {game.endTime}</p>

        {/* Player Count */}
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-600">Players:</span> {game.players?.length || 0} / {game.maxPlayers || "∞"}
        </p>

        <button className="mt-2 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PickupGameCard;
