import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_APIKEY;
  const BASE_URL = process.env.REACT_APP_API_URL;

  // Ambil Top Favorites saat pertama load
  useEffect(() => {
    fetchPopular();
  }, []);

  const fetchPopular = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/movie/popular`, {
        params: { api_key: API_KEY },
      });
      setMovies(res.data.results || []);
    } catch (err) {
      console.error("Error fetching popular movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query: search },
      });
      setMovies(res.data.results || []);
    } catch (err) {
      console.error("Error searching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTrailerUrl = async (movieId) => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
        params: { api_key: API_KEY },
      });
      const trailer = res.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (err) {
      console.error("Error fetching trailer:", err);
      return null;
    }
  };

  const handleBackHome = () => {
    setSearch("");
    fetchPopular();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
            🎬 VingMovie
          </h1>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row w-full md:w-auto gap-2"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search movie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700 w-full sm:w-80 transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                🔍
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Back to Home Button */}
      {search && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={handleBackHome}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-xl font-semibold transition-all duration-300 text-white flex items-center gap-2 shadow-lg transform hover:scale-105"
          >
            ⬅ Back to Home
          </button>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            {search ? `🔍 Search Results for "${search}"` : "⭐ Top Favorites"}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4"></div>
            <p className="text-xl text-gray-400 animate-pulse">Loading amazing movies...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍿</div>
            <p className="text-xl text-gray-400 mb-4">Belum ada film, coba cari deh!</p>
            <p className="text-gray-500">Gunakan search box di atas untuk mencari film favorit kamu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="group bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-500 cursor-pointer hover:-translate-y-2 border border-gray-700 hover:border-yellow-500/50"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={async () => {
                  const url = await getTrailerUrl(movie.id);
                  if (url) window.open(url, "_blank");
                  else alert("Trailer tidak tersedia 😢");
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-72 sm:h-80 md:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-white text-sm font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                      <p className="text-black font-semibold text-sm">🎬 Watch Trailer</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    📅 {movie.release_date || 'TBA'}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-yellow-400 font-bold">{movie.vote_average.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">/10</span>
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      Click to watch
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              🎬 VingMovie
            </h3>
            <p className="text-gray-400 mb-4">Discover amazing movies and watch trailers</p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
              <span>Powered by TMDB API</span>
              <span>•</span>
              <span>Made with ❤️ and React</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
