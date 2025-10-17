import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {

    async handleGetSettings(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleUpdateSettings(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }
}
