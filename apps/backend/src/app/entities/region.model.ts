import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { RegionLanguage } from "./regionLanguage.model";
import { Language } from "./language.model";
import { Province } from "./province.model";
import { Member } from "./member.model";
import { UserRegion } from "./userRegion.model";

@Entity({ name: "regions" })
export class Region {
  @PrimaryColumn({ type: "char", length: 2 })
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug!: string;

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

  @OneToMany(() => RegionLanguage, (regionLanguage) => regionLanguage.region, { cascade: true })
  regionLanguages?: RegionLanguage[];

  @OneToMany(() => Province, (province) => province.region)
  provinces?: Province[];

  @ManyToMany(() => Language, (language) => language.regions)
  @JoinTable({
    name: "regions_languages",
    joinColumn: { name: "region_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "language_id", referencedColumnName: "id" },
  })
  languages?: Language[];

  @OneToMany(() => Member, (member) => member.region)
  members?: Member[];

  @OneToMany(() => UserRegion, (userRegion) => userRegion.region)
  userRegions?: UserRegion[];
}

