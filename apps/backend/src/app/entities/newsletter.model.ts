import { Column, CreateDateColumn, Entity, Index, UpdateDateColumn } from "typeorm";

@Entity({ name: "newsletters" })
export class Newsletter {
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
  @Column({ type: "varchar", length: 255 })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

