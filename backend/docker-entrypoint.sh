ln -snf /tmp/app /app
cd /app
npm install
npm update

if [ $WATCH -eq 1 ]; then
  npm run start:debug
else
  npm run start
fi
