import { prisma } from "../src/index.js";

const categories = [
  { slug: "science", name: "Science" },
  { slug: "community", name: "Community" },
  { slug: "environment", name: "Environment" },
];

const articles = [
  {
    slug: "coral-reef-recovery",
    title: "Coral reef shows record recovery after restoration project",
    summary: "Volunteers replanted over 10,000 coral fragments, and most are thriving.",
    body: "A community-led restoration effort has helped a damaged reef bounce back faster than scientists expected.",
    category: "environment",
  },
  {
    slug: "library-free-meals",
    title: "Local library starts serving free lunches to kids all summer",
    summary: "The program fed more than 2,000 children in its first month.",
    body: "Librarians partnered with nearby restaurants to make sure no child goes hungry while school is out.",
    category: "community",
  },
  {
    slug: "new-malaria-vaccine",
    title: "New malaria vaccine rolls out to millions of children",
    summary: "Early results point to a sharp drop in severe cases.",
    body: "Health workers say the rollout is one of the fastest vaccine campaigns they have seen.",
    category: "science",
  },
];

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
  }
  for (const { category, ...a } of articles) {
    const data = { ...a, category: { connect: { slug: category } } };
    await prisma.article.upsert({ where: { slug: a.slug }, update: data, create: data });
  }
  console.log(`Seeded ${categories.length} categories and ${articles.length} articles`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
