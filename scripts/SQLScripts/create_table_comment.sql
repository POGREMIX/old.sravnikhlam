CREATE TABLE comment(
    id         int unique PRIMARY KEY,
    value      varchar(255),
	date	   timestamp with time zone NOT NULL,
	textId	   int NOT NULL REFERENCES public."text" (id),
	userId	   int NOT NULL REFERENCES public."user" (id)
);

CREATE SEQUENCE comment_id_seq;
ALTER TABLE "comment" ALTER id SET DEFAULT NEXTVAL('comment_id_seq');