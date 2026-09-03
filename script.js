// --- SHARKFEAST CORE SCRIPT ---
const OWNER_USERNAME = "sharkie";
const STAFF_RANKS = ["Website Owner", "Website Admin", "Website Mod"];

// Shark-themed syllable prompts (BombParty-style, fully original)
const LETTER_CHOICES = [
    "ARK","SH","FEA","ST","MEG","SUR","FIN","OCE","TIC","BLO","JAW","GUL",
    "REE","COR","WAV","TID","DEP","ABYS","KEL","POR","BAR","RAC","HUN",
    "PRE","DAT","SWI","MER","GIL","SCU","TEETH","FINN","SHAR","KBA"
];

// Bonus alphabet letters that can restore a life when fully used (shark-themed set)
const DEFAULT_BONUS_LETTERS = ["S","H","A","R","K","F","I","N"];

// Lightweight built-in dictionary for offline validation (common English words containing common prompts)
const SHARK_WORD_BANK = new Set([
    "shark","sharks","megalodon","ocean","oceans","reef","coral","wave","waves","tide","tides",
    "fin","fins","gill","gills","jaw","jaws","hunt","hunter","predator","prey","swim","swimmer",
    "deep","depth","abyss","kelp","port","harbor","bark","spark","share","sharp","harpoon",
    "feast","surfer","surfing","surface","surge","current","current","stream","stream","fish",
    "fishing","whale","whales","dolphin","seal","seals","orca","barracuda","stingray","manta",
    "turtle","turtles","crab","crabs","lobster","octopus","squid","plankton","algae","bubble",
    "bubbles","splash","splash","dive","diver","diving","snorkel","scuba","boat","boats",
    "ship","ships","captain","crew","anchor","sail","sailing","storm","storms","thunder",
    "lightning","rain","cloud","clouds","sky","sun","moon","star","stars","island","islands",
    "beach","beaches","sand","sandy","rock","rocks","stone","stones","cave","caves","cliff",
    "cliffs","mountain","mountains","valley","river","rivers","lake","lakes","pond","ponds",
    "water","waters","liquid","fluid","flow","flowing","float","floating","sink","sinking",
    "drown","drowning","rescue","save","saver","hero","heroes","legend","myth","myths",
    "story","stories","tale","tales","adventure","quest","journey","travel","explore","explorer",
    "discover","discovery","treasure","gold","silver","pearl","pearls","gem","gems","jewel",
    "crown","king","queen","prince","princess","royal","empire","kingdom","throne","castle",
    "sword","shield","armor","battle","war","warrior","soldier","army","navy","fleet","armada",
    "attack","defend","defense","victory","defeat","win","winner","lose","loser","draw",
    "game","games","play","player","players","team","teams","score","point","points","level",
    "round","rounds","turn","turns","time","timer","clock","second","seconds","minute","hour",
    "day","night","week","month","year","season","spring","summer","autumn","winter","fall",
    "animal","animals","creature","creatures","beast","beasts","monster","monsters","dragon",
    "dragons","phoenix","griffin","unicorn","mermaid","merman","siren","sirens","ghost","ghosts",
    "spirit","spirits","soul","souls","life","lives","death","dead","alive","living","born",
    "birth","grow","growth","change","transform","evolve","evolution","power","powers","force",
    "energy","magic","spell","spells","potion","potions","herb","herbs","plant","plants","tree",
    "trees","flower","flowers","leaf","leaves","root","roots","seed","seeds","fruit","fruits",
    "food","foods","eat","eater","meal","meals","dinner","lunch","breakfast","snack","snacks",
    "drink","drinks","juice","milk","coffee","tea","water","soda","beer","wine","alcohol",
    "happy","sad","angry","afraid","fear","fearful","brave","courage","strong","weak","smart",
    "clever","wise","foolish","kind","cruel","nice","mean","good","bad","better","best","worst",
    "big","small","large","tiny","huge","giant","mini","micro","macro","fast","slow","quick",
    "rapid","speed","speedy","slow","sluggish","high","low","tall","short","long","wide","narrow",
    "thick","thin","heavy","light","hard","soft","rough","smooth","sharp","blunt","hot","cold",
    "warm","cool","wet","dry","clean","dirty","new","old","young","ancient","modern","fresh",
    "stale","raw","cooked","burnt","sweet","sour","bitter","salty","spicy","mild","strong",
    "weak","loud","quiet","silent","noisy","bright","dark","light","dim","clear","cloudy",
    "open","closed","full","empty","rich","poor","free","busy","easy","hard","simple","complex",
    "true","false","real","fake","right","wrong","correct","incorrect","yes","no","maybe",
    "always","never","sometimes","often","rarely","usually","probably","possibly","certainly",
    "perhaps","maybe","surely","definitely","absolutely","completely","totally","entirely",
    "partly","mostly","mainly","especially","particularly","specifically","generally","usually",
    "normally","typically","commonly","frequently","occasionally","seldom","hardly","barely",
    "almost","nearly","about","around","approximately","roughly","exactly","precisely","just",
    "only","even","still","already","yet","again","once","twice","thrice","first","second",
    "third","last","next","previous","current","future","past","present","now","then","soon",
    "later","earlier","before","after","during","while","until","since","from","to","into",
    "onto","upon","over","under","above","below","beside","between","among","through","across",
    "along","around","about","against","toward","towards","away","back","forward","up","down",
    "left","right","north","south","east","west","center","middle","side","edge","corner",
    "top","bottom","front","rear","inside","outside","within","without","beyond","behind",
    "ahead","behind","near","far","close","distant","local","global","national","international",
    "world","earth","planet","universe","space","galaxy","star","stars","sun","moon","sky",
    "air","wind","breeze","gale","hurricane","tornado","storm","rain","snow","ice","frost",
    "fog","mist","cloud","clouds","thunder","lightning","flash","boom","crash","bang","pop",
    "splash","swoosh","whoosh","roar","growl","hiss","bark","meow","chirp","sing","song",
    "music","melody","rhythm","beat","drum","guitar","piano","violin","flute","horn","trumpet",
    "dance","dancer","jump","run","walk","crawl","fly","swim","dive","climb","fall","rise",
    "stand","sit","lie","sleep","wake","dream","think","thought","idea","ideas","mind","brain",
    "heart","soul","spirit","body","hand","hands","foot","feet","head","face","eye","eyes",
    "ear","ears","nose","mouth","tooth","teeth","tongue","lip","lips","hair","skin","bone",
    "bones","blood","vein","muscle","muscles","nerve","nerves","cell","cells","organ","organs",
    "system","systems","network","web","internet","computer","phone","screen","keyboard","mouse",
    "click","type","typing","write","writing","read","reading","book","books","page","pages",
    "chapter","story","novel","poem","poetry","art","artist","paint","painting","draw","drawing",
    "photo","photos","picture","pictures","image","images","video","videos","movie","movies",
    "film","films","show","shows","series","episode","season","channel","station","radio",
    "broadcast","stream","streaming","live","online","offline","connect","connection","link",
    "links","site","sites","page","pages","web","website","app","apps","game","games","play",
    "player","players","score","highscore","leaderboard","rank","ranking","level","levels",
    "stage","stages","boss","bosses","enemy","enemies","ally","allies","friend","friends",
    "foe","foes","rival","rivals","competitor","competitors","champion","champions","winner",
    "winners","loser","losers","tie","draw","victory","defeat","success","failure","try","tries",
    "attempt","attempts","chance","chances","opportunity","opportunities","luck","lucky","unlucky",
    "fortune","destiny","fate","future","past","present","history","legend","myth","tale",
    "adventure","quest","mission","missions","goal","goals","target","targets","aim","aims",
    "purpose","reason","cause","effect","result","results","outcome","outcomes","consequence",
    "consequences","impact","impacts","influence","influences","power","powers","force","forces",
    "strength","weakness","ability","abilities","skill","skills","talent","talents","gift","gifts",
    "curse","curses","blessing","blessings","magic","magical","spell","spells","potion","potions",
    "wand","staff","sword","blade","dagger","axe","hammer","bow","arrow","arrows","shield",
    "armor","helmet","boots","gloves","cloak","robe","ring","rings","amulet","amulet","crystal",
    "crystals","gem","gems","jewel","jewels","treasure","treasures","gold","silver","bronze",
    "iron","steel","wood","stone","rock","rocks","dirt","mud","sand","clay","glass","metal",
    "plastic","paper","cloth","fabric","leather","silk","wool","cotton","linen","rubber","foam",
    "plastic","carbon","oxygen","hydrogen","nitrogen","helium","neon","argon","krypton","xenon",
    "radon","uranium","plutonium","element","elements","atom","atoms","molecule","molecules",
    "compound","compounds","mixture","mixtures","solution","solutions","acid","acids","base",
    "bases","salt","salts","sugar","sugars","fat","fats","protein","proteins","vitamin","vitamins",
    "mineral","minerals","nutrient","nutrients","calorie","calories","energy","energies","power",
    "powers","force","forces","motion","motions","speed","speeds","velocity","acceleration",
    "gravity","magnet","magnets","electric","electricity","current","currents","voltage","volt",
    "amp","ampere","watt","watts","joule","joules","newton","newtons","pascal","pascals",
    "hertz","frequency","wave","waves","sound","sounds","light","lights","color","colors",
    "red","blue","green","yellow","orange","purple","pink","brown","black","white","gray",
    "grey","silver","gold","bronze","copper","iron","steel","chrome","nickel","zinc","lead",
    "tin","aluminum","aluminium","titanium","platinum","diamond","ruby","sapphire","emerald",
    "topaz","amethyst","opal","pearl","pearls","jade","turquoise","amber","coral","ivory",
    "bone","bones","ivory","horn","horns","antler","antlers","feather","feathers","fur","hair",
    "scale","scales","shell","shells","claw","claws","fang","fangs","tooth","teeth","beak",
    "beaks","wing","wings","tail","tails","fin","fins","gill","gills","flipper","flippers",
    "paw","paws","hoof","hooves","foot","feet","leg","legs","arm","arms","hand","hands",
    "finger","fingers","thumb","thumbs","toe","toes","nail","nails","skin","hide","pelt",
    "coat","coats","mane","manes","crest","crests","comb","combs","wattle","wattles","spur",
    "spurs","quill","quills","spine","spines","thorn","thorns","prickle","prickles","barb",
    "barbs","hook","hooks","spike","spikes","blade","blades","edge","edges","point","points",
    "tip","tips","end","ends","start","starts","begin","begins","finish","finishes","complete",
    "completes","done","ready","set","go","stop","stops","halt","halts","pause","pauses",
    "resume","resumes","continue","continues","proceed","proceeds","advance","advances","retreat",
    "retreats","withdraw","withdraws","escape","escapes","flee","flees","run","runs","chase",
    "chases","hunt","hunts","seek","seeks","find","finds","search","searches","look","looks",
    "see","sees","watch","watches","observe","observes","notice","notices","spot","spots",
    "detect","detects","discover","discovers","reveal","reveals","uncover","uncovers","expose",
    "exposes","hide","hides","conceal","conceals","cover","covers","mask","masks","disguise",
    "disguises","camouflage","camouflages","blend","blends","match","matches","fit","fits",
    "suit","suits","belong","belongs","own","owns","possess","possesses","have","has","hold",
    "holds","keep","keeps","store","stores","save","saves","preserve","preserves","protect",
    "protects","guard","guards","defend","defends","shield","shields","block","blocks","parry",
    "parries","dodge","dodges","evade","evades","avoid","avoids","miss","misses","hit","hits",
    "strike","strikes","blow","blows","punch","punches","kick","kicks","slash","slashes",
    "stab","stabs","thrust","thrusts","cut","cuts","slice","slices","chop","chops","hack",
    "hacks","cleave","cleaves","split","splits","crack","cracks","break","breaks","shatter",
    "shatters","smash","smashes","crush","crushes","grind","grinds","pulverize","pulverizes",
    "destroy","destroys","ruin","ruins","wreck","wrecks","damage","damages","harm","harms",
    "hurt","hurts","injure","injures","wound","wounds","heal","heals","cure","cures","mend",
    "mends","repair","repairs","fix","fixes","restore","restores","recover","recovers",
    "revive","revives","resurrect","resurrects","rebirth","rebirths","renew","renews","refresh",
    "refreshes","recharge","recharges","refuel","refuels","restock","restocks","replenish",
    "replenishes","refill","refills","reload","reloads","reset","resets","restart","restarts",
    "reboot","reboots","reload","reloads","retry","retries","attempt","attempts","try","tries",
    "effort","efforts","try","tries","attempt","attempts","go","goes","try","tries","shot",
    "shots","chance","chances","opportunity","opportunities","opening","openings","window",
    "windows","door","doors","gate","gates","portal","portals","passage","passages","path",
    "paths","road","roads","trail","trails","track","tracks","route","routes","way","ways",
    "direction","directions","course","courses","journey","journeys","trip","trips","voyage",
    "voyages","expedition","expeditions","quest","quests","mission","missions","task","tasks",
    "job","jobs","duty","duties","role","roles","part","parts","function","functions","purpose",
    "purposes","goal","goals","aim","aims","target","targets","objective","objectives","end",
    "ends","finish","finishes","conclusion","conclusions","result","results","outcome","outcomes",
    "consequence","consequences","effect","effects","impact","impacts","influence","influences",
    "change","changes","shift","shifts","move","moves","motion","motions","action","actions",
    "act","acts","deed","deeds","feat","feats","achievement","achievements","accomplishment",
    "accomplishments","success","successes","victory","victories","triumph","triumphs","win",
    "wins","victory","victories","defeat","defeats","loss","losses","failure","failures","setback",
    "setbacks","obstacle","obstacles","challenge","challenges","difficulty","difficulties","problem",
    "problems","issue","issues","trouble","troubles","crisis","crises","emergency","emergencies",
    "danger","dangers","risk","risks","threat","threats","hazard","hazards","peril","perils",
    "menace","menaces","foe","foes","enemy","enemies","adversary","adversaries","opponent",
    "opponents","rival","rivals","competitor","competitors","challenger","challengers","contender",
    "contenders","candidate","candidates","nominee","nominees","applicant","applicants","entrant",
    "entrants","participant","participants","player","players","competitor","competitors","athlete",
    "athletes","sport","sports","game","games","match","matches","contest","contests","tournament",
    "tournaments","championship","championships","league","leagues","division","divisions","conference",
    "conferences","season","seasons","year","years","month","months","week","weeks","day","days",
    "hour","hours","minute","minutes","second","seconds","moment","moments","instant","instants",
    "time","times","era","eras","age","ages","period","periods","epoch","epochs","eon","eons",
    "century","centuries","decade","decades","millennium","millennia","generation","generations",
    "lifetime","lifetimes","life","lives","existence","existences","being","beings","creature",
    "creatures","organism","organisms","species","species","kind","kinds","type","types","form",
    "forms","shape","shapes","structure","structures","design","designs","pattern","patterns",
    "model","models","template","templates","example","examples","sample","samples","specimen",
    "specimens","instance","instances","case","cases","situation","situations","circumstance",
    "circumstances","condition","conditions","state","states","status","statuses","position",
    "positions","location","locations","place","places","spot","spots","site","sites","area",
    "areas","region","regions","zone","zones","sector","sectors","district","districts","quarter",
    "quarters","neighborhood","neighborhoods","community","communities","society","societies",
    "culture","cultures","civilization","civilizations","nation","nations","country","countries",
    "state","states","province","provinces","territory","territories","land","lands","ground",
    "grounds","earth","earths","world","worlds","planet","planets","globe","globes","sphere",
    "spheres","ball","balls","orb","orbs","circle","circles","ring","rings","loop","loops",
    "cycle","cycles","circuit","circuits","path","paths","route","routes","way","ways","course",
    "courses","track","tracks","trail","trails","road","roads","street","streets","avenue",
    "avenues","boulevard","boulevards","lane","lanes","alley","alleys","path","paths","sidewalk",
    "sidewalks","pavement","pavements","highway","highways","freeway","freeways","expressway",
    "expressways","turnpike","turnpikes","interstate","interstates","route","routes","highway",
    "highways","road","roads","path","paths","way","ways","direction","directions","course",
    "courses","heading","headings","bearing","bearings","compass","compasses","map","maps",
    "chart","charts","atlas","atlases","globe","globes","planetarium","planetariums","observatory",
    "observatories","telescope","telescopes","microscope","microscopes","lens","lenses","mirror",
    "mirrors","glass","glasses","window","windows","door","doors","gate","gates","portal",
    "portals","entrance","entrances","exit","exits","opening","openings","hole","holes","gap",
    "gaps","crack","cracks","fissure","fissures","crevice","crevices","cave","caves","cavern",
    "caverns","tunnel","tunnels","passage","passages","corridor","corridors","hall","halls",
    "hallway","hallways","room","rooms","chamber","chambers","hall","halls","auditorium",
    "auditoriums","theater","theaters","theatre","theatres","cinema","cinemas","stadium",
    "stadiums","arena","arenas","coliseum","coliseums","amphitheater","amphitheaters","forum",
    "forums","square","squares","plaza","plazas","park","parks","garden","gardens","yard",
    "yards","lawn","lawns","field","fields","meadow","meadows","pasture","pastures","prairie",
    "prairies","plain","plains","desert","deserts","tundra","tundras","forest","forests","woods",
    "wood","jungle","jungles","rainforest","rainforests","swamp","swamps","marsh","marshes",
    "bog","bogs","fen","fens","wetland","wetlands","lake","lakes","pond","ponds","pool","pools",
    "river","rivers","stream","streams","creek","creeks","brook","brooks","waterfall","waterfalls",
    "cascade","cascades","rapids","rapid","falls","fall","ocean","oceans","sea","seas","bay",
    "bays","gulf","gulfs","strait","straits","channel","channels","sound","sounds","inlet",
    "inlets","cove","coves","harbor","harbors","port","ports","dock","docks","pier","piers",
    "wharf","wharves","quay","quays","marina","marinas","shipyard","shipyards","boatyard",
    "boatyards","drydock","drydocks","slip","slips","berth","berths","mooring","moorings",
    "anchor","anchors","chain","chains","rope","ropes","cable","cables","line","lines","net",
    "nets","trap","traps","hook","hooks","bait","baits","lure","lures","sinker","sinkers",
    "float","floats","bobber","bobbers","reel","reels","rod","rods","pole","poles","line",
    "lines","tackle","tackles","gear","gears","equipment","equipments","tool","tools","device",
    "devices","machine","machines","engine","engines","motor","motors","pump","pumps","valve",
    "valves","pipe","pipes","tube","tubes","hose","hoses","duct","ducts","vent","vents","shaft",
    "shafts","axle","axles","wheel","wheels","tire","tires","rim","rims","hub","hubs","spoke",
    "spokes","bearing","bearings","gear","gears","cog","cogs","sprocket","sprockets","chain",
    "chains","belt","belts","pulley","pulleys","lever","levers","fulcrum","fulcrums","pivot",
    "pivots","hinge","hinges","joint","joints","link","links","connector","connectors","coupling",
    "couplings","adapter","adapters","fitting","fittings","fastener","fasteners","bolt","bolts",
    "nut","nuts","screw","screws","nail","nails","pin","pins","rivet","rivets","clamp","clamps",
    "clip","clips","bracket","brackets","brace","braces","support","supports","stand","stands",
    "base","bases","foundation","foundations","footing","footings","footing","footings","pillar",
    "pillars","column","columns","post","posts","beam","beams","joist","joists","rafter",
    "rafters","truss","trusses","frame","frames","structure","structures","building","buildings",
    "house","houses","home","homes","dwelling","dwellings","residence","residences","abode",
    "abodes","shelter","shelters","refuge","refuges","haven","havens","sanctuary","sanctuaries",
    "asylum","asylums","retreat","retreats","hideout","hideouts","lair","lairs","den","dens",
    "nest","nests","burrow","burrows","hole","holes","cave","caves","cavern","caverns","grotto",
    "grottos","tunnel","tunnels","passage","passages","corridor","corridors","hall","halls",
    "room","rooms","chamber","chambers","cell","cells","vault","vaults","crypt","crypts",
    "tomb","tombs","grave","graves","cemetery","cemeteries","graveyard","graveyards","burial",
    "burials","funeral","funerals","wake","wakes","memorial","memorials","monument","monuments",
    "statue","statues","sculpture","sculptures","carving","carvings","relief","reliefs","frieze",
    "friezes","mural","murals","painting","paintings","portrait","portraits","landscape",
    "landscapes","still","life","abstract","abstracts","impression","impressions","expression",
    "expressions","cubism","cubisms","surrealism","surrealisms","realism","realisms","modernism",
    "modernisms","postmodernism","postmodernisms","contemporary","contemporaries","classic",
    "classics","traditional","traditionals","folk","folks","pop","pops","rock","rocks","jazz",
    "jazzes","blues","bluese","country","countries","folk","folks","classical","classicals",
    "opera","operas","ballet","ballets","dance","dances","theater","theaters","drama","dramas",
    "comedy","comedies","tragedy","tragedies","musical","musicals","show","shows","performance",
    "performances","act","acts","scene","scenes","act","acts","play","plays","script","scripts",
    "screenplay","screenplays","dialogue","dialogues","monologue","monologues","soliloquy",
    "soliloquies","aside","asides","stage","stages","set","sets","prop","props","costume",
    "costumes","makeup","makeups","lighting","lightings","sound","sounds","effect","effects",
    "special","specials","visual","visuals","cgi","cgis","animation","animations","cartoon",
    "cartoons","comic","comics","manga","mangas","anime","animes","graphic","graphics","novel",
    "novels","book","books","story","stories","tale","tales","fable","fables","myth","myths",
    "legend","legends","epic","epics","saga","sagas","chronicle","chronicles","history","histories",
    "biography","biographies","autobiography","autobiographies","memoir","memoirs","diary",
    "diaries","journal","journals","log","logs","record","records","account","accounts","report",
    "reports","article","articles","essay","essays","paper","papers","thesis","theses","dissertation",
    "dissertations","thesis","theses","paper","papers","study","studies","research","researches",
    "investigation","investigations","inquiry","inquiries","probe","probes","examination",
    "examinations","analysis","analyses","review","reviews","critique","critiques","criticism",
    "criticisms","commentary","commentaries","opinion","opinions","view","views","perspective",
    "perspectives","angle","angles","take","takes","stance","stances","position","positions",
    "stand","stands","attitude","attitudes","outlook","outlooks","mindset","mindsets","mentality",
    "mentalities","philosophy","philosophies","ideology","ideologies","belief","beliefs","faith",
    "faiths","religion","religions","creed","creeds","doctrine","doctrines","dogma","dogmas",
    "tenet","tenets","principle","principles","value","values","ethic","ethics","moral","morals",
    "virtue","virtues","vice","vices","sin","sins","crime","crimes","offense","offenses","felony",
    "felonies","misdemeanor","misdemeanors","infraction","infractions","violation","violations",
    "breach","breaches","transgression","transgressions","wrong","wrongs","error","errors","mistake",
    "mistakes","blunder","blunders","fault","faults","flaw","flaws","defect","defects","imperfection",
    "imperfections","shortcoming","shortcomings","limitation","limitations","constraint","constraints",
    "restriction","restrictions","limitation","limitations","bound","bounds","boundary","boundaries",
    "limit","limits","edge","edges","border","borders","frontier","frontiers","perimeter","perimeters",
    "circumference","circumferences","radius","radii","diameter","diameters","center","centers",
    "middle","middles","core","cores","heart","hearts","nucleus","nuclei","kernel","kernels",
    "seed","seeds","germ","germs","sprout","sprouts","shoot","shoots","bud","buds","bloom",
    "blooms","blossom","blossoms","flower","flowers","petal","petals","stem","stems","stalk",
    "stalks","branch","branches","twig","twigs","leaf","leaves","frond","fronds","needle","needles",
    "spine","spines","thorn","thorns","prickle","prickles","barb","barbs","spike","spikes","point",
    "points","tip","tips","end","ends","extremity","extremities","terminus","termini","terminal",
    "terminals","destination","destinations","goal","goals","target","targets","aim","aims","objective",
    "objectives","purpose","purposes","intent","intents","intention","intentions","plan","plans",
    "scheme","schemes","plot","plots","strategy","strategies","tactic","tactics","maneuver","maneuvers",
    "move","moves","play","plays","action","actions","step","steps","measure","measures","procedure",
    "procedures","process","processes","method","methods","technique","techniques","approach","approaches",
    "way","ways","means","mean","manner","manners","style","styles","fashion","fashions","mode","modes",
    "form","forms","shape","shapes","structure","structures","format","formats","layout","layouts",
    "design","designs","pattern","patterns","template","templates","model","models","prototype","prototypes",
    "example","examples","sample","samples","specimen","specimens","instance","instances","case","cases",
    "illustration","illustrations","demonstration","demonstrations","exhibition","exhibitions","display",
    "displays","show","shows","presentation","presentations","performance","performances","act","acts",
    "scene","scenes","sequence","sequences","series","series","set","sets","collection","collections",
    "group","groups","batch","batches","lot","lots","bunch","bunches","cluster","clusters","bundle",
    "bundles","pack","packs","package","packages","parcel","parcels","packet","packets","box","boxes",
    "container","containers","vessel","vessels","jar","jars","bottle","bottles","can","cans","tin","tins",
    "canister","canisters","drum","drums","barrel","barrels","cask","casks","keg","kegs","tank","tanks",
    "reservoir","reservoirs","cistern","cisterns","pool","pools","pond","ponds","lake","lakes","sea","seas",
    "ocean","oceans","gulf","gulfs","bay","bays","inlet","inlets","cove","coves","harbor","harbors",
    "port","ports","dock","docks","pier","piers","wharf","wharves","quay","quays","marina","marinas"
]);

