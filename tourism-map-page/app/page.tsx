"use client";

import React, { useState, Suspense } from "react";
import { MapPin, Hotel, Camera, Utensils, Calendar, Star, X, Search, ZoomIn, ZoomOut, Map, List } from "lucide-react";
import Loading from "./Loading";

interface Place {
  name: string;
  city: string;
  description?: string;
  rating?: number;
  price?: number;
  priceRange?: string;
  amenities?: string[];
  cuisine?: string;
  duration?: string;
  bestTime?: string;
  coordinates: { x: number; y: number };
}

interface PlaceWithMeta extends Place {
  key: string;
  category: string;
}

interface Data {
  hotels: Record<string, Place>;
  attractions: Record<string, Place>;
  restaurants: Record<string, Place>;
  activities: Record<string, Place>;
}

const TourismMap = () => {
  const [selectedPlace, setSelectedPlace] = useState<PlaceWithMeta | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<PlaceWithMeta | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [zoom, setZoom] = useState(1);

  // Coordinates are in percentages relative to the map image
  // Based on accurate geographic positions on the Algeria map
  const data: Data = {
    hotels: {
      "hotel-1": {
        name: "Sofitel Algiers Hamma Garden",
        city: "Algiers",
        description: "Luxury 5-star hotel with stunning Mediterranean views, spa facilities, and fine dining restaurants in the heart of Algiers.",
        rating: 4.7,
        price: 250,
        amenities: ["Pool", "Spa", "Restaurant", "Free WiFi", "Gym"],
        coordinates: { x: 62, y: 20 },
      },
      "hotel-2": {
        name: "El Aurassi Hotel",
        city: "Algiers",
        description: "Iconic landmark hotel overlooking the Bay of Algiers with panoramic views and excellent conference facilities.",
        rating: 4.5,
        price: 180,
        amenities: ["Pool", "Restaurant", "Bar", "Business Center"],
        coordinates: { x: 50, y: 14 },
      },
      "hotel-3": {
        name: "Hotel Tassili",
        city: "Djanet",
        description: "Comfortable desert oasis hotel perfect for exploring the Tassili n'Ajjer National Park and Saharan landscapes.",
        rating: 4.2,
        price: 120,
        amenities: ["Restaurant", "Tour Desk", "Air Conditioning"],
        coordinates: { x: 82, y: 72 },
      },
      "hotel-4": {
        name: "Hotel Serai",
        city: "Constantine",
        description: "Modern hotel in the city of bridges, offering comfortable rooms and easy access to historic sites.",
        rating: 4.3,
        price: 95,
        amenities: ["Restaurant", "Free WiFi", "Parking"],
        coordinates: { x: 75, y: 14 },
      },
      "hotel-5": {
        name: "Hotel Timimoun",
        city: "Timimoun",
        description: "Traditional red clay architecture hotel in the red oasis city, gateway to the Grand Erg Occidental.",
        rating: 4.0,
        price: 85,
        amenities: ["Restaurant", "Garden", "Desert Tours"],
        coordinates: { x: 22, y: 52 },
      },
      "hotel-6": {
        name: "Hotel Les Zianides",
        city: "Tlemcen",
        description: "Elegant hotel in the historic city of Tlemcen, near ancient Islamic monuments.",
        rating: 4.1,
        price: 90,
        amenities: ["Restaurant", "Free WiFi", "Garden"],
        coordinates: { x: 18, y: 14 },
      },
      "hotel-7": {
        name: "Royal Hotel Oran",
        city: "Oran",
        description: "Seafront hotel with beautiful views of the Mediterranean and easy access to the city center.",
        rating: 4.4,
        price: 140,
        amenities: ["Pool", "Restaurant", "Beach Access", "Spa"],
        coordinates: { x: 25, y: 11 },
      },
    },
    attractions: {
      "attr-1": {
        name: "Casbah of Algiers",
        city: "Algiers",
        description: "UNESCO World Heritage Site featuring Ottoman palaces, mosques, and traditional houses in a maze of narrow streets.",
        rating: 4.8,
        coordinates: { x: 54, y: 11 },
      },
      "attr-2": {
        name: "Tassili n'Ajjer",
        city: "Djanet",
        description: "UNESCO site with prehistoric rock art dating back 12,000 years and spectacular sandstone formations in the Sahara.",
        rating: 4.9,
        coordinates: { x: 85, y: 68 },
      },
      "attr-3": {
        name: "Timgad Roman Ruins",
        city: "Batna",
        description: "Remarkably preserved Roman colonial town founded by Emperor Trajan in AD 100, a UNESCO World Heritage Site.",
        rating: 4.7,
        coordinates: { x: 72, y: 22 },
      },
      "attr-4": {
        name: "Djemila Roman Ruins",
        city: "Setif",
        description: "Ancient Roman town with temples, basilicas, and triumphal arches showcasing Roman urban planning.",
        rating: 4.6,
        coordinates: { x: 68, y: 16 },
      },
      "attr-5": {
        name: "Constantine Bridges",
        city: "Constantine",
        description: "The city of bridges featuring dramatic gorges and historic suspension bridges over the Rhumel River.",
        rating: 4.5,
        coordinates: { x: 77, y: 12 },
      },
      "attr-6": {
        name: "Notre Dame d'Afrique",
        city: "Algiers",
        description: "Beautiful 19th-century basilica perched on a cliff overlooking the Bay of Algiers with stunning architecture.",
        rating: 4.4,
        coordinates: { x: 48, y: 13 },
      },
      "attr-7": {
        name: "M'Zab Valley",
        city: "Ghardaia",
        description: "UNESCO World Heritage Site featuring five fortified cities built by the Mozabites in the 10th century.",
        rating: 4.7,
        coordinates: { x: 50, y: 42 },
      },
      "attr-8": {
        name: "Santa Cruz Fortress",
        city: "Oran",
        description: "Spanish-era fortress overlooking Oran with panoramic views of the city and Mediterranean Sea.",
        rating: 4.3,
        coordinates: { x: 23, y: 13 },
      },
      "attr-9": {
        name: "Great Mosque of Tlemcen",
        city: "Tlemcen",
        description: "One of the oldest and most important mosques in Algeria, dating back to 1136 AD.",
        rating: 4.5,
        coordinates: { x: 16, y: 16 },
      },
    },
    restaurants: {
      "rest-1": {
        name: "Restaurant La Palmeraie",
        city: "Algiers",
        description: "Upscale Algerian cuisine featuring couscous, tajines, and fresh Mediterranean seafood.",
        rating: 4.6,
        priceRange: "$$$",
        cuisine: "Algerian",
        coordinates: { x: 56, y: 13 },
      },
      "rest-2": {
        name: "Le Tantra",
        city: "Algiers",
        description: "French-Algerian fusion restaurant with elegant ambiance and creative Mediterranean dishes.",
        rating: 4.5,
        priceRange: "$$$",
        cuisine: "French-Algerian",
        coordinates: { x: 53, y: 15 },
      },
      "rest-3": {
        name: "Restaurant El Djazair",
        city: "Constantine",
        description: "Traditional Constantine cuisine including rechta, chakhchoukha, and local pastries.",
        rating: 4.4,
        priceRange: "$$",
        cuisine: "Algerian",
        coordinates: { x: 78, y: 15 },
      },
      "rest-4": {
        name: "Cafe Tantonville",
        city: "Oran",
        description: "Historic cafe serving traditional Algerian coffee, pastries, and light Mediterranean fare.",
        rating: 4.3,
        priceRange: "$",
        cuisine: "Cafe",
        coordinates: { x: 27, y: 12 },
      },
      "rest-5": {
        name: "Le Petit Palais",
        city: "Algiers",
        description: "Charming bistro in the Casbah area offering authentic Algerian street food and traditional dishes.",
        rating: 4.5,
        priceRange: "$$",
        cuisine: "Algerian Street Food",
        coordinates: { x: 51, y: 12 },
      },
    },
    activities: {
      "act-1": {
        name: "Sahara Desert Expedition",
        city: "Djanet",
        description: "Multi-day camel trek through the Sahara with camping under the stars and visits to ancient rock art sites.",
        rating: 4.9,
        price: 450,
        duration: "3-5 days",
        bestTime: "October - April",
        coordinates: { x: 80, y: 75 },
      },
      "act-2": {
        name: "Casbah Walking Tour",
        city: "Algiers",
        description: "Guided walking tour through the historic Casbah, exploring Ottoman architecture and local crafts.",
        rating: 4.7,
        price: 45,
        duration: "3 hours",
        bestTime: "Morning",
        coordinates: { x: 55, y: 10 },
      },
      "act-3": {
        name: "Roman Heritage Tour",
        city: "Batna",
        description: "Full-day tour visiting Timgad and Lambaesis Roman ruins with expert archaeological guide.",
        rating: 4.6,
        price: 120,
        duration: "Full day",
        bestTime: "Spring/Autumn",
        coordinates: { x: 70, y: 24 },
      },
      "act-4": {
        name: "Hoggar Mountains Trek",
        city: "Tamanrasset",
        description: "Trekking adventure in the volcanic Hoggar Mountains with Tuareg guides and visits to Assekrem.",
        rating: 4.8,
        price: 380,
        duration: "4-7 days",
        bestTime: "November - March",
        coordinates: { x: 52, y: 85 },
      },
      "act-5": {
        name: "Oran City Tour",
        city: "Oran",
        description: "Explore the vibrant port city including Santa Cruz fortress, the old town, and Rai music heritage.",
        rating: 4.4,
        price: 55,
        duration: "Half day",
        bestTime: "Year-round",
        coordinates: { x: 24, y: 10 },
      },
      "act-6": {
        name: "M'Zab Valley Cultural Tour",
        city: "Ghardaia",
        description: "Discover the unique Mozabite architecture and culture with visits to all five fortified cities.",
        rating: 4.6,
        price: 85,
        duration: "Full day",
        bestTime: "Year-round",
        coordinates: { x: 52, y: 44 },
      },
      "act-7": {
        name: "Bechar Desert Adventure",
        city: "Bechar",
        description: "Explore the western Sahara region with visits to kasbahs and traditional oasis settlements.",
        rating: 4.3,
        price: 200,
        duration: "2-3 days",
        bestTime: "October - April",
        coordinates: { x: 12, y: 38 },
      },
      "act-8": {
        name: "Annaba Beach & History",
        city: "Annaba",
        description: "Combine beach relaxation with visits to the Basilica of St. Augustine and Hippo Regius ruins.",
        rating: 4.5,
        price: 75,
        duration: "Full day",
        bestTime: "May - September",
        coordinates: { x: 88, y: 10 },
      },
    },
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }
        />
      ))}
      <span className="text-sm ml-1 font-semibold text-slate-700">{rating}</span>
    </div>
  );

  const getCategoryIcon = (category: string) =>
    ({
      hotels: <Hotel size={18} />,
      attractions: <Camera size={18} />,
      restaurants: <Utensils size={18} />,
      activities: <Calendar size={18} />,
    })[category] || <MapPin size={18} />;

  const getCategoryColor = (category: string) =>
    ({
      hotels: "bg-indigo-500",
      attractions: "bg-emerald-600",
      restaurants: "bg-orange-500",
      activities: "bg-sky-500",
    })[category] || "bg-slate-500";

  const getCategoryMarkerBg = (category: string) =>
    ({
      hotels: "bg-indigo-500 border-indigo-700",
      attractions: "bg-emerald-500 border-emerald-700",
      restaurants: "bg-orange-500 border-orange-700",
      activities: "bg-sky-500 border-sky-700",
    })[category] || "bg-slate-500 border-slate-700";

  const filteredPlaces = (): PlaceWithMeta[] => {
    let all: PlaceWithMeta[] = [];

    const push = (obj: Record<string, Place>, category: string) =>
      Object.entries(obj).forEach(([key, value]) =>
        all.push({ ...value, key, category })
      );

    if (activeFilter === "all" || activeFilter === "hotels") push(data.hotels, "hotels");
    if (activeFilter === "all" || activeFilter === "attractions") push(data.attractions, "attractions");
    if (activeFilter === "all" || activeFilter === "restaurants") push(data.restaurants, "restaurants");
    if (activeFilter === "all" || activeFilter === "activities") push(data.activities, "activities");

    if (searchTerm)
      all = all.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.city.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return all;
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetView = () => {
    setZoom(1);
  };

  const PlaceDetails = ({ place }: { place: PlaceWithMeta | null }) => {
    if (!place) return null;

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
          <div className={`flex justify-between items-center ${getCategoryColor(place.category)} text-white p-5`}>
            <div className="flex items-center gap-3">
              {getCategoryIcon(place.category)}
              <h3 className="text-xl font-bold">{place.name}</h3>
            </div>
            <button 
              onClick={() => setSelectedPlace(null)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={16} />
              <span>{place.city}, Algeria</span>
            </div>
            
            {place.description && (
              <p className="text-slate-600 leading-relaxed">{place.description}</p>
            )}
            
            {place.rating && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Rating:</span>
                {renderStars(place.rating)}
              </div>
            )}
            
            {place.price && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Price:</span>
                <span className="font-bold text-emerald-600">${place.price}</span>
                {place.category === "hotels" && <span className="text-slate-400 text-sm">/ night</span>}
              </div>
            )}
            
            {place.priceRange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Price Range:</span>
                <span className="font-bold text-emerald-600">{place.priceRange}</span>
              </div>
            )}

            {place.cuisine && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Cuisine:</span>
                <span className="font-medium text-slate-700">{place.cuisine}</span>
              </div>
            )}

            {place.duration && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Duration:</span>
                <span className="font-medium text-slate-700">{place.duration}</span>
              </div>
            )}

            {place.bestTime && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Best Time:</span>
                <span className="font-medium text-slate-700">{place.bestTime}</span>
              </div>
            )}

            {place.amenities && place.amenities.length > 0 && (
              <div>
                <span className="text-sm text-slate-500 block mb-2">Amenities:</span>
                <div className="flex flex-wrap gap-2">
                  {place.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filterButtons = [
    { key: "all", label: "All", icon: <MapPin size={16} /> },
    { key: "hotels", label: "Hotels", icon: <Hotel size={16} /> },
    { key: "attractions", label: "Attractions", icon: <Camera size={16} /> },
    { key: "restaurants", label: "Restaurants", icon: <Utensils size={16} /> },
    { key: "activities", label: "Activities", icon: <Calendar size={16} /> },
  ];

  const places = filteredPlaces();

  // City labels with percentage positions on the map
  const cityLabels = [
    { name: "Algiers", x: 52, y: 8 },
    { name: "Oran", x: 25, y: 7 },
    { name: "Constantine", x: 76, y: 9 },
    { name: "Annaba", x: 88, y: 6 },
    { name: "Tlemcen", x: 16, y: 11 },
    { name: "Setif", x: 66, y: 13 },
    { name: "Batna", x: 72, y: 19 },
    { name: "Biskra", x: 68, y: 28 },
    { name: "Ghardaia", x: 50, y: 38 },
    { name: "Ouargla", x: 65, y: 45 },
    { name: "Bechar", x: 12, y: 34 },
    { name: "Adrar", x: 22, y: 55 },
    { name: "Tamanrasset", x: 52, y: 80 },
    { name: "Djanet", x: 82, y: 68 },
    { name: "Tindouf", x: 5, y: 50 },
    { name: "El Oued", x: 78, y: 32 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={32} />
            <h1 className="text-3xl font-bold">Discover Algeria</h1>
          </div>
          <p className="text-emerald-100 text-lg">
            Explore the rich heritage, stunning landscapes, and vibrant culture of Algeria
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-700 placeholder:text-slate-400 shadow-sm"
              placeholder="Search places, cities, or activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                viewMode === "map"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300"
              }`}
            >
              <Map size={18} />
              Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                viewMode === "list"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300"
              }`}
            >
              <List size={18} />
              List
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveFilter(btn.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                activeFilter === btn.key
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300"
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {viewMode === "map" ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Map Controls */}
            <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={20} className="text-slate-600" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={20} className="text-slate-600" />
                </button>
                <button
                  onClick={resetView}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium text-slate-600"
                >
                  Reset
                </button>
                <span className="text-sm text-slate-500 ml-2">{Math.round(zoom * 100)}%</span>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-slate-600">Hotels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Attractions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-slate-600">Restaurants</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-sky-500" />
                  <span className="text-slate-600">Activities</span>
                </div>
              </div>
            </div>

            {/* Interactive Map with PNG Image */}
            <div className="relative overflow-hidden bg-slate-100" style={{ height: "650px" }}>
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: `scale(${zoom})`,
                }}
              >
                <div className="relative" style={{ width: "600px", height: "700px" }}>
                  {/* Algeria Map PNG */}
                  <img
                    src="/images/image.png"
                    alt="Map of Algeria"
                    className="object-contain size-full"
                    draggable={false}
                  />
                  
                  {/* City Labels */}
                  {cityLabels.map((city) => (
                    <div
                      key={city.name}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${city.x}%`,
                        top: `${city.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span
                        className="text-xs font-bold text-slate-800 whitespace-nowrap px-1 py-0.5 rounded"
                        style={{
                          textShadow: "0 0 4px white, 0 0 4px white, 0 0 4px white",
                        }}
                      >
                        {city.name}
                      </span>
                    </div>
                  ))}

                  {/* Place Markers */}
                  {places.map((place) => (
                    <div
                      key={place.key}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${place.coordinates.x}%`,
                        top: `${place.coordinates.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => setSelectedPlace(place)}
                      onMouseEnter={() => setHoveredPlace(place)}
                      onMouseLeave={() => setHoveredPlace(null)}
                    >
                      {/* Marker */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform duration-200 ${getCategoryMarkerBg(place.category)} ${
                          hoveredPlace?.key === place.key ? "scale-125" : ""
                        }`}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>

                      {/* Pulse effect for hovered */}
                      {hoveredPlace?.key === place.key && (
                        <div
                          className={`absolute inset-0 w-5 h-5 rounded-full ${getCategoryMarkerBg(place.category)} animate-ping opacity-50`}
                        />
                      )}

                      {/* Tooltip */}
                      {hoveredPlace?.key === place.key && (
                        <div
                          className="absolute z-20 bg-white rounded-lg shadow-xl p-3 min-w-[200px] pointer-events-none"
                          style={{
                            left: place.coordinates.x > 70 ? "auto" : "100%",
                            right: place.coordinates.x > 70 ? "100%" : "auto",
                            top: "50%",
                            transform: "translateY(-50%)",
                            marginLeft: place.coordinates.x > 70 ? 0 : "10px",
                            marginRight: place.coordinates.x > 70 ? "10px" : 0,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1 rounded ${getCategoryColor(place.category)} text-white`}>
                              {getCategoryIcon(place.category)}
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">{place.name}</span>
                          </div>
                          <p className="text-xs text-slate-500">{place.city}, Algeria</p>
                          {place.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              <span className="text-xs text-slate-600">{place.rating}</span>
                            </div>
                          )}
                          <p className="text-xs text-emerald-600 mt-1">Click for details</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {places.map((place) => (
                <div
                  key={place.key}
                  onClick={() => setSelectedPlace(place)}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-slate-100 hover:border-emerald-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(place.category)} text-white`}>
                      {getCategoryIcon(place.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{place.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin size={14} />
                        <span>{place.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  {place.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">{place.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {place.rating && renderStars(place.rating)}
                    {place.price && (
                      <span className="font-bold text-emerald-600">${place.price}</span>
                    )}
                    {place.priceRange && (
                      <span className="font-bold text-emerald-600">{place.priceRange}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Results Count */}
        <div className="mt-6 text-center text-slate-500">
          Showing {places.length} {places.length === 1 ? "place" : "places"}
        </div>
      </main>

      {/* Place Details Modal */}
      <Suspense fallback={<Loading />}>
        <PlaceDetails place={selectedPlace} />
      </Suspense>
    </div>
  );
}

export default TourismMap;
