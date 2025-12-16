import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    return (
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    🎬 MovieSearch
                </Link>
                <nav>
                    <Link to="/">Home</Link>
                    {/* Search link will be added later */}
                </nav>
            </div>
        </header>
    );
}
