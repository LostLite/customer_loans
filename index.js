const app = require('express')();
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 3030;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(fileUpload({
    useTempFiles: false,
    tempFileDir: '/tmp/'
}));

app.use("/api/v1/", routes);

app.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to the Customer Loans API'});
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})