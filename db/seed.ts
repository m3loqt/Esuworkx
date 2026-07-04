process.loadEnvFile();

async function seed() {
  const { db } = await import("./index");
  const { products, works } = await import("./schema");
  const { mockProducts, mockWorks } = await import("../lib/mock-data");

  for (const product of mockProducts) {
    await db
      .insert(products)
      .values({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: product.images,
        specifications: product.specifications,
        status: product.status,
        stockCount: product.stockCount,
      })
      .onConflictDoNothing({ target: products.slug });
  }

  for (const work of mockWorks) {
    await db
      .insert(works)
      .values({
        title: work.title,
        slug: work.slug,
        description: work.description,
        images: work.images,
      })
      .onConflictDoNothing({ target: works.slug });
  }

  console.log(`Seeded ${mockProducts.length} products and ${mockWorks.length} works.`);
}

seed().then(() => process.exit(0));
