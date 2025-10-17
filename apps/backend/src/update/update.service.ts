import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateService {

    async handleGetUpdates(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }
}