// Shark Sauce (PopSauce-style) prompt bank — original shark / ocean trivia & visual descriptions
const SHARK_SAUCE_PROMPTS = [
    { type: "text", prompt: "What shark is known as the largest living fish?", answers: ["whale shark","whaleshark"] },
    { type: "text", prompt: "Which shark has a hammer-shaped head?", answers: ["hammerhead","hammerhead shark"] },
    { type: "text", prompt: "What is the fastest shark species?", answers: ["shortfin mako","mako","mako shark"] },
    { type: "text", prompt: "Name the prehistoric giant shark often called the megatooth.", answers: ["megalodon","megalodon shark"] },
    { type: "text", prompt: "Which ocean zone is pitch black and home to many deep-sea sharks?", answers: ["abyssal","abyss","abyssal zone","midnight zone"] },
    { type: "text", prompt: "What do you call a group of sharks?", answers: ["shiver","school","gam"] },
    { type: "text", prompt: "Which sense do sharks primarily use to detect blood from far away?", answers: ["smell","olfaction","scent"] },
    { type: "text", prompt: "What is the name of the shark's electroreception organs?", answers: ["ampullae of lorenzini","ampullae","lorenzini"] },
    { type: "text", prompt: "Which shark is famous for its great white appearance in movies?", answers: ["great white","great white shark","white shark"] },
    { type: "text", prompt: "What is a baby shark called?", answers: ["pup","shark pup"] },
    { type: "text", prompt: "Which shark can survive in both salt and fresh water?", answers: ["bull shark","bull"] },
    { type: "text", prompt: "Name the filter-feeding shark that is the second largest fish.", answers: ["basking shark","basking"] },
    { type: "text", prompt: "What is the term for when a shark leaps fully out of the water?", answers: ["breaching","breach"] },
    { type: "text", prompt: "Which shark has a long flattened snout lined with teeth?", answers: ["sawshark","saw shark"] },
    { type: "text", prompt: "What ocean current is famous for warm water and sharks off the US east coast?", answers: ["gulf stream","gulfstream"] },
    { type: "emoji", prompt: "🦈 + 👑 = ?", answers: ["king of the ocean","apex predator","great white","megalodon"] },
    { type: "emoji", prompt: "🌊 + 🦈 + 💥 = ?", answers: ["feeding frenzy","frenzy","attack"] },
    { type: "emoji", prompt: "🦷 + 🦈 = ?", answers: ["teeth","jaws","bite"] },
    { type: "text", prompt: "Which shark is known for its blue color and long pectoral fins?", answers: ["blue shark","blue"] },
    { type: "text", prompt: "What is the common name for Sphyrna mokarran?", answers: ["great hammerhead","hammerhead"] }
];

