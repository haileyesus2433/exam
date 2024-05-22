import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Create channels
    const channels = await prisma.channel.createMany({
      data: [
        { name: "HBO" },
        { name: "ABC TV" },
        { name: "NBC TV" },
        { name: "AMC TV" },
        { name: "Disney" },
        { name: "FOX" },
      ],
    });

    // Create types
    const types = await prisma.type.createMany({
      data: [
        { name: "Live TV" },
        { name: "Movies" },
        { name: "TV Shows" },
        { name: "Sports" },
      ],
    });

    // Create categories
    const categories = await prisma.category.createMany({
      data: [
        { name: "Recommended" },
        { name: "Popular" },
        { name: "Featured" },
        { name: "Favorites" },
        { name: "Watch Later" },
      ],
    });

    // Create video
    const video = await prisma.video.create({
      data: {
        title: "Interstellar",
        duration: 10140000,
        description:
          "Interstellar is a 2014 epic science fiction film co-written, directed, and produced by Christopher Nolan. It stars Matthew McConaughey, Anne Hathaway, Jessica Chastain, Bill Irwin, Ellen Burstyn, Matt Damon, and Michael Caine.",
        channelId: 1,
        typeId: 2,
        categoryId: 2,
        videoUrl: "https://youtu.be/zSWdZVtXT7E",
      },
    });

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export { seedData };
