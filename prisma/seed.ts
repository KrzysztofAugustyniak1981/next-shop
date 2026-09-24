import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });



async function main() {
    console.log("Seed start...");

    await prisma.brand.createMany({
        data: [
            { name: "ROG" },
            { name: "Logitech" },
            { name: "JBL" },
            { name: "AOC" },
            { name: "Razer" },
            { name: "Rexus" },
            { name: "Sony" },
        ],
        skipDuplicates: true,
    });

    await prisma.category.createMany({
        data: [
            { name: "Mouse" },
            { name: "Monitor" },
            { name: "Headphone" },
            { name: "Keyboard" },
            { name: "Webcam" },
        ],
        skipDuplicates: true,
    });
    const mouse = await prisma.category.findUnique({
        where: { name: "Mouse" },
    });

    const monitor = await prisma.category.findUnique({
        where: { name: "Monitor" },
    });

    const headphone = await prisma.category.findUnique({
        where: { name: "Headphone" },
    });

    const keyboard = await prisma.category.findUnique({
        where: { name: "Keyboard" },
    });

    const webcam = await prisma.category.findUnique({
        where: { name: "Webcam" },
    });

    const rog = await prisma.brand.findUnique({
        where: { name: "ROG" },
    });

    const logitech = await prisma.brand.findUnique({
        where: { name: "Logitech" },
    });

    const jbl = await prisma.brand.findUnique({
        where: { name: "JBL" },
    });

    const aoc = await prisma.brand.findUnique({
        where: { name: "AOC" },
    });

    const razer = await prisma.brand.findUnique({
        where: { name: "Razer" },
    });

    const rexus = await prisma.brand.findUnique({
        where: { name: "Rexus" },
    });

    const sony = await prisma.brand.findUnique({
        where: { name: "Sony" },
    });

    if (
        !mouse ||
        !monitor ||
        !headphone ||
        !keyboard ||
        !webcam ||
        !rog ||
        !logitech ||
        !jbl ||
        !aoc ||
        !razer ||
        !rexus ||
        !sony
    ) {
        throw new Error("Required category or brand not found");
    }

    const products = [
        {
            name: "Rexus Xierra X16",
            description: "Gaming mouse",
            price: 25.99,
            stock: 20,
            imageUrl: "https://i.ibb.co/QFZX63yJ/product-mouse.png",
            categoryId: mouse.id,
            brandId: rexus.id,
        },
        {
            name: "Logitech G502 Hero",
            description: "Gaming mouse",
            price: 34.99,
            oldPrice: 54.99,
            stock: 15,
            imageUrl: "https://i.ibb.co/QFZX63yJ/product-mouse.png",
            categoryId: mouse.id,
            brandId: logitech.id,
        },
        {
            name: "Razer DeathAdder Essential",
            description: "Ergonomic gaming mouse",
            price: 29.99,
            stock: 14,
            imageUrl: "https://i.ibb.co/0p4sQMrk/Razer-Death-Adder-Essential.jpg",
            categoryId: mouse.id,
            brandId: razer.id,
        },
        {
            name: "Logitech G305 Lightspeed",
            description: "Wireless gaming mouse",
            price: 39.99,
            stock: 11,
            imageUrl: "https://i.ibb.co/2028xP4v/Logitech-G305-Lightspeed.jpg",
            categoryId: mouse.id,
            brandId: logitech.id,
        },
        {
            name: "ROG Gladius III",
            description: "Gaming mouse with ergonomic design",
            price: 69.99,
            stock: 9,
            imageUrl: "https://i.ibb.co/b5Dd9rt5/ROG-Gladius-III.jpg",
            categoryId: mouse.id,
            brandId: rog.id,
        },
        {
            name: "Sony WH-CH510",
            description: "Wireless headphones",
            price: 59.99,
            stock: 18,
            imageUrl: "https://i.ibb.co/Fq6GRB4n/Sony-WH-CH510.png",
            categoryId: headphone.id,
            brandId: sony.id,
        },
        {
            name: "JBL Tune 500",
            description: "Lightweight on-ear headphones",
            price: 29.95,
            stock: 20,
            imageUrl: "https://i.ibb.co/9mNhc34H/JBL-Tune500.png",
            categoryId: headphone.id,
            brandId: jbl.id,
        },
        {
            name: "JBL Tune 510BT",
            description: "Wireless Bluetooth headphones",
            price: 49.99,
            stock: 15,
            imageUrl: "https://i.ibb.co/RT7smNfb/JBL-Tune-510-BT.jpg",
            categoryId: headphone.id,
            brandId: jbl.id,
        },
        {
            name: "Sony WH-CH720N",
            description: "Wireless noise cancelling headphones",
            price: 129.99,
            stock: 9,
            imageUrl: "https://i.ibb.co/hx5N3yrT/Sony-WH-CH720-N.jpg",
            categoryId: headphone.id,
            brandId: sony.id,
        },
        {
            name: "Razer BlackShark V2",
            description: "Gaming headset with surround sound",
            price: 79.99,
            stock: 11,
            imageUrl: "https://i.ibb.co/x88XKv4X/Razer-Black-Shark-V2.jpg",
            categoryId: headphone.id,
            brandId: razer.id,
        },
        {
            name: "AOC 24G2E",
            description: "Gaming monitor",
            price: 209.99,
            stock: 8,
            imageUrl: "https://i.ibb.co/PzJKcy8c/AOC-24-G2-E.png",
            categoryId: monitor.id,
            brandId: aoc.id,
        },
        {
            name: "ROG Swift PG259QN",
            description: "High refresh rate gaming monitor",
            price: 299.99,
            stock: 7,
            imageUrl: "https://i.ibb.co/B2NH5rN4/ROG-Swift-PG259-QN.png",
            categoryId: monitor.id,
            brandId: rog.id,
        },
        {
            name: "AOC C24G2U",
            description: "Curved gaming monitor",
            price: 189.99,
            stock: 10,
            imageUrl: "https://i.ibb.co/jkMGtm9n/AOC-C24-G2-U.jpg",
            categoryId: monitor.id,
            brandId: aoc.id,
        },
        {
            name: "AOC Q27G2S",
            description: "27-inch QHD gaming monitor",
            price: 279.99,
            stock: 6,
            imageUrl: "https://i.ibb.co/Xr6tZQ75/AOC-Q27-G2-S.jpg",
            categoryId: monitor.id,
            brandId: aoc.id,
        },
        {
            name: "ROG Strix XG27AQ",
            description: "27-inch gaming monitor",
            price: 399.99,
            stock: 5,
            imageUrl: "https://i.ibb.co/n8KPcGDv/ROG-Strix-XG27-AQ.jpg",
            categoryId: monitor.id,
            brandId: rog.id,
        },
        {
            name: "Razer Huntsman Elite",
            description: "Gaming keyboard",
            price: 106.83,
            stock: 12,
            imageUrl: "https://i.ibb.co/7Nthq0yr/Razer-Huntsman-Elite.png",
            categoryId: keyboard.id,
            brandId: razer.id,
        },
        {
            name: "Logitech G213 Prodigy",
            description: "Gaming keyboard with RGB lighting",
            price: 49.99,
            stock: 14,
            imageUrl: "https://i.ibb.co/hRrR1bZw/Logitech-G213-Prodigy.jpg",
            categoryId: keyboard.id,
            brandId: logitech.id,
        },
        {
            name: "Razer BlackWidow V3",
            description: "Mechanical gaming keyboard",
            price: 99.99,
            stock: 10,
            imageUrl: "https://i.ibb.co/7JfLtdX4/Razer-Black-Widow-V3.jpg",
            categoryId: keyboard.id,
            brandId: razer.id,
        },
        {
            name: "ROG Strix Scope RX",
            description: "Optical mechanical gaming keyboard",
            price: 129.99,
            stock: 8,
            imageUrl: "https://i.ibb.co/W4SNw0Pg/ROG-Strix-Scope-RX.jpg",
            categoryId: keyboard.id,
            brandId: rog.id,
        },
        {
            name: "Rexus Legionare MX5",
            description: "Mechanical RGB gaming keyboard",
            price: 59.99,
            stock: 12,
            imageUrl: "https://i.ibb.co/5PzFQn9/Rexus-Legionare-MX5.jpg",
            categoryId: keyboard.id,
            brandId: rexus.id,
        },
        {
            name: "Logitech C920 HD Pro",
            description: "Full HD webcam for video calls and streaming",
            price: 79.99,
            stock: 12,
            imageUrl: "https://i.ibb.co/Dfp1dmBG/Logitech-C920-HD-Pro.jpg",
            categoryId: webcam.id,
            brandId: logitech.id,
        },
        {
            name: "Logitech C922 Pro Stream",
            description: "Full HD streaming webcam",
            price: 99.99,
            stock: 9,
            imageUrl: "https://i.ibb.co/wFQWWjBj/Logitech-C922-Pro-Stream.jpg",
            categoryId: webcam.id,
            brandId: logitech.id,
        },
        {
            name: "Razer Kiyo",
            description: "Streaming webcam with built-in ring light",
            price: 89.99,
            stock: 8,
            imageUrl: "https://i.ibb.co/BV3wC2g5/Razer-Kiyo.jpg",
            categoryId: webcam.id,
            brandId: razer.id,
        },
        {
            name: "Razer Kiyo Pro",
            description: "Full HD USB webcam for streaming",
            price: 149.99,
            stock: 6,
            imageUrl: "https://i.ibb.co/5XzHFs3r/Razer-Kiyo-Pro.jpg",
            categoryId: webcam.id,
            brandId: razer.id,
        },
        {
            name: "ROG Eye S",
            description: "Full HD webcam with AI noise cancellation",
            price: 109.99,
            stock: 7,
            imageUrl: "https://i.ibb.co/MbSrH9S/ROG-Eye-S.jpg",
            categoryId: webcam.id,
            brandId: rog.id,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: {
                name: product.name,
            },
            update: product,
            create: product,
        });
    }

    const passwordHash = await bcrypt.hash("test123", 12);

    await prisma.user.upsert({
        where: {
            email: "test@example.com",
        },
        update: {
            passwordHash: passwordHash,
        },
        create: {
            firstName: "Test",
            email: "test@example.com",
            passwordHash: passwordHash,
            address: "Gorzów Wielkopolski",
        },
    });

    console.log("Seed completed.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });