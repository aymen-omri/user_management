require('dotenv').config();
let express = require('express');
let mysql = require('mysql2');
let cors = require('cors');
let multer = require('multer');
let path = require('path');
let bodyParser = require('body-parser');
let fs = require('fs');

let app = express();

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

//Create mysql database connection
let database = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

//Connect to database
database.connect((err) => {
    if (err) throw err;
    console.log("Database connected successfully");
});

//Admin login
app.post('/login', (req, res) => {
    let username = req.body['username'];
    let pwd = req.body['pwd'];
    let query = "select * from user_details where username=? and pwd=?";
    database.execute(query, [username, pwd], (err, result) => {
        if (err) throw err;
        if (result[0]) {
            return res.status(200).json({ message: "logged in", data: result[0] });
        } else {
            return res.status(401).json({ message: "Wrong email or password!" });
        }
    });
});

//Configure file storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

//This function is gonna be useful every time we need to delete a photo from a given path 
function deletePhoto(imagePath) {
    try {
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log('File deleted');
        }
    } catch (error) {
        console.error('Error deleting file', error);
    }
}

//Create a new user 
app.post('/add_user', upload.single('image'), async (req, res) => {
    try {
        const { username, pwd, display_name, role_u, designation, email } = req.body;
        const photo_path = req.file.path;
        let query = "insert into user_details (username , pwd , display_name , role_u , designation , email , photo_path) values (?,?,?,?,?,?,?)";
        database.execute(query, [username, pwd, display_name, role_u, designation, email, photo_path], (err, result) => {
            if (err) {
                deletePhoto(photo_path);
                return res.status(500).json({ error: "Email or username already used!" });
            }
            return res.status(200).json({ message: "User inserted successfully!" });
        });
    } catch (e) {
        console.log("error: " + e);
        return res.status(500).json({ message: "Error while uploading the picture!" });
    }
});

//Get all users 
app.get('/all', (req, res) => {
    let query = 'select * from user_details';
    database.execute(query, (err, result) => {
        if (err) throw err;
        if (result) return res.status(200).json({ message: 'success', data: result });
    });
});

//Get user details by id 
app.get('/byid/:id', (req, res) => {
    let id = req.params.id;
    let query = "select * from user_details where id = ?";
    database.execute(query, [id], (err, result) => {
        if (err) throw err;
        if (result) return res.status(200).json({ message: 'success', data: result });
    });
});

//Update user data by id 
app.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const { username, pwd, display_name, role_u, designation, email } = req.body;

        // Prepare update query and parameters
        let query, queryParams;
        if (req.file) {
            const photo_path = req.file.path;
            query = "UPDATE user_details SET username=?, pwd=?, display_name=?, role_u=?, designation=?, email=?, photo_path=? where id=?";
            queryParams = [username, pwd, display_name, role_u, designation, email, photo_path, id];
        } else {
            query = "UPDATE user_details SET username=?, pwd=?, display_name=?, role_u=?, designation=?, email=? where id=?";
            queryParams = [username, pwd, display_name, role_u, designation, email, id];
        }

        // Execute the update query
        const updateResult = await database.execute(query, queryParams);

        return res.status(200).json({ message: "User updated successfully!" });
    } catch (error) {
        if (req.file) {
            deletePhoto(req.file.path);
        }
        return res.status(500).json({ error: "An error occurred while updating user details." });
    }
});



//Delete user by id 
app.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    let query = "delete from user_details where id = ?";
    database.execute(query, [id], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Deleted successfully!" });
    });
});



//This is a simple api end point to test backend
app.get('/test', (req, res) => {
    res.json({ message: "success" });
});


//Backend is litening on port 3000 all you have to do is typing : http://localhost:3000/<API_END_POINT>
app.listen(process.env.PORT || 3000, () => {
    console.log("app is litening on port 3000");
});