if (!localStorage.getItem("shark_users_db")) {
    const defaultRegistry = {};
    defaultRegistry[OWNER_USERNAME] = { password: "Megalodon#789X!_Apex", rank: "Website Owner", pfp: "🦈" };
    localStorage.setItem("shark_users_db", JSON.stringify(defaultRegistry));
}

const AppState = {
    currentUser: JSON.parse(localStorage.getItem("shark_current_user") || "null"),
    activeLobby: JSON.parse(localStorage.getItem("shark_active_lobby") || "null"),
    lobbies: JSON.parse(localStorage.getItem("shark_feasts_lobbies") || "[]"),
    gameActive: false,
    currentLetters: "SHARK",
    roundTimer: null,
    timeLeft: 12,
    // Turn-based Shark Bomb state
    turnOrder: [],
    currentTurnIndex: 0,
    usedWords: new Set(),
    bonusLetters: [...DEFAULT_BONUS_LETTERS],
    playerBonusProgress: {}, // username -> Set of used bonus letters
    minTurnTime: 5,
    // Shark Sauce state
    saucePrompt: null,
    sauceRoundActive: false,
    sauceAnswers: {},
    sauceTimer: null
};

document.addEventListener("DOMContentLoaded", () => {
    initAuthUI();
    resolveUserRank();
    initUserProfileUI();
    initChatToggle();
    initSidebarTabs();
    renderPublicLobbies();
    updateManagementConsolePosition();
    initEventListeners();

    if (AppState.currentUser) {
        document.getElementById("auth-modal-overlay")?.classList.add("hidden");
        document.getElementById("lobby-browser-container")?.classList.remove("hidden");
    } else {
        document.getElementById("auth-modal-overlay")?.classList.remove("hidden");
        document.getElementById("lobby-browser-container")?.classList.add("hidden");
    }

    if (AppState.activeLobby) {
        enterLobby(AppState.activeLobby, false);
    }
});

// ===================== AUTH =====================

function initAuthUI() {
    const signUpTab = document.getElementById("auth-tab-signup");
    const signInTab = document.getElementById("auth-tab-signin");
    const submitBtn = document.getElementById("auth-submit-btn");
    const usernameInput = document.getElementById("auth-username-input");
    const passwordInput = document.getElementById("auth-password-input");
    const errorBanner = document.getElementById("auth-error-banner");

    let isSignUpMode = false;

    signUpTab?.addEventListener("click", () => {
        isSignUpMode = true;
        signUpTab.style.background = "#fff";
        signUpTab.style.color = "#000";
        signInTab.style.background = "transparent";
        signInTab.style.color = "#fff";
        if (submitBtn) submitBtn.textContent = "Create Account";
    });

    signInTab?.addEventListener("click", () => {
        isSignUpMode = false;
        signInTab.style.background = "#fff";
        signInTab.style.color = "#000";
        signUpTab.style.background = "transparent";
        signUpTab.style.color = "#fff";
        if (submitBtn) submitBtn.textContent = "Sign In";
    });

    submitBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        const username = usernameInput?.value.trim() || "";
        const password = passwordInput?.value.trim() || "";
        errorBanner?.classList.add("hidden");

        if (!username || !password) {
            showAuthError("Please enter both username and password.");
            return;
        }

        const globalBans = JSON.parse(localStorage.getItem("shark_global_bans") || "[]");
        if (globalBans.includes(username.toLowerCase())) {
            showAuthError("This account has been banned from SharkFeast.");
            return;
        }

        const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");

        if (isSignUpMode) {
            if (usersDb[username]) {
                showAuthError("Username already exists! Please choose another one or sign in.");
                return;
            }
            usersDb[username] = {
                password: password,
                rank: username.toLowerCase() === OWNER_USERNAME ? "Website Owner" : "Player",
                pfp: "🦈"
            };
            localStorage.setItem("shark_users_db", JSON.stringify(usersDb));
        } else {
            if (!usersDb[username] || usersDb[username].password !== password) {
                showAuthError("Invalid username or password.");
                return;
            }
        }

        AppState.currentUser = { username, rank: usersDb[username].rank, pfp: usersDb[username].pfp };
        localStorage.setItem("shark_current_user", JSON.stringify(AppState.currentUser));

        document.getElementById("auth-modal-overlay")?.classList.add("hidden");
        document.getElementById("lobby-browser-container")?.classList.remove("hidden");

        resolveUserRank();
        initUserProfileUI();
        updateManagementConsolePosition();
        renderPublicLobbies();
    });

    function showAuthError(msg) {
        if (errorBanner) {
            errorBanner.textContent = msg;
            errorBanner.classList.remove("hidden");
        } else {
            alert(msg);
        }
    }
}

