FROM alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    font-noto-emoji

COPY . .

ENV BROWSER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm install -g redoc-cli

RUN npm install

RUN redoc-cli bundle -o public/index.html openapi.json

CMD [ "npm","start" ]