import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { BlogPost } from './blog-posts/entities/blog-post.entity';
import { Drop, DropStatus } from './drops/entities/drop.entity';
import { Review } from './reviews/entities/review.entity';
import { Build } from './builds/entities/build.entity';

dotenv.config();

const IMG = {
  rtx5090: 'https://www.figma.com/api/mcp/asset/8562bb3e-49ba-4d02-99c9-a8d89d6759da',
  gamingMouse: 'https://www.figma.com/api/mcp/asset/acd2b80a-5bdf-4ddd-9dcd-e6f70f6c1d3c',
  catGamingPCs: 'https://www.figma.com/api/mcp/asset/2d4d0bd5-e6f8-4a91-8910-f75f2a7f86b7',
  catComponents: 'https://www.figma.com/api/mcp/asset/fbdc9a5e-9c1b-4f3c-ad16-19eb18b34e3d',
  catPeripherals: 'https://www.figma.com/api/mcp/asset/bc6701dd-077c-47eb-b4a3-16bb4bbaa8ed',
};

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'krypta',
  entities: [Category, Product, BlogPost, Drop, Review, Build],
  synchronize: true,
});

async function seed() {
  await ds.initialize();
  console.log('Connected to database');

  // Clear in safe order (children before parents)
  await ds.query('TRUNCATE TABLE reviews, builds, products, blog_posts, drops, categories RESTART IDENTITY CASCADE');
  console.log('Cleared existing data');

  // ── Categories ──────────────────────────────────────────────────────
  const catRepo = ds.getRepository(Category);
  const cats = await catRepo.save([
    { slug: 'gpus', label: 'GPUs' },
    { slug: 'cpus', label: 'CPUs' },
    { slug: 'ram', label: 'RAM' },
    { slug: 'storage', label: 'Storage' },
    { slug: 'motherboards', label: 'Boards' },
    { slug: 'power', label: 'Power' },
    { slug: 'cooling', label: 'Cooling' },
    { slug: 'cases', label: 'Cases' },
  ]);
  console.log(`  ✓ ${cats.length} categories`);

  // ── Products ─────────────────────────────────────────────────────────
  const prodRepo = ds.getRepository(Product);
  const products = await prodRepo.save([
    { slug: 'rtx-5090', name: 'NVIDIA GeForce RTX 5090', brand: 'NVIDIA', price: 1999, oldPrice: 2199, img: IMG.rtx5090, badge: 'NEW', specs: ['32GB GDDR7', 'PCIe 5.0', '575W TDP'], categorySlug: 'gpus' },
    { slug: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090', brand: 'NVIDIA', price: 1499, oldPrice: null, img: IMG.rtx5090, badge: null, specs: ['24GB GDDR6X', 'PCIe 4.0', '450W TDP'], categorySlug: 'gpus' },
    { slug: 'rtx-4080-super', name: 'NVIDIA GeForce RTX 4080 Super', brand: 'NVIDIA', price: 999, oldPrice: 1099, img: IMG.rtx5090, badge: 'SALE', specs: ['16GB GDDR6X', 'PCIe 4.0', '320W TDP'], categorySlug: 'gpus' },
    { slug: 'rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', price: 899, oldPrice: null, img: IMG.rtx5090, badge: null, specs: ['24GB GDDR6', 'PCIe 4.0', '355W TDP'], categorySlug: 'gpus' },
    { slug: 'rtx-4070-ti', name: 'NVIDIA GeForce RTX 4070 Ti', brand: 'NVIDIA', price: 749, oldPrice: 799, img: IMG.rtx5090, badge: null, specs: ['12GB GDDR6X', 'PCIe 4.0', '285W TDP'], categorySlug: 'gpus' },
    { slug: 'rx-7800-xt', name: 'AMD Radeon RX 7800 XT', brand: 'AMD', price: 499, oldPrice: null, img: IMG.rtx5090, badge: null, specs: ['16GB GDDR6', 'PCIe 4.0', '263W TDP'], categorySlug: 'gpus' },
    { slug: 'rtx-4060-ti', name: 'NVIDIA GeForce RTX 4060 Ti', brand: 'NVIDIA', price: 399, oldPrice: 429, img: IMG.rtx5090, badge: 'SALE', specs: ['8GB GDDR6', 'PCIe 4.0', '165W TDP'], categorySlug: 'gpus' },
    { slug: 'arc-a770', name: 'Intel Arc A770', brand: 'Intel', price: 299, oldPrice: null, img: IMG.rtx5090, badge: null, specs: ['16GB GDDR6', 'PCIe 4.0', '225W TDP'], categorySlug: 'gpus' },
  ]);
  console.log(`  ✓ ${products.length} products`);

  // ── Blog Posts ───────────────────────────────────────────────────────
  const blogRepo = ds.getRepository(BlogPost);
  const posts = await blogRepo.save([
    { slug: 'rtx-5090-review', title: 'NVIDIA RTX 5090 Review: The Ultimate 4K Gaming GPU', excerpt: "We put NVIDIA's flagship RTX 5090 through its paces in the latest AAA titles and benchmarks.", category: 'Reviews', readTime: '8 min read', img: IMG.rtx5090 },
    { slug: 'best-gaming-pc-builds-2026', title: 'Best Gaming PC Builds in Tunisia for 2026', excerpt: 'Our expert team curates the best value-for-money gaming PC configurations across all budget ranges.', category: 'Guides', readTime: '12 min read', img: IMG.catGamingPCs },
    { slug: 'ddr5-vs-ddr4-gaming', title: 'DDR5 vs DDR4: Does It Matter for Gaming in 2026?', excerpt: 'We test 20+ games to see if upgrading to DDR5 RAM actually improves your gaming experience.', category: 'Guides', readTime: '6 min read', img: IMG.catComponents },
    { slug: 'pc-building-beginners-guide', title: 'The Complete PC Building Guide for Beginners in Tunisia', excerpt: 'Everything you need to know about building your first gaming PC, from choosing parts to final assembly.', category: 'Tutorials', readTime: '15 min read', img: IMG.catComponents },
    { slug: 'best-gaming-peripherals-2026', title: 'Best Gaming Peripherals for 2026: Mice, Keyboards & Headsets', excerpt: 'Level up your gaming setup with our curated selection of the best peripherals available in Tunisia.', category: 'Reviews', readTime: '10 min read', img: IMG.catPeripherals },
    { slug: 'krypta-rtx-5090-build', title: 'Inside the KRYPTA RTX 5090 Flagship Build', excerpt: 'A deep dive into how we assemble our most powerful custom PC build, part by part.', category: 'Behind the Build', readTime: '9 min read', img: IMG.rtx5090 },
  ]);
  console.log(`  ✓ ${posts.length} blog posts`);

  // ── Drops ────────────────────────────────────────────────────────────
  const dropRepo = ds.getRepository(Drop);
  const now = new Date();
  const drops = await dropRepo.save([
    {
      id: 'krypta-collector-mouse',
      title: 'KRYPTA x Pro-Gamer Collector Edition Mouse',
      description: 'Limited to 500 units worldwide. Handcrafted design, ultra-lightweight at 58g.',
      price: 249,
      available: 47,
      total: 500,
      img: IMG.gamingMouse,
      status: DropStatus.LIVE,
      endsAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    },
    {
      id: 'krypta-rtx-bundle',
      title: "KRYPTA RTX 5090 Founder's Edition Bundle",
      description: 'Exclusive bundle: RTX 5090 FE + custom KRYPTA branded case + mouse pad.',
      price: 2499,
      available: 12,
      total: 50,
      img: IMG.rtx5090,
      status: DropStatus.LIVE,
      endsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    },
    {
      id: 'krypta-merch-hoodie',
      title: 'KRYPTA Premium Gaming Hoodie — Stealth Black',
      description: 'Premium quality, limited edition KRYPTA branded hoodie. Available in S to 3XL.',
      price: 89,
      available: 0,
      total: 200,
      img: IMG.catGamingPCs,
      status: DropStatus.SOLD_OUT,
      endsAt: null,
    },
    {
      id: 'krypta-keyboard-drop',
      title: 'KRYPTA x Artisan Mechanical Keyboard',
      description: 'Custom colorway, hotswap switches, premium PBT keycaps. 75% layout.',
      price: 329,
      available: 0,
      total: 150,
      img: IMG.catPeripherals,
      status: DropStatus.UPCOMING,
      endsAt: null,
    },
  ]);
  console.log(`  ✓ ${drops.length} drops`);

  // ── Reviews ──────────────────────────────────────────────────────────
  const rtx5090 = products.find((p) => p.slug === 'rtx-5090')!;
  const reviewRepo = ds.getRepository(Review);
  const reviews = await reviewRepo.save([
    { author: 'Ahmed B.', rating: 5, body: 'Incredible card, runs everything at 4K ultra settings. Worth every dinar.', productId: rtx5090.id },
    { author: 'Sami K.', rating: 5, body: 'Fast delivery from Krypta, card was perfectly packaged. Performance is insane.', productId: rtx5090.id },
    { author: 'Rami L.', rating: 4, body: 'Excellent GPU, temps are great with proper airflow. Highly recommend.', productId: rtx5090.id },
  ]);
  console.log(`  ✓ ${reviews.length} reviews`);

  await ds.destroy();
  console.log('\n✅ Seed complete');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