function resolveUserRank() {
    if (!AppState.currentUser) return;
    if (AppState.currentUser.username.toLowerCase() === OWNER_USERNAME) {
        AppState.currentUser.rank = "Website Owner";
    } else {
        const staffRanks = JSON.parse(localStorage.getItem("shark_feasts_staff") || "{}");
        const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
        const userRecord = usersDb[AppState.currentUser.username];
        AppState.currentUser.rank = staffRanks[AppState.currentUser.username] || userRecord?.rank || AppState.currentUser.rank || "Player";
    }
}

function isWebsiteStaff(rank) {
    return STAFF_RANKS.includes(rank);
}

// ===================== PROFILE =====================

function initUserProfileUI() {
    if (!AppState.currentUser) return;

    const avatarEl = document.getElementById("user-avatar-placeholder");
    const profileContainer = document.getElementById("user-profile-badge");
    const usernameLabel = document.getElementById("user-display-name");
    const currentUserDisplay = document.getElementById("current-user-display");

    if (usernameLabel) usernameLabel.textContent = AppState.currentUser.username;
    if (currentUserDisplay) currentUserDisplay.textContent = AppState.currentUser.username;

    if (avatarEl && AppState.currentUser.pfp) {
        avatarEl.innerHTML = AppState.currentUser.pfp.startsWith("data:image")
            ? `<img src="${AppState.currentUser.pfp}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
            : AppState.currentUser.pfp;
    }

    if (profileContainer && !document.getElementById("profile-dropdown-menu")) {
        profileContainer.style.position = "relative";
        const dropdown = document.createElement("div");
        dropdown.id = "profile-dropdown-menu";
        dropdown.className = "hidden";
        dropdown.style.cssText = "position:absolute; top:45px; left:0; background:#0f172a; border:1px solid #334155; border-radius:8px; padding:10px; width:150px; z-index:9999; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);";
        dropdown.innerHTML = `
            <div style="font-size:12px; font-weight:bold; color:#38bdf8; margin-bottom:8px; border-bottom:1px solid #1e293b; padding-bottom:4px;">${AppState.currentUser.username}</div>
            <button id="change-pfp-btn" style="width:100%; text-align:left; background:none; border:none; color:white; padding:6px; cursor:pointer; border-radius:4px; font-size:12px;">Change PFP</button>
            <button id="logout-btn" style="width:100%; text-align:left; background:none; border:none; color:#ef4444; padding:6px; cursor:pointer; font-weight:bold; border-radius:4px; font-size:12px;">Logout</button>
        `;
        profileContainer.appendChild(dropdown);

        profileContainer.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", () => dropdown.classList.add("hidden"));

        dropdown.querySelector("#change-pfp-btn").addEventListener("click", () => {
            let hiddenInput = document.getElementById("direct-global-pfp-input");
            if (!hiddenInput) {
                hiddenInput = document.createElement("input");
                hiddenInput.type = "file";
                hiddenInput.id = "direct-global-pfp-input";
                hiddenInput.accept = "image/*";
                hiddenInput.style.display = "none";
                document.body.appendChild(hiddenInput);

                hiddenInput.addEventListener("change", (ev) => {
                    const file = ev.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newPfp = event.target.result;
                        AppState.currentUser.pfp = newPfp;
                        localStorage.setItem("shark_current_user", JSON.stringify(AppState.currentUser));

                        const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
                        if (usersDb[AppState.currentUser.username]) {
                            usersDb[AppState.currentUser.username].pfp = newPfp;
                            localStorage.setItem("shark_users_db", JSON.stringify(usersDb));
                        }
                        initUserProfileUI();
                        if (AppState.activeLobby) renderLobbySeating();
                    };
                    reader.readAsDataURL(file);
                });
            }
            hiddenInput.click();
        });

        dropdown.querySelector("#logout-btn").addEventListener("click", () => {
            AppState.currentUser = null;
            localStorage.removeItem("shark_current_user");
            window.location.reload();
        });
    }
}

// ===================== MANAGEMENT CONSOLE POSITION =====================
// Bottom-middle while browsing lobbies, top-right corner once inside a lobby.
// Visible only to Website Owner / Admin / Mod.

function updateManagementConsolePosition() {
    const managementBtn = document.getElementById("secret-lobby-viewer-btn");
    const isStaff = isWebsiteStaff(AppState.currentUser?.rank);
    const inLobby = AppState.activeLobby !== null;
    if (!managementBtn) return;

    if (!isStaff) {
        managementBtn.classList.add("hidden");
        return;
    }

    managementBtn.classList.remove("hidden");
    managementBtn.textContent = "🛡️ Management Console";
    managementBtn.style.cssText += "border:none; padding:10px 18px; border-radius:8px; cursor:pointer; font-weight:bold; background:#dc2626; color:white; box-shadow:0 0 12px rgba(220,38,38,0.5); z-index:999;";

    if (!inLobby) {
        managementBtn.style.position = "fixed";
        managementBtn.style.bottom = "20px";
        managementBtn.style.left = "50%";
        managementBtn.style.transform = "translateX(-50%)";
        managementBtn.style.top = "auto";
        managementBtn.style.right = "auto";
    } else {
        managementBtn.style.position = "fixed";
        managementBtn.style.top = "15px";
        managementBtn.style.right = "20px";
        managementBtn.style.bottom = "auto";
        managementBtn.style.left = "auto";
        managementBtn.style.transform = "none";
    }
}

// ===================== SIDEBAR / CHAT UI =====================

function initSidebarTabs() {
    document.querySelectorAll(".sidebar-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".sidebar-tab-btn").forEach(b => {
                b.classList.remove("active");
                b.style.background = "transparent";
                b.style.color = "#94a3b8";
            });
            document.querySelectorAll(".sidebar-pane").forEach(p => p.classList.add("hidden"));

            e.currentTarget.classList.add("active");
            e.currentTarget.style.background = "#1e293b";
            e.currentTarget.style.color = "white";

            const paneId = e.currentTarget.getAttribute("data-pane");
            document.getElementById(paneId)?.classList.remove("hidden");

            if (paneId === "lobby-players-tab-pane") renderPlayersTabList();
            if (paneId === "lobby-settings-pane") loadLobbySettingsUI();
        });
    });
}

function initChatToggle() {
    const chatToggleBtn = document.getElementById("chat-toggle-btn");
    const chatSidebar = document.getElementById("chat-sidebar");
    if (chatToggleBtn && chatSidebar) {
        chatToggleBtn.addEventListener("click", () => {
            chatSidebar.classList.toggle("collapsed");
            chatToggleBtn.textContent = chatSidebar.classList.contains("collapsed") ? "---->" : "<----";
        });
    }
}

// ===================== GLOBAL EVENT LISTENERS =====================

function initEventListeners() {
    document.getElementById("open-create-modal-btn")?.addEventListener("click", () => {
        document.getElementById("new-lobby-name-input").value = "";
        document.getElementById("private-lobby-checkbox").checked = false;
        document.getElementById("create-modal")?.classList.remove("hidden");
    });

    document.getElementById("cancel-create-modal-btn")?.addEventListener("click", () => {
        document.getElementById("create-modal")?.classList.add("hidden");
    });

    document.getElementById("confirm-create-lobby-btn")?.addEventListener("click", () => {
        const rawName = document.getElementById("new-lobby-name-input")?.value.trim() || "";
        if (rawName.length < 2) {
            alert("Lobby name must be at least 2 characters.");
            return;
        }

        const newLobby = {
            id: Date.now(),
            name: rawName,
            isPrivate: document.getElementById("private-lobby-checkbox")?.checked || false,
            host: AppState.currentUser.username,
            lobbyMods: [],
            rulesText: "Follow chat rules and respect all players. 🦈",
            gameMode: "Shark Bomb",
            lives: 3,
            maxLives: 5,
            minTurnTime: 5,
            bonusLettersEnabled: true,
            players: [],
            gameParticipants: [],
            playerStates: {},
            mutedPlayers: [],
            bannedPlayers: []
        };

        AppState.lobbies.push(newLobby);
        saveAndCleanLobbies();
        document.getElementById("create-modal")?.classList.add("hidden");
        enterLobby(newLobby, true);
    });

    document.getElementById("secret-lobby-viewer-btn")?.addEventListener("click", () => {
        openManagementConsole();
    });

    document.getElementById("save-lobby-settings-btn")?.addEventListener("click", saveLobbySettings);

    document.getElementById("lobby-lives-range")?.addEventListener("input", (e) => {
        const label = document.getElementById("lobby-lives-val");
        if (label) label.textContent = e.target.value;
    });

    const chatInput = document.getElementById("chat-input-field");
    const chatForm = document.getElementById("chat-input-form") || chatInput?.closest("form");

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInput?.value.trim();
            if (text) {
                handleChatMessage(text);
                chatInput.value = "";
            }
        });
    }

    document.getElementById("leave-lobby-btn")?.addEventListener("click", () => {
        if (AppState.activeLobby) {
            AppState.lobbies = JSON.parse(localStorage.getItem("shark_feasts_lobbies") || "[]");
            const cur = AppState.lobbies.find(l => l.id === AppState.activeLobby.id);
            if (cur) {
                cur.players = (cur.players || []).filter(p => p !== AppState.currentUser.username);
                cur.gameParticipants = (cur.gameParticipants || []).filter(p => p !== AppState.currentUser.username);
                if (cur.playerStates) delete cur.playerStates[AppState.currentUser.username];
                if (cur.lobbyMods) cur.lobbyMods = cur.lobbyMods.filter(p => p !== AppState.currentUser.username);
            }
            saveAndCleanLobbies();
        }
        stopRoundTimer();
        AppState.activeLobby = null;
        AppState.gameActive = false;
        localStorage.removeItem("shark_active_lobby");

        document.getElementById("lobby-screen")?.classList.add("hidden");
        document.getElementById("lobby-browser-container")?.classList.remove("hidden");
        updateManagementConsolePosition();
        renderPublicLobbies();
    });
}

// ===================== CHAT =====================

function handleChatMessage(text) {
    if (!AppState.activeLobby) return;
    if (AppState.activeLobby.mutedPlayers?.includes(AppState.currentUser.username)) {
        appendChatMessage("System", "You are muted in this lobby and cannot send messages.");
        return;
    }
    appendChatMessage(AppState.currentUser.username, text);
}

// ===================== LOBBY ROLE PERMISSIONS =====================

// Host + lobby mods + website staff can kick/ban/mute inside a lobby.
function canModerateLobby() {
    if (!AppState.activeLobby || !AppState.currentUser) return false;
    const isHost = AppState.activeLobby.host === AppState.currentUser.username;
    const isLobbyMod = (AppState.activeLobby.lobbyMods || []).includes(AppState.currentUser.username);
    return isHost || isLobbyMod || isWebsiteStaff(AppState.currentUser.rank);
}

// Only the lobby host (or website staff, as an override) can promote/demote lobby mods.
function canManageLobbyMods() {
    if (!AppState.activeLobby || !AppState.currentUser) return false;
    const isHost = AppState.activeLobby.host === AppState.currentUser.username;
    return isHost || isWebsiteStaff(AppState.currentUser.rank);
}

function isCurrentUserLobbyHost() {
    return AppState.activeLobby && AppState.currentUser && AppState.activeLobby.host === AppState.currentUser.username;
}

// ===================== ENTER LOBBY =====================

function enterLobby(lobbyObj, saveStorage = true) {
    AppState.lobbies = JSON.parse(localStorage.getItem("shark_feasts_lobbies") || "[]");
    const currentLobby = AppState.lobbies.find(l => l.id === lobbyObj.id) || lobbyObj;

    if ((currentLobby.bannedPlayers || []).includes(AppState.currentUser.username)) {
        alert("You are banned from this lobby.");
        return;
    }

    AppState.activeLobby = currentLobby;

    let isNewJoin = false;
    if (!AppState.activeLobby.players) AppState.activeLobby.players = [];
    if (AppState.currentUser && !AppState.activeLobby.players.includes(AppState.currentUser.username)) {
        AppState.activeLobby.players.push(AppState.currentUser.username);
        isNewJoin = true;
    }
    if (!AppState.activeLobby.lives) AppState.activeLobby.lives = 3;

    if (saveStorage) saveAndCleanLobbies();

    document.getElementById("lobby-browser-container")?.classList.add("hidden");
    document.getElementById("auth-modal-overlay")?.classList.add("hidden");
    document.getElementById("lobby-screen")?.classList.remove("hidden");

    updateManagementConsolePosition();
    renderLobbyUI();

    if (isNewJoin) announceUserJoin();
}

function announceUserJoin() {
    const user = AppState.currentUser;
    if (!user) return;
    let alertMsg;
    if (user.rank === "Website Owner") {
        alertMsg = `Beware! Website Owner Has Joined: ${user.username} has joined`;
    } else if (user.rank === "Website Admin") {
        alertMsg = `Website Admin Has Joined: ${user.username} has joined`;
    } else if (user.rank === "Website Mod") {
        alertMsg = `Website Mod Has Joined: ${user.username} has joined`;
    } else {
        alertMsg = `${user.username} has joined the lobby`;
    }
    appendChatMessage("System", alertMsg);
}

function renderLobbyUI() {
    const nameHeader = document.getElementById("current-lobby-name-header");
    if (nameHeader) nameHeader.textContent = AppState.activeLobby.name;

    const badge = document.getElementById("server-type-badge-header");
    if (badge) {
        badge.textContent = AppState.activeLobby.isPrivate ? "Private" : "Public";
        badge.style.background = AppState.activeLobby.isPrivate ? "#7f1d1d" : "#0284c7";
    }

    loadLobbySettingsUI();
    renderLobbySeating();
    renderPlayersTabList();
}

// ===================== LOBBY SETTINGS =====================

function loadLobbySettingsUI() {
    const lobby = AppState.activeLobby;
    if (!lobby) return;

    const rulesInput = document.getElementById("lobby-rules-input");
    const modeSelect = document.getElementById("lobby-gamemode-select");
    const livesRange = document.getElementById("lobby-lives-range");
    const livesVal = document.getElementById("lobby-lives-val");
    const saveBtn = document.getElementById("save-lobby-settings-btn");
    const readonlyNote = document.getElementById("settings-readonly-note");

    if (rulesInput) rulesInput.value = lobby.rulesText || "";
    if (modeSelect) modeSelect.value = lobby.gameMode || "Shark Bomb";
    if (livesRange) livesRange.value = lobby.lives || 3;
    if (livesVal) livesVal.textContent = lobby.lives || 3;

    const editable = isCurrentUserLobbyHost();
    [rulesInput, modeSelect, livesRange].forEach(el => { if (el) el.disabled = !editable; });
    if (saveBtn) saveBtn.classList.toggle("hidden", !editable);
    if (readonlyNote) readonlyNote.classList.toggle("hidden", editable);
}

function saveLobbySettings() {
    if (!AppState.activeLobby) return;

    if (!isCurrentUserLobbyHost()) {
        alert("Only the lobby host can change these settings.");
        return;
    }

    const rulesEl = document.getElementById("lobby-rules-input");
    const modeEl = document.getElementById("lobby-gamemode-select");
    const livesEl = document.getElementById("lobby-lives-range");

    if (rulesEl) AppState.activeLobby.rulesText = rulesEl.value;
    if (modeEl) AppState.activeLobby.gameMode = modeEl.value;
    if (livesEl) {
        const newLives = parseInt(livesEl.value, 10) || 3;
        AppState.activeLobby.lives = newLives;
        Object.keys(AppState.activeLobby.playerStates || {}).forEach(username => {
            if (!(AppState.activeLobby.gameParticipants || []).includes(username)) {
                AppState.activeLobby.playerStates[username].lives = newLives;
            }
        });
    }

    saveAndCleanLobbies();
    renderLobbyUI();
    appendChatMessage("System", `⚙️ ${AppState.currentUser.username} updated the lobby settings.`);
}

// ===================== PLAYERS TAB / MODERATION =====================

function renderPlayersTabList() {
    const listPane = document.getElementById("lobby-players-tab-pane");
    if (!listPane || !AppState.activeLobby) return;

    let html = `<div style="font-weight:bold; color:#38bdf8; margin-bottom:8px;">Players in Lobby (${AppState.activeLobby.players.length})</div>`;
    const canModerate = canModerateLobby();
    const canManageMods = canManageLobbyMods();

    AppState.activeLobby.players.forEach(player => {
        const isPlayerHost = player === AppState.activeLobby.host;
        const isPlayerMod = (AppState.activeLobby.lobbyMods || []).includes(player);
        const isMuted = (AppState.activeLobby.mutedPlayers || []).includes(player);

        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#030712; padding:6px 10px; border-radius:6px; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
                <span style="cursor:pointer; color:#38bdf8;" onclick="openPlayerProfileModal('${player}')">👤 ${player} ${isPlayerHost ? '(Host)' : ''} ${isPlayerMod ? '(Lobby Mod)' : ''} ${isMuted ? '🔇' : ''}</span>
        `;

        let actionButtons = `<div style="display:flex; gap:4px; align-items:center;">`;
        if (canManageMods && player !== AppState.currentUser.username && !isPlayerHost) {
            actionButtons += `<button class="mod-action-btn mod" onclick="toggleLobbyMod('${player}')">${isPlayerMod ? 'Unmod' : 'Mod'}</button>`;
        }
        if (canModerate && player !== AppState.currentUser.username) {
            actionButtons += `<button class="mod-action-btn mute" onclick="toggleMutePlayer('${player}')">${isMuted ? 'Unmute' : 'Mute'}</button>`;
            actionButtons += `<button class="mod-action-btn kick" onclick="kickPlayer('${player}')">Kick</button>`;
            actionButtons += `<button class="mod-action-btn ban" onclick="banPlayer('${player}')">Ban</button>`;
        }
        if (player !== AppState.currentUser.username) {
            actionButtons += `<button class="mod-action-btn" style="background:#374151; color:white;" onclick="reportPlayer('${player}')">Report</button>`;
        }
        actionButtons += `</div>`;
        html += actionButtons + `</div>`;
    });

    listPane.innerHTML = html;
}

