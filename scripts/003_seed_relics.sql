-- Seed data for Relic Curator
-- Sample relics from around the world showcasing different heritage categories

-- Note: These relics are inserted without a user_id since they're showcase data
-- In production, you'd want to create a system user or adjust RLS policies

-- First, let's create a showcase policy that allows viewing relics without user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'relics' AND policyname = 'relics_showcase_view'
  ) THEN
    CREATE POLICY "relics_showcase_view" ON relics FOR SELECT USING (user_id IS NULL AND status = 'published');
  END IF;
END $$;

-- Allow inserts for showcase relics (for seeding)
ALTER TABLE relics ALTER COLUMN user_id DROP NOT NULL;

-- Insert sample relics
INSERT INTO relics (
  title, description, story, category, subcategory, tags,
  origin_region, origin_country, cultural_group, time_period, estimated_era,
  ai_significance, ai_preservation_urgency, ai_related_traditions,
  ai_current_relevance, ai_future_importance, ai_time_capsule_note, ai_museum_ready,
  primary_image_url, status, is_verified
) VALUES

-- ARTIFACT: Japanese Kintsugi Bowl
(
  'Kintsugi Bowl - The Art of Golden Repair',
  'A ceramic bowl repaired with gold lacquer, embodying the Japanese philosophy of embracing imperfection and finding beauty in broken things.',
  'This bowl belonged to a tea ceremony master in Kyoto. When it broke in 1892, instead of discarding it, the master had it repaired with gold lacquer, following the kintsugi tradition. The golden seams tell a story of resilience and the beauty of impermanence.',
  'artifact',
  'ceramic',
  ARRAY['kintsugi', 'japanese', 'ceramics', 'wabi-sabi', 'tea ceremony', 'repair art'],
  'Asia',
  'Japan',
  'Japanese',
  '19th century',
  '1890s',
  'Kintsugi represents a profound philosophical approach to life - that breakage and repair are part of an object''s history, not something to hide. This philosophy has influenced modern approaches to mental health, sustainability, and design thinking.',
  7,
  ARRAY['Wabi-sabi aesthetic', 'Tea ceremony (Chado)', 'Japanese lacquerware', 'Zen Buddhism'],
  'In our disposable culture, kintsugi offers a counter-narrative: repair over replace, history over perfection. The practice has seen renewed interest among sustainability advocates and mindfulness practitioners.',
  'As mass production continues and handcraft skills decline, kintsugi masters are becoming rare. By 2100, this may be a lost art preserved only in museums and digital archives. Future generations will study this as evidence of a time when humans valued objects beyond their utility.',
  'In an age of instant replacement, this bowl whispers of patience - of hands that chose gold over garbage, that found beauty in breakage. Future visitors to the Chrono-Vault will hold their breath at these golden rivers, understanding that our ancestors knew what we may have forgotten: nothing truly broken is beyond transformation.',
  true,
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
  'published',
  true
),

-- PRACTICE: Irish Sean-nós Dancing
(
  'Sean-nós Dancing - Ireland''s Solo Step Dance',
  'An ancient form of solo Irish step dancing characterized by low-to-the-ground footwork, free arm movements, and improvisation. Unlike modern Irish dance, it emphasizes individual expression.',
  'Sean-nós (meaning "old style") dancing was nearly lost during the 20th century as the more formal Riverdance style became internationally popular. In the Connemara region, elderly dancers kept the tradition alive, passing it down in kitchen sessions and local gatherings.',
  'practice',
  'dance',
  ARRAY['sean-nos', 'irish dance', 'folk dance', 'improvisation', 'connemara', 'gaelic'],
  'Europe',
  'Ireland',
  'Irish Gaelic',
  'Pre-17th century',
  'Medieval',
  'Sean-nós represents one of the oldest forms of percussive dance in Europe. Its emphasis on improvisation and personal expression contrasts with codified dance forms, offering insights into pre-modern artistic traditions.',
  9,
  ARRAY['Irish music sessions', 'Gaelic language revival', 'Celtic festivals', 'Riverdance'],
  'While Riverdance brought Irish dance global fame, it overshadowed sean-nós. Today, cultural preservationists are working to document and teach this older form before its last practitioners pass away.',
  'As the last generation of traditional sean-nós dancers ages, their improvisational knowledge cannot be fully captured in video. By 2100, we may have recordings but lose the subtle transmission of rhythm and soul that happens only in person.',
  'Watch closely: those feet speak a language older than books. In 2100, when humans may move through virtual worlds, they will seek this footage to remember when we danced on kitchen flagstones, when rhythm lived in bodies before it lived in code.',
  true,
  'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
  'published',
  true
),

