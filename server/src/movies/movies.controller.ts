import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

/**
 * MoviesController: 영화 관련 API 엔드포인트
 * - GET /movies/top-rated: 인기 영화 목록
 * - GET /movies/search: 텍스트 검색 (제목, 배우, 제작사)
 * - GET /movies/genres: 장르 목록
 * - GET /movies/discover: 장르별 탐색
 * - GET /movies/:id: 영화 상세 정보
 */
@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }

    @Get('top-rated')
    async getTopRated(@Query('page') page: string) {
        const pageNum = parseInt(page) || 1;
        return this.moviesService.getTopRated(pageNum);
    }

    /**
     * 통합 검색
     * GET /movies/search?q=검색어&type=multi&page=1
     * type: 'movie' | 'person' | 'company' | 'multi'
     */
    @Get('search')
    async search(
        @Query('q') query: string,
        @Query('type') type: string = 'multi',
        @Query('page') page: string = '1',
    ) {
        const pageNum = parseInt(page) || 1;
        const searchType = type as 'movie' | 'person' | 'company' | 'multi';

        return this.moviesService.structuredSearch({
            type: searchType,
            query: query || '',
            page: pageNum,
        });
    }

    /**
     * 장르 목록 조회
     * GET /movies/genres
     */
    @Get('genres')
    async getGenres() {
        return this.moviesService.getGenres();
    }

    /**
     * 장르별 영화 탐색
     * GET /movies/discover?genres=28,12&page=1&sort=popularity.desc
     */
    @Get('discover')
    async discover(
        @Query('genres') genres: string,
        @Query('page') page: string = '1',
        @Query('sort') sort: string = 'popularity.desc',
    ) {
        const pageNum = parseInt(page) || 1;
        return this.moviesService.discoverByGenre(genres, pageNum, sort);
    }

    @Get(':id')
    async getMovieDetail(@Param('id') id: string) {
        const movieId = parseInt(id);
        return this.moviesService.getMovieDetail(movieId);
    }
}

