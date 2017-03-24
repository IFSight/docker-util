FROM mhart/alpine-node:6
MAINTAINER IF Fulcrum "fulcrum@ifsight.net"

RUN apk update && apk upgrade && \
    apk --no-cache add gettext curl

ADD fulcrum /fulcrum