-- PROFESSION: Indian Kaavad Storytelling
(
  'Kaavad Banchana - The Portable Temple Storytellers',
  'A dying tradition where traveling storytellers from Rajasthan carry painted wooden shrines (kaavads) door-to-door, narrating mythological tales through sequential painted panels.',
  'The Kaavad tradition dates back over 400 years. Storytellers called Kaavadiya Bhats would walk from village to village, opening the painted wooden doors of their portable shrines to reveal sequential narratives. Each family had their own Kaavadiya who knew their ancestral stories.',
  'profession',
  'storytelling',
  ARRAY['kaavad', 'rajasthan', 'storytelling', 'portable shrine', 'bhats', 'oral tradition'],
  'Asia',
  'India',
  'Rajasthani',
  '17th century onwards',
  '1600s',
  'Kaavad represents a unique intersection of visual art, oral tradition, and mobile theater. It demonstrates how pre-literate societies transmitted cultural knowledge through multi-sensory experiences.',
  10,
  ARRAY['Shadow puppetry', 'Phad painting', 'Kathputli puppetry', 'Pandavani narration'],
  'Fewer than 20 traditional Kaavadiya Bhats remain active. Television and smartphones have replaced the need for traveling storytellers, and the families who once hosted them have dispersed.',
  'This is one of the world''s most endangered storytelling traditions. Without urgent documentation and support, it will exist only in museums and academic papers by 2050.',
  'Before Netflix, before cinema, before electricity - there was a knock on the door. A traveler stood there with a painted wooden box full of gods and heroes. Open this Chrono-Vault archive, future human, and step into a world where stories walked to your doorstep.',
  true,
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
  'published',
  true
),

-- STORY: Aboriginal Dreamtime
(
  'The Rainbow Serpent - Dreamtime Creation Story',
  'A foundational creation narrative from Australian Aboriginal culture explaining the formation of landscapes, waterways, and the laws governing human behavior through the journey of the Rainbow Serpent.',
  'This version of the Rainbow Serpent story comes from the Gunditjmara people of Victoria. It has been shared with permission and describes how the serpent carved out the rivers and created the eel traps that sustained the community for 6,000+ years.',
  'story',
  'creation myth',
  ARRAY['dreamtime', 'aboriginal', 'rainbow serpent', 'creation', 'australia', 'indigenous'],
  'Oceania',
  'Australia',
  'Gunditjmara',
  'Continuous for 65,000+ years',
  'Ancient',
  'Aboriginal Dreamtime stories represent the longest continuous narrative tradition on Earth. They encode ecological knowledge, social laws, and geographical information in memorable narrative form.',
  8,
  ARRAY['Songlines', 'Rock art narratives', 'Corroboree ceremonies', 'Tjukurpa'],
  'Many Dreamtime stories were suppressed during colonization. Today, Aboriginal communities are working to reclaim and teach these narratives, while also navigating complex questions about which stories can be shared publicly.',
  'As climate change alters the Australian landscape, some of the geographical features encoded in Dreamtime stories may change or disappear, breaking the narrative-landscape connection that has persisted for millennia.',
  'Listen carefully: this story is older than the pyramids, older than Stonehenge, older than writing itself. It has traveled through 3,000 generations of human minds. In the digital eternities ahead, may this voice of deep time remind us that stories are how humans remember.',
  true,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'published',
  true
),

