import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvestmentDto } from '@shared/shared/src/dto/investment/create-investment.dto';
import { Status, Types } from '@shared/shared/src/enums';
import { Cluster } from 'src/database/models/cluster.model';
import { Collection } from 'src/database/models/collection.model';
import { Investment } from 'src/database/models/investment.model';
import { Transaction } from 'src/database/models/transaction.model';
import { Wallet } from 'src/database/models/wallet.model';

@Injectable()
export class InvestmentService {
  async handleGetInvestments(user_id: string) {
    const investments = await Investment.findAll({
      where: { user_id }, include: [
        {
          model: Cluster, include: [
            { model: Collection }
          ]
        }

      ]
    })

    return {
      success: true,
      message: '',
      data: investments,
    };
  }

  async handleCreateInvestment(payload: CreateInvestmentDto, user_id: string) {
    const { cluster_id, amount } = payload;
    if (!Investment.sequelize) {
      throw new Error('Database connection not established');
    }
    const t = await Investment.sequelize.transaction();

    try {
      const user_wallet = await Wallet.findOne({ where: { user_id } });
      const cluster = await Cluster.findByPk(cluster_id);

      if (!cluster) {
        throw new NotFoundException('Cluster not found');
      }

      if (!user_wallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (Number(user_wallet.available_balance) < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      if (
        Number(cluster.total_funds_raised) + amount >
        Number(cluster.target_fundraising_amount)
      ) {
        throw new BadRequestException('Investment exceeds target amount');
      }

      await user_wallet.decrement('available_balance', {
        by: amount,
        transaction: t,
      });

      await user_wallet.increment(
        {
          total_portfolio: amount,
          active_investment_principal: amount,
        },
        { transaction: t },
      );

      const tx = await Transaction.create(
        {
          amount,
          user_id,
          type: Types.INVESTMENT,
          status: Status.COMPLETED,
          title: `Investment in ${cluster.name}`,
          category: 'Investment',
        },
        { transaction: t },
      );

      await Investment.create(
        {
          user_id,
          cluster_id,
          transaction_id: tx.id,
          amount_invested: amount,
          status: Status.ACTIVE,
          total_earnings: 0,
        },
        { transaction: t },
      );

      await cluster.increment('total_funds_raised', {
        by: amount,
        transaction: t,
      });

      await t.commit();

      return {
        success: true,
        message: 'Investment successful',
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async handleGetInvesmentById(investment_id: string) {
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
