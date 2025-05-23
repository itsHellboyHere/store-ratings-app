const prisma = require("../utils/prisma")
const { hashPassword } = require("../utils/hash")
const { sendCredentialsEmail } = require("../utils/mailer")

// create users based on the roles
// normal user-admin-owner store
const createUsers = async (req, res) => {
    const { name, email, password, address, role } = req.body
    if (!['ADMIN', 'OWNER', 'USER'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (existingUser) return res.status(400).json({ error: `Email id ${email} already exists ` })
    try {
        const hashed = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                address,
                role,
                mustChangePassword: true,
            },
        });
        // mail the login-credentials to the user
        await sendCredentialsEmail(email, email, password)
        res.status(201).json({
            message: `${role} created. Email sent.`,
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'User creation failed' });
    }

}
// create store and asign it to role-owner

const createStore = async (req, res) => {
    const { name, address, email: storeEmail, ownerEmail } = req.body;
    if (!name || !address || !storeEmail || !ownerEmail) {
        return res.status(400).json({ error: "Name, address, store email, and owner email are required" })
    }

    try {
        // find the owner using owner email
        const owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
        if (!owner || owner.role != "OWNER") return res.status(400).json({ error: "No owner found with this email" });

        // create the store 

        const store = await prisma.store.create({
            data: {
                name,
                address,
                email: storeEmail,
                ownerId: owner.id,
            },
        });

        res.status(201).json({ message: 'Store created successfully', store });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: " Failed to create store" })
    }
}


module.exports = {
    createUsers,
    createStore,

}