-- LANGUAGE: Silbo Gomero Whistled Language
(
  'Silbo Gomero - The Whistled Language of La Gomera',
  'A whistled form of Spanish used on the Canary Island of La Gomera, where steep ravines made conventional speech impractical. Entire conversations can be whistled over distances of up to 5 kilometers.',
  'Silbo Gomero was used by the indigenous Guanche people before Spanish colonization and was adapted to Spanish by later settlers. By the 1990s, only elderly shepherds remembered it. A 1999 law made it mandatory in La Gomera schools, sparking revival.',
  'language',
  'whistled language',
  ARRAY['silbo gomero', 'whistled language', 'canary islands', 'guanche', 'endangered language'],
  'Europe',
  'Spain',
  'Gomeran',
  'Pre-Hispanic, adapted 15th century',
  'Ancient',
  'Silbo Gomero is one of the world''s only fully developed whistled languages. Neuroscience studies show that fluent whistlers process Silbo in language areas of the brain, not music areas - it is truly a language.',
  6,
  ARRAY['Sfyria (Greek whistled language)', 'Kuş dili (Turkish bird language)', 'Mazatec whistled speech'],
  'Thanks to school programs, young Gomerans can now whistle-speak. However, practical use remains limited as mobile phones have replaced long-distance mountain communication.',
  'Silbo Gomero is a remarkable example of successful language revival. Future linguists will study this case to understand how endangered languages can be saved through education policy.',
  'In the valleys of La Gomera, words fly on the wind. This is not music - it is language, whistled across chasms where shouting fails. Future humans: when you communicate through neural links and quantum channels, remember that your ancestors once sang conversations through mountain air.',
  true,
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  'published',
  true
),

-- EVERYDAY: Japanese Furoshiki Wrapping Cloth
(
  'Furoshiki - The Art of Cloth Wrapping',
  'Traditional Japanese wrapping cloths used for centuries to carry goods, wrap gifts, and transport items. A single square of fabric can wrap objects of any shape through various folding techniques.',
  'Furoshiki originated in the Nara period (710-794) when they were used in bathhouses to bundle clothes. The practice became widespread during the Edo period. After WWII, plastic bags nearly killed the tradition, but environmental concerns have sparked a global revival.',
  'everyday',
  'textile practice',
  ARRAY['furoshiki', 'japanese', 'wrapping', 'sustainable', 'zero waste', 'textile'],
  'Asia',
  'Japan',
  'Japanese',
  '8th century onwards',
  'Nara Period',
  'Furoshiki represents ancient zero-waste wisdom now relevant to modern sustainability movements. A single cloth replaces hundreds of disposable bags and can last decades.',
  4,
  ARRAY['Korean bojagi', 'Gift wrapping traditions', 'Tenugui cloth', 'Eco-friendly packaging'],
  'Furoshiki is experiencing a global renaissance driven by sustainability movements. Fashion brands and environmental organizations are teaching furoshiki techniques as alternatives to plastic packaging.',
  'As humanity grapples with plastic pollution, furoshiki may evolve from "traditional practice" to "essential skill." Future historians may see our plastic era as a temporary aberration from millennia of reusable wrapping.',
  'Your great-grandparents wrapped presents in cloth they kept for life. Your parents wrapped them in paper used once. You might wrap them in plastic that will outlast your grandchildren. Here in the Chrono-Vault, we preserve the elegant answer that existed all along.',
  true,
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
  'published',
  true
),

-- PRACTICE: Mexican Day of the Dead Altar Building
(
  'Ofrenda - Day of the Dead Altar Traditions',
  'The practice of building home altars (ofrendas) for deceased loved ones during Día de los Muertos, featuring marigolds, sugar skulls, photographs, and the departed''s favorite foods and possessions.',
  'Each November, the García family in Michoacán builds an ofrenda that has grown over four generations. The altar includes photographs dating back to 1920, and the family''s recipe for pan de muerto has been passed down through five generations of bakers.',
  'practice',
  'ritual',
  ARRAY['dia de muertos', 'ofrenda', 'mexico', 'ancestor veneration', 'marigolds', 'sugar skulls'],
  'North America',
  'Mexico',
  'Mexican',
  'Pre-Columbian, evolved',
  '3000 years',
  'Día de los Muertos represents a unique syncretic tradition blending pre-Columbian ancestor veneration with Catholic All Saints Day. It offers one of the world''s most elaborate systems for maintaining connection with deceased loved ones.',
  5,
  ARRAY['All Souls Day', 'Chinese Qingming Festival', 'Bon Festival (Japan)', 'Halloween'],
  'UNESCO recognized Día de los Muertos as Intangible Cultural Heritage in 2008. While widely practiced, commercialization and the influence of American Halloween are gradually changing traditional observances.',
  'As Mexican diaspora communities grow globally, Día de los Muertos spreads but also transforms. By 2100, we may see both more widespread celebration and greater deviation from traditional practices.',
  'Death is not an ending here - it is a homecoming. Every marigold petal is a step on the path between worlds. Future humans, when you have conquered disease and extended life, will you still know how to honor those who came before? This altar teaches that remembering is the most human act.',
  true,
  'https://images.unsplash.com/photo-1509721434272-b79147e0e708?w=800',
  'published',
  true
),

