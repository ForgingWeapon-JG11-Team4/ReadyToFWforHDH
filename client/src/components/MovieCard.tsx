import { Link } from 'react-router-dom';
import './MovieCard.css';

interface MovieProps {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
}

export default function MovieCard({ id, title, poster_path, vote_average }: MovieProps) {
    const posterUrl = poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <Link to={`/movie/${id}`} className="movie-card">
            <div className="poster-wrapper">
                <img src={posterUrl} alt={title} loading="lazy" />
                <div className="rating-badge">⭐ {vote_average.toFixed(1)}</div>
            </div>
            <div className="movie-info">
                <h3>{title}</h3>
            </div>
        </Link>
    );
}
