const express = require('express');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require('dotenv').config();
const database = require("./config/database")
const systemConfig = require("./config/system")
const route = require("./routes/client/index.route");
const routeAmin = require("./routes/admin/index.route");
const multer = require('multer')
database.connect();
const app = express();
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({
  extended: false
}))
const port = process.env.PORT;

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
//flash
app.use(cookieParser('avavav'));
app.use(session({
  cookie: {
    maxAge: 60000
  }
}));
app.use(flash());
//end flash
// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin // chỉ dùng được trong file pug
app.use(express.static(`${__dirname}/public`))
//route
route(app);
routeAmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});