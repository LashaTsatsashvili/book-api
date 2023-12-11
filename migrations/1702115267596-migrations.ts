import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1702115267596 implements MigrationInterface {
    name = 'Migrations1702115267596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reading_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`lastReadPage\` int NULL, \`userId\` int NULL, \`bookId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`lastReadPage\``);
        await queryRunner.query(`ALTER TABLE \`reading_history\` ADD CONSTRAINT \`FK_0a84665f42ef7d9ed671a6828e4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reading_history\` ADD CONSTRAINT \`FK_9b3007c1cfeb3f2b2be3c3aadf9\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reading_history\` DROP FOREIGN KEY \`FK_9b3007c1cfeb3f2b2be3c3aadf9\``);
        await queryRunner.query(`ALTER TABLE \`reading_history\` DROP FOREIGN KEY \`FK_0a84665f42ef7d9ed671a6828e4\``);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`lastReadPage\` int NULL`);
        await queryRunner.query(`DROP TABLE \`reading_history\``);
    }

}
