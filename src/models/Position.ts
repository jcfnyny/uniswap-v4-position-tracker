import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Wallet } from './Wallet';

@Entity('positions')
@Index(['owner'])
@Index(['poolAddress'])
export class Position {
  @PrimaryColumn()
  tokenId!: string;

  @Column({ length: 42 })
  owner!: string;

  @Column({ length: 66 })
  poolAddress!: string;

  @Column({ length: 42 })
  token0Address!: string;

  @Column({ length: 20 })
  token0Symbol!: string;

  @Column('int')
  token0Decimals!: number;

  @Column({ length: 42 })
  token1Address!: string;

  @Column({ length: 20 })
  token1Symbol!: string;

  @Column('int')
  token1Decimals!: number;

  @Column('int')
  fee!: number;

  @Column({ length: 42, nullable: true })
  hookAddress?: string;

  @Column('varchar')
  liquidity!: string;

  @Column('int')
  tickLower!: number;

  @Column('int')
  tickUpper!: number;

  @Column('varchar')
  feeGrowthInside0LastX128!: string;

  @Column('varchar')
  feeGrowthInside1LastX128!: string;

  @Column('varchar')
  tokensOwed0!: string;

  @Column('varchar')
  tokensOwed1!: string;

  @Column('int', { nullable: true })
  chainId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastSyncedAt!: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.positions)
  @JoinColumn({ name: 'owner', referencedColumnName: 'address' })
  wallet?: Wallet;
}
