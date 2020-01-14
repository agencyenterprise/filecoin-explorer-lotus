> agency enterprise filecoin-explorer-lotus

# Usage

First, you need lotus up and running. Follow [these instructions](https://docs.lotu.sh/en+install-lotus-ubuntu) to install the necessary dep's.

Next, clone the repo and switch to the appropriate branch and make:

```bash
$ git clone https://github.com/filecoin-project/lotus.git
$ cd lotus/
$ git checkout feat/chainwatch-pg
$ make clean && make all && make chainwatch
```

Next, run the daemon, sync the chain, and run the chain watcher.

```bash
$ ./lotus daemon

# in another terminal
$ ./lotus sync wait

# in yet another terminal
$ ./chainwatch --db='postgres://postgres:@localhost:5432/lotus?sslmode=disable' run
```

Finally, inside of this repo's directory, run the following commands:

```bash
# use docker-compose
$ docker-compose up

# or, use yarn / npm
$ yarn install
$ yarn start
```

# License

[LICENSE](LICENSE)

```
The MIT License (MIT)

Copyright (c) 2020 Agency Enterprise

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
