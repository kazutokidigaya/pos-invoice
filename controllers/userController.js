import Users from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const loginItemController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const response = {
      _id: user._id,
      email: user.email,
      verified: true,
    };

    // Respond with success if the credentials are valid
    res.status(200).json({ message: "Login successful!", response });
  } catch (error) {
    console.error("Error in LoginController:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists. Please log in." });
    }
    const newUser = new Users({
      email: email,
      password: password,
      verified: true,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Error in RegisterController:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
