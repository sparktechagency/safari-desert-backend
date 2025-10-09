import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().min(1, { message: 'Email is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

const passwordSchema = z
  .string() // must be a string; non-strings will be rejected by Zod
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be at most 128 characters" })
  .refine((v) => v.trim() === v, {
    message: "Password cannot start or end with spaces",
  })
  .refine((v) => /[a-z]/.test(v), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((v) => /[A-Z]/.test(v), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((v) => /[^A-Za-z0-9]/.test(v), {
    message: "Password must contain at least one special character",
  });

export const registerUserValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, { message: "Name is required" }),

      email: z
        .string()
        .trim()
        .email("Invalid email address"),

      password:passwordSchema
    })
    .strict(),
}).strict();


export const editProfileSchema = z.object({
  body:z.object({
    name: z.string().min(1, "Name is required").optional(),
    
  })
});

const forgotPasswordSchema = z.object({
      body: z.object({ email: z.string().email("Invalid email address"),})
 
});

export const verifyOtpSchema = z.object({ 
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string()
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only digits"),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({

    oldPassword: z.string().min(1, { message: 'Old password is required' }),
    newPassword: z.string().min(1, { message: 'New password is required' }),
  }),
});
const resetPasswordValidationSchema = z.object({
  body: z.object({
        email: z.string().email("Invalid email address"),
    newPassword: z.string().min(1, { message: 'New password is required' }),
  }).strict(),
})

const refreshTokenValidationSchema = z.object({
  cookie: z.object({
    refreshToken: z.string().min(1, { message: 'Refresh token is required!' }),
  }),
});




export const AuthValidation = {
  loginValidationSchema,
  registerUserValidationSchema,
  editProfileSchema,forgotPasswordSchema,verifyOtpSchema,changePasswordValidationSchema,resetPasswordValidationSchema,refreshTokenValidationSchema

  
};
