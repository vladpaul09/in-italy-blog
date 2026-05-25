import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "media" })
export class Media {
  @PrimaryColumn({ type: "varchar", length: 255 })
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  getName(): string {
    return this.id;
  }
}

