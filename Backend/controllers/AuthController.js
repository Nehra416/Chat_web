import User from "../models/AuthModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { unlinkSync } from "fs";

const maxAge = 4 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
}


const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("All Fields are requried");
        }

        const user = await User.create({ email, password });

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "none",
        });

        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("All Fields are requried");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send("User with this email is not found")
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).send("Incorrect Password");
        }

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).send("User can't found");
        }

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const profileUpdate = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).send("Firstname and Lastname is required.");
        }

        const user = await User.findByIdAndUpdate(userId,
            { firstName, lastName, color, profileSetup: true },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const profileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("Profile image is required");
        }

        const userId = req.userId;
        const profileImage = req.file;

        const user = await User.findByIdAndUpdate(userId,
            { image: profileImage.path },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            image: user.image,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const deleteProfileImage = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not Found");
        }

        if (user.image) {
            unlinkSync(user.image);
        }

        user.image = null;
        await user.save();

        return res.status(200).send("Profile is removed Successfully");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const logout = async (req, res, next) => {
    try {
        // send a empty cookie which is expire after 1 milisecond
        res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
        return res.status(200).send("Logut Successfully");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export {
    signup,
    login,
    getUserInfo,
    profileUpdate,
    profileImage,
    deleteProfileImage,
    logout
}