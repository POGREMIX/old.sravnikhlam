CREATE TABLE "user" (
    id          int not null unique PRIMARY KEY,
    login       varchar(255) unique NOT NULL
);

CREATE SEQUENCE user_id_seq;
ALTER TABLE "user" ALTER id SET DEFAULT NEXTVAL('user_id_seq');