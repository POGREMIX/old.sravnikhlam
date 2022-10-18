CREATE TABLE "dislike"(
    id         int unique PRIMARY KEY,
    textId     int NOT NULL REFERENCES public."text" (id),
	userId	   int NOT NULL REFERENCES public."user" (id)
);

CREATE SEQUENCE dislike_id_seq;
ALTER TABLE "dislike" ALTER id SET DEFAULT NEXTVAL('dislike_id_seq');