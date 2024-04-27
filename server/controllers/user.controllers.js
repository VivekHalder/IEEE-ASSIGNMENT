import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateTokens } from "./utils/generateTokens.js";

const signupUser = asyncHandler(async (req, res, next) => {
  try {
    console.log("Signup process started.");
    console.log(req.body);
    const { username, email, password } = req.body;

    console.log("Received data:", username, email, password);

    if ([username, email, password].some((ele) => ele !== "")) {
      throw new ApiError(400, "No fields should be empty.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email address.");
    }

    const existingUser = await User.findOne({
      $or: [
        {
          email,
        },
        {
          username,
        },
      ],
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists.");
    }

    const newUser = await User.create(req.body);

    if (!newUser) {
      throw new ApiError(400, "User could not be created.");
    }

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken",
    );

    console.log("User created successfully:", createdUser);

    return res
      .status(200)
      .json(new ApiResponse(201, createdUser, "User created successfully."));
  } catch (error) {
    console.error("Error during signup:", error.message);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    console.log("Login process started.");
    const { email, password } = req.body;

    console.log("Received login data:", email, password);

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required for login.");
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    console.log("User logged in successfully:", loggedInUser);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
            user: loggedInUser,
          },
          "User logged in successfully.",
        ),
      );
  } catch (error) {
    console.error("Error during login:", error.message);
    next(error);
  }
});

const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    console.log("Logout process started.");

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      },
    );

    console.log("User logged out successfully.");

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully."));
  } catch (error) {
    console.error("Error during logout:", error.message);
    next(error);
  }
});

export { signupUser, loginUser, logoutUser };