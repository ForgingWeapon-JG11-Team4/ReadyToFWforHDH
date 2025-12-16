import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }

    @Get('top-rated')
    async getTopRated(@Query('page') page: string) {
        // User requested Top 100. TMDB returns 20 per page.
        // Frontend logic will handle paging (1~5 pages = 100 items).
        // API just proxies the page request.
        const pageNum = parseInt(page) || 1;
        return this.moviesService.getTopRated(pageNum);
    }
}
