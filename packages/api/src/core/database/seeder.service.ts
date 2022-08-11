import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/modules/account/entities/account.entity';
import { BankEntity } from 'src/modules/context/entities/bank.entity';
import { CurrencyEntity } from 'src/modules/context/entities/currency.entity';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { bankData, currencyData, userData } from './data/data';
import { CsvParserFactory } from '../common/factories/csv-parser.factory';
import { TransactionImportedEvent } from 'src/modules/transaction/events/transastion-imported.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SeederService {
  constructor(
    private dataSource: DataSource,
    private csvParserFactory: CsvParserFactory,
    private eventEmitter: EventEmitter2,
  ) {}

  async currency(): Promise<void> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .orIgnore()
        .into(CurrencyEntity)
        .values(currencyData)
        .execute();
    } catch (error) {
      console.error(error);
    }
  }

  async banks(): Promise<void> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .orIgnore()
        .into(BankEntity)
        .values(bankData)
        .execute();
    } catch (error) {
      console.error(error);
    }
  }

  async user(): Promise<void> {
    const bankRepository = this.dataSource.getRepository(BankEntity);
    const currencyRepository = this.dataSource.getRepository(CurrencyEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);
    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const transactionRepository =
      this.dataSource.getRepository(TransactionEntity);

    const createdUser = await userRepository.insert(userData);
    const { id: userId } = createdUser.identifiers[0];

    const user = await userRepository.findOneBy({ id: userId });
    const bank = await bankRepository.findOneBy({ id: 2 });
    const currency = await currencyRepository.findOneBy({ id: 2 });

    const createdAccount = await accountRepository.insert({
      name: 'Lloyds',
      accountNumber: '123456789',
      bank,
      currency,
      user,
    });
    const { id: accountId } = createdAccount.identifiers[0];

    const account = await accountRepository.findOneBy({ id: accountId });

    const transactions = await this.csvParserFactory.parseSeedingCsv(
      account,
      '/app/data/transactions.csv',
    );

    await transactionRepository.insert(transactions);

    const mostRecentTransaction = await this.dataSource
      .getRepository(TransactionEntity)
      .createQueryBuilder('transaction')
      .orderBy('transaction_date', 'DESC')
      .leftJoin('transaction.account', 'account')
      .leftJoin('account.user', 'user')
      .where('account.id = :accountId', { accountId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    // update current account balance
    await this.dataSource
      .createQueryBuilder()
      .update(AccountEntity)
      .set({ balance: +mostRecentTransaction.balance })
      .where('id = :id', { id: accountId })
      .andWhere('account.id = :accountId', { accountId })
      .execute();
  }
}
