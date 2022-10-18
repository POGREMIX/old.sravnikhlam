CREATE TABLE text(
    id         int unique PRIMARY KEY,
    value      json NOT NULL,
	date 	   timestamp with time zone NOT NULL,
	userId     int NOT NULL,
	FOREIGN KEY (userId) REFERENCES public."user" (id)
);

CREATE SEQUENCE text_id_seq;
ALTER TABLE "text" ALTER id SET DEFAULT NEXTVAL('text_id_seq');