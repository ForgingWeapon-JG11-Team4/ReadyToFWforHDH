import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
    private readonly TMDB_API_URL = 'https://api.themoviedb.org/3';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async getTopRated(page: number = 1) {
        // Try to load from Config (Env), fallback to hardcoded key if specific env issues persist
        const apiKey = this.configService.get<string>('TMDB_API_KEY') || 'e0437f2d5cdc8cc83e99b1b9a98aa066';
        console.log('DEBUG: Using API Key:', apiKey ? '***' : 'undefined');

        if (!apiKey) {
            throw new HttpException('TMDB_API_KEY is missing', HttpStatus.INTERNAL_SERVER_ERROR);
        }

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
}
