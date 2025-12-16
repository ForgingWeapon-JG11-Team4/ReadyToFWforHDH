import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetailPage.css';

interface MovieDetail {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    genres: { id: number; name: string }[];
    credits: {
        cast: {
            id: number;
            name: string;
            character: string;
            profile_path: string;
        }[];
        crew: {
            id: number;
            name: string;
            job: string;
        }[];
    };
    images: {
        backdrops: { file_path: string }[];
    };
}

const MovieDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/movies/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Failed to fetch movie detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetail();
        }
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (!movie) return <div className="error">Movie not found</div>;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : '';

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <div className="movie-detail-page">
            {/* Hero Section with Backdrop */}
            <div
                className="detail-hero"
                style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), #141414), url(${backdropUrl})` }}
            >
                <div className="detail-content">
                    <div className="detail-poster">
                        <img src={posterUrl} alt={movie.title} />
                    </div>
                    <div className="detail-info">
                        <h1 className="detail-title">{movie.title}</h1>
                        <h2 className="detail-subtitle">{movie.original_title} ({movie.release_date.split('-')[0]})</h2>

                        <div className="detail-meta">
                            <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
                            <span className="genres">
                                {movie.genres.map(g => g.name).join(', ')}
                            </span>
                        </div>

                        <p className="detail-overview">{movie.overview}</p>

                        {/* Crew (Director) */}
                        <div className="detail-crew">
                            <strong>Director: </strong>
                            {movie.credits.crew.find(c => c.job === 'Director')?.name || 'Unknown'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast Section */}
            <section className="detail-section">
                <h3>Top Cast</h3>
                <div className="cast-grid">
                    {movie.credits.cast.slice(0, 10).map(actor => (
                        <div key={actor.id} className="cast-card">
                            <img
                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/138x175?text=No+Image'}
                                alt={actor.name}
                            />
                            <p className="actor-name">{actor.name}</p>
                            <p className="character-name">{actor.character}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gallery Section */}
            {movie.images.backdrops.length > 0 && (
                <section className="detail-section">
                    <h3>Gallery</h3>
                    <div className="gallery-grid">
                        {movie.images.backdrops.slice(0, 6).map((img, idx) => (
                            <img
                                key={idx}
                                src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                                alt={`Scene ${idx + 1}`}
                                className="gallery-img"
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default MovieDetailPage;
