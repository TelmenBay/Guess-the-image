// =====================================================================
//  IMAGE DATA — this is the only file you edit to add images.
//
//  1. Drop the image file into  images/<category>/
//  2. Add one line below:  { src, answer, category }
//
//  The category slider on the setup screen is built from this list
//  automatically — a new category name here creates a new slider stop.
//  The answer is what appears on screen after Space is pressed.
//
//  Shortcut: answer and category are optional. If you leave them out
//  they are derived from the file name and folder name:
//      { src: "images/animals/polar_bear.jpg" }
//  becomes  answer: "Polar Bear",  category: "Animals".
// =====================================================================

const IMAGE_DATA = [

  // ---- Монгол аж ахуйн хэрэгсэл ----
  { src: "images/Mongol-aj-ahui/chudur.jpeg",  answer: "Чөдөр",  category: "Монгол аж ахуйн хэрэгсэл" },
  { src: "images/Mongol-aj-ahui/duruu.jpeg",   answer: "Дөрөө",   category: "Монгол аж ахуйн хэрэгсэл" },
  { src: "images/Mongol-aj-ahui/emeel.jpeg",   answer: "Эмээл",   category: "Монгол аж ахуйн хэрэгсэл" },
  { src: "images/Mongol-aj-ahui/hazaar.jpeg",  answer: "Хазаар",  category: "Монгол аж ахуйн хэрэгсэл" },
  { src: "images/Mongol-aj-ahui/huhuur.jpg",   answer: "Хөхүүр",  category: "Монгол аж ахуйн хэрэгсэл" },
  { src: "images/Mongol-aj-ahui/huiv.jpeg",    answer: "Хуйв",    category: "Монгол аж ахуйн хэрэгсэл" },
  { src: "images/Mongol-aj-ahui/husuur.jpg",   answer: "Хусуур",  category: "Монгол аж ахуйн хэрэгсэл" },
  { src: "images/Mongol-aj-ahui/tashuur.jpg",  answer: "Ташуур", category: "Монгол аж ахуйн хэрэгсэл" },
  { src: "images/Mongol-aj-ahui/uurga.jpeg",   answer: "Уурга",   category: "Монгол аж ахуйн хэрэгсэл" },

  // ---- Монгол дуучид ----
  { src: "images/Mongol-duuchid/a-sound.jpeg",    answer: "A-Sound",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/enerel.jpeg",     answer: "Энэрэл",       category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/gangbay.jpeg",    answer: "Gangbay",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/ice-top.jpg",     answer: "Ice Top",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/javkhlan.jpg",    answer: "Жавхлан",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/kharanga.jpeg",   answer: "Харанга",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/khusugtun.jpeg",  answer: "Хөсөгтөн",     category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/kiwi.jpeg",       answer: "Kiwi",         category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/mrs-m.jpeg",      answer: "Mrs M",        category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/nisvanis.jpeg",   answer: "Нисванис",     category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/nomin-talst.jpeg",answer: "Номин Талст",  category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/nominjin.jpeg",   answer: "Номинжин",     category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/rokitbay.jpeg",   answer: "Rokit Bay",    category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/sarantuya.jpeg",  answer: "Сарантуяа",    category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/serchmaa.jpeg",   answer: "Сэрчмаа",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/seryoja.jpeg",    answer: "Seryoja",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/soyol-erdene.jpeg",answer: "Соёл-Эрдэнэ",  category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/the-lemons.jpeg", answer: "The Lemons",   category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/thunderz.jpeg",   answer: "Thunderz",     category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/tsetse.jpeg",     answer: "Цэцэ",         category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/vandebo.jpeg",    answer: "Vandebo",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/young-mo-g.jpeg", answer: "Young Mo'G",   category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/big gee.jpeg",    answer: "Big Gee",      category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/enkh-erdene.jpeg",answer: "Энх-Эрдэнэ",   category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/ginjin.jpeg",     answer: "Ginjin",       category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/hurd.jpeg",       answer: "Хурд",         category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/290.jpeg",           answer: "290", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/adarsuren.jpg",      answer: "Адарсүрэн", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/altanjargal.jpeg",   answer: "Алтанжаргал", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/amarhuu.jpg",        answer: "Амархүү", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/banzagch-2.jpg",       answer: "Банзрагч", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/bold.jpeg",          answer: "Болд", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/boldbaatar.jpeg",    answer: "Болдбаатар", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/chingis-jaga.jpeg",  answer: "Чингис Жагаа", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/colors-mongolia.jpeg", answer: "Colors Mongolia", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/enkhe-erkhem.jpeg",  answer: "Enkhe x Erkhem", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/hosbayar.jpeg",      answer: "Хосбаяр", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/magnolian.jpeg",     answer: "Magnolian", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/namone.jpeg",        answer: "Namone", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/naran.jpg",          answer: "Наран", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/otgonjargal.jpg",    answer: "Отгонжаргал", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/tenuun.jpeg",        answer: "Тэнүүн", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/the-baatar.jpeg",    answer: "The Baatar", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/tumendemberel.jpeg", answer: "Түмэндэмбэрэл", category: "Монгол дуучид" },
  { src: "images/Mongol-duuchid/turmandakh.jpeg",    answer: "Төрмандах", category: "Монгол дуучид" },

  // ---- Монгол жүжигчид ----
  { src: "images/Mongol-jujigchid/amarsaikhan.jpeg",       answer: "Амарсайхан",         category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/ariunbyamba.jpg",        answer: "Ариунбямба",         category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/baatarhuu.jpeg",         answer: "Баатархүү",          category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/barhuu.jpeg",            answer: "Бархүү",             category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/battumur.jpeg",          answer: "Баттөмөр",           category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/bayrbat.jpeg",           answer: "Баярбат",            category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/bayrmagnai.jpeg",        answer: "Баярмагнай",         category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/bolderdene.jpeg",        answer: "Болд-Эрдэнэ",        category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/dulguun.jpeg",           answer: "Дөлгөөн",            category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/erdenezaan.jpeg",        answer: "Эрдэнэзаан",         category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/erkhembayar.webp",       answer: "Эрхэмбаяр",          category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/munkhsaikhan.jpeg",      answer: "Мөнхсайхан",         category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/naransolongo.jpeg",      answer: "Нарансолонго",       category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/odonchimeg.jpeg",        answer: "Одончимэг",          category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/onon.jpeg",              answer: "Онон",               category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/surult.jpeg",            answer: "Сөрөлт",             category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/temuujin-temka.jpg",     answer: "Тэмүүжин (Тэмка)",   category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/tselmeg.jpeg",           answer: "Цэлмэг",             category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/tumurbaatar.jpeg",       answer: "Төмөрбаатар",        category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/tuvshintur-tuutuu.jpeg", answer: "Түвшинтөр (Төтө)", category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/tuya.jpeg",              answer: "Туяа",               category: "Монгол жүжигчид" },
  { src: "images/Mongol-jujigchid/yalalt.webp",            answer: "Ялалт",              category: "Монгол жүжигчид" },

  // ---- Супер баатрууд ----
  { src: "images/superhero/aquaman.jpeg",          answer: "Aquaman",           category: "Супер баатрууд" },
  { src: "images/superhero/batman.webp",           answer: "Batman",            category: "Супер баатрууд" },
  { src: "images/superhero/captain marvel.webp",   answer: "Captain Marvel",    category: "Супер баатрууд" },
  { src: "images/superhero/catwoman.jpg",          answer: "Catwoman",          category: "Супер баатрууд" },
  { src: "images/superhero/daredevil.jpg",         answer: "Daredevil",         category: "Супер баатрууд" },
  { src: "images/superhero/green lantern.jpeg",    answer: "Green Lantern",     category: "Супер баатрууд" },
  { src: "images/superhero/Hulk.jpeg",             answer: "Hulk",              category: "Супер баатрууд" },
  { src: "images/superhero/loki.webp",             answer: "Loki",              category: "Супер баатрууд" },
  { src: "images/superhero/martianmanhunter.jpeg", answer: "Martian Manhunter", category: "Супер баатрууд" },
  { src: "images/superhero/nightwing.jpeg",        answer: "Nightwing",         category: "Супер баатрууд" },
  { src: "images/superhero/robin.jpeg",            answer: "Robin",             category: "Супер баатрууд" },
  { src: "images/superhero/scarletwitch.jpg",      answer: "Scarlet Witch",     category: "Супер баатрууд" },
  { src: "images/superhero/silversurfer.jpg",      answer: "Silver Surfer",     category: "Супер баатрууд" },
  { src: "images/superhero/spawn.jpg",             answer: "Spawn",             category: "Супер баатрууд" },
  { src: "images/superhero/spiderman.jpg",         answer: "Spider-Man",        category: "Супер баатрууд" },
  { src: "images/superhero/theflash.jpeg",         answer: "The Flash",         category: "Супер баатрууд" },
  { src: "images/superhero/thing.webp",            answer: "The Thing",         category: "Супер баатрууд" },
  { src: "images/superhero/thor.jpeg",             answer: "Thor",              category: "Супер баатрууд" },
  { src: "images/superhero/wonderwoman.jpg",       answer: "Wonder Woman",      category: "Супер баатрууд" },

  // ---- Нүүр будалтын бүтээгдэхүүн ----
  { src: "images/Makeup-products/beauty blender.webp",        answer: "Beauty Blender",          category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/blush.avif",                 answer: "Blush",                   category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/bronzer_contour.webp",       answer: "Bronzer / Contour",       category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/concealer.avif",             answer: "Concealer",               category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/cushion.webp",               answer: "Cushion",                 category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/eye shadow.webp",            answer: "Eye Shadow",              category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/eyelash curler.webp",        answer: "Eyelash Curler",          category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/eyeliner.avif",              answer: "Eyeliner",                category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/highlighter.avif",           answer: "Highlighter",             category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/lash cluster.webp",          answer: "Lash Cluster",            category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/lip gloss.webp",             answer: "Lip Gloss",               category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/lip liner.avif",             answer: "Lip Liner",               category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/lipstick.avif",              answer: "Lipstick",                category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/mascara.jpg",                answer: "Mascara",                 category: "Нүүр будалтын бүтээгдэхүүн" },
  { src: "images/Makeup-products/setting powder_powder.webp", answer: "Setting Powder / Powder", category: "Нүүр будалтын бүтээгдэхүүн" },

  // ---- Example of another category (uncomment once the files exist) ----
  // { src: "images/animals/dog.jpg", answer: "Dog", category: "Animals" },
  // { src: "images/food/pizza.jpg",  answer: "Pizza", category: "Food" },

];
