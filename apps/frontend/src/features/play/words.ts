import { isLadderWord } from "@repo/puzzles";

// The word ladder's dictionary: the puzzle engine's own ladder words (the words it builds ladders
// from), plus a modest pocket list of everyday three- and four-letter words so older three-letter
// ladders and familiar words the engine leaves out still count.

const THREE = `
ace act add ado aft age ago aid aim air ale all and ant any ape apt arc are ark arm art ash ask ate
awe axe bad bag ban bar bat bay bed bee beg bet bib bid big bin bit boa bob bog boo bop bow box boy
bra bud bug bun bus but buy bye cab cad cam can cap car cat cod cog con coo cop cot cow coy cry cub
cue cup cur cut dab dad dam day den dew did die dig dim din dip doe dog don dot dry dub dud due dug
dun duo dye ear eat ebb egg ego elf elk elm emu end era eve ewe eye fab fad fan far fat fax fed fee
fen few fib fig fin fir fit fix flu fly foe fog for fox fry fun fur gag gal gap gas gel gem get gig
gin gnu gob god got gum gun gut guy gym had ham has hat hay hem hen her hew hid him hip his hit hob
hoe hog hop hot how hub hue hug hum hut ice icy ill imp ink inn ion ire irk its ivy jab jam jar jaw
jay jet jig job jog jot joy jug jut keg ken key kid kin kit lab lad lag lap law lay lea led leg let
lid lie lip lit log lot low lug mad man map mar mat maw may men met mew mid mix mob mop mow mud mug
mum nab nag nap nay net new nib nil nip nit nod nor not now nun nut oaf oak oar oat odd ode off oft
oil old one opt orb ore our out owe owl own pad pal pan pap par pat paw pay pea peg pen pep per pet
pew pie pig pin pip pit ply pod pop pot pow pry pub pug pun pup pus put rag ram ran rap rat raw ray
red ref rib rid rig rim rip rob rod roe rot row rub rug rum run rut rye sad sag sap sat saw say sea
see set sew she shy sin sip sir sis sit six ski sky sly sob sod son sop sot sow soy spa spy sty sub
sue sum sun sup tab tad tag tan tap tar tat tax tea ten the tie tin tip toe tog ton too top tot tow
toy try tub tug two urn use van vat vet vex via vie vow wad wag war was wax way web wed wee wet who
why wig win wit woe wok won woo wow yak yam yap yaw yea yen yes yet yew yin you zap zed zen zig zip
zit zoo
`;

