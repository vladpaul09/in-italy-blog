import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Region } from "./region.model";
import { ProvinceLanguage } from "./provinceLanguage.model";
import { Municipality } from "./municipality.model";
import { UserProvince } from "./userProvince.model";

@Entity({ name: "provinces" })
export class Province {
  @PrimaryColumn({ type: "char", length: 4 })
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug!: string;

  @Column({ type: "varchar", length: 10 })
  code!: string;

  @Column({ name: "region_id", type: "char", length: 2 })
  regionId!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  image!: string | null;

  @Column({ name: "mobile_image", type: "varchar", length: 255, nullable: true })
  mobileImage!: string | null;

  @Column({ name: "show_frontend", type: "boolean", default: false })
  showFrontend!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Region, (region) => region.provinces, { onDelete: "CASCADE" })
  region?: Region;

  @OneToMany(() => ProvinceLanguage, (provinceLanguage) => provinceLanguage.province, { cascade: true })
  provinceLanguages?: ProvinceLanguage[];

  @OneToMany(() => Municipality, (municipality) => municipality.province)
  municipalities?: Municipality[];

  @OneToMany(() => UserProvince, (userProvince) => userProvince.province)
  userProvinces?: UserProvince[];
}

