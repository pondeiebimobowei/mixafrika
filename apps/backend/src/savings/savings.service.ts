import { Injectable } from '@nestjs/common';

@Injectable()
export class SavingsService {

    async handleGetSavings(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleCreateSavings(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleGetSavingsById(savings_id){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleUpdateSavingsById(savings_id: string){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleGetSavingsHistory(savings_id){
        return {
            success: true,
            message: '',
            data: [],
        }
    }


}
