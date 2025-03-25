library
```
cd backend
npm init -y
npm install --save-dev express multer cors fs-extra path node-cron nodemon jsonwebtoken bcryptjs

cd frontend
npm init -y
npm install --save-dev webpack webpack-cli react@17.0.2 react-dom@17.0.2
npm install @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
npm install --save-dev react-router-dom@5.3.0 css-loader style-loader html-webpack-plugin webpack-dev-server
npm install --save-dev axios lucide-react
```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"