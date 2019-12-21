create database "transaction_api";
create table "user" (
  id serial PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  cashtag VARCHAR(100) NOT NULL,
  phone_number VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


create table "wallet" (
  id serial PRIMARY KEY,
  user_id int REFERENCES "public"."user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  balance float NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TYPE "type" AS ENUM ('withdraw', 'deposit');
create table "transaction" (
  id serial PRIMARY KEY,
  wallet_id int REFERENCES "public"."wallet"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  nominal float NOT NULL DEFAULT 0,
  "type" "type",
  description TEXT NOT NULL,
  beneficiary_id int REFERENCES "public"."user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table payee (
  id serial PRIMARY KEY,
  user_id int REFERENCES "public"."user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  payee_id int REFERENCES "public"."user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO "public"."user" (id,name,cashtag,address,phone_number,email,password) VALUES (1,'Alan','alans','tebet','14045','alan@email.com','7c222fb2927d828af22f592134e8932480637c0d');
INSERT INTO "public"."user" (id,name,cashtag,address,phone_number,email,password) VALUES (2,'Bertha','Berths','gelael','14042','bertha@email.com','7c222fb2927d828af22f592134e8932480637c0d');
INSERT INTO "public"."user" (id,name,cashtag,address,phone_number,email,password) VALUES (3,'Adit','ditdit','gelael','14042','adit@email.com','7c222fb2927d828af22f592134e8932480637c0d');
INSERT INTO "wallet" (id,user_id,balance) VALUES (1,1,0);
INSERT INTO "wallet" (id,user_id,balance) VALUES (2,2,0);
INSERT INTO "wallet" (id,user_id,balance) VALUES (3,3,0);
INSERT INTO "transaction" (id,wallet_id,nominal,type,description) VALUES (1,1,50000,'deposit','Tabungan Bank');
INSERT INTO "transaction" (id,wallet_id,nominal,type,description) VALUES (2,2,10000,'deposit','Initial Deposit');
INSERT INTO "transaction" (id,wallet_id,nominal,type,description) VALUES (3,3,200000,'deposit','motor');

drop table "transaction";
drop table "wallet";
drop table "public"."user";
