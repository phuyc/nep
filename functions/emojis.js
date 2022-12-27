// Object to use instead of if...else/switch
const ROLES = {
    "Striker": "<:role_striker:1009747263528116334> Striker",
    "Sniper": "<:role_sniper:1009747261682614382> Sniper",
    "Ranger": "<:role_ranger:1009747273019830322> Ranger",
    "Defender": "<:role_defender:1009746831372202014> Defender",
    "Supporter":"<:role_support:1009747241751302344> Supporter",
    "Siege": "<:role_siege:1009747259405115423> Siege",
    "Tower": "<:role_tower:1009747265667223592> Tower"
}

const TYPES = {
    "Counter": "<:type_counter:1009747267466567761> Counter",
    "Soldier": "<:type_soldier:1009747270998179890> Soldier",
    "Mech": "<:type_mech:1009747269286899802> Mech",
    "MechCounter": "<:type_counter:1009747267466567761> Counter <:type_mech:1009747269286899802> Mech",
    "SoldierMech": "<:type_mech:1009747269286899802> Mech <:type_soldier:1009747270998179890> Soldier",
    "CounterCorrupted Object": "<:type_counter:1009747267466567761> Counter <:type_co:1015504113871634472> CO",
    "MechCorrupted Object": "<:type_mech:1009747269286899802> Mech <:type_co:1015504113871634472> CO"
}

const RATINGS = {
    "D": "<:D_:1024285330217640038>",
    "C": "<:C_:1024285328246313041>",
    "B": "<:B_:1024285326270808094>",
    "A": "<:A_:1024285324345622529>",
    "S": "<:S_:1024285317643108383>",
    "SS": "<:SS:1024285320268746762>",
    "SSS": "<:SSS:1024285322433015858>"
}

const REARMS = {
    'r.mina': 'expert-mercenary-yoo-mina',
    'r.yoo mina': 'expert-mercenary-yoo-mina',
    'r.xiao': 'xiao',
    'r.irie': 'best-mascot-irie',
    'r.elizabeth': 'blue-blood-elizabeth',
    'r.esterosa': 'near-astraea-esterosa',
    'r.eujin': 'agent-eujin',
    'r.orca': 'abyssal-ravage-orca',
    'r.miya': 'best-streamer-miya',
    'r.kang': 'investigator-kang',
    'r.sylvia': 'dark-seven-sylvia',
    'r.sorim': 'special-forces-han-sorim',
    'r.han sorim': 'special-forces-han-sorim',
    'r.titan':  'triana-titan',
}

module.exports = { ROLES, TYPES, RATINGS, REARMS }