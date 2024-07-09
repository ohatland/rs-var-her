export interface Ship {
  nr: number;
  navn: string;
  mmsi: number;
  klasse: ShipType
}

enum ShipType {
  Simrad,
  Bergesen,
  Staff,
  Ulstein,
  Fosen,
  PetterSundt, // Petter C. G. Sundt
  Andre,
  EmmyDyvi,
  vonKoss,
  Skomvær,
  Ambulansebåt,
  Støttefartøy,
  RescueRunner,
  Hovercraft,
}

export const allShips: Ship[] = [
  {
    nr: 176,
    navn: "Leif-Erik Simonsen",
    mmsi: 259024040,
    klasse: ShipType.Ulstein
  },
  {
    nr: 175,
    navn: "Wilhelm Wilhelmsen",
    mmsi: 258027670,
    klasse: ShipType.Staff
  },
  {
    nr: 174,
    navn: "Oscar Tybring V",
    mmsi: 259005900,
    klasse: ShipType.Fosen
  },
  {
    nr: 173,
    navn: "Erling Skjalgsson",
    mmsi: 258002830,
    klasse: ShipType.Ulstein
  },
  {
    nr: 172,
    navn: "Ragnar Stoud Platou",
    mmsi: 257126540,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 171,
    navn: "Ivar Formo",
    mmsi: 257089480,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 170,
    navn: "Prinsesse Ragnhild",
    mmsi: 257067640,
    klasse: ShipType.Staff
  },
  {
    nr: 169,
    navn: "Odd Fellow III",
    mmsi: 257035500,
    klasse: ShipType.Ulstein
  },
  {
    nr: 168,
    navn: "Hans Herman Horn",
    mmsi: 257035360,
    klasse: ShipType.Ulstein
  },
  {
    nr: 167,
    navn: "UNI Sognefjord",
    mmsi: 257037300,
    klasse: ShipType.Staff
  },
  {
    nr: 166,
    navn: "Horn Stayer",
    mmsi: 257003590,
    klasse: ShipType.Staff
  },
  {
    nr: 165,
    navn: "Askeladden",
    mmsi: 257003560,
    klasse: ShipType.Staff
  },
  {
    nr: 164,
    navn: "Jens Bye",
    mmsi: 257003550,
    klasse: ShipType.Staff
  },
  {
    nr: 163,
    navn: "Kristian Gerhard Jebsen II",
    mmsi: 257952600,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 162,
    navn: "Klaveness Marine",
    mmsi: 257928800,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 161,
    navn: "Einar Staff Sr.",
    mmsi: 257795700,
    klasse: ShipType.Staff
  },
  {
    nr: 160,
    navn: "Horn Rescue",
    mmsi: 257641000,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 159,
    navn: "Elias",
    mmsi: 257654700,
    klasse: ShipType.Bergesen
  },
  {
    nr: 158,
    navn: "Idar Ulstein",
    mmsi: 257393000,
    klasse: ShipType.Ulstein
  },
  {
    nr: 157,
    navn: "Bill",
    mmsi: 257565700,
    klasse: ShipType.Bergesen
  },
  {
    nr: 156,
    navn: "Eivind Eckbo",
    mmsi: 257556800,
    klasse: ShipType.Bergesen
  },
  {
    nr: 155,
    navn: "Bendt R. Rasmussen",
    mmsi: 257556700,
    klasse: ShipType.Bergesen
  },
  {
    nr: 154,
    navn: "Det Norske Veritas II",
    mmsi: 257556500,
    klasse: ShipType.Bergesen
  },
  {
    nr: 152,
    navn: "Bergesen d.y",
    mmsi: 257165800,
    klasse: ShipType.Bergesen
  },
  {
    nr: 151,
    navn: "Sjømann",
    mmsi: 257123900,
    klasse: ShipType.Bergesen
  },
  {
    nr: 150,
    navn: "Odin",
    mmsi: 258280500,
    klasse: ShipType.Fosen
  },
  {
    nr: 149,
    navn: "Uni Røros",
    mmsi: 257492500,
    klasse: ShipType.Andre
  },
  {
    nr: 148,
    navn: "Mjøsvekteren",
    mmsi: 257150500,
    klasse: ShipType.Andre
  },
  {
    nr: 147,
    navn: "Inge Steensland",
    mmsi: 258257500,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 146,
    navn: "Stormbull",
    mmsi: 258258500,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 145,
    navn: "Vekteren",
    mmsi: 258277500,
    klasse: ShipType.Simrad
  },
  {
    nr: 144,
    navn: "Uni Helgeland",
    mmsi: 258276500,
    klasse: ShipType.Simrad
  },
  {
    nr: 143,
    navn: "Uni Kragerø",
    mmsi: 257024500,
    klasse: ShipType.Bergesen
  },
  {
    nr: 142,
    navn: "Horn Flyer",
    mmsi: 258235500,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 141,
    navn: "Mærsk",
    mmsi: 258217500,
    klasse: ShipType.Simrad
  },
  {
    nr: 140,
    navn: "Bjarne Kyrkjebø",
    mmsi: 258150500,
    klasse: ShipType.Simrad
  },
  {
    nr: 139,
    navn: "Uni Oslofjord",
    mmsi: 258092500,
    klasse: ShipType.Simrad
  },
  {
    nr: 138,
    navn: "Sundt Flyer",
    mmsi: 259192000,
    klasse: ShipType.PetterSundt
  },
  {
    nr: 137,
    navn: "Kristian Gerhard Jebsen",
    mmsi: 258144000,
    klasse: ShipType.Fosen
  },
  {
    nr: 136,
    navn: "Halfdan Grieg",
    mmsi: 259176000,
    klasse: ShipType.Fosen
  },
  {
    nr: 135,
    navn: "Kaptein E. Nygård",
    mmsi: 258027500,
    klasse: ShipType.Simrad
  },
  {
    nr: 134,
    navn: "Uni Femunden",
    mmsi: 258233500,
    klasse: ShipType.Andre
  },
  {
    nr: 132,
    navn: "Gjert Wilhelmsen",
    mmsi: 258005500,
    klasse: ShipType.Fosen
  },
  {
    nr: 131,
    navn: "Uni",
    mmsi: 257964900,
    klasse: ShipType.Simrad
  },
  {
    nr: 130,
    navn: "Utvær",
    mmsi: 257959900,
    klasse: ShipType.Simrad
  },
  {
    nr: 129,
    navn: "Une Amundsen",
    mmsi: 257918900,
    klasse: ShipType.Simrad
  },
  {
    nr: 128,
    navn: "Gideon",
    mmsi: 257904900,
    klasse: ShipType.Simrad
  },
  {
    nr: 127,
    navn: "Ryfylke",
    mmsi: 257895900,
    klasse: ShipType.Simrad
  },
  {
    nr: 126,
    navn: "Harald V",
    mmsi: 258073000,
    klasse: ShipType.Fosen
  },
  {
    nr: 125,
    navn: "Det Norske Veritas",
    mmsi: 259193000,
    klasse: ShipType.Fosen
  },
  {
    nr: 124,
    navn: "Simrad Buholmen SRK",
    mmsi: 257744900,
    klasse: ShipType.Simrad
  },
  {
    nr: 122,
    navn: "Simrad Færder",
    mmsi: 257733900,
    klasse: ShipType.Simrad
  },
  {
    nr: 120,
    navn: "Sundt",
    mmsi: 257677900,
    klasse: ShipType.Simrad
  },
  {
    nr: 114,
    navn: "Bergen Kreds",
    mmsi: 259473000,
    klasse: ShipType.EmmyDyvi
  },
  {
    nr: 113,
    navn: "Erik Bye",
    mmsi: 259460000,
    klasse: ShipType.EmmyDyvi
  },
  {
    nr: 111,
    navn: "Peter Henry von Koss",
    mmsi: 259343000,
    klasse: ShipType.vonKoss
  },
  {
    nr: 110,
    navn: "Reidar von Koss",
    mmsi: 259313000,
    klasse: ShipType.vonKoss
  },
  {
    nr: 108,
    navn: "Kaptein Buhre",
    mmsi: 257218500,
    klasse: ShipType.Skomvær
  },
  {
    nr: 107,
    navn: "Knut Hoem",
    mmsi: 257227000,
    klasse: ShipType.Skomvær
  },
  {
    nr: 103,
    navn: "Dagfinn Paust",
    mmsi: 257246500,
    klasse: ShipType.Skomvær
  },
  {
    nr: 423,
    navn: "Eyr Åsvær",
    mmsi: 257807490,
    klasse: ShipType.Ambulansebåt
  },
  {
    nr: 422,
    navn: "Eyr Myken",
    mmsi: 257054000,
    klasse: ShipType.Ambulansebåt
  },
  {
    nr: 421,
    navn: "Eyr Bremstein",
    mmsi: 257029000,
    klasse: ShipType.Ambulansebåt
  },
  {
    nr: 420,
    navn: "Eyr Ytterholmen",
    mmsi: 257047000,
    klasse: ShipType.Ambulansebåt
  },
  {
    nr: 811,
    navn: "Inger Johanne",
    mmsi: 258022120,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 810,
    navn: "Berge liv",
    mmsi: 259004550,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 809,
    navn: "Nicolai Jarlsby",
    mmsi: 258012180,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 808,
    navn: "Sjøvekteren",
    mmsi: 258012170,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 807,
    navn: "Uni Oksøy",
    mmsi: 258012160,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 806,
    navn: "UNI Torungen",
    mmsi: 257075370,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 805,
    navn: "Dora Elsebeth",
    mmsi: 257075360,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 804,
    navn: "Folke Patriksson II",
    mmsi: 257075260,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 803,
    navn: "Folke Patriksson I",
    mmsi: 257075250,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 802,
    navn: "Norsk Tipping II",
    mmsi: 257075230,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 801,
    navn: "Norsk Tipping I",
    mmsi: 257075210,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 953,
    navn: "Rescue Runner 03",
    mmsi: 259034810,
    klasse: ShipType.RescueRunner
  },
  {
    nr: 952,
    navn: "Rescue Rib",
    mmsi: 259034820,
    klasse: ShipType.Støttefartøy
  },
  {
    nr: 951,
    navn: "Rescue Runner 02",
    mmsi: 259004540,
    klasse: ShipType.RescueRunner
  },
  {
    nr: 950,
    navn: "Rescue Runner 01",
    mmsi: 259004560,
    klasse: ShipType.RescueRunner
  },
  {
    nr: 903,
    navn: "Frikken",
    mmsi: 257110290,
    klasse: ShipType.Hovercraft
  },
  {
    nr: 902,
    navn: "Klaveness stiftelsen",
    mmsi: 258004210,
    klasse: ShipType.Hovercraft
  },
  {
    nr: 901,
    navn: "Isvekteren",
    mmsi: 257085670,
    klasse: ShipType.Hovercraft
  },
]