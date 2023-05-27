const router = require("express").Router();
const authGuard = require("../auth/authGuard");
const Product = require("../models/productModel");
const cloudinary = require("cloudinary").v2;

// create a add product route
router.post("/add", authGuard, async (req, res) => {
    // destructuring
    const { name, price, category, description } = req.body;

    // image
    const image = req.files.image;

    //validation
    if (!name || !price || !category || !description || !image) {
        return res.status(400).json({ msg: "Please fill all the fields." });
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image.path, {
            folder: "products",
            crop: "scale",
        });

        // create a new product
        const newProduct = new Product({
            name,
            image: uploadedImage.secure_url,
            price,
            category,
            description,
        });

        // save product
        await newProduct.save();
        res.status(200).send("Success");
    } catch (err) {
        res.status(500).json({ msg: "Add Product Failed" });
    }
});

module.exports = router;