window.openPlayerProfileModal = function(username) {
    const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
    const userInfo = usersDb[username] || { rank: "Player", pfp: "🦈" };

    const modal = document.createElement("div");
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:99999;";
    modal.innerHTML = `
        <div style="background:#0f172a; border:1px solid #334155; padding:20px; border-radius:12px; text-align:center; width:280px; color:white;">
            <div style="font-size:40px; margin-bottom:10px;">${userInfo.pfp.startsWith("data:image") ? `<img src="${userInfo.pfp}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;">` : userInfo.pfp}</div>
            <h3 style="color:#38bdf8; margin:0 0 5px 0;">${username}</h3>
            <p style="color:#8b949e; font-size:12px; margin-bottom:15px;">Rank: ${userInfo.rank}</p>
            <button style="padding:6px 12px; font-size:12px; border:none; border-radius:6px; cursor:pointer; background:#334155; color:white;" onclick="this.closest('div').parentElement.remove();">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
};

window.toggleLobbyMod = function(username) {
    if (!canManageLobbyMods()) return;
    if (!AppState.activeLobby.lobbyMods) AppState.activeLobby.lobbyMods = [];

    if (AppState.activeLobby.lobbyMods.includes(username)) {
        AppState.activeLobby.lobbyMods = AppState.activeLobby.lobbyMods.filter(m => m !== username);
        appendChatMessage("System", `${username} is no longer a lobby mod.`);
    } else {
        AppState.activeLobby.lobbyMods.push(username);
        appendChatMessage("System", `${username} has been promoted to lobby mod by ${AppState.currentUser.username}.`);
    }
    saveAndCleanLobbies();
    renderLobbyUI();
};

window.toggleMutePlayer = function(username) {
    if (!canModerateLobby()) return;
    if (!AppState.activeLobby.mutedPlayers) AppState.activeLobby.mutedPlayers = [];

    if (AppState.activeLobby.mutedPlayers.includes(username)) {
        AppState.activeLobby.mutedPlayers = AppState.activeLobby.mutedPlayers.filter(p => p !== username);
        appendChatMessage("System", `🔊 ${username} was unmuted by ${AppState.currentUser.username}.`);
    } else {
        AppState.activeLobby.mutedPlayers.push(username);
        appendChatMessage("System", `🔇 ${username} was muted by ${AppState.currentUser.username}.`);
    }
    saveAndCleanLobbies();
    renderPlayersTabList();
};

window.kickPlayer = function(username) {
    if (!canModerateLobby()) return;
    AppState.activeLobby.players = AppState.activeLobby.players.filter(p => p !== username);
    AppState.activeLobby.gameParticipants = (AppState.activeLobby.gameParticipants || []).filter(p => p !== username);
    if (AppState.activeLobby.playerStates) delete AppState.activeLobby.playerStates[username];
    if (AppState.activeLobby.lobbyMods) AppState.activeLobby.lobbyMods = AppState.activeLobby.lobbyMods.filter(p => p !== username);
    saveAndCleanLobbies();
    renderLobbyUI();
    appendChatMessage("System", `🔨 Player ${username} was kicked from the lobby by ${AppState.currentUser.username}.`);
};

window.banPlayer = function(username) {
    if (!canModerateLobby()) return;
    if (!confirm(`Ban ${username} from this lobby? They won't be able to rejoin.`)) return;
    if (!AppState.activeLobby.bannedPlayers) AppState.activeLobby.bannedPlayers = [];
    if (!AppState.activeLobby.bannedPlayers.includes(username)) AppState.activeLobby.bannedPlayers.push(username);
    window.kickPlayer(username);
    appendChatMessage("System", `⛔ ${username} has been banned from this lobby by ${AppState.currentUser.username}.`);
};

