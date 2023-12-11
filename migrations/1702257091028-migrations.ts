import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1702257091028 implements MigrationInterface {
    name = 'Migrations1702257091028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reading_history\` DROP FOREIGN KEY \`FK_9b3007c1cfeb3f2b2be3c3aadf9\``);
        await queryRunner.query(`ALTER TABLE \`reading_history\` CHANGE \`lastReadPage\` \`lastReadPage\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reading_history\` ADD CONSTRAINT \`FK_9b3007c1cfeb3f2b2be3c3aadf9\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reading_history\` DROP FOREIGN KEY \`FK_9b3007c1cfeb3f2b2be3c3aadf9\``);
        await queryRunner.query(`ALTER TABLE \`reading_history\` CHANGE \`lastReadPage\` \`lastReadPage\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reading_history\` ADD CONSTRAINT \`FK_9b3007c1cfeb3f2b2be3c3aadf9\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
