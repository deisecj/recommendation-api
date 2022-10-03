import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Program } from "./Program";

@Entity()
export class Resident extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    userId: string

    @Column()
    name: string

    @Column({ nullable: true })
    gender: string

    @Column("timestamp")
    birthday: Date

    @Column("timestamp")
    moveInDate: Date

    @Column({ nullable: true })
    levelOfCare: string

    @Column()
    roomNumber: number

    @Column("text", { array: true, default: "{}" })
    hobbies: string[]

    @ManyToMany(() => Program, (program) => program.attendees)
    @JoinTable({ 
        name: 'program_attendees_resident',
        joinColumn: { name: 'residentUserId' },
        inverseJoinColumn: { name: 'programId' }
      })
    programs: Program[]
}
