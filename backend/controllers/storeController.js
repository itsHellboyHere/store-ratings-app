const { skip } = require("@prisma/client/runtime/library");
const prisma = require("../utils/prisma")

// get all stores
// serach with name or address
const getStores = async (req, res) => {
    const { search = "", page = 1, limit = 5 } = req.query;
    const pageSize = parseInt(limit);
    const pageNumber = parseInt(page);
    try {
        const [stores, totalCount] = await Promise.all([prisma.store.findMany({
            where: {
                OR: [
                    { name: { contains: search || "", mode: "insensitive" } },
                    { address: { contains: search || "", mode: "insensitive" } },
                ],

            },
            include: {
                ratings: true,
            },
            // if pageNo = 1 then first page will skip 0
            // as (1-1) = 0 * 5 = 0 
            //  in second (2-1) = 1* 5 = 5 skips .
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        }),
        prisma.store.count({
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { address: { contains: search, mode: "insensitive" } },
                ],
            },
        }),
        ]);
        const formatted = stores.map((store) => {
            const total = store.ratings.reduce((sum, r) => sum + r.score, 0);
            const average = store.ratings.length > 0 ? total / store.ratings.length : 0;

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                averageRating: average.toFixed(1)
            }
        });
        res.status(200).json({
            stores: formatted,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: pageNumber
        });

    } catch (err) {
        res.status(500).json({ error: "Failed to get Stores" })
    }
}
// Get details for a single store including user's rating 
const getStoreDetails = async (req, res) => {
    const storeId = Number(req.params.id);
    const userId = req.user?.id;

    try {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: {
                ratings: true,
                owner: true,
            },
        });

        if (!store) return res.status(404).json({ error: "Store not found" });

        const total = store.ratings.reduce((sum, r) => sum + r.score, 0);
        const averageRating = store.ratings.length > 0 ? total / store.ratings.length : 0;
        const userRating = store.ratings.find(r => r.userId === userId);
        const isAdmin = req.user?.role === 'ADMIN';
        const isOwner = req.user?.id === store.owner?.id;
        res.status(200).json({
            id: store.id,
            name: store.name,
            address: store.address,
            averageRating: averageRating.toFixed(1),
            userRating: userRating?.score || null,
            ownerEmail: isAdmin || isOwner ? store.owner?.email : null
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to get Store" })
    }

}

const rateStore = async (req, res) => {
    const userId = req.user.id;
    const storeId = Number(req.params.id);
    const { score } = req.body;

    if (score < 1 || score > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    try {
        const existingRating = await prisma.rating.findUnique({
            where: { userId_storeId: { userId, storeId } },
        });
        let rating;
        if (existingRating) {
            rating = await prisma.rating.update({
                where: { userId_storeId: { userId, storeId } },
                data: { score },
            });
        } else {
            rating = await prisma.rating.create({
                data: { userId, storeId, score },
            });
        }

        res.status(201).json({ message: "Rating submitted", rating });
    } catch (err) {
        res.status(500).json("Failed to rate store")
    }
}

const ownerDashBoardDetails = async (req, res) => {
    const ownerId = req.user.id;

    try {
        const stores = await prisma.store.findMany({
            where: { ownerId: ownerId },
            include: {
                ratings: {
                    include: { user: true },
                },
            },
        });

        if (!stores || stores.length === 0) return res.status(404).json({ error: "Store not found for this owner" });
        const result = stores.map((store) => {
            const total = store.ratings.reduce((sum, r) => sum + r.score, 0);
            const average = store.ratings.length > 0 ? total / store.ratings.length : 0;

            const ratings = store.ratings.map((r) => ({
                id: r.id,
                score: r.score,
                userName: r.user.name,
                userEmail: r.user.email,
            }));

            return {
                id: store.id,
                storeName: store.name,
                address: store.address,
                averageRating: average.toFixed(1),
                ratings,
            };
        });
        res.status(200)
            .json(result);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to load dashboard" });
    }
}

module.exports = {
    getStores,
    getStoreDetails,
    rateStore,
    ownerDashBoardDetails
}