import { Controller, Post, Body, Get } from '@nestjs/common';
import { BankCardService } from './bank_card.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';

@Controller('v1/bank-card')
export class BankCardController {
    constructor(private readonly bankCardService: BankCardService) {}

    @Get()
    async getAllBankCards(@ParsedToken() jwt: IJwtToken) {
        return this.bankCardService.getAllBankCards(jwt.id);
    }
}
