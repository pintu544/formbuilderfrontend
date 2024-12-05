// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const phoneNumberRegex = /^\d{10}$/;
const otpRegex = /^\d{6}$/;

export const isValid = (label, value, type) => {
  if (!value?.toString()?.trim()) return `${label} is required`;
  if (!type) return "";
  if (type === "email" && !emailRegex.test(value)) return "Invalid email";
  if (type === "password" && !passwordRegex.test(value))
    return "Password should contain at least one digit, one lowercase letter, one uppercase letter, and be at least 6 characters long.";
  if (type === "username" && !usernameRegex.test(value))
    return "Invalid username";
  if (type === "phonenumber" && !phoneNumberRegex.test(value))
    return "Invalid phone number";
  if (type === "otp" && !otpRegex.test(value)) return "Invalid OTP";
  return "";
};

export const isValidBool = (value) =>
  value?.toString()?.trim() ? true : false;
