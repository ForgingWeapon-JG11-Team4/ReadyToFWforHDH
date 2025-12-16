import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import './SearchPage.css';

interface Movie {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    vote_average: number;
    media_type?: string;
}

interface Genre {
    id: number;
    name: string;
}

const API_URL = 'http://localhost:3000';

/**
 * SearchPage: 검색 페이지
 * - 텍스트 검색 (영화 제목, 배우, 제작사)
 * - 카테고리(장르) 필터
 * - 검색 타입 선택 (영화/배우/제작사/전체)
 */
export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [searchType, setSearchType] = useState<'multi' | 'movie' | 'person' | 'company'>('multi');
    const [results, setResults] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isGenreMode, setIsGenreMode] = useState(false);

    // 장르 목록 불러오기
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`${API_URL}/movies/genres`);
                setGenres(response.data);
            } catch (error) {
                console.error('Failed to fetch genres:', error);
            }
        };
        fetchGenres();
    }, []);

    // URL 쿼리 파라미터로 검색 실행
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
            performSearch(q, 1);
        }
    }, [searchParams]);

    // 텍스트 검색
    const performSearch = async (searchQuery: string, pageNum: number) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setIsGenreMode(false);
        try {
            const response = await axios.get(`${API_URL}/movies/search`, {
                params: {
                    q: searchQuery,
                    type: searchType,
                    page: pageNum
                }
            });

            const data = response.data;
            // multi search returns mixed types
            const movies = data.results.filter((item: any) =>
                item.media_type === 'movie' || item.media_type === 'person' || !item.media_type
            );
            setResults(movies);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB max 500 pages
            setPage(pageNum);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // 장르별 검색
    const searchByGenres = async (pageNum: number) => {
        if (selectedGenres.length === 0) return;

        setLoading(true);
        setIsGenreMode(true);
        try {
            const response = await axios.get(`${API_URL}/movies/discover`, {
                params: {
                    genres: selectedGenres.join(','),
                    page: pageNum
                }
            });

            const data = response.data;
            setResults(data.results);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setPage(pageNum);
        } catch (error) {
            console.error('Genre search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // 검색 핸들러
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setSearchParams({ q: query });
            performSearch(query, 1);
        }
    };

    // 장르 토글
    const toggleGenre = (genreId: number) => {
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    // 장르 검색 실행
    const handleGenreSearch = () => {
        if (selectedGenres.length > 0) {
            searchByGenres(1);
        }
    };

    // 페이징
    const handlePageChange = (newPage: number) => {
        if (isGenreMode) {
            searchByGenres(newPage);
        } else {
            performSearch(query, newPage);
        }
    };

    return (
        <div className="search-page">
            <div className="search-container">
                <h1>🔍 영화 검색</h1>

                {/* 텍스트 검색 폼 */}
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-type-selector">
                        <label>
                            <input
                                type="radio"
                                name="searchType"
                                checked={searchType === 'multi'}
                                onChange={() => setSearchType('multi')}
                            />
                            전체
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="searchType"
                                checked={searchType === 'movie'}
                                onChange={() => setSearchType('movie')}
                            />
                            영화 제목
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="searchType"
                                checked={searchType === 'person'}
                                onChange={() => setSearchType('person')}
                            />
                            배우
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="searchType"
                                checked={searchType === 'company'}
                                onChange={() => setSearchType('company')}
                            />
                            제작사
                        </label>
                    </div>
                    <div className="search-input-row">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="검색어를 입력하세요..."
                            className="search-input-main"
                        />
                        <button type="submit" className="btn-search">검색</button>
                    </div>
                </form>

                {/* 장르 필터 */}
                <div className="genre-filter">
                    <h3>📁 카테고리 (장르)</h3>
                    <div className="genre-tags">
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                className={`genre-tag ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                                onClick={() => toggleGenre(genre.id)}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                    {selectedGenres.length > 0 && (
                        <button className="btn-genre-search" onClick={handleGenreSearch}>
                            선택한 장르로 검색 ({selectedGenres.length}개)
                        </button>
                    )}
                </div>

                {/* 검색 결과 */}
                {loading ? (
                    <div className="loading">검색 중...</div>
                ) : (
                    <>
                        {results.length > 0 && (
                            <div className="search-results">
                                <h3>검색 결과 ({results.length})</h3>
                                <div className="results-grid">
                                    {results.map(item => (
                                        <MovieCard
                                            key={item.id}
                                            id={item.id}
                                            title={item.title || item.name || 'Unknown'}
                                            poster_path={item.poster_path}
                                            vote_average={item.vote_average}
                                        />
                                    ))}
                                </div>

                                {/* 페이징 */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            disabled={page <= 1}
                                            onClick={() => handlePageChange(page - 1)}
                                        >
                                            이전
                                        </button>
                                        <span>{page} / {totalPages}</span>
                                        <button
                                            disabled={page >= totalPages}
                                            onClick={() => handlePageChange(page + 1)}
                                        >
                                            다음
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {results.length === 0 && (query || selectedGenres.length > 0) && !loading && (
                            <p className="no-results">검색 결과가 없습니다.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
