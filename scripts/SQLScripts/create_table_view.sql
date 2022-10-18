CREATE TABLE view(
    id         int unique PRIMARY KEY,
    count      int,
	textId	   int,
	FOREIGN KEY (textId) REFERENCES public."text" (id)
);

CREATE SEQUENCE view_id_seq;
ALTER TABLE "view" ALTER id SET DEFAULT NEXTVAL('view_id_seq');