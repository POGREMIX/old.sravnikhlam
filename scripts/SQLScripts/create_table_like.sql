CREATE TABLE "like"(
    id         int unique PRIMARY KEY,
    textId     int NOT NULL REFERENCES public."text" (id),
	userId	   int NOT NULL REFERENCES public."user" (id)
);

CREATE SEQUENCE like_id_seq;
ALTER TABLE "like" ALTER id SET DEFAULT NEXTVAL('like_id_seq');