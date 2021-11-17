const router = require('express').Router();
let Item = require('../models/itemModel')
let User = require('../models/userModel')
let {image} = require('../models/uploadsModel')
//let Image = require('../models/uploadsModel')
let getData = require('../functions/getters');
let cart = require('../functions/cart');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path')
const {GridFsStorage} = require("multer-gridfs-storage");
//const mongodb = require('mongodb');
const crypto = require("crypto");
require('dotenv').config();
const { MONGO_URL } = process.env;

const storage = new GridFsStorage({
    url: MONGO_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + "" + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });
/*    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5mb 
})*/

// get all the items
router.route('/').get((req, res) => {
    Item.find()
    .then(items => res.json(items))
    .catch(err => res.status(400).json(`Error: ${err}`)) 
})

// post item (item needs to be updated in two: itself, seller product list) // TESTED
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const img = req.file.id
        const vendorId = req.body.id 
        const itemname = req.body.name
        const desc = req.body.desc
        const price = req.body.price
        // const img = req.file.buffer // only using multer, due to security issue, disabled 

        // image 
        let vendor, id;

        const newItem = await Item.model.create({
        vendorId: vendorId,
        name: itemname,
        desc: desc,
        price: price,
        img: img
        //image 
        })

        await newItem.save() // Saving it to database 
        id = await Item.getIdByName(itemname);
        vendor = await getData.getUser(vendorId);
        vendor.products.push({name: itemname, price: price, _id: id});
        await User.updateProducts(vendor);
        res.status(200).send('object added')
        return;
    } catch(err) {
        res.status(400).send(`Error: ${err}`)
    }
})



// I feel like this can be done in the same route as the rest of the item add
// that and what Muhammad sent
// parameters: filter, update
// so before pulling img route, /add must have been pulled. 
// how can we get id for made item to be used in below route 
// with the video explanation you sent in the chat? 
// okay wanna tell me more? 

// post img 
// router.post('/img', upload.single('image'), async (req, res) => {
//     try {
//         const img = req.file.buffer
//         const newItem = await Item.findOneAndUpdate({img: img})

//     } catch (error) {
//         console.log(`Error: ${error}`) // hi 
//     }
// })


// get one item  // TESTED
router.route('/get/:id').get(async (req, res) => {
            try {
        let data = await getData.getItem(req.params.id); // item obj defined into data 
        /*let { _id, name, desc, img, price, vendorId } = data;
        let file = await getImage(img);*/
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/image/:id', (req, res) => {
    try{
        image.findOne({ _id: req.params.id }, (err, file) => { 
            if (!file || file.length === 0) {
                return res.status(404).json({ err: "No file exists"});
            }
            const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName: 'uploads'});
            bucket.openDownloadStream(mongoose.Types.ObjectId(req.params.id)).pipe(res);
    })
    } catch(err) { 
        res.status(400).send(err); // no more error // btw do you see what else is missing? 
    }
}) // the code error fixed 


// router.get('/image/:id', (req, res) => { router.route('/image/:id').get(async (req, res) => {
//     try{
//         gfs.files.findOne({ filename: req.params.id }, (err, file) => {
//              // Check if file
//             gfs.files.findOne({ _id: req.params.id }, (err, file) => {
//             if (!file || file.length === 0) {
//                 return res.status(404).json({
//                     err: "No file exists"
//                 });
//             }
//             const readstream = gfs.createReadStream(file.filename);
//             readstream.pipe(res);
//     } catch(err) {es.status(
//         });400).send(err);
//     }
// })

// delete
router.route('/:id').delete(async (req, res) => {
    try {
        let users, vendor;
    // get the vendorId for later
        let img;
        let vid = await getData.getItem(req.params.id)
        img = vid.img;
        vid = vid.vendorId;
        // remove the model
        await Item.model.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id))
        vendor = await getData.getUser(vid);
        if (vendor) {
            let idx = vendor.products.findIndex(item => item._id === req.params.id);
            vendor.products.splice(idx, 1);
            await User.updateProducts(vendor);
        }
        users = await User.findByCartItem(req.params.id);
        for (let i = 0; i < users.length; i++) {
            await cart.removeFromCart(users[i]._id, req.params.id);
        }
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName: 'uploads'});
        bucket.delete(mongoose.Types.ObjectId(img));
        res.json('Item deleted')
    }catch(error) {
        console.log(error);
        res.status(400).json(`Error: ${error}`)
    }
})
// dont forget to save
module.exports = router;