const YouthTryoutCard = ({ tryout }) => {
    return (
      <div className="relative rounded-xl overflow-hidden transition transform hover:scale-[1.015] hover:shadow-xl bg-gradient-to-br from-zinc-100 to-zinc-200">
        {/* Background image with optional overlay */}
        {tryout.imageURLs && tryout.imageURLs.length > 0 && (
          <img
            src={tryout.imageURLs[0]}
            alt="Tryout"
            className="w-full h-48 object-cover"
          />
        )}
  
        {/* Content overlay */}
        <div className="p-4 space-y-2 bg-white">
          <h3 className="text-xl font-bold text-zinc-900">{tryout.teamName}</h3>
  
          <p className="text-sm text-gray-600">
            {tryout.ageGroup} • {tryout.division}
          </p>
  
          <p className="text-sm text-gray-600">
            📍 {tryout.location} • {tryout.metroCity}
          </p>
  
          <p className="text-sm text-gray-600">
            🕒 {new Date(tryout.time).toLocaleString()}
          </p>
  
          {tryout.extraInfo && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-3">
              {tryout.extraInfo}
            </p>
          )}
  
          {/* Displaying coach information */}
          {tryout.coachFirstName && tryout.coachLastName && (
            <p className="text-sm text-gray-700 mt-2">
              Coach: {tryout.coachFirstName} {tryout.coachLastName}
            </p>
          )}
          
          {tryout.coachContact && (
            <p className="text-sm text-gray-700 mt-2">
              Contact: {tryout.coachContact}
            </p>
          )}
  
          <p className="text-xs text-blue-600 font-medium mt-3">
            Posted by {tryout.username}
          </p>
        </div>
      </div>
    );
  };
  
  export default YouthTryoutCard;
  