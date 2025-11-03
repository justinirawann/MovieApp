import { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <header className="bg-gray-900 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">🎬 VingMovie</h1>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row w-full md:w-auto gap-2"
          >
            <input
              type="text"
              placeholder="Search movie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none w-full sm:w-auto"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 rounded-lg font-semibold hover:bg-yellow-400 transition w-full sm:w-auto"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Back to Home Button */}
      {search && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={handleBackHome}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition text-white flex items-center gap-2"
          >
            ⬅ Back to Home
          </button>
        </div>
      )}

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-400">
          ⭐ {search ? `Search Results for "${search}"` : "Top Favorites"}
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : movies.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada film, coba cari deh 🍿</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:scale-105 transform transition cursor-pointer"
                onClick={async () => {
                  const url = await getTrailerUrl(movie.id);
                  if (url) window.open(url, "_blank");
                  else alert("Trailer tidak tersedia 😢");
                }}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/200"
                  }
                  alt={movie.title}
                  className="w-full h-80 sm:h-96 md:h-80 lg:h-96 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-semibold">{movie.title}</h3>
                  <p className="text-sm md:text-base text-gray-400">
                    Release: {movie.release_date}
                  </p>
                  <p className="text-yellow-400 font-bold">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-400 text-sm mt-1 italic">Klik poster untuk trailer</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
