const prisma = require("../utils/prisma")

// ○ Total number of users
// ○ Total number of stores
// ○ Total number of submitted ratings

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalStores = await prisma.store.count();
        const totalRatings = await prisma.rating.count();

        res.status(200).json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
}

// Can view a list of stores with the following details:
// ○ Name, Email, Address, Rating
const getAllStores = async (req, res) => {
    try {
        const stores = await prisma.store.findMany({
            include: {
                ratings: true,
            },
        });

        const storeData = stores.map((store) => {
            const totalRatings = store.ratings.length;
            const avgRating = totalRatings === 0
                ? 0
                : store.ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings;

            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                avgRating: avgRating.toFixed(2),
            };
        })
        res.status(200).json(storeData);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fecth stores" })
    }
}
// ● Can view a list of normal and admin users with:
// ○ Name, Email, Address, Role
// ● Can apply filters on all listings based on Name, Email, Address, and Role.
const getAllUsers = async (req, res) => {
    const { name, email, address, role } = req.query;
    try {
        const users = await prisma.user.findMany({
            where: {
                name: { contains: name, mode: "insensitive" },
                email: { contains: email, mode: 'insensitive' },
                address: { contains: address, mode: "insensitive" },
                role: role || undefined,
            },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json(users);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch users" })
    }
}
//  get a single user details

const getUserDetails = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                stores: {
                    include: {
                        ratings: true,
                    },
                },
            },
        });
        if (!user) return res.status(404).json({ error: 'User not found' })

        let avgStoreRating = null;
        if (user.role === 'OWNER' && user.stores.length > 0) {
            const allRatings = user.stores.flatMap((store) => store.ratings);
            const totalRatings = allRatings.length
            // reduce take an accumulator
            // callback function and a initialValue 
            // if not provided uses the array first ele.
            avgStoreRating = totalRatings === 0
                ? 0
                : (
                    allRatings.reduce((sum, r) => sum + r.score, 0) / totalRatings
                ).toFixed(2)
        }
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
            avgStoreRating,
            totalStores: user.role === 'OWNER' ? user.stores.length : undefined,
        });

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch details" })
    }
}
module.exports = {
    getDashboardStats,
    getAllStores,
    getAllUsers,
    getUserDetails,
}