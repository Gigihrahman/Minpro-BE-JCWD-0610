import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.users.createMany({
    data: [
      {
        id: 1,
        email: "alice@prisma.io",
        fullName: "alice keren",
        password: "cekkk",
        phoneNumber: "08123456789",
        referalCode: "123456789",
        role: "ADMIN",
      },
      {
        id: 2,
        email: "yanto@mail.com",
        fullName: "yanto keren",
        password: "cekkk",
        phoneNumber: "08123456789",
        referalCode: "1234567123",
        role: "USER",
      },
      {
        id: 3,
        email: "kurniawan",
        fullName: "kurniawan keren",
        password: "cekkk",
        phoneNumber: "08123456789",
        referalCode: "123456789",
        role: "ORGANIZER",
      },
      {
        id: 4,
        email: "kurnianto",
        fullName: "kurnianto hebat",
        password: "cekkk",
        phoneNumber: "08123456789",
        referalCode: "123456789",
        role: "ORGANIZER",
      },
    ],
  });

  const organizer = await prisma.organizer.createMany({
    data: [
      {
        id: 1,
        userId: 3,
        name: "Pt. kurniawan hebat maju jaya",
        npwp: "1234asfas",
        phoneNumber: "085825858",
        profilePicture: "https://picsum.photos/200/300",
        accNumber: 123456125,
        bankName: "Bank BCA",
      },

      {
        id: 2,
        userId: 4,
        name: "Pt. kurnianto hebat maju jaya",
        npwp: "1234asfas",
        phoneNumber: "085825858",
        profilePicture: "https://picsum.photos/200/300",
        accNumber: 123456125,
        bankName: "Bank BCA",
      },
    ],
  });
  const location = await prisma.city.createMany({
    data: [
      {
        id: 1,
        name: "Jakarta",
      },
      {
        id: 2,
        name: "Bandung",
      },
      {
        id: 3,
        name: "Surabaya",
      },
      {
        id: 4,
        name: "Yogyakarta",
      },
      {
        id: 5,
        name: "Bali",
      },
      {
        id: 6,
        name: "Medan",
      },
      {
        id: 7,
        name: "Makassar",
      },
      {
        id: 8,
        name: "Palembang",
      },
      {
        id: 9,
        name: "Batam",
      },
      {
        id: 10,
        name: "Semarang",
      },
    ],
  });

  const categori = await prisma.categories.createMany({
    data: [
      {
        id: 1,
        name: "Music",
        description: "Music event incoming section",
      },
      {
        id: 2,
        name: "Sport",
        description: "Sport event incoming section",
      },
      {
        id: 3,
        name: "Art",
        description: "Art event incoming section",
      },
      {
        id: 4,
        name: "Festival",
        description: "Festival event incoming section",
      },
      {
        id: 5,
        name: "Exhibition",
        description: "Exhibition event incoming section",
      },
    ],
  });

  const event = await prisma.events.createMany({
    data: [
      {
        id: 1,
        name: "Music Festival",
        description: "Music Festival event",
        startEvent: new Date("2025-05-01"),
        endEvent: new Date("2023-10-02"),
        cityId: 1,
        organizerId: 1,
        categoryId: 1,
        image: "https://picsum.photos/200/300",
        locationDetail: "jalan raya no1",
        slug: "music-festival",
      },
      {
        id: 2,
        name: "Sport Festival",
        description: "Sport Festival event",
        startEvent: new Date("2025-05-01"),
        endEvent: new Date("2025-05-02"),
        cityId: 1,
        organizerId: 2,
        categoryId: 2,
        image: "https://picsum.photos/200/300",
        locationDetail: "jalan raya no1",
        slug: "sport-festival",
      },
      {
        id: 3,
        name: "Art Festival",
        description: "Art Festival event",
        startEvent: new Date("2025-05-01"),
        endEvent: new Date("2025-05-02"),
        cityId: 1,
        organizerId: 1,
        categoryId: 3,
        image: "https://picsum.photos/200/300",
        locationDetail: "jalan raya no1",
        slug: "art-festival",
      },
      {
        id: 4,
        name: "Festival Festival",
        description: "Festival Festival event",
        startEvent: new Date("2025-05-01"),
        endEvent: new Date("2025-05-02"),
        cityId: 1,
        organizerId: 2,
        categoryId: 4,
        image: "https://picsum.photos/200/300",
        locationDetail: "jalan raya no1",
        slug: "festival-festival",
      },
      {
        id: 5,
        name: "Exhibition Festival",
        description: "Exhibition Festival event",
        startEvent: new Date("2025-05-01"),
        endEvent: new Date("2025-05-02"),
        cityId: 1,
        organizerId: 1,
        categoryId: 5,
        image: "https://picsum.photos/200/300",
        locationDetail: "jalan raya no1",
        slug: "exhibition-festival",
      },
    ],
  });
  const seat = await prisma.seats.createMany({
    data: [
      {
        id: 1,
        eventId: 1,
        name: "VIP",
        totalSeat: 100,
        price: 1000000,
        description: "VIP seat",
      },
      {
        id: 2,
        eventId: 1,
        name: "Regular",
        totalSeat: 200,
        price: 500000,
        description: "Regular seat",
      },
      {
        id: 3,
        eventId: 2,
        name: "VIP",
        totalSeat: 100,
        price: 1000000,
        description: "VIP seat",
      },
      {
        id: 4,
        eventId: 2,
        name: "Regular",
        totalSeat: 200,
        price: 500000,
        description: "Regular seat",
      },
    ],
  });

  const coupon = await prisma.coupons.createMany({
    data: [],
  });

  const vouchers = await prisma.vouchers.createMany({ data: [] });
  const referrals = await prisma.referrals.createMany({ data: [] });

  const points = await prisma.points.createMany({
    data: [],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
