$(> db/places.sqlite)
cat db/migrate.sql | sqlite3 db/places.sqlite
cat db/seed.sql | sqlite3 db/places.sqlite
