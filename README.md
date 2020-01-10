# Filecoin Explorer Lotus

TODO: short description

## Steps

1. Download lotus: `git clone https://github.com/filecoin-project/lotus`
2. Checkout the chainwatch branch: `git fetch && git checkout feat/chainwatch-pg`
3. Follow the installation instructions, [here](https://docs.lotu.sh/#what-can-i-learn-here-100488).
4. Also build the chainwatch service `$ make chainwatch`
5. Run the lotus daemon: `$ lotus daemon`
6. In another terminal, sync the chain: `$ lotus sync wait`
7. After some time (but you don't have to wait unti the entire chain sync's) run the chainwatch in a third terminal `$ chainwatch --db 'postgres://postgres:@localhost:5432/postgres?sslmode=disable' run`
8. Modify the `DATABASE_URL` env var in for the server in [docker-compose.yml](docker-compose.yml). Note the url of the host machine is set to `dockerhost` and most likely shouldn't be changed. Only the username, password, port and db should probably be changed.
9. In a fourth terminal, run docker-compose: `$ docker-compose up`
