import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  const { email, password } = req.body;
  // Check if email and password match the predefined ones
  if (email !== "example@gmail.com" || password !== "password123") {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT token with both email and username
  const token = jwt.sign({ email }, "jdkdkkd,mkujdm");
  res.cookie("token", token, { httpOnly: true });

  // Send a success response
  res.status(200).json({ message: "Login successful", token });
};
