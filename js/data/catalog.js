export const productCatalog = [
  {
    id: 'brasaDouble',
    category: 'burgers',
    name: { pt: 'Brasa Duplo', es: 'Brasa Doble', en: 'The Brasa Double' },
    price: 16,
    desc: {
      pt: 'Dois smash burgers, cheddar intenso, bacon, cebola crocante e molho Brasa.',
      es: 'Dos smash burgers, cheddar intenso, tocino, cebolla crujiente y salsa Brasa.',
      en: 'Two smashed beef patties, sharp cheddar, bacon, crispy onions and Brasa sauce.'
    },
    img: 'assets/double_burger.webp',
    tag: { pt: 'Mais vendido', es: 'Mas vendido', en: 'Best seller' },
    moods: ['classic', 'cheesy', 'premium'],
    profile: {
      pt: ['Crosta crocante', 'Bacon defumado', 'Cheddar intenso'],
      es: ['Costra crujiente', 'Tocino ahumado', 'Cheddar intenso'],
      en: ['Crispy crust', 'Smoky bacon', 'Sharp cheddar']
    },
    smash: 88,
    heat: { pt: 'Medio', es: 'Medio', en: 'Medium' },
    richness: { pt: 'Marcante', es: 'Intensa', en: 'Bold' }
  },
  {
    id: 'truffleFries',
    category: 'sides',
    name: { pt: 'Fritas Trufadas', es: 'Papas Trufadas', en: 'Truffle Fries' },
    price: 6,
    desc: {
      pt: 'Batatas crocantes com azeite trufado, parmesao, cebolinha e aioli.',
      es: 'Papas crujientes con aceite de trufa, parmesano, cebollin y aioli.',
      en: 'Crispy fries, truffle oil, parmesan, chives and truffle aioli.'
    },
    img: 'assets/fries.webp',
    tag: { pt: 'Favorito da casa', es: 'Favorito de la casa', en: 'House favorite' },
    moods: ['premium', 'cheesy', 'quick'],
    profile: {
      pt: ['Aioli trufado', 'Parmesao', 'Pontas crocantes'],
      es: ['Aioli trufado', 'Parmesano', 'Bordes crujientes'],
      en: ['Truffle aioli', 'Parmesan', 'Crispy edges']
    },
    smash: 58,
    heat: { pt: 'Leve', es: 'Suave', en: 'Mild' },
    richness: { pt: 'Marcante', es: 'Intensa', en: 'Bold' }
  },
  {
    id: 'classicSmash',
    category: 'burgers',
    name: { pt: 'Smash Classico', es: 'Smash Clasico', en: 'Classic Smash' },
    price: 12,
    desc: {
      pt: 'Carne prensada na chapa, queijo americano, picles, cebola, ketchup e mostarda.',
      es: 'Carne prensada a la plancha, queso americano, pepinillos, cebolla, ketchup y mostaza.',
      en: 'Smashed beef patty, American cheese, pickles, onions, ketchup and mustard.'
    },
    img: 'assets/classic_burger.webp',
    tag: { pt: 'Classico', es: 'Clasico', en: 'Classic' },
    moods: ['classic', 'quick'],
    profile: {
      pt: ['Picles acido', 'Queijo americano', 'Crosta de chapa'],
      es: ['Pepinillo acido', 'Queso americano', 'Costra de plancha'],
      en: ['Pickle snap', 'American cheese', 'Griddle crust']
    },
    smash: 76,
    heat: { pt: 'Leve', es: 'Suave', en: 'Mild' },
    richness: { pt: 'Equilibrada', es: 'Equilibrada', en: 'Balanced' }
  },
  {
    id: 'truffleMushroom',
    category: 'burgers',
    name: { pt: 'Trufa e Cogumelos', es: 'Trufa y Hongos', en: 'Truffle Mushroom' },
    price: 14,
    desc: {
      pt: 'Smash burger com cogumelos trufados, queijo suico e aioli de alho.',
      es: 'Smash burger con hongos trufados, queso suizo y aioli de ajo.',
      en: 'Smashed beef patty, truffle mushrooms, swiss cheese and garlic aioli.'
    },
    img: 'assets/truffle_burger.webp',
    tag: { pt: 'Premium', es: 'Premium', en: 'Premium' },
    moods: ['premium'],
    profile: {
      pt: ['Cogumelos trufados', 'Suico derretido', 'Aioli de alho'],
      es: ['Hongos trufados', 'Suizo fundido', 'Aioli de ajo'],
      en: ['Truffle mushroom', 'Swiss melt', 'Garlic aioli']
    },
    smash: 72,
    heat: { pt: 'Leve', es: 'Suave', en: 'Mild' },
    richness: { pt: 'Intensa', es: 'Potente', en: 'Heavy' }
  },
  {
    id: 'spicyJalapeno',
    category: 'burgers',
    name: { pt: 'Jalapeno Picante', es: 'Jalapeno Picante', en: 'Spicy Jalapeno' },
    price: 13,
    desc: {
      pt: 'Cheddar intenso, jalapenos, cebola crocante e molho Brasa picante.',
      es: 'Cheddar intenso, jalapenos, cebolla crujiente y salsa Brasa picante.',
      en: 'Sharp cheddar, jalapenos, crispy onions and spicy Brasa sauce.'
    },
    img: 'assets/double_burger.webp',
    tag: { pt: 'Picante', es: 'Picante', en: 'Spicy' },
    moods: ['spicy', 'cheesy', 'quick'],
    profile: {
      pt: ['Ardor de jalapeno', 'Cebola crocante', 'Molho Brasa'],
      es: ['Picor de jalapeno', 'Cebolla crujiente', 'Salsa Brasa'],
      en: ['Jalapeno heat', 'Crispy onions', 'Brasa sauce']
    },
    smash: 82,
    heat: { pt: 'Picante', es: 'Picante', en: 'Spicy' },
    richness: { pt: 'Marcante', es: 'Intensa', en: 'Bold' }
  },
  {
    id: 'onionRings',
    category: 'sides',
    name: { pt: 'Onion Rings', es: 'Aros de Cebolla', en: 'Onion Rings' },
    price: 7,
    desc: {
      pt: 'Aneis de cebola empanados e super crocantes com molho Brasa.',
      es: 'Aros de cebolla empanizados y super crujientes con salsa Brasa.',
      en: 'Crispy breaded onion rings served with Brasa sauce.'
    },
    img: 'assets/onion_rings.webp',
    tag: { pt: 'Crocante', es: 'Crujiente', en: 'Crispy' },
    moods: ['quick'],
    profile: {
      pt: ['Cebola doce', 'Empanado crocante', 'Molho Brasa'],
      es: ['Cebolla dulce', 'Empanizado crujiente', 'Salsa Brasa'],
      en: ['Sweet onion', 'Crispy breading', 'Brasa sauce']
    },
    smash: 30,
    heat: { pt: 'Leve', es: 'Suave', en: 'Mild' },
    richness: { pt: 'Equilibrada', es: 'Equilibrada', en: 'Balanced' }
  },
  {
    id: 'wedges',
    category: 'sides',
    name: { pt: 'Batata Canoa', es: 'Papas Gajo', en: 'Potato Wedges' },
    price: 6,
    desc: {
      pt: 'Batatas rusticas em formato canoa, temperadas com ervas finas.',
      es: 'Papas rusticas en forma de gajo, condimentadas con finas hierbas.',
      en: 'Rustic potato wedges seasoned with fine herbs.'
    },
    img: 'assets/wedges.webp',
    tag: { pt: 'Rustica', es: 'Rustica', en: 'Rustic' },
    moods: ['classic'],
    profile: {
      pt: ['Ervas finas', 'Interior macio', 'Casca crocante'],
      es: ['Finas hierbas', 'Interior suave', 'Cascara crujiente'],
      en: ['Fine herbs', 'Soft inside', 'Crispy skin']
    },
    smash: 40,
    heat: { pt: 'Nenhum', es: 'Ninguno', en: 'None' },
    richness: { pt: 'Leve', es: 'Ligera', en: 'Light' }
  },
  {
    id: 'cheddarBaconFries',
    category: 'sides',
    name: { pt: 'Fritas Cheddar & Bacon', es: 'Papas Cheddar y Tocino', en: 'Cheddar Bacon Fries' },
    price: 9,
    desc: {
      pt: 'Batatas crocantes cobertas com muito cheddar derretido e pedacos de bacon.',
      es: 'Papas crujientes cubiertas con mucho cheddar derretido y trozos de tocino.',
      en: 'Crispy fries loaded with melted cheddar cheese and bacon bits.'
    },
    img: 'assets/cheddar_bacon_fries.webp',
    tag: { pt: 'Indulgente', es: 'Indulgente', en: 'Indulgent' },
    moods: ['cheesy', 'premium'],
    profile: {
      pt: ['Cheddar cremoso', 'Bacon crocante', 'Batata dourada'],
      es: ['Cheddar cremoso', 'Tocino crujiente', 'Papa dorada'],
      en: ['Creamy cheddar', 'Crispy bacon', 'Golden fries']
    },
    smash: 60,
    heat: { pt: 'Leve', es: 'Suave', en: 'Mild' },
    richness: { pt: 'Intensa', es: 'Potente', en: 'Heavy' }
  },
  {
    id: 'chocolateShake',
    category: 'drinks',
    name: { pt: 'Chocolate Shake', es: 'Batido de Chocolate', en: 'Chocolate Shake' },
    price: 8,
    desc: {
      pt: 'Milkshake cremoso de chocolate intenso com chantilly e calda.',
      es: 'Batido cremoso de chocolate intenso con crema batida y sirope.',
      en: 'Creamy rich chocolate milkshake with whipped cream and drizzle.'
    },
    img: 'assets/chocolate_shake.webp',
    tag: { pt: 'Cremoso', es: 'Cremoso', en: 'Creamy' },
    moods: ['premium'],
    profile: {
      pt: ['Chocolate belga', 'Chantilly fresco', 'Calda espessa'],
      es: ['Chocolate belga', 'Crema fresca', 'Sirope espeso'],
      en: ['Belgian chocolate', 'Fresh whip', 'Thick drizzle']
    },
    smash: 0,
    heat: { pt: 'Gelado', es: 'Frio', en: 'Cold' },
    richness: { pt: 'Doce', es: 'Dulce', en: 'Sweet' }
  },
  {
    id: 'coke',
    category: 'drinks',
    name: { pt: 'Coca-Cola', es: 'Coca-Cola', en: 'Coca-Cola' },
    price: 4,
    desc: {
      pt: 'Refrigerante de cola gelado com muito gelo e limao.',
      es: 'Refresco de cola frio con mucho hielo y limon.',
      en: 'Ice cold cola with lots of ice and a slice of lemon.'
    },
    img: 'assets/coke.webp',
    tag: { pt: 'Gelada', es: 'Fria', en: 'Ice cold' },
    moods: ['classic', 'quick'],
    profile: {
      pt: ['Gelo', 'Gas', 'Refrescante'],
      es: ['Hielo', 'Gas', 'Refrescante'],
      en: ['Ice', 'Fizz', 'Refreshing']
    },
    smash: 0,
    heat: { pt: 'Gelado', es: 'Frio', en: 'Cold' },
    richness: { pt: 'Leve', es: 'Ligera', en: 'Light' }
  },
  {
    id: 'guarana',
    category: 'drinks',
    name: { pt: 'Guaraná', es: 'Guaraná', en: 'Guaraná' },
    price: 4,
    desc: {
      pt: 'Guaraná gelado, o sabor original do Brasil.',
      es: 'Guaraná frío, el sabor original de Brasil.',
      en: 'Ice cold Guarana soda, the original taste of Brazil.'
    },
    img: 'assets/guarana.webp',
    tag: { pt: 'Brasileiro', es: 'Brasileño', en: 'Brazilian' },
    moods: ['classic'],
    profile: {
      pt: ['Gelo', 'Gas', 'Original'],
      es: ['Hielo', 'Gas', 'Original'],
      en: ['Ice', 'Fizz', 'Original']
    },
    smash: 0,
    heat: { pt: 'Gelado', es: 'Frio', en: 'Cold' },
    richness: { pt: 'Leve', es: 'Ligera', en: 'Light' }
  },
  {
    id: 'churros',
    category: 'desserts',
    name: { pt: 'Churros c/ Doce de Leite', es: 'Churros c/ Dulce de Leche', en: 'Churros & Dulce de Leche' },
    price: 6,
    desc: {
      pt: 'Churros quentinhos e crocantes polvilhados com açucar e canela, acompanhados de doce de leite.',
      es: 'Churros calientes y crujientes espolvoreados con azúcar y canela, acompañados de dulce de leche.',
      en: 'Warm crispy churros dusted with cinnamon sugar, served with dulce de leche dip.'
    },
    img: 'assets/churros.webp',
    tag: { pt: 'Favorito', es: 'Favorito', en: 'Favorite' },
    moods: ['premium'],
    profile: {
      pt: ['Doce de leite', 'Crocante', 'Canela'],
      es: ['Dulce de leche', 'Crujiente', 'Canela'],
      en: ['Dulce de leche', 'Crispy', 'Cinnamon']
    },
    smash: 0,
    heat: { pt: 'Quente', es: 'Caliente', en: 'Hot' },
    richness: { pt: 'Doce', es: 'Dulce', en: 'Sweet' }
  },
  {
    id: 'brownie',
    category: 'desserts',
    name: { pt: 'Brownie de Chocolate', es: 'Brownie de Chocolate', en: 'Fudge Brownie' },
    price: 7,
    desc: {
      pt: 'Brownie denso e molhadinho por dentro com casquinha crocante por fora.',
      es: 'Brownie denso y húmedo por dentro con costra crujiente por fuera.',
      en: 'Dense, fudgy chocolate brownie with a crinkly top crust.'
    },
    img: 'assets/brownie.webp',
    tag: { pt: 'Intenso', es: 'Intenso', en: 'Rich' },
    moods: ['premium', 'cheesy'],
    profile: {
      pt: ['Chocolate amargo', 'Textura densa', 'Casquinha'],
      es: ['Chocolate amargo', 'Textura densa', 'Costra'],
      en: ['Dark chocolate', 'Fudgy texture', 'Crust']
    },
    smash: 0,
    heat: { pt: 'Morno', es: 'Tibio', en: 'Warm' },
    richness: { pt: 'Marcante', es: 'Intensa', en: 'Bold' }
  },
  {
    id: 'pudim',
    category: 'desserts',
    name: { pt: 'Pudim', es: 'Flan', en: 'Pudim (Flan)' },
    price: 6,
    desc: {
      pt: 'Pudim de leite condensado clássico, sem furinhos, com calda de caramelo.',
      es: 'Flan de leche condensada clásico, suave, con sirope de caramelo.',
      en: 'Classic Brazilian condensed milk flan, silky smooth with caramel sauce.'
    },
    img: 'assets/pudim.webp',
    tag: { pt: 'Clássico', es: 'Clásico', en: 'Classic' },
    moods: ['classic'],
    profile: {
      pt: ['Leite condensado', 'Caramelo', 'Cremoso'],
      es: ['Leche condensada', 'Caramelo', 'Cremoso'],
      en: ['Condensed milk', 'Caramel', 'Creamy']
    },
    smash: 0,
    heat: { pt: 'Frio', es: 'Frio', en: 'Cold' },
    richness: { pt: 'Doce', es: 'Dulce', en: 'Sweet' }
  }
];