-- PROFESSION: Venetian Glass Blowing
(
  'Murano Glass Maestro - Venetian Glassblowing',
  'The centuries-old tradition of glassblowing on the island of Murano, Venice, where master artisans create intricate sculptures and functional objects using techniques closely guarded since the 13th century.',
  'Maestro Antonio learned glassblowing from his father, who learned from his father, in an unbroken line going back to the 1500s. The family''s signature technique for creating filigrana glass patterns is known only to three living people.',
  'profession',
  'craft',
  ARRAY['murano glass', 'venice', 'glassblowing', 'artisan', 'craft', 'italy'],
  'Europe',
  'Italy',
  'Venetian',
  '13th century onwards',
  '1291 (Murano decree)',
  'Murano glassmaking represents one of Europe''s oldest continuous craft traditions. The island system created to protect trade secrets inadvertently preserved techniques that might otherwise have been lost to industrialization.',
  7,
  ARRAY['Bohemian crystal', 'Swedish glass design', 'Japanese glass art', 'Studio glass movement'],
  'Murano glass faces competition from cheap imports and declining apprenticeship. Of 90+ furnaces operating in 1990, fewer than 30 remain active. Some traditional techniques are known to only one or two living masters.',
  'Climate change threatens Venice itself, putting Murano''s future in question. The tradition may be forced to relocate, potentially breaking the place-based apprenticeship system that has transmitted knowledge for 700 years.',
  'Fire and breath, molten light shaped by ancient hands. The secrets of Murano have survived plagues, empires, and world wars. As Venice sinks and masters age, we capture their fire here - not just the objects, but the knowledge of making them.',
  true,
  'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800',
  'published',
  true
),

-- EVERYDAY: Korean Ondol Heating System
(
  'Ondol - Traditional Korean Underfloor Heating',
  'An ancient Korean architectural system where heat from a wood fire passes through flues under the floor, creating radiant heating that keeps rooms warm while maintaining healthy air quality.',
  'Ondol systems have been found in Korean archaeological sites dating back 5,000 years. The Kim family home in Gyeongju has maintained its original ondol system for 12 generations, with the knowledge of maintenance passed from father to son.',
  'everyday',
  'architecture',
  ARRAY['ondol', 'korean', 'heating', 'architecture', 'sustainable', 'radiant heat'],
  'Asia',
  'South Korea',
  'Korean',
  '5,000+ years old',
  'Bronze Age',
  'Ondol is one of the world''s oldest and most energy-efficient heating systems. Modern radiant floor heating is essentially a technological update of this ancient Korean innovation.',
  5,
  ARRAY['Roman hypocaust', 'Chinese kang bed-stove', 'Russian pechka', 'Modern radiant heating'],
  'Traditional wood-fired ondol is rare in modern Korea, replaced by hot-water systems. However, the principle remains in virtually every Korean building, and traditional ondol is preserved in heritage homes.',
  'As energy efficiency becomes critical, ondol principles are being studied globally. South Korea''s "hanok stay" tourism has created economic incentive to maintain traditional systems.',
  'For 5,000 years, Korean families have slept on warm floors while winter raged outside. No electricity, no pollution, just the patient movement of heat through stone. Future engineers: your ancestors solved this problem beautifully. We preserved their solution.',
  true,
  'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
  'published',
  true
),

-- STORY: West African Anansi Spider Tales
(
  'Anansi the Spider - Trickster Tales of West Africa',
  'A collection of folk tales featuring Anansi, a clever spider who uses wit and cunning to triumph over larger and stronger animals. These stories encode moral lessons and survival strategies.',
  'These Anansi tales were recorded from Kofi Mensah, a 94-year-old storyteller in Ghana who learned them from his grandmother, who learned them during the pre-colonial Ashanti Empire. He has told these stories at over 1,000 community gatherings.',
  'story',
  'folk tale',
  ARRAY['anansi', 'spider', 'trickster', 'west africa', 'ghana', 'ashanti', 'oral tradition'],
  'Africa',
  'Ghana',
  'Akan/Ashanti',
  'Ancient, recorded from 1800s',
  'Pre-colonial',
  'Anansi stories were carried across the Atlantic during slavery, becoming "Aunt Nancy" tales in the American South and "Anancy" stories in the Caribbean. They represent one of Africa''s most successful cultural exports.',
  6,
  ARRAY['Br''er Rabbit', 'Caribbean Anancy', 'Yoruba trickster tales', 'Native American Coyote'],
  'Anansi stories remain vital in West Africa and the Caribbean. The character has been adapted into children''s books, animated films, and Neil Gaiman''s novel "Anansi Boys," introducing him to new generations.',
  'As African diaspora communities reconnect with heritage, Anansi has become a symbol of resilience and cleverness. The spider who defeated stronger foes through wit resonates with communities who survived through ingenuity.',
  'Small and overlooked, the spider won against lions. These stories crossed oceans in the memories of enslaved people, carrying hope in their words. Anansi proved that the powerless are never truly powerless. In tomorrow''s world, may this truth echo still.',
  true,
  'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
  'published',
  true
),

