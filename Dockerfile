FROM artixlinux/base:latest

# set up the environment before the install
ENV BUN_INSTALL="$HOME/.bun"
ENV PATH=$BUN_INSTALL/bin:$PATH
WORKDIR .

# initial dependencies layer
RUN pacman --needed --noconfirm --disable-download-timeout -Syyu &&\
    pacman --noconfirm --disable-download-timeout -S unzip curl

RUN curl -fsSL https://bun.sh/install | bash

# run the server and expose the port
COPY . .
CMD  [ "bun", "run", "serve" ]
EXPOSE 6969