window.reportPlayer = function(username) {
    const reason = prompt(`Reason for reporting ${username}:`);
    if (!reason) return;

    let reports = JSON.parse(localStorage.getItem("shark_lobby_reports") || "[]");
    reports.push({
        reporter: AppState.currentUser.username,
        target: username,
        lobbyName: AppState.activeLobby.name,
        lobbyId: AppState.activeLobby.id,
        reason,
        time: new Date().toLocaleTimeString()
    });
    localStorage.setItem("shark_lobby_reports", JSON.stringify(reports));
    alert("Report submitted to the staff notification mailbox!");
};

// ===================== ARENA SEATING (4 sides around the shark pool) =====================

function renderLobbySeating() {
    const seatingGrid = document.getElementById("player-seating-grid");
    if (!seatingGrid || !AppState.activeLobby) return;

    const lobby = AppState.activeLobby;
    const players = lobby.players || [];
    const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
    const inGameRound = (lobby.gameParticipants || []).includes(AppState.currentUser.username);

    const sides = { top: [], right: [], bottom: [], left: [] };
    const sideOrder = ["top", "right", "bottom", "left"];
    players.forEach((player, idx) => sides[sideOrder[idx % 4]].push(player));

    const currentTurnPlayer = AppState.gameActive && !AppState.sauceRoundActive ? getCurrentTurnPlayer() : null;
    const mode = lobby.gameMode || "Shark Bomb";

    const buildRaft = (player) => {
        const isPlayerHost = player === lobby.host;
        const isPlayerMod = (lobby.lobbyMods || []).includes(player);
        const pfp = usersDb[player]?.pfp || "🦈";
        const inRound = (lobby.gameParticipants || []).includes(player);
        const state = (lobby.playerStates || {})[player];
        const eliminated = inRound && state && state.lives <= 0;
        const isTurn = currentTurnPlayer === player;

        return `
            <div class="raft-seat ${eliminated ? "eliminated" : ""} ${isTurn ? "current-turn" : ""}">
                <div class="raft-avatar">${pfp.startsWith("data:image") ? `<img src="${pfp}">` : pfp}</div>
                <div class="raft-meta">
                    <div class="raft-name">${player}${isPlayerHost ? " ⚓" : isPlayerMod ? " 🛡️" : ""}${isTurn ? " ⚡" : ""}</div>
                    <div class="raft-lives">${eliminated ? "OUT" : inRound ? "❤️".repeat(Math.max(state?.lives ?? lobby.lives, 0)) : "Not in round"}</div>
                </div>
            </div>
        `;
    };

    const emptySlot = `<div class="raft-seat empty">🪵 Empty Seat</div>`;

    const promptLabel = AppState.sauceRoundActive ? "Shark Sauce" : "Typing Prompt";
    const promptContent = AppState.sauceRoundActive && AppState.saucePrompt
        ? `<span class="prompt-syllable" style="font-size:13px; letter-spacing:0.5px; line-height:1.3;">${AppState.saucePrompt.prompt}</span>`
        : `<span class="prompt-syllable" id="active-letters-display">${AppState.currentLetters}</span>`;

    seatingGrid.innerHTML = `
        <div style="color:#e0f2fe; font-weight:bold; margin-bottom:8px; text-align:center;">🌊 SharkFeast Arena — ${mode} 🌊</div>
        <div class="arena-grid">
            <div class="seat-row top">${sides.top.map(buildRaft).join("") || emptySlot}</div>
            <div class="seat-col left">${sides.left.map(buildRaft).join("")}</div>

            <div class="arena-center">
                <div class="prompt-pool" id="prompt-pool">
                    <div class="shark-swimmer" id="arena-shark">🦈</div>
                    <div class="prompt-text-box" id="prompt-text-box">
                        <span class="prompt-label">${promptLabel}</span><br>
                        ${promptContent}
                    </div>
                    <div class="splash-fx" id="splash-fx">💦</div>
                </div>
                <div id="bonus-letters-display" class="bonus-letters-row" title="Use all these letters in your words to gain a life"></div>
            </div>

            <div class="seat-col right">${sides.right.map(buildRaft).join("")}</div>
            <div class="seat-row bottom">${sides.bottom.map(buildRaft).join("") || emptySlot}</div>
        </div>

        <div id="round-timer-display" style="text-align:center; font-size: 13px; font-weight: bold; color: #34d399; margin-top: 14px;">
            ${lobby.gameParticipants?.length ? (AppState.gameActive ? `⏳ ${AppState.timeLeft}s` : "Waiting...") : ""}
        </div>

        <div style="text-align:center; margin-top:10px;">
            <input type="text" id="active-game-word-input" placeholder="${AppState.sauceRoundActive ? "Type your answer..." : "Type word containing the prompt and press Enter..."}" style="width:80%; max-width:340px; padding:10px 14px; border-radius:8px; border:1px solid #38bdf8; background:#030712; color:white; font-size:14px; outline:none;" ${!inGameRound || !AppState.gameActive ? 'disabled' : ''}>
        </div>

        <div class="round-status-line" id="round-status-line"></div>

        <div style="margin-top:14px; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            ${!inGameRound ? `
                <button id="join-game-round-btn" style="background:#22c55e; padding:8px 16px; border:none; border-radius:6px; cursor:pointer; color:white; font-weight:bold;">Join Game Round</button>
            ` : `
                <span style="color:#34d399; font-weight:bold; padding:8px;">You're seated in the arena!</span>
            `}
        </div>
    `;

    document.getElementById("join-game-round-btn")?.addEventListener("click", handleJoinGameRound);

    const activeWordInput = document.getElementById("active-game-word-input");
    if (activeWordInput) {
        activeWordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && AppState.gameActive) {
                const word = e.target.value.trim().toLowerCase();
                e.target.value = "";
                if (AppState.sauceRoundActive) {
                    processSauceAnswer(word);
                } else {
                    processTypingWord(word);
                }
            }
        });
    }

    updateBonusLettersUI();
    refreshRoundStatusLine();
}

function refreshRoundStatusLine() {
    const statusLine = document.getElementById("round-status-line");
    if (!statusLine || !AppState.activeLobby) return;
    const joined = AppState.activeLobby.gameParticipants?.length || 0;
    const mode = AppState.activeLobby.gameMode || "Shark Bomb";

    if (!AppState.gameActive) {
        if (joined === 0) {
            statusLine.textContent = `Mode: ${mode} — Click Join Game Round. Need at least 2 players.`;
        } else if (joined === 1) {
            statusLine.textContent = "Waiting for at least 1 more player to join the round...";
        }
    } else if (AppState.sauceRoundActive) {
        statusLine.textContent = "Shark Sauce — first correct answer scores!";
    } else {
        const turnPlayer = getCurrentTurnPlayer();
        statusLine.textContent = turnPlayer
            ? `Shark Bomb — ${turnPlayer}'s turn | Prompt: ${AppState.currentLetters}`
            : "Round in progress — type fast!";
    }
}

function handleJoinGameRound() {
    const lobby = AppState.activeLobby;
    if (!lobby) return;
    if (!lobby.gameParticipants) lobby.gameParticipants = [];
    if (!lobby.playerStates) lobby.playerStates = {};

    if (lobby.gameParticipants.includes(AppState.currentUser.username)) return;

    lobby.gameParticipants.push(AppState.currentUser.username);
    lobby.playerStates[AppState.currentUser.username] = { lives: lobby.lives || 3 };
    AppState.playerBonusProgress[AppState.currentUser.username] = new Set();
    saveAndCleanLobbies();
    renderLobbySeating();
    appendChatMessage("System", `🦈 ${AppState.currentUser.username} joined the game round.`);

    if (lobby.gameParticipants.length >= 2 && !AppState.gameActive) {
        const mode = lobby.gameMode || "Shark Bomb";
        if (mode === "Shark Sauce") {
            startSharkSauceRound();
        } else {
            beginSharkBombGame();
        }
    } else {
        appendChatMessage("System", "Waiting for at least 2 players before the round can start...");
    }
}

// ===================== SHARK BOMB (turn-based word game) =====================

function beginSharkBombGame() {
    const lobby = AppState.activeLobby;
    if (!lobby) return;

    AppState.gameActive = true;
    AppState.usedWords = new Set();
    AppState.bonusLetters = [...DEFAULT_BONUS_LETTERS];
    AppState.playerBonusProgress = {};
    (lobby.gameParticipants || []).forEach(p => {
        AppState.playerBonusProgress[p] = new Set();
        if (!lobby.playerStates[p]) lobby.playerStates[p] = { lives: lobby.lives || 3 };
    });

    // Build turn order and shuffle lightly
    AppState.turnOrder = [...(lobby.gameParticipants || [])];
    for (let i = AppState.turnOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [AppState.turnOrder[i], AppState.turnOrder[j]] = [AppState.turnOrder[j], AppState.turnOrder[i]];
    }
    AppState.currentTurnIndex = 0;

    appendChatMessage("System", `🎮 Shark Bomb started! ${AppState.turnOrder.length} players. Survive the prompt or get swallowed!`);
    startPlayerTurn();
}

function getCurrentTurnPlayer() {
    if (!AppState.turnOrder.length) return null;
    return AppState.turnOrder[AppState.currentTurnIndex % AppState.turnOrder.length];
}

function startPlayerTurn() {
    stopRoundTimer();
    const lobby = AppState.activeLobby;
    if (!lobby || !AppState.gameActive) return;

    // Skip eliminated players
    let safety = 0;
    while (safety < 20) {
        const player = getCurrentTurnPlayer();
        const state = lobby.playerStates?.[player];
        if (player && state && state.lives > 0) break;
        AppState.currentTurnIndex = (AppState.currentTurnIndex + 1) % Math.max(AppState.turnOrder.length, 1);
        safety++;
    }

    const currentPlayer = getCurrentTurnPlayer();
    if (!currentPlayer) {
        checkForRoundWinner();
        return;
    }

    AppState.currentLetters = LETTER_CHOICES[Math.floor(Math.random() * LETTER_CHOICES.length)];
    // Random timer between 8–18s, inspired by classic bomb-style pressure
    AppState.timeLeft = 8 + Math.floor(Math.random() * 11);
    const minTime = lobby.minTurnTime || AppState.minTurnTime || 5;

    const display = document.getElementById("active-letters-display");
    if (display) display.textContent = AppState.currentLetters;

    const input = document.getElementById("active-game-word-input");
    const isMyTurn = currentPlayer === AppState.currentUser?.username;
    if (input) {
        input.disabled = !isMyTurn;
        input.placeholder = isMyTurn
            ? `Your turn! Type a word containing "${AppState.currentLetters}"...`
            : `Waiting for ${currentPlayer}...`;
        if (isMyTurn) input.focus();
    }

    updateBonusLettersUI();
    appendChatMessage("System", `⏱️ ${currentPlayer}'s turn — prompt: "${AppState.currentLetters}" (${AppState.timeLeft}s)`);
    refreshRoundStatusLine();
    renderLobbySeating();

    AppState.roundTimer = setInterval(() => {
        AppState.timeLeft--;
        const timerDisplay = document.getElementById("round-timer-display");
        if (timerDisplay) {
            timerDisplay.textContent = `⏳ ${getCurrentTurnPlayer()}'s turn — ${AppState.timeLeft}s`;
            timerDisplay.style.color = AppState.timeLeft <= 3 ? "#ef4444" : "#34d399";
        }
        if (AppState.timeLeft <= 0) {
            stopRoundTimer();
            const failed = getCurrentTurnPlayer();
            appendChatMessage("System", `💥 The shark struck! ${failed} ran out of time.`);
            applyLifeLoss(failed);
        }
    }, 1000);
}

