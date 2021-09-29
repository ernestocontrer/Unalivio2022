#! /bin/sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

rm ./functions/.runtimeconfig.json
cp ./functions/.runtimeconfig-development.json ./functions/.runtimeconfig.json
nvm exec $(cat ./functions/.nvmrc) npm --prefix functions run build

firebase emulators:start --import ./data --export-on-exit ./data --inspect-functions

rm ./functions/.runtimeconfig.json
cp ./functions/.runtimeconfig-production.json ./functions/.runtimeconfig.json
