FROM alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    BROWSER_PATH=/usr/bin/chromium-browser

RUN npm install -g redoc-cli

RUN npm install

RUN redoc-cli bundle -o public/index.html openapi.json

CMD [ "npm","start" ]