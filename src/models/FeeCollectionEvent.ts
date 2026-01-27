import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('fee_collection_events')
@Index(['positionTokenId', 'blockNumber'])
@Index(['timestamp'])
export class FeeCollectionEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  positionTokenId!: string;

  @Column('bigint')
  blockNumber!: number;

  @Column('timestamp')
  timestamp!: Date;

  @Column('varchar')
  token0Amount!: string;

  @Column('varchar')
  token1Amount!: string;

  @Column('decimal', { precision: 20, scale: 8 })
  token0USD!: number;

  @Column('decimal', { precision: 20, scale: 8 })
  token1USD!: number;

  @Column({ length: 66 })
  transactionHash!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
