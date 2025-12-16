import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

/**
 * MoviesService: 영화 데이터 관련 비즈니스 로직
 * - TMDB API 연동
 * - 인기 영화, 상세 정보, 검색, 장르별 조회 기능
 * - 추후 LLM 연동을 위한 구조화된 검색 지원
 */
@Injectable()
export class MoviesService {
    private readonly TMDB_API_URL = 'https://api.themoviedb.org/3';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    private getApiKey(): string {
        return this.configService.get<string>('TMDB_API_KEY') || 'e0437f2d5cdc8cc83e99b1b9a98aa066';
    }

    async getTopRated(page: number = 1) {
        const apiKey = this.getApiKey();
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.TMDB_API_URL}/movie/popular`, {
                    params: {
                        api_key: apiKey,
                        language: 'ko-KR',
                        page: page,
                        region: 'KR'
                    },
                }),
            );
            return data;
        } catch (error) {
            console.error(error);
            throw new HttpException('Failed to fetch movies from TMDB', HttpStatus.BAD_GATEWAY);
        }
    }

    async getMovieDetail(id: number) {
        const apiKey = this.getApiKey();
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.TMDB_API_URL}/movie/${id}`, {
                    params: {
                        api_key: apiKey,
                        language: 'ko-KR',
                        append_to_response: 'credits,images'
                    },
                }),
            );
            return data;
        } catch (error) {
            console.error(`Failed to fetch detail for movie ${id}:`, error);
            throw new HttpException(`Failed to fetch movie detail for ${id}`, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * 통합 검색 (영화 제목, 배우, 제작사 등)
     * TMDB /search/multi API 사용
     * 추후 LLM이 파싱한 쿼리를 받아 처리 가능
     */
    async searchMulti(query: string, page: number = 1) {
        const apiKey = this.getApiKey();
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.TMDB_API_URL}/search/multi`, {
                    params: {
                        api_key: apiKey,
                        language: 'ko-KR',
                        query: query,
                        page: page,
                        include_adult: false
                    },
                }),
            );
            // 영화만 필터링 (person, tv 제외 가능)
            return data;
        } catch (error) {
            console.error(`Search failed for query: ${query}`, error);
            throw new HttpException('Search failed', HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * 영화 제목 검색
     */
    async searchMovies(query: string, page: number = 1) {
        const apiKey = this.getApiKey();
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.TMDB_API_URL}/search/movie`, {
                    params: {
                        api_key: apiKey,
                        language: 'ko-KR',
                        query: query,
                        page: page,
                        include_adult: false
                    },
                }),
            );
            return data;
        } catch (error) {
            console.error(`Movie search failed for query: ${query}`, error);
            throw new HttpException('Movie search failed', HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * 배우/인물 검색
     */
    async searchPerson(query: string, page: number = 1) {
        const apiKey = this.getApiKey();
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.TMDB_API_URL}/search/person`, {
                    params: {
                        api_key: apiKey,
                        language: 'ko-KR',
                        query: query,
                        page: page
                    },
                }),
            );
            return data;
        } catch (error) {
            console.error(`Person search failed for query: ${query}`, error);
            throw new HttpException('Person search failed', HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * 제작사 검색
     */
    async searchCompany(query: string, page: number = 1) {
        const apiKey = this.getApiKey();
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.TMDB_API_URL}/search/company`, {
                    params: {
                        api_key: apiKey,
                        query: query,
                        page: page
                    },
                }),
            );
            return data;
        } catch (error) {
            console.error(`Company search failed for query: ${query}`, error);
            throw new HttpException('Company search failed', HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * 장르 목록 조회
     * TMDB /genre/movie/list API
     */
    async getGenres() {
        const apiKey = this.getApiKey();
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.TMDB_API_URL}/genre/movie/list`, {
                    params: {
                        api_key: apiKey,
                        language: 'ko-KR'
                    },
                }),
            );
            return data.genres;
        } catch (error) {
            console.error('Failed to fetch genres', error);
            throw new HttpException('Failed to fetch genres', HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * 장르별 영화 탐색
     * TMDB /discover/movie API
     * @param genreIds 장르 ID들 (comma separated)
     */
    async discoverByGenre(genreIds: string, page: number = 1, sortBy: string = 'popularity.desc') {
        const apiKey = this.getApiKey();
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.TMDB_API_URL}/discover/movie`, {
                    params: {
                        api_key: apiKey,
                        language: 'ko-KR',
                        with_genres: genreIds,
                        page: page,
                        sort_by: sortBy,
                        include_adult: false
                    },
                }),
            );
            return data;
        } catch (error) {
            console.error(`Discover failed for genres: ${genreIds}`, error);
            throw new HttpException('Discover failed', HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * 구조화된 검색 (LLM 연동 대비)
     * type: 'movie' | 'person' | 'company' | 'multi'
     * 추후 LLM이 자연어를 파싱해 이 메서드를 호출
     */
    async structuredSearch(params: {
        type: 'movie' | 'person' | 'company' | 'multi';
        query: string;
        genreIds?: string;
        page?: number;
    }) {
        const { type, query, genreIds, page = 1 } = params;

        switch (type) {
            case 'movie':
                return this.searchMovies(query, page);
            case 'person':
                return this.searchPerson(query, page);
            case 'company':
                return this.searchCompany(query, page);
            case 'multi':
            default:
                // 장르 필터가 있으면 discover 사용
                if (genreIds) {
                    return this.discoverByGenre(genreIds, page);
                }
                return this.searchMulti(query, page);
        }
    }
}