const FOUR = `
able ache acid acre acts aged aide aims airy ajar akin alas ally alms aloe also alto ammo amok ants
apex arch area arms army arts atom aunt aura auto avid away awed awry axes axis axle babe baby back
bade bait bake bald bale ball balm band bane bang bank bare bark barn base bash bask bass bath bats
bead beak beam bean bear beat beef been beep beer bees beet bell belt bend bent best beds bike bile
bill bind bird bite bits blew blip blob bloc blog blot blow blue blur boar boat bode body boil bold
bolt bomb bond bone bony book boom boon boot bore born boss both bout bowl bows buck buds buff bugs
bulb bulk bull bump bums bunk buns buoy burn burp bury bush bust busy butt buys buzz cafe cage cake
calf call calm came camp cane cans cape card care carp cars cart case cash cask cast cats cave cell
cent chap chat chef chew chin chip chop chow chug city clad clam clan clap claw clay clip clod clog
clot club clue coal coat coax cobs coco code coil coin coke cola cold cole colt comb come cone cook
cool coop cope cops copy cord core cork corn cost cosy cots coup cove cows cozy crab crew crib crop
crow cube cubs cuff cull cult cups curb curd cure curl cute cuts dais dame damp dams dare dark darn
dart dash data date dawn days daze dead deaf deal dean dear debt deck deed deem deep deer deft defy
dell demo dene dens dent deny desk dews dial dice died dies diet digs dill dime dine ding dint dips
dire dirt disc dish disk diva dive dock dodo doer does doff dogs dole doll dome done doom door dope
dose dote dots dove down doze drab drag dram draw drew drip drop drum dual duck duct dude duel dues
duet dull duly dumb dump dune dung dunk dusk dust duty dyed each earl earn ears ease east easy
eats echo edge edgy edit eels eggs else emit ends envy epic even ever evil exam exit eyed eyes face
fact fade fail fain fair fake fall fame fang fans fare farm fast fate fawn fear feat feed feel fees
feet fell felt fern fest feud fibs figs file fill film find fine fins fire firm fish fist fits five
fizz flag flak flan flap flat flaw flea fled flee flew flex flip flit flog flop flow flue flux foal
foam foes fogs foil fold folk fond font food fool foot ford fore fork form fort foul four fowl foxy
fray free fret frog from fuel full fume fund funk furl fury fuse fuss fuzz gain gait gala gale gall
game gang gape garb gash gasp gate gave gaze gear geek gels gems gene gent germ gift gild gill gilt
gird girl gist give glad glee glen glib glow glue glum gnat gnaw goad goal goat gobs gods goes gold
golf gone gong good goof goon goop gore gory gosh gown grab gram gray grew grey grid grim grin grip
grit grow grub gulf gull gulp gums gunk guns guru gush gust guts guys hack hail hair hale half hall
halo halt hams hand hang hard hare harm harp hash hate hats haul have hawk haze hazy head heal heap
hear heat heck heed heel heir held hell helm help hemp hems hens herb herd here hero hers hide high
hike hill hilt hind hint hips hire hiss hits hive hoax hobs hock hoed hold hole holy home hone honk
hood hoof hook hoop hoot hope hops horn hose host hour hove howl hubs hues huff huge hugs hull hump
hums hung hunk hunt hurl hurt hush husk huts hymn icon idea idle idly idol iffy inch info inks inky
inns into ions iris iron isle itch item jabs jack jade jail jams jars jaws jazz jean jeep jeer jell
jest jets jibe jigs jilt jinx jive jobs jock jogs join joke jolt josh jots jowl joys judo jugs juke
jump junk jury just keel keen keep kelp kept keys kick kids kill kiln kilt kind king kiss kite kits
kiwi knee knew knit knob knot know lace lack lacy lads lady laid lair lake lamb lame lamp land lane
laps lard lark lash lass last late lava lawn laws lays laze lazy lead leaf leak lean leap leek leer
left legs lend lens lent less lest levy liar lice lick lids lied lies life lift like lily limb lime
limp line link lint lion lips lisp list live load loaf loan lobe loch lock lode loft logo logs lone
long look loom loon loop loot lord lore lose loss lost lots loud lout love lows luck lull lump lung
lure lurk lush lust lute lynx mace made maid mail maim main make male mall malt mane many maps mare
mark mart mash mask mass mast mate math mats maze mead meal mean meat meek meet meld melt memo mend
menu meow mere mesh mess mews mice mild mile milk mill mime mind mine mint mire miss mist mite mitt
moan moat mobs mock mode mole molt monk mood moon moor moot mope mops more moss most moth move mown
much muck muds muff mugs mule mull mums murk muse mush musk must mute mutt myth nabs nags nail name
nape naps navy near neat neck need neon nerd nest nets news newt next nice nick nine nips node nods
none nook noon nope norm nose nosy note noun nuts oafs oaks oars oath oats obey odds odes oils oily
okay omen omit once ones only onto ooze opal open opts oral orbs orca ours oust outs oval oven over
owed owes owls owns pace pack pact pads page paid pail pain pair pale palm pals pane pang pans pant
pare park part pass past pate path pave pawn paws pays peak peal pear peas peat peck peek peel peep
peer pegs pens perk perm pert peso pest pets pick pier pies pigs pike pile pill pine ping pink pins
pint pipe pips pits pity plan play plea pleb plod plop plot plow ploy plug plum plus pods poem poet
poke poky pole poll polo pomp pond pony pooh pool poop poor pope pops pore pork port pose posh post
posy pots pour pout pram pray prep prey prim prod prom prop pros prow pubs puck puff pugs pull pulp
puma pump punk puns punt puny pupa pups pure purr push puts putt quay quid quip quit quiz race rack
racy raft rage rags raid rail rain rake ramp rams rang rank rant rare rash rasp rate rats rave rays
raze read real ream reap rear redo reed reef reek reel rein rely rent rest ribs rice rich ride rife
rift rigs rile rims rind ring rink riot ripe rise risk rite road roam roar robe robs rock rode rods
role roll romp roof rook room root rope rose rosy rota rote rots rove rows rubs ruby rude rugs ruin
rule rump rums rune rung runs runt ruse rush rust ruts sack safe saga sage said sail sake sale salt
same sand sane sang sank saps sash sass save saws says scab scan scar seal seam sear seas seat sect
seed seek seem seen seep seer sees self sell semi send sent sets sewn sews shed shin ship shoe shoo
shop shot show shun shut sick side sift sigh sign silk sill silo silt sing sink sins sips sire site
sits size skid skim skin skip skis slab slam slap slat slaw slay sled slew slid slim slip slit slob
slot slow slug slum slur smog snag snap snip snob snot snow snub snug soak soap soar sobs sock soda
sofa soft soil sold sole solo some song sons soon soot sore sort soul soup sour sown sows soya spam
span spar spas spat spec sped spin spit spot spry spud spun spur stab stag star stay stem step stew
stir stop stow stub stud stun such suck suds suit sulk sums sung sunk suns sure surf swam swan swap
swat sway swim swum tabs tack taco tact tags tail take tale talk tall tame tang tank tans taps tarn
tart task taut taxi teal team tear teas teem teen tell temp tend tens tent term tern test text than
that thaw thee them then they thin this thud thug thus tick tide tidy tied tier ties tiff tile till
tilt time tine tins tint tiny tips tire toad toed toes tofu toga toil told toll tomb tome tone tong
tons took tool toot tops tore torn tort toss tote tots tour tout town toys tram trap tray tree trek
trim trio trip trod trot true tsar tuba tube tubs tuck tuft tugs tuna tune turf turn tusk tutu twig
twin twit type tyre ugly undo unit unto upon urge urns used user uses vain vale vamp vane vans vary
vase vast veal veer veil vein vend vent verb very vest veto vets vibe vice view vile vine visa void
vole volt vote vows wade wadi wads waft wage wags waif wail wait wake walk wall wand wane want ward
ware warm warn warp wars wart wary wash wasp watt wave wavy waxy ways weak wean wear webs weds weed
week weep weld well welt went wept were west wets wham what when whet whey whim whip whir whiz whom
wick wide wife wigs wild will wilt wily wimp wind wine wing wink wins wipe wire wiry wise wish wisp
with wits woes woke woks wolf womb wood woof wool word wore work worm worn wove wrap wren writ yaks
yams yank yaps yard yarn yawn yeah year yell yelp yeti yoga yogi yoke yolk your yowl yuck yule zany
zaps zeal zero zest zing zips zone zoom zoos
`;

const WORDS = new Set(`${THREE} ${FOUR}`.split(/\s+/).filter(Boolean));

/** Whether a word counts as a ladder word (any case). `extra` adds words, e.g. a known answer. */
export const knownWord = (word: string, extra: Iterable<string> = []) =>
  isLadderWord(word) ||
  WORDS.has(word.toLowerCase()) ||
  [...extra].some((w) => w.toLowerCase() === word.toLowerCase());

/** How many letters differ between two words of the same length (Infinity if lengths differ). */
export function lettersChanged(a: string, b: string): number {
  if (a.length !== b.length) return Infinity;
  let n = 0;
  for (let i = 0; i < a.length; i++) if (a[i]?.toUpperCase() !== b[i]?.toUpperCase()) n++;
  return n;
}