function stopRoundTimer() {
    if (AppState.roundTimer) {
        clearInterval(AppState.roundTimer);
        AppState.roundTimer = null;
    }
    if (AppState.sauceTimer) {
        clearInterval(AppState.sauceTimer);
        AppState.sauceTimer = null;
    }
}

function isValidWord(word) {
    if (!word || word.length < 2) return false;
    const upper = word.toUpperCase();
    if (!upper.includes(AppState.currentLetters)) return false;
    if (AppState.usedWords.has(word.toLowerCase())) return false;
    // Accept if in our bank OR if it simply contains the prompt (lenient offline mode)
    return SHARK_WORD_BANK.has(word.toLowerCase()) || word.length >= 3;
}

function processTypingWord(word) {
    if (!AppState.gameActive) return;
    const currentPlayer = getCurrentTurnPlayer();
    if (currentPlayer !== AppState.currentUser?.username) {
        appendChatMessage("System", "It's not your turn!");
        return;
    }

    const clean = (word || "").trim().toLowerCase();
    if (!clean) return;

    if (!isValidWord(clean)) {
        stopRoundTimer();
        if (AppState.usedWords.has(clean)) {
            appendChatMessage("System", `❌ "${clean}" was already used!`);
        } else {
            appendChatMessage("System", `❌ "${clean}" is not valid for "${AppState.currentLetters}".`);
        }
        applyLifeLoss(currentPlayer);
        return;
    }

    stopRoundTimer();
    AppState.usedWords.add(clean);
    appendChatMessage("System", `✅ ${currentPlayer} submitted "${clean}"!`);

    // Bonus letter progress
    applyBonusLetters(currentPlayer, clean);

    // Advance turn; if remaining time was low, give next player the minimum
    const lobby = AppState.activeLobby;
    const minTime = lobby?.minTurnTime || 5;
    AppState.currentTurnIndex = (AppState.currentTurnIndex + 1) % Math.max(AppState.turnOrder.length, 1);

    saveAndCleanLobbies();
    setTimeout(() => startPlayerTurn(), 400);
}

function applyBonusLetters(username, word) {
    const lobby = AppState.activeLobby;
    if (!lobby || lobby.bonusLettersEnabled === false) return;
    if (!AppState.playerBonusProgress[username]) AppState.playerBonusProgress[username] = new Set();

    const progress = AppState.playerBonusProgress[username];
    const upper = word.toUpperCase();
    let gained = false;
    for (const letter of AppState.bonusLetters) {
        if (upper.includes(letter) && !progress.has(letter)) {
            progress.add(letter);
            gained = true;
        }
    }
    if (gained) updateBonusLettersUI();

    if (progress.size >= AppState.bonusLetters.length) {
        const state = lobby.playerStates?.[username];
        const maxLives = lobby.maxLives || 5;
        if (state && state.lives < maxLives) {
            state.lives += 1;
            appendChatMessage("System", `💚 ${username} collected all bonus letters and gained a life! (${state.lives} ❤️)`);
        }
        AppState.playerBonusProgress[username] = new Set(); // reset for another cycle
        updateBonusLettersUI();
        saveAndCleanLobbies();
        renderLobbySeating();
    }
}

function updateBonusLettersUI() {
    const el = document.getElementById("bonus-letters-display");
    if (!el) return;
    const me = AppState.currentUser?.username;
    const progress = AppState.playerBonusProgress[me] || new Set();
    el.innerHTML = AppState.bonusLetters.map(l =>
        `<span class="bonus-letter ${progress.has(l) ? "used" : ""}">${l}</span>`
    ).join("");
}

// ===================== SHARK SAUCE (quiz / prompt race) =====================

function startSharkSauceRound() {
    const lobby = AppState.activeLobby;
    if (!lobby) return;

    AppState.gameActive = true;
    AppState.sauceRoundActive = true;
    AppState.sauceAnswers = {};
    AppState.saucePrompt = SHARK_SAUCE_PROMPTS[Math.floor(Math.random() * SHARK_SAUCE_PROMPTS.length)];
    AppState.timeLeft = 15;

    const display = document.getElementById("active-letters-display");
    if (display) display.textContent = "SAUCE";

    const promptBox = document.getElementById("prompt-text-box");
    if (promptBox) {
        promptBox.innerHTML = `
            <span class="prompt-label">Shark Sauce</span><br>
            <span class="prompt-syllable" style="font-size:14px; letter-spacing:0.5px;">${AppState.saucePrompt.prompt}</span>
        `;
    }

    const input = document.getElementById("active-game-word-input");
    if (input) {
        input.disabled = false;
        input.placeholder = "Type your answer and press Enter...";
        input.focus();
    }

    appendChatMessage("System", `🥤 Shark Sauce round! First correct answer wins the point. 15 seconds.`);
    refreshRoundStatusLine();

    AppState.sauceTimer = setInterval(() => {
        AppState.timeLeft--;
        const timerDisplay = document.getElementById("round-timer-display");
        if (timerDisplay) {
            timerDisplay.textContent = `🥤 Sauce — ${AppState.timeLeft}s left`;
            timerDisplay.style.color = AppState.timeLeft <= 3 ? "#ef4444" : "#38bdf8";
        }
        if (AppState.timeLeft <= 0) {
            stopRoundTimer();
            appendChatMessage("System", `⏰ Time's up! No one got it. Answer was: ${AppState.saucePrompt.answers[0]}`);
            AppState.sauceRoundActive = false;
            setTimeout(() => {
                if ((lobby.gameParticipants || []).length >= 2) startSharkSauceRound();
            }, 2000);
        }
    }, 1000);
}

function processSauceAnswer(answer) {
    if (!AppState.sauceRoundActive || !AppState.saucePrompt) return;
    const clean = (answer || "").trim().toLowerCase();
    if (!clean) return;

    const correct = AppState.saucePrompt.answers.some(a => clean === a.toLowerCase() || clean.includes(a.toLowerCase()));
    if (!correct) {
        appendChatMessage("System", `❌ ${AppState.currentUser.username}: incorrect.`);
        return;
    }

    stopRoundTimer();
    AppState.sauceRoundActive = false;
    appendChatMessage("System", `🏆 ${AppState.currentUser.username} got it! "${clean}"`);
    playSinkAndSplashAnimation();

    // Award a symbolic "point" via a life buff or just chat glory
    const lobby = AppState.activeLobby;
    if (lobby?.playerStates?.[AppState.currentUser.username]) {
        const maxLives = lobby.maxLives || 5;
        if (lobby.playerStates[AppState.currentUser.username].lives < maxLives) {
            lobby.playerStates[AppState.currentUser.username].lives += 1;
            appendChatMessage("System", `💚 Bonus life awarded to ${AppState.currentUser.username}!`);
        }
    }
    saveAndCleanLobbies();
    renderLobbySeating();

    setTimeout(() => {
        if ((lobby.gameParticipants || []).length >= 2 && AppState.gameActive) {
            startSharkSauceRound();
        }
    }, 2500);
}

// ===================== LIFE LOSS / ELIMINATION ANIMATIONS =====================

function applyLifeLoss(username) {
    const lobby = AppState.activeLobby;
    if (!lobby?.playerStates?.[username]) return;

    lobby.playerStates[username].lives -= 1;
    appendChatMessage("System", `💔 ${username} lost a life! (${lobby.playerStates[username].lives} left)`);

    playSinkAndSplashAnimation();

    if (lobby.playerStates[username].lives <= 0) {
        appendChatMessage("System", `🦈 The shark swallowed ${username}! They are out.`);
        playEliminationAnimation(() => {
            lobby.gameParticipants = (lobby.gameParticipants || []).filter(p => p !== username);
            AppState.turnOrder = AppState.turnOrder.filter(p => p !== username);
            if (AppState.currentTurnIndex >= AppState.turnOrder.length) AppState.currentTurnIndex = 0;
            saveAndCleanLobbies();
            renderLobbySeating();
            checkForRoundWinner();
            if (AppState.gameActive && AppState.turnOrder.length >= 2) {
                setTimeout(() => startPlayerTurn(), 700);
            }
        });
    } else {
        // Pass to next player
        AppState.currentTurnIndex = (AppState.currentTurnIndex + 1) % Math.max(AppState.turnOrder.length, 1);
        saveAndCleanLobbies();
        setTimeout(() => {
            renderLobbySeating();
            startPlayerTurn();
        }, 650);
    }
}

function playSinkAndSplashAnimation() {
    const promptBox = document.getElementById("prompt-text-box");
    const splash = document.getElementById("splash-fx");

    if (promptBox) {
        promptBox.classList.add("sinking");
        setTimeout(() => promptBox.classList.remove("sinking"), 550);
    }
    if (splash) {
        splash.classList.remove("active");
        void splash.offsetWidth; // restart animation
        splash.classList.add("active");
    }
}

function playEliminationAnimation(onComplete) {
    const shark = document.getElementById("arena-shark");
    if (!shark) {
        onComplete && onComplete();
        return;
    }
    shark.style.animationPlayState = "paused";
    shark.classList.add("jump-swallow");
    setTimeout(() => {
        shark.classList.remove("jump-swallow");
        shark.style.animationPlayState = "running";
        onComplete && onComplete();
    }, 1100);
}

function checkForRoundWinner() {
    const lobby = AppState.activeLobby;
    if (!lobby) return;
    const remaining = (lobby.gameParticipants || []).filter(p => (lobby.playerStates?.[p]?.lives ?? 0) > 0);

    if (remaining.length <= 1) {
        if (remaining.length === 1) {
            appendChatMessage("System", `🏆 ${remaining[0]} wins the round! The ocean bows to the apex.`);
        } else {
            appendChatMessage("System", "The round ended with no survivors. The shark goes hungry...");
        }
        lobby.gameParticipants = [];
        lobby.playerStates = {};
        AppState.gameActive = false;
        AppState.sauceRoundActive = false;
        AppState.turnOrder = [];
        AppState.usedWords = new Set();
        AppState.playerBonusProgress = {};
        stopRoundTimer();
        saveAndCleanLobbies();
        renderLobbySeating();
    }
}

// ===================== MANAGEMENT CONSOLE (website staff) =====================

