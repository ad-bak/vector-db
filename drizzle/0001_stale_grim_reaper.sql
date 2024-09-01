CREATE TABLE IF NOT EXISTS "MovieEmbedding" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MovieEmbedding" ADD CONSTRAINT "MovieEmbedding_movie_id_Movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."Movie"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
