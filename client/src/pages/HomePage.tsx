import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import './HomePage.css';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

export default function HomePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/movies/top-rated?page=${page}`);
                // TMDB returns results in 'results' array
                setMovies(response.data.results);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page]);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => p + 1);

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Recent Top Movies</h1>
                <p>Discover the latest popular movies</p>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster_path={movie.poster_path}
                                vote_average={movie.vote_average}
                            />
                        ))}
                    </div>

                    <div className="pagination">
                        <button onClick={handlePrev} disabled={page === 1}>
                            Previous
                        </button>
                        <span className="page-number">Page {page}</span>
                        <button onClick={handleNext}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
}
