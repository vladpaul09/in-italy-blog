import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

import { Language } from "./language.model";

@Entity({ name: "push_subscriptions" })
export class PushSubscription {
  @Column({
    type: "bigint",
    unsigned: true,
    primary: true,
    generated: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  id!: number;

  @Index({ unique: true })
  @Column({ type: "text" })
  endpoint!: string;

  @Column({ name: "p256dh_key", type: "varchar", length: 255 })
  p256dhKey!: string;

  @Column({ name: "auth_key", type: "varchar", length: 255 })
  authKey!: string;

  @Column({ name: "expiration_time", type: "varchar", length: 255, nullable: true })
  expirationTime!: string | null;

  @Column({ name: "user_agent", type: "text", nullable: true })
  userAgent!: string | null;

  @Column({ name: "ip_address", type: "varchar", length: 45, nullable: true })
  ipAddress!: string | null;

  @Column({ type: "varchar", length: 10, default: "it" })
  locale!: string;

  @Column({ type: "decimal", precision: 12, scale: 7, nullable: true })
  latitude!: string | null;

  @Column({ type: "decimal", precision: 12, scale: 7, nullable: true })
  longitude!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Language, (language) => language.pushSubscriptions, { onDelete: "RESTRICT" })
  language?: Language;
}