-- ARTIFACT: Moroccan Zellige Tilework
(
  'Zellige Mosaic Tiles - Moroccan Geometric Art',
  'Hand-cut terracotta tiles arranged in intricate geometric patterns, representing Islamic artistic traditions that transform mathematical principles into visual poetry. Each piece is cut individually by master craftsmen.',
  'This zellige panel was created by a family of m''allem (master artisans) in Fez who have practiced the craft for 11 generations. The geometric pattern is based on a design found in a 14th-century madrasa.',
  'artifact',
  'decorative art',
  ARRAY['zellige', 'morocco', 'islamic art', 'geometric', 'tiles', 'fez', 'mosaic'],
  'Africa',
  'Morocco',
  'Moroccan/Islamic',
  '10th century onwards',
  'Islamic Golden Age',
  'Zellige represents the Islamic artistic response to the prohibition on figurative imagery - abstract mathematics made visual. Each pattern contains hidden symmetries that have fascinated mathematicians and artists alike.',
  7,
  ARRAY['Spanish azulejo', 'Turkish Iznik tiles', 'Persian mosaic', 'Sacred geometry'],
  'Authentic zellige requires years of training and is increasingly rare as machine-cut tiles flood the market. Young Moroccans often prefer faster-paying work over the long apprenticeship required.',
  'Without intervention, hand-cut zellige may become extinct within 50 years. The mathematical precision required takes decades to master, and few young people are willing to invest the time.',
  'Mathematics made visible, infinity captured in clay. Each tile in this pattern was cut by hand, by eye, by generations of knowledge. When machines can copy any pattern, the Chrono-Vault preserves what cannot be copied: the human patience written into every edge.',
  true,
  'https://images.unsplash.com/photo-1548018560-c7196548e84d?w=800',
  'published',
  true
),

-- LANGUAGE: Hawaiian Language Revival
(
  'ʻŌlelo Hawaiʻi - The Hawaiian Language Renaissance',
  'Documentation of the Hawaiian language revival movement, including traditional chants, place names with their stories, and the immersion school programs that have brought the language back from near extinction.',
  'In 1983, only 50 children under 18 spoke Hawaiian as a first language. This archive documents the Pūnana Leo immersion preschools that sparked revival, including audio of kupuna (elders) recorded before their passing.',
  'language',
  'language revival',
  ARRAY['hawaiian', 'olelo hawaii', 'language revival', 'polynesian', 'immersion education'],
  'Oceania',
  'United States (Hawaii)',
  'Native Hawaiian',
  'Ancient, revival 1983-present',
  'Ancient Polynesian',
  'Hawaiian language revival is one of the most successful language revitalization efforts in history. From 50 child speakers in 1983 to over 24,000 fluent speakers today, it offers a model for endangered language communities worldwide.',
  4,
  ARRAY['Māori language revival', 'Welsh language revival', 'Hebrew revitalization', 'Navajo preservation'],
  'Hawaiian is now taught in schools, universities, and immersion programs. Hawaiian-medium education produces fluent graduates, and the language is increasingly visible in public life. However, most speakers are still over 60.',
  'The Hawaiian revival proves that language death is not inevitable. By 2100, Hawaiian could be a thriving language with hundreds of thousands of speakers, or it could decline again. The current generation''s choices will determine which future arrives.',
  'They told us it was dying, but our ancestors'' words did not want to die. From 50 children to thousands, from silence to song. This archive holds the voices of kupuna who refused to let their language sleep. May it teach future generations: no language is too far gone to bring home.',
  true,
  'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800',
  'published',
  true
);

-- Restore NOT NULL constraint if needed (comment out if you want to allow showcase relics)
-- ALTER TABLE relics ALTER COLUMN user_id SET NOT NULL;