function openManagementConsole() {
    const modal = document.getElementById("admin-modal");
    if (!modal) return;

    const rank = AppState.currentUser.rank;
    const isOwner = rank === "Website Owner";
    const isAdmin = rank === "Website Admin";
    const isMod = rank === "Website Mod";

    modal.classList.remove("hidden");
    modal.innerHTML = `
        <div class="admin-modal-card">
            <h3 style="margin-top:0; color:#38bdf8;">SharkFeast Management Console</h3>
            <div class="admin-tabs">
                <button class="tab-btn active" data-target="admin-servers-pane">Server Manager</button>
                <button class="tab-btn" data-target="admin-commands-pane">Command Center</button>
                <button class="tab-btn" data-target="admin-players-pane">All Players</button>
                <button class="tab-btn" data-target="admin-mailbox-pane">Mailbox 📬</button>
                ${isOwner ? '<button class="tab-btn" data-target="admin-ranks-pane">Manage Ranks</button>' : ''}
            </div>

            <div id="admin-servers-pane" class="admin-tab-pane">
                <p style="font-size:12px; color:#8b949e;">Active lobbies and server health control.</p>
                <div id="admin-servers-list" style="margin-top:10px;"></div>
            </div>

            <div id="admin-commands-pane" class="admin-tab-pane hidden">
                <p style="font-size:12px; color:#8b949e;">Website staff commands (${isOwner ? '15 commands' : isAdmin ? '10 commands' : '8 commands'} available). These are separate from lobby-host / lobby-mod controls, which only apply inside a single lobby.</p>
                <textarea id="admin-cmd-textarea" rows="3" placeholder="Type command (e.g. /ban, /mute, /warn)..." style="width:100%; background:#030712; color:white; border:1px solid #374151; padding:8px; border-radius:4px; margin:10px 0;"></textarea>
                <button id="execute-admin-cmd-btn" style="width:100%; margin-bottom:15px; padding:8px; background:#38bdf8; color:black; font-weight:bold; border:none; border-radius:4px; cursor:pointer;">Execute Command</button>
                <div style="background:#030712; padding:10px; border-radius:6px; border:1px solid #1f2937; max-height:150px; overflow-y:auto;">
                    <strong style="color:#38bdf8; font-size:12px;">Authorized Commands (${rank}):</strong>
                    <ul style="margin:5px 0 0 20px; font-size:11px; color:#9ca3af; padding:0;">
                        ${isMod ? `
                            <li>/warn [user] - Issue warning</li>
                            <li>/mute [user] - Global mute</li>
                            <li>/kick [user] - Kick from lobby</li>
                            <li>/reportcheck - Review reports</li>
                            <li>/serverinfo - Check uptime</li>
                            <li>/staffmsg [msg] - Broadcast staff notice</li>
                            <li>/clearchat - Clear global announcements</li>
                            <li>/help - View help guide</li>
                        ` : ''}
                        ${isAdmin ? `
                            <li>/warn [user], /mute [user], /kick [user], /reportcheck, /serverinfo, /staffmsg [msg], /clearchat, /help</li>
                            <li>/ban [user] - Global website ban</li>
                            <li>/unban [user] - Remove global ban</li>
                        ` : ''}
                        ${isOwner ? `
                            <li>All 15 commands unlocked: Full Website Owner Control (Ban, Unban, SetRank, Server Shutdown, Global Broadcasts, Database Purge, Mod Promos, etc.)</li>
                        ` : ''}
                    </ul>
                </div>
            </div>

            <div id="admin-players-pane" class="admin-tab-pane hidden">
                <p style="font-size:12px; color:#8b949e;">Registered users database and online/lobby status:</p>
                <div id="admin-all-players-list" style="margin-top:10px;"></div>
            </div>

            <div id="admin-mailbox-pane" class="admin-tab-pane hidden">
                <p style="font-size:12px; color:#8b949e;">Lobby Reports Mailbox (Exclusive to Website Owner, Admins & Mods — regular players never see this):</p>
                <div id="admin-mailbox-list" style="margin-top:10px;"></div>
            </div>

            ${isOwner ? `
            <div id="admin-ranks-pane" class="admin-tab-pane hidden">
                <p style="font-size:12px; color:#8b949e;">Assign or update player website ranks.</p>
                <input type="text" id="rank-username-input" placeholder="Enter exact username..." style="width:100%; background:#030712; color:white; border:1px solid #374151; padding:8px; border-radius:4px; margin:8px 0;">
                <select id="rank-select-dropdown" style="width:100%; background:#030712; color:white; border:1px solid #374151; padding:8px; border-radius:4px; margin-bottom:12px;">
                    <option value="Player">Player</option>
                    <option value="Website Mod">Website Mod</option>
                    <option value="Website Admin">Website Admin</option>
                </select>
                <button id="apply-rank-btn" style="width:100%; padding:8px; background:#22c55e; color:white; font-weight:bold; border:none; border-radius:4px; cursor:pointer;">Apply Rank</button>
            </div>` : ''}

            <div style="display:flex; justify-content: flex-end; margin-top: 20px;">
                <button id="close-admin-btn" style="background:#374151; color:white; border:none; padding:6px 14px; border-radius:4px; cursor:pointer;">Close Panel</button>
            </div>
        </div>
    `;

    modal.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            modal.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            modal.querySelectorAll(".admin-tab-pane").forEach(p => p.classList.add("hidden"));
            e.currentTarget.classList.add("active");
            modal.querySelector("#" + e.currentTarget.getAttribute("data-target"))?.classList.remove("hidden");
        });
    });

    document.getElementById("close-admin-btn")?.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    document.getElementById("execute-admin-cmd-btn")?.addEventListener("click", () => {
        const val = document.getElementById("admin-cmd-textarea")?.value.trim();
        if (!val) return;
        alert(`Executed command: ${val}`);
        document.getElementById("admin-cmd-textarea").value = "";
    });

    if (isOwner) {
        document.getElementById("apply-rank-btn")?.addEventListener("click", () => {
            const username = document.getElementById("rank-username-input")?.value.trim();
            const selectedRole = document.getElementById("rank-select-dropdown")?.value;
            if (!username) return;

            let staffRanks = JSON.parse(localStorage.getItem("shark_feasts_staff") || "{}");
            if (selectedRole === "Player") delete staffRanks[username];
            else staffRanks[username] = selectedRole;

            localStorage.setItem("shark_feasts_staff", JSON.stringify(staffRanks));
            alert(`Updated ${username} to ${selectedRole}!`);
        });
    }

    renderAdminServersList();
    renderAdminPlayersList();
    renderAdminMailboxList();
}

function renderAdminServersList() {
    const container = document.getElementById("admin-servers-list");
    if (!container) return;
    saveAndCleanLobbies();

    if (AppState.lobbies.length === 0) {
        container.innerHTML = `<p style="color:#8b949e; padding:10px;">No active lobbies right now.</p>`;
        return;
    }

    let html = "";
    AppState.lobbies.forEach(s => {
        html += `
            <div class="admin-list-row">
                <div><strong>${s.name}</strong> <span style="color:${s.isPrivate ? '#a855f7' : '#22c55e'};">(${s.isPrivate ? 'Private' : 'Public'})</span> — Host: ${s.host}</div>
                <button style="background:#dc2626; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="shutdownLobby(${s.id})">Shutdown</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

window.shutdownLobby = function(id) {
    AppState.lobbies = AppState.lobbies.filter(l => l.id !== id);
    localStorage.setItem("shark_feasts_lobbies", JSON.stringify(AppState.lobbies));
    if (AppState.activeLobby && AppState.activeLobby.id === id) {
        AppState.activeLobby = null;
        localStorage.removeItem("shark_active_lobby");
        document.getElementById("lobby-screen")?.classList.add("hidden");
        document.getElementById("lobby-browser-container")?.classList.remove("hidden");
    }
    renderAdminServersList();
    renderPublicLobbies();
    alert("Lobby has been shut down.");
};

function renderAdminPlayersList() {
    const container = document.getElementById("admin-all-players-list");
    if (!container) return;

    const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
    saveAndCleanLobbies();

    let html = "";
    Object.keys(usersDb).forEach(username => {
        const inLobby = AppState.lobbies.find(l => (l.players || []).includes(username));
        const statusText = inLobby ? `In Lobby: ${inLobby.name}` : "Offline / Browsing";
        const statusColor = inLobby ? "#22c55e" : "#8b949e";

        html += `
            <div class="admin-list-row">
                <div><strong>${username}</strong> <span style="color:#38bdf8; font-size:11px;">(${usersDb[username].rank || "Player"})</span></div>
                <div style="color:${statusColor};">${statusText}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderAdminMailboxList() {
    const container = document.getElementById("admin-mailbox-list");
    if (!container) return;

    const reports = JSON.parse(localStorage.getItem("shark_lobby_reports") || "[]");
    if (reports.length === 0) {
        container.innerHTML = `<p style="color:#8b949e; padding:10px;">No lobby reports received in mailbox.</p>`;
        return;
    }

    let html = "";
    reports.forEach(r => {
        html += `
            <div style="background:#030712; padding:10px; border-radius:6px; margin-bottom:8px; border-left:3px solid #ef4444; font-size:12px;">
                <div><strong>Reporter:</strong> ${r.reporter} | <strong>Reported:</strong> <span style="color:#ef4444;">${r.target}</span></div>
                <div style="color:#9ca3af; margin:4px 0;">Reason: ${r.reason}</div>
                <div style="color:#9ca3af; margin:4px 0;">Lobby: ${r.lobbyName} (${r.time})</div>
                <button style="background:#38bdf8; color:black; font-weight:bold; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="joinLobbyById(${r.lobbyId}); document.getElementById('admin-modal').classList.add('hidden');">Join Lobby to Investigate</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ===================== LOBBY LIST / PERSISTENCE =====================

function saveAndCleanLobbies() {
    AppState.lobbies = AppState.lobbies.filter(l => l.players && l.players.length > 0);
    localStorage.setItem("shark_feasts_lobbies", JSON.stringify(AppState.lobbies));
    if (AppState.activeLobby) {
        localStorage.setItem("shark_active_lobby", JSON.stringify(AppState.activeLobby));
    }
}

function renderPublicLobbies() {
    const list = document.getElementById("public-lobbies-list");
    if (!list) return;

    saveAndCleanLobbies();
    const publicLobbies = AppState.lobbies.filter(l => !l.isPrivate);

    if (publicLobbies.length === 0) {
        list.innerHTML = `<p style="color:#8b949e; text-align:center; padding:10px;">No public lobbies active. Create one above!</p>`;
        return;
    }

    let html = "";
    publicLobbies.forEach(l => {
        html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:#030712; border-radius:6px; margin-bottom:8px;">
            <div><strong>${l.name}</strong> <span style="color:#8b949e; font-size:12px;">(Host: ${l.host} — Players: ${l.players.length})</span></div>
            <button style="background:#38bdf8; color:black; font-weight:bold; padding:4px 10px; border:none; border-radius:4px; cursor:pointer;" onclick="joinLobbyById(${l.id})">Join</button>
        </div>`;
    });
    list.innerHTML = html;
}

window.joinLobbyById = function(id) {
    const lobby = AppState.lobbies.find(l => l.id === id);
    if (lobby) enterLobby(lobby, true);
};

function appendChatMessage(sender, text) {
    const box = document.getElementById("chat-messages");
    if (box) {
        box.innerHTML += `<div><strong>${sender}:</strong> ${text}</div>`;
        box.scrollTop = box.scrollHeight;
    }
}
