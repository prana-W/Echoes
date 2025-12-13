import { ApiError, ApiResponse, asyncHandler } from "../utility/index.js";
import statusCode from "../constants/statusCode.js";
import cookieOptions from "../constants/cookieOptions.js";
import User from "../models/user.model.js";
import Analytics from "../models/analytics.model.js";

const signupUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "All required fields must be provided!"
        );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(
            statusCode.CONFLICT,
            "User already registered! Kindly login instead."
        );
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    await Analytics.findOneAndUpdate(
        {},
        { $inc: { totalUsers: 1 } },
        { upsert: true, new: true }
    );

    return res.status(statusCode.CREATED).json(
        new ApiResponse(statusCode.CREATED, "User registered successfully.", {
            userId: user._id,
            name: user.name,
            email: user.email,
        })
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, "All fields are required!");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(statusCode.NOT_FOUND, "User not found!");
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError(statusCode.UNAUTHORIZED, "Incorrect password!");
    }

    const accessToken = await user.generateAccessTokenFromUserId(user._id);
    if (!accessToken) {
        throw new ApiError(
            statusCode.INTERNAL_SERVER_ERROR,
            "Failed to generate access token."
        );
    }

    return res
        .status(statusCode.OK)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(statusCode.OK, "User logged in successfully.", {
                userId: user._id,
                name: user.name,
                email: user.email,
            })
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(statusCode.OK)
        .cookie("accessToken", "", { ...cookieOptions, maxAge: 0 })
        .json(new ApiResponse(statusCode.OK, "User logged out successfully."));
});

export { signupUser, loginUser, logoutUser };
