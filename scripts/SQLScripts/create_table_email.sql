CREATE TABLE email(
    id         int unique PRIMARY KEY,
    value      varchar(255) not null,
	confirmed boolean not null,
	userId	   int not null,
	FOREIGN KEY (userId) REFERENCES public."user" (id)
);

CREATE SEQUENCE email_id_seq;
ALTER TABLE "email" ALTER id SET DEFAULT NEXTVAL('email_id_seq');