import jwt from "jsonwebtoken";

export const generateAuthToken = (user: any) => {
    const data = {
        email: user.email,
        userId: user._id,
    }

    const token = jwt.sign(data, process.env.TOKEN_SECRET_KEY || '', { expiresIn: '15 days' });

    return token;
}

export const setAuthTokenNull = () => {
    const token = jwt.sign({}, process.env.TOKEN_SECRET_KEY || '', { expiresIn: 0 });
    return token;
}

export const checkAuth = (token: string): boolean => {
    try {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY || ' ');
        return true
    }
    catch (error) {
        console.log(error);
        return false
    }

}