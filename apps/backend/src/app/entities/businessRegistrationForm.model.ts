import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "business_registration_forms" })
export class BusinessRegistrationForm {
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

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  surname!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  phone!: string;

  @Column({ type: "text" })
  note!: string;

  @Column({ type: "varchar", length: 255 })
  company!: string;

  @Column({ name: "fiscal_code", type: "varchar", length: 255 })
  fiscalCode!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

