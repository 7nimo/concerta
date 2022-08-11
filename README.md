Concerta is my personal financial manager app, over-engineered, 
and used mainly as a learning tool, to teach myself interesting technologies.
	
It takes CSV data from bank statements and translates it into charts to visualise income and expenses over time, with many ideas still to come.

# Running locally

1. Move env files 
mv .example.env .env
mv packages/api/.example.env packages/api/.env

2. Spin up the project with `docker compose up` 

3. Seed database
`docker exec -d b_api sh -c "yarn seed currency && yarn seed banks && yarn seed user"`

4. Visit http://localhost:4100/

user credentials:
  email: concerta@elusion.io
  password: concerta
