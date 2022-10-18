CREATE TABLE "image"(
    id         int unique PRIMARY KEY,
    textId	   int NOT NULL REFERENCES public."text" (id),
    hash       varchar(255) not null,
    url        varchar(255) not null	
);

CREATE SEQUENCE image_id_seq;
ALTER TABLE "image" ALTER id SET DEFAULT NEXTVAL('image_id_seq');