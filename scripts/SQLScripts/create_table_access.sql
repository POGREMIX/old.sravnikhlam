CREATE TABLE access(
    id         int unique PRIMARY KEY,
    hash       varchar(255) NOT NULL,
	salt 	   varchar(255) NOT NULL,
	userId	   int,
	FOREIGN KEY (userId) REFERENCES public."user" (id)
);

CREATE SEQUENCE access_id_seq;
ALTER TABLE "access" ALTER id SET DEFAULT NEXTVAL('access_id_seq');