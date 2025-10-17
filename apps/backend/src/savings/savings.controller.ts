import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SavingsService } from './savings.service';

@Controller('v1/savings')
export class SavingsController {

    constructor(private readonly savingsService: SavingsService) {}

    @Get()
    getSavings(){
        return this.savingsService.handleGetSavings()
    }

    @Post()
    createSavings(){
        return this.savingsService.handleCreateSavings()
    }

    @Patch(":savings_id")
    updateSavings(@Param('savings_id') savings_id: string){
        return this.savingsService.handleUpdateSavingsById(savings_id)
    }

    @Get(":savings_id")
    getSavingsById(@Param('savings_id') savings_id: string){
        return this.savingsService.handleGetSavingsById(savings_id)
    }

    @Get(":savings_id")
    getSavingsHistory(@Param("savings_id") savings_id: string ){
        return this.savingsService.handleGetSavingsHistory(savings_id)
    }

}
