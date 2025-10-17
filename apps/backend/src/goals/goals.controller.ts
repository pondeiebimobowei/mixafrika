import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('v1/goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @Get()
    getGoals(){
        return this.goalsService.handleGetGoals()
    }

    @Post()
    createGoal(){
        return this.goalsService.handleCreateGoals()
    }

    @Patch(':gaol_id')
    updateGoal(@Param('gaol_id') goal_id: string ){
        return this.goalsService.handleUpdateGoals(goal_id)
    }
}
