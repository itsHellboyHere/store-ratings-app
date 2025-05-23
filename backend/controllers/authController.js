const prisma = require("../utils/prisma")
const { hashPassword, comparePassword, generateToken } = require("../utils/hash")


const signUp = async (req, res) => {
    const { name, email, password, address } = req.body;

    if (!name || name.length < 5 || name.length > 60)
        return res.status(400).json({ error: 'Name must be between 5-60 characters' });

    if (!address || address.length > 400)
        return res.status(400).json({ error: 'Address must be under 400 characters' });

    if (!password || !/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password) || password.length < 8 || password.length > 16)
        return res.status(400).json({ error: 'Password must be 8-16 chars, include uppercase & special char' });

    if (!email)
        return res.status(400).json({ error: 'Email is required' });

    const existingUser = await prisma.user.findUnique({
        where: { email: email },
    });
    if (existingUser) return res.status(400).json({ error: `User with this ${email} email already exists` });

    try {
        const hashed = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                address,
                role: 'USER',
            }
        });
        res.status(201).json({ user: { id: user.id, role: user.role } });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: "Inavlid Input" })
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Please provide both email and password ' });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const isValid = await comparePassword(password, user.password)
        if (!isValid) return res.status(401).json({ error: "Invalid email or password" });

        const token = generateToken(user);

        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                mustChangePassword: user.mustChangePassword,
            },
            token
        });

    } catch (err) {
        res.status(400).json({ error: 'Login failed' })
    }
}

const logout = async (req, res) => {

    res.status(200).json({ message: 'Logout successful. Please clear token on client side.' });
};

module.exports = {
    signUp,
    signIn,
    logout
}