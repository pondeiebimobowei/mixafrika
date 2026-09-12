import { Controller, Post, Body, Get } from '@nestjs/common';
import { BankCardService } from './bank_card.service';
import { ParsedToken } from '../decorators/parsed-token.decorator';
import { IJwtToken } from '@mixafrica/shared';

@Controller('v1/bank-card')
export class BankCardController {
    constructor(private readonly bankCardService: BankCardService) {}

    @Get()
    async getAllBankCards(@ParsedToken() jwt: IJwtToken) {
        return this.bankCardService.getAllBankCards(jwt.id);
    }
}
