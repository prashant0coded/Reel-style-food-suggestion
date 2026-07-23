const userModel = require("../models/user.model")
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: turns Mongoose/DB errors into a clean, readable message
function getErrorMessage(err) {
    if (err.name === "ValidationError") {
        const fields = Object.values(err.errors).map(e => e.message);
        return fields.join(" ");
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || { email: true })[0];
        return `An account with this ${field} already exists.`;
    }
    return err.message || "Something went wrong. Please try again.";
}

async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Full name, email, and password are all required."
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            email
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        })
    } catch (err) {
        console.error("registerUser error:", err);
        res.status(400).json({ message: getErrorMessage(err) });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            })
        }

        const user = await userModel.findOne({
            email
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        })
    } catch (err) {
        console.error("loginUser error:", err);
        res.status(400).json({ message: getErrorMessage(err) });
    }
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}


async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, phone, address, contactName } = req.body;

        if (!name || !email || !password || !phone || !address || !contactName) {
            return res.status(400).json({
                message: "Business name, contact name, phone, email, password, and address are all required."
            })
        }

        const isAccountAlreadyExists = await foodPartnerModel.findOne({
            email
        })

        if (isAccountAlreadyExists) {
            return res.status(400).json({
                message: "Food partner account already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        })

        const token = jwt.sign({
            id: foodPartner._id,
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(201).json({
            message: "Food partner registered successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                address: foodPartner.address,
                contactName: foodPartner.contactName,
                phone: foodPartner.phone
            }
        })
    } catch (err) {
        console.error("registerFoodPartner error:", err);
        res.status(400).json({ message: getErrorMessage(err) });
    }
}

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            })
        }

        const foodPartner = await foodPartnerModel.findOne({
            email
        })

        if (!foodPartner) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({
            id: foodPartner._id,
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(200).json({
            message: "Food partner logged in successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name
            }
        })
    } catch (err) {
        console.error("loginFoodPartner error:", err);
        res.status(400).json({ message: getErrorMessage(err) });
    }
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food partner logged out successfully"
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}
