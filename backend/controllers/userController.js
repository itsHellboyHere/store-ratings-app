const prisma = require("../utils/prisma")
const { hashPassword, comparePassword, generateToken } = require("../utils/hash")
const changePassword = async (req, res) => {
    const userId = req.user.id
    const { newPassword } = req.body;

    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword) || newPassword.length < 8 || newPassword.length > 16)
        return res.status(400).json({ error: 'Password must be 8-16 chars, include uppercase & special char' });

    try {
        const hashed = await hashPassword(newPassword);
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashed,
                mustChangePassword: false,
            },
            select: {
                id: true,
                name: true,
                role: true,
                mustChangePassword: true,
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Password changed successfully", user: user })

    } catch (err) {
        console.log(err)
        res.status(401).json({ error: "Password change failed" })
    }
}
module.exports = {
    changePassword
}