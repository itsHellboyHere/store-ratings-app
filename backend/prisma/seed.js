const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin1@gmail.com";

    const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (exists) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    await prisma.user.create({
        data: {
            name: "System Administrator",
            email: adminEmail,
            password: hashedPassword,
            address: "Admin Address",
            role: "ADMIN",
        },
    });

    console.log("✅ Admin created");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
