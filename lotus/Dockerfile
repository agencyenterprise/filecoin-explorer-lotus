FROM ubuntu:18.04

# 1. Create user
RUN useradd -ms /bin/bash lotus

# 2. Create the working directory at '/home/app' and give user use permissions
RUN mkdir -p /home/lotus/app && chown -R lotus:lotus /home/lotus/app

# 3. Set the working directory
WORKDIR /home/lotus/app

# 4. Install the deps
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    apt-get update && \
    add-apt-repository -y ppa:longsleep/golang-backports && \
    apt-get update && \
    apt-get install -y mesa-opencl-icd ocl-icd-opencl-dev curl \
      golang-go gcc git bzr jq pkg-config mesa-opencl-icd ocl-icd-opencl-dev

# 5. More deps
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# 6. Clone the repo
RUN git clone https://github.com/filecoin-project/lotus.git .


RUN chown -R lotus:lotus /home/lotus

COPY --chown=lotus:lotus entrypoint.sh .


# WS port
EXPOSE 1234
# P2P port
EXPOSE 5678

USER lotus
RUN git fetch && git checkout feat/chainwatch-pg && make clean && make all && make chainwatch
USER root
RUN chmod +x /home/lotus/app/entrypoint.sh && chmod +x /home/lotus/app/lotus && chmod +x /home/lotus/app/chainwatch && chown -R lotus:lotus /var/tmp
USER lotus

ENTRYPOINT ["/home/lotus/app/entrypoint.sh"]
