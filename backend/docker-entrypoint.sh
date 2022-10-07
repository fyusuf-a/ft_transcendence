ln -snf /tmp/app /app
cd /app
npm install

if [ $WATCH -eq 1 ]; then
  npm run start:debug
else
  npm run start
fi
