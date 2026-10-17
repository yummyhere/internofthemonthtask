from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings
from decimal import Decimal
import os

from apps.catalog.models import Category, Product
from apps.accounts.models import CustomerProfile

class Command(BaseCommand):
    help = 'Seeds database with realistic Vegist organic grocery categories and products'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing products and categories before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write("Clearing existing catalog data...")
            Product.objects.all().delete()
            Category.objects.all().delete()

        # 1. Superuser Creation
        admin_user = os.environ.get('SUPERUSER_USERNAME', 'admin')
        admin_email = os.environ.get('SUPERUSER_EMAIL', 'admin@vegist.com')
        admin_pass = os.environ.get('SUPERUSER_PASSWORD', 'AdminPass2026!')

        if not User.objects.filter(username=admin_user).exists():
            u = User.objects.create_superuser(
                username=admin_user,
                email=admin_email,
                password=admin_pass
            )
            self.stdout.write(self.style.SUCCESS(f"Superuser '{admin_user}' created successfully."))
        else:
            self.stdout.write(f"Superuser '{admin_user}' already exists.")

        # 2. Demo Customer Creation
        if not User.objects.filter(username='customer').exists():
            demo_cust = User.objects.create_user(
                username='customer',
                email='customer@vegist.com',
                first_name='Ayesha',
                last_name='Khan',
                password='CustomerPass2026!'
            )
            profile, _ = CustomerProfile.objects.get_or_create(user=demo_cust)
            profile.phone = '+92 300 8765432'
            profile.address = 'House 42-B, Sector Z, Phase 6, DHA'
            profile.city = 'Lahore'
            profile.postal_code = '54792'
            profile.save()
            self.stdout.write(self.style.SUCCESS("Demo customer 'customer@vegist.com' created."))

        # 3. Categories
        categories_data = [
            {
                'name': 'Fresh Vegetables',
                'slug': 'vegetables',
                'description': 'Crisp, pesticide-free greens and root vegetables harvested daily from partner organic farms.',
                'icon_name': 'carrot',
                'image_url': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
                'is_featured': True
            },
            {
                'name': 'Organic Fruits',
                'slug': 'fruits',
                'description': 'Naturally sun-ripened orchard fruits bursting with natural sweetness and essential antioxidants.',
                'icon_name': 'apple',
                'image_url': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
                'is_featured': True
            },
            {
                'name': 'Dairy & Free-Range Eggs',
                'slug': 'dairy-eggs',
                'description': 'Pure grass-fed cow and buffalo milk, free-range desi eggs, and traditional hand-churned butter.',
                'icon_name': 'milk',
                'image_url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
                'is_featured': True
            },
            {
                'name': 'Cold-Pressed Juices',
                'slug': 'juices',
                'description': 'Raw, unpasteurized juices pressed fresh with zero added refined sugars or chemical preservatives.',
                'icon_name': 'cup-soda',
                'image_url': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
                'is_featured': True
            },
            {
                'name': 'Bakery & Whole Grains',
                'slug': 'bakery-grains',
                'description': 'Wild yeast artisan sourdough, organic stone-ground whole wheat, and nutrient-dense oats.',
                'icon_name': 'wheat',
                'image_url': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
                'is_featured': True
            },
            {
                'name': 'Pantry & Organic Oils',
                'slug': 'pantry',
                'description': 'Cold-pressed mustard & extra virgin olive oils, pure raw Sidr honey, and natural Himalayan rock salt.',
                'icon_name': 'jar',
                'image_url': 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80',
                'is_featured': True
            },
        ]

        category_objs = {}
        for cat_data in categories_data:
            cat, created = Category.objects.update_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            category_objs[cat.slug] = cat

        self.stdout.write(self.style.SUCCESS(f"Processed {len(category_objs)} categories."))

        # 4. Products
        products_data = [
            # Fresh Vegetables
            {
                'category': category_objs['vegetables'],
                'name': 'Crisp Organic Baby Spinach',
                'slug': 'organic-baby-spinach',
                'description': 'Tender, nutrient-rich spinach leaves washed and hand-packed. Perfect for wholesome salads, sautéing, or fresh green smoothies.',
                'regular_price': Decimal('160.00'),
                'discounted_price': Decimal('135.00'),
                'unit': '500 g bunch',
                'stock_quantity': 45,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80',
                'origin': 'Chak 42 Organic Farm, Sheikhupura',
                'rating': Decimal('4.95'),
                'reviews_count': 38,
                'nutritional_highlights': 'Iron 15% DV, Vitamin A 140% DV, Calcium 10% DV per 100g serving.'
            },
            {
                'category': category_objs['vegetables'],
                'name': 'Vine-Ripened Organic Tomatoes',
                'slug': 'vine-ripened-tomatoes',
                'description': 'Juicy, deep red heirloom tomatoes left on the vine until peak ripeness for rich, authentic culinary flavor.',
                'regular_price': Decimal('220.00'),
                'discounted_price': Decimal('185.00'),
                'unit': '1 kg pack',
                'stock_quantity': 60,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80',
                'origin': 'Potohar Highlands Organic Farm',
                'rating': Decimal('4.88'),
                'reviews_count': 42,
                'nutritional_highlights': 'High in lycopene, Vitamin C, potassium, and natural folate.'
            },
            {
                'category': category_objs['vegetables'],
                'name': 'Sweet Rainbow Organic Carrots',
                'slug': 'organic-rainbow-carrots',
                'description': 'Crunchy, soil-grown carrots rich in natural beta-carotene. Washed gently to preserve earthy taste and natural nutrients.',
                'regular_price': Decimal('140.00'),
                'discounted_price': None,
                'unit': '1 kg pack',
                'stock_quantity': 35,
                'is_organic': True,
                'is_featured': False,
                'image_url': 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=700&q=80',
                'origin': 'Faisalabad Agro Research Cluster',
                'rating': Decimal('4.90'),
                'reviews_count': 19,
                'nutritional_highlights': 'Beta-carotene powerhouse with dietary fiber and Vitamin K1.'
            },
            {
                'category': category_objs['vegetables'],
                'name': 'Fresh Crown Broccoli',
                'slug': 'fresh-crown-broccoli',
                'description': 'Dense, vibrant green florets cut the morning of delivery. Rich in sulforaphane, essential antioxidants, and fiber.',
                'regular_price': Decimal('340.00'),
                'discounted_price': Decimal('290.00'),
                'unit': '500 g head',
                'stock_quantity': 25,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=700&q=80',
                'origin': 'Abbottabad Green Valleys',
                'rating': Decimal('4.92'),
                'reviews_count': 27,
                'nutritional_highlights': 'Provides 135% of daily Vitamin C and 116% Vitamin K per 100g.'
            },

            # Organic Fruits
            {
                'category': category_objs['fruits'],
                'name': 'Crisp Honeycrisp Apples',
                'slug': 'swat-honeycrisp-apples',
                'description': 'Hand-picked from pesticide-free Swat mountain orchards. Exceptionally crisp texture with a balanced, sweet-tart balance.',
                'regular_price': Decimal('420.00'),
                'discounted_price': Decimal('360.00'),
                'unit': '1 kg pack',
                'stock_quantity': 50,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80',
                'origin': 'Swat Valley Alpine Orchards',
                'rating': Decimal('4.97'),
                'reviews_count': 64,
                'nutritional_highlights': 'Rich in quercetin antioxidants and soluble pectin fiber for gut health.'
            },
            {
                'category': category_objs['fruits'],
                'name': 'Highland Farm Strawberries',
                'slug': 'highland-farm-strawberries',
                'description': 'Fragrant, naturally ripened ruby strawberries. Packed fresh in breathable eco-punnets to protect their delicate skin.',
                'regular_price': Decimal('480.00'),
                'discounted_price': Decimal('399.00'),
                'unit': '400 g punnet',
                'stock_quantity': 30,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=80',
                'origin': 'Murree Ridge Hydro Farms',
                'rating': Decimal('4.94'),
                'reviews_count': 51,
                'nutritional_highlights': 'Packed with polyphenols, manganese, and immunity-boosting Vitamin C.'
            },
            {
                'category': category_objs['fruits'],
                'name': 'Raw Cavendish Bananas',
                'slug': 'raw-cavendish-bananas',
                'description': 'Tree-ripened organic bananas from Sindh river delta plantations. Free from artificial chemical carbide ripening agents.',
                'regular_price': Decimal('240.00'),
                'discounted_price': None,
                'unit': '1 Dozen',
                'stock_quantity': 75,
                'is_organic': True,
                'is_featured': False,
                'image_url': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80',
                'origin': 'Mirpurkhas Organic River Estates',
                'rating': Decimal('4.85'),
                'reviews_count': 33,
                'nutritional_highlights': 'Rich source of bioavailable potassium, Vitamin B6, and prebiotic starch.'
            },
            {
                'category': category_objs['fruits'],
                'name': 'Sun-Drenched Valencia Oranges',
                'slug': 'valencia-oranges',
                'description': 'Unwaxed, fragrant citrus bursting with sweet juice. Grown with organic compost and zero synthetic sprays.',
                'regular_price': Decimal('320.00'),
                'discounted_price': Decimal('270.00'),
                'unit': '2 kg bag',
                'stock_quantity': 40,
                'is_organic': True,
                'is_featured': False,
                'image_url': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=700&q=80',
                'origin': 'Sargodha Citrus Belt',
                'rating': Decimal('4.91'),
                'reviews_count': 29,
                'nutritional_highlights': 'High bioflavonoid and Vitamin C concentration.'
            },

            # Dairy & Eggs
            {
                'category': category_objs['dairy-eggs'],
                'name': 'Pure Grass-Fed Whole Cow Milk',
                'slug': 'pure-grass-fed-milk',
                'description': 'Chilled, raw-tested unadulterated milk from pasture-grazed Sahiwal cows. Bottled in sterilised reusable glass jugs.',
                'regular_price': Decimal('260.00'),
                'discounted_price': Decimal('230.00'),
                'unit': '1 Litre Glass Bottle',
                'stock_quantity': 50,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80',
                'origin': 'Sahiwal Heritage Dairy Cooperative',
                'rating': Decimal('4.98'),
                'reviews_count': 72,
                'nutritional_highlights': 'Natural A2 protein beta-casein, 4.2% butterfat, bioactive calcium.'
            },
            {
                'category': category_objs['dairy-eggs'],
                'name': 'Pasture-Raised Desi Brown Eggs',
                'slug': 'pasture-raised-brown-eggs',
                'description': 'Golden yolks from hens roaming freely on chemical-free green pastures with seeds, greens, and clean spring water.',
                'regular_price': Decimal('390.00'),
                'discounted_price': Decimal('340.00'),
                'unit': '1 Dozen Carton',
                'stock_quantity': 65,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=700&q=80',
                'origin': 'Kasur Free-Range Countryside Run',
                'rating': Decimal('4.96'),
                'reviews_count': 89,
                'nutritional_highlights': 'Omega-3 fatty acids 3x higher than industrial cage eggs, 6g protein per egg.'
            },
            {
                'category': category_objs['dairy-eggs'],
                'name': 'Organic Greek Style Set Yogurt',
                'slug': 'organic-greek-yogurt',
                'description': 'Slow-cultured whole milk yogurt, traditionally strained for velvety thickness and dense live probiotics.',
                'regular_price': Decimal('380.00'),
                'discounted_price': None,
                'unit': '500 g clay pot',
                'stock_quantity': 28,
                'is_organic': True,
                'is_featured': False,
                'image_url': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80',
                'origin': 'Sahiwal Heritage Dairy Cooperative',
                'rating': Decimal('4.89'),
                'reviews_count': 22,
                'nutritional_highlights': 'Contains 12 billion CFU active live probiotic cultures.'
            },

            # Cold-Pressed Juices
            {
                'category': category_objs['juices'],
                'name': 'Green Vitality Elixir Juice',
                'slug': 'green-vitality-elixir',
                'description': 'Hydrating blend of cucumber, green apple, crisp kale, celery, lemon, and a hint of fresh mountain ginger.',
                'regular_price': Decimal('390.00'),
                'discounted_price': Decimal('320.00'),
                'unit': '350 ml bottle',
                'stock_quantity': 40,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80',
                'origin': 'Vegist Daily Cold-Press Kitchen',
                'rating': Decimal('4.93'),
                'reviews_count': 44,
                'nutritional_highlights': 'Zero added sugars, zero water dilution, 100% cold hydraulic pressure.'
            },
            {
                'category': category_objs['juices'],
                'name': 'Pure Pomegranate Ruby Press',
                'slug': 'pomegranate-ruby-press',
                'description': 'Pure cold extraction from ruby red Kandahari pomegranates. Unmatched tartness and antioxidant density.',
                'regular_price': Decimal('490.00'),
                'discounted_price': Decimal('430.00'),
                'unit': '350 ml bottle',
                'stock_quantity': 25,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=700&q=80',
                'origin': 'Vegist Daily Cold-Press Kitchen',
                'rating': Decimal('4.97'),
                'reviews_count': 36,
                'nutritional_highlights': 'Packed with punicalagin and ellagic acid antioxidants.'
            },
            {
                'category': category_objs['juices'],
                'name': 'Sunset Carrot Ginger Boost',
                'slug': 'carrot-ginger-boost',
                'description': 'Fresh sweet carrots blended with zesty orange and cold-pressed ginger root for radiant skin and immune vitality.',
                'regular_price': Decimal('360.00'),
                'discounted_price': None,
                'unit': '350 ml bottle',
                'stock_quantity': 30,
                'is_organic': True,
                'is_featured': False,
                'image_url': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=80',
                'origin': 'Vegist Daily Cold-Press Kitchen',
                'rating': Decimal('4.87'),
                'reviews_count': 18,
                'nutritional_highlights': 'Natural gingerol anti-inflammatory action with Vitamin A.'
            },

            # Bakery & Grains
            {
                'category': category_objs['bakery-grains'],
                'name': 'Stone-Baked Rustic Sourdough Loaf',
                'slug': 'rustic-sourdough-loaf',
                'description': 'Naturally leavened over 36 hours with wild yeast culture and stone-ground organic wheat flour. Deep, crunchy crust.',
                'regular_price': Decimal('450.00'),
                'discounted_price': Decimal('390.00'),
                'unit': '750 g artisan loaf',
                'stock_quantity': 22,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
                'origin': 'The Old Mill Hearth Bakery',
                'rating': Decimal('4.96'),
                'reviews_count': 60,
                'nutritional_highlights': 'Long slow fermentation breaks down gluten and phytic acid naturally.'
            },
            {
                'category': category_objs['bakery-grains'],
                'name': 'Organic Rolled Porridge Oats',
                'slug': 'organic-rolled-oats',
                'description': 'Whole grain oat groats gently steamed and rolled. Keeps you full for hours with soluble beta-glucan heart-healthy fiber.',
                'regular_price': Decimal('520.00'),
                'discounted_price': None,
                'unit': '1 kg pouch',
                'stock_quantity': 40,
                'is_organic': True,
                'is_featured': False,
                'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80',
                'origin': 'Northern Valley Certified Organics',
                'rating': Decimal('4.91'),
                'reviews_count': 24,
                'nutritional_highlights': 'Beta-glucan helps naturally regulate blood sugar and cholesterol.'
            },
            {
                'category': category_objs['bakery-grains'],
                'name': 'Heritage Whole Wheat Chakki Atta',
                'slug': 'heritage-whole-wheat-atta',
                'description': '100% whole grain flour ground on slow stone chakki to keep the nutrient-packed wheatgerm and bran fully intact.',
                'regular_price': Decimal('680.00'),
                'discounted_price': Decimal('590.00'),
                'unit': '5 kg bag',
                'stock_quantity': 50,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80',
                'origin': 'Punjab Organic Flour Mills',
                'rating': Decimal('4.98'),
                'reviews_count': 78,
                'nutritional_highlights': 'Zero chemical bleaching, zero maida adulteration, 100% natural fiber.'
            },

            # Pantry & Organic Oils
            {
                'category': category_objs['pantry'],
                'name': 'Cold-Pressed Extra Virgin Olive Oil',
                'slug': 'extra-virgin-olive-oil',
                'description': 'Single-origin unfiltered olive oil pressed within hours of harvest from Chakwal mountain olive groves.',
                'regular_price': Decimal('1850.00'),
                'discounted_price': Decimal('1650.00'),
                'unit': '750 ml glass bottle',
                'stock_quantity': 35,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=700&q=80',
                'origin': 'Potohar Valley Olive Research Estates',
                'rating': Decimal('4.99'),
                'reviews_count': 82,
                'nutritional_highlights': 'Acidity below 0.3%, rich in oleocanthal and polyphenols.'
            },
            {
                'category': category_objs['pantry'],
                'name': 'Wild Mountain Raw Sidr Honey',
                'slug': 'wild-sidr-honey',
                'description': 'Unheated, unfiltered wild berry honey gathered by bees from ancient Sidr (Beri) trees in the Karak foothills.',
                'regular_price': Decimal('2200.00'),
                'discounted_price': Decimal('1950.00'),
                'unit': '500 g glass jar',
                'stock_quantity': 20,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=700&q=80',
                'origin': 'Karak Beri Forest Wild Harvest',
                'rating': Decimal('5.00'),
                'reviews_count': 94,
                'nutritional_highlights': 'Enzyme-rich raw superfood with natural antibacterial properties.'
            },
            {
                'category': category_objs['pantry'],
                'name': 'Pure Pink Himalayan Mineral Salt',
                'slug': 'pink-himalayan-salt',
                'description': 'Authentic unrefined crystalline rock salt mined from ancient subterranean mineral deposits at Khewra.',
                'regular_price': Decimal('220.00'),
                'discounted_price': None,
                'unit': '1 kg jar',
                'stock_quantity': 80,
                'is_organic': True,
                'is_featured': False,
                'image_url': 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=700&q=80',
                'origin': 'Khewra Salt Range Heritage Mine',
                'rating': Decimal('4.92'),
                'reviews_count': 40,
                'nutritional_highlights': 'Contains 84 trace minerals including potassium, magnesium, and calcium.'
            },
            {
                'category': category_objs['pantry'],
                'name': 'Organic Raw Chia Seeds',
                'slug': 'organic-raw-chia-seeds',
                'description': 'Sustainably farmed black chia seeds loaded with plant-based Omega-3 ALA, soluble fiber, and complete protein.',
                'regular_price': Decimal('650.00'),
                'discounted_price': Decimal('550.00'),
                'unit': '400 g airtight jar',
                'stock_quantity': 45,
                'is_organic': True,
                'is_featured': True,
                'image_url': 'https://images.unsplash.com/photo-1584365685547-9a5fb6f3a70c?auto=format&fit=crop&w=700&q=80',
                'origin': 'Sindh Agro Ecological Farms',
                'rating': Decimal('4.90'),
                'reviews_count': 35,
                'nutritional_highlights': '5g Omega-3 and 10g dietary fiber per 2-tablespoon serving.'
            },
        ]

        created_count = 0
        updated_count = 0
        for pdata in products_data:
            slug = pdata['slug']
            p, created = Product.objects.update_or_create(
                slug=slug,
                defaults=pdata
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded catalog: {created_count} products created, {updated_count} updated."
        ))
