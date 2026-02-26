import { Injectable } from '@nestjs/common';
import { BankCard } from 'src/database/models/bank-card.model';

@Injectable()
export class BankCardService {

    async getAllBankCards(user_id: string) {
        const bankCards = await BankCard.findAll({ where: { user_id } });
        return {
            sucess: true,
            message: 'Bank cards fetched successfully',
            data: bankCards
        };
    }
}
