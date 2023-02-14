import { MigrationInterface, QueryRunner } from "typeorm";

export class initProyect1675285270987 implements MigrationInterface {
    name = 'initProyect1675285270987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mnt_refresh_token" ("id" SERIAL NOT NULL, "refresh_token" text NOT NULL, "date_valid" TIMESTAMP WITH TIME ZONE NOT NULL, "id_user" integer, CONSTRAINT "PK_f4bad54767e6bcdd975190e853b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mnt_users" ("id" SERIAL NOT NULL, "email" character varying(320) NOT NULL, "password" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id_profile" integer, CONSTRAINT "UQ_1e617ed0ca179d432721034ef1a" UNIQUE ("email"), CONSTRAINT "PK_1472534d7931b53554745135d16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mnt_rols" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_7df04d930b65ddaeee745d876d7" UNIQUE ("name"), CONSTRAINT "PK_341e94bff374ded32c9a74b0112" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mnt_profile_rols" ("id_profile" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_44cbd2ac57e79153abe0a7b1c9a" PRIMARY KEY ("id_profile", "id_rol"))`);
        await queryRunner.query(`CREATE TABLE "mnt_profiles" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5c5f854a30cc90bf2965f27cd1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mnt_profile_modules" ("id_profile" integer NOT NULL, "id_module" integer NOT NULL, CONSTRAINT "PK_5d4446eb90dcd336e3d7d25b445" PRIMARY KEY ("id_profile", "id_module"))`);
        await queryRunner.query(`CREATE TABLE "mnt_modules" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "name_ruta" character varying NOT NULL, "description" character varying(250), "icon" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_public" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_84ffb8aebdb402d144f29bee0f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mnt_refresh_token" ADD CONSTRAINT "fk_mnt_user_refresh_token" FOREIGN KEY ("id_user") REFERENCES "mnt_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mnt_users" ADD CONSTRAINT "fk_mnt_user_profile" FOREIGN KEY ("id_profile") REFERENCES "mnt_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mnt_profile_rols" ADD CONSTRAINT "FK_7059d4964f53f54718bde8f598d" FOREIGN KEY ("id_profile") REFERENCES "mnt_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mnt_profile_rols" ADD CONSTRAINT "FK_f4f49d9d2dd1ed13b607f244a4f" FOREIGN KEY ("id_rol") REFERENCES "mnt_rols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mnt_profile_modules" ADD CONSTRAINT "FK_4b9a61fcaa565584fa8efc4dcf6" FOREIGN KEY ("id_profile") REFERENCES "mnt_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mnt_profile_modules" ADD CONSTRAINT "FK_1534197901fcdc0477acb6776e2" FOREIGN KEY ("id_module") REFERENCES "mnt_modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mnt_profile_modules" DROP CONSTRAINT "FK_1534197901fcdc0477acb6776e2"`);
        await queryRunner.query(`ALTER TABLE "mnt_profile_modules" DROP CONSTRAINT "FK_4b9a61fcaa565584fa8efc4dcf6"`);
        await queryRunner.query(`ALTER TABLE "mnt_profile_rols" DROP CONSTRAINT "FK_f4f49d9d2dd1ed13b607f244a4f"`);
        await queryRunner.query(`ALTER TABLE "mnt_profile_rols" DROP CONSTRAINT "FK_7059d4964f53f54718bde8f598d"`);
        await queryRunner.query(`ALTER TABLE "mnt_users" DROP CONSTRAINT "fk_mnt_user_profile"`);
        await queryRunner.query(`ALTER TABLE "mnt_refresh_token" DROP CONSTRAINT "fk_mnt_user_refresh_token"`);
        await queryRunner.query(`DROP TABLE "mnt_modules"`);
        await queryRunner.query(`DROP TABLE "mnt_profile_modules"`);
        await queryRunner.query(`DROP TABLE "mnt_profiles"`);
        await queryRunner.query(`DROP TABLE "mnt_profile_rols"`);
        await queryRunner.query(`DROP TABLE "mnt_rols"`);
        await queryRunner.query(`DROP TABLE "mnt_users"`);
        await queryRunner.query(`DROP TABLE "mnt_refresh_token"`);
    }

}
