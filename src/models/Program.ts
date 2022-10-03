import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Resident } from "./Resident";

@Entity()
export class Program extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column("timestamp")
    start: Date

    @Column("timestamp")
    end: Date

    @Column()
    mode: string

    @Column("text", { array: true, default: "{}" })
    dimensions: string[]

    @Column("text", { array: true, default: "{}" })
    facilitators: string[]

    @Column("text", { array: true, default: "{}" })
    levelsOfCare: string[]

    @Column("text", { array: true, default: "{}" })
    hobbies: string[]

    @ManyToMany(() => Resident)
    @JoinTable()
    attendees: Resident[]
}
