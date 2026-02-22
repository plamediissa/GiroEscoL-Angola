export const ANGOLA_GEOGRAPHY: Record<string, string[]> = {
  "Bengo": ["Ambriz", "Bula Atumba", "Dande", "Dembos", "Nambuangongo", "Pango Aluquém"],
  "Benguela": ["Balombo", "Baía Farta", "Benguela", "Catumbela", "Chongorói", "Ganda", "Lobito", "Seles", "Sumbe"],
  "Bié": ["Andulo", "Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuemba", "Cunhinga", "Kuito", "Nharea"],
  "Cabinda": ["Belize", "Buco-Zau", "Cabinda", "Cacongo"],
  "Cuando Cubango": ["Calai", "Cuangar", "Cuchi", "Cuito Cuanavale", "Dirico", "Mavinga", "Menongue", "Nancova", "Rivungo"],
  "Cuanza Norte": ["Ambaca", "Banga", "Bolongongo", "Cambambe", "Cazengo", "Golungo Alto", "Gonguembo", "Lucala", "Quiculungo", "Samba Caju"],
  "Cuanza Sul": ["Amboim", "Cassongue", "Cela", "Conda", "Ebo", "Libolo", "Mussende", "Porto Amboim", "Quibala", "Quilenda", "Seles", "Sumbe"],
  "Cunene": ["Cahama", "Cuanhama", "Curoca", "Cuvelai", "Namacunde", "Ombadja"],
  "Huambo": ["Bailundo", "Caála", "Catchiungo", "Ecunha", "Huambo", "Londuimbali", "Longonjo", "Mungo", "Tchicala-Tcholoanga", "Tchindjenje", "Ucuma"],
  "Huíla": ["Caconda", "Cacula", "Caluquembe", "Chiange", "Chibia", "Chicomba", "Chipindo", "Cuvango", "Humpata", "Jamba", "Lubango", "Matala", "Quilengues", "Quipungo"],
  "Luanda": ["Belas", "Cacuaco", "Cazenga", "Icolo e Bengo", "Luanda", "Quiçama", "Kilamba Kiaxi", "Talatona", "Viana"],
  "Lunda Norte": ["Cambulo", "Capenda-Camulemba", "Caungula", "Chitato", "Cuilo", "Cuango", "Lubalo", "Lucapa", "Xá-Muteba"],
  "Lunda Sul": ["Cacolo", "Dala", "Muconda", "Saurimo"],
  "Malanje": ["Cacuso", "Calandula", "Cambundi-Catembo", "Cangandala", "Caombo", "Cuaba Nzogo", "Cunda-Dia-Baze", "Luquembo", "Malanje", "Marimba", "Massango", "Mucari", "Quela", "Quirima"],
  "Moxico": ["Alto Zambeze", "Bundas", "Camanongue", "Cameia", "Léua", "Luau", "Luacano", "Luchazes", "Moxico"],
  "Namibe": ["Bibala", "Camucuio", "Moçâmedes", "Tômbwa", "Virei"],
  "Uíge": ["Ambuila", "Bembe", "Buengas", "Bungo", "Damba", "Milunga", "Mucaba", "Negage", "Puri", "Quimbele", "Quitexe", "Sanza Pombo", "Songo", "Uíge", "Zombo"],
  "Zaire": ["Cuimba", "M'banza Kongo", "Noqui", "Nzeto", "Soyo", "Tomboco"]
};

// Common neighborhoods for major municipalities (simplified for demo)
export const COMMON_NEIGHBORHOODS: Record<string, string[]> = {
  "Luanda": ["Maianga", "Ingombota", "Samba", "Rangel", "Sambizanga", "Rocha Pinto", "Cassequel", "Prenda"],
  "Viana": ["Viana Sede", "Zango 1", "Zango 2", "Zango 3", "Zango 4", "Zango 5", "Kikuxi", "Baia"],
  "Belas": ["Kilamba", "Benfica", "Futungo", "Ramiros"],
  "Cazenga": ["Hoji-ya-Henda", "Tala Hady", "Cazenga Popular", "Kalawenda"],
  "Talatona": ["Talatona Sede", "Camama", "Cidade Universitária", "Lar do Patriota"],
  "Kilamba Kiaxi": ["Palanca", "Golf 1", "Golf 2", "Sapú", "Nova Vida"],
  "Lobito": ["Lobito Velho", "Restinga", "Bela Vista", "Canata"],
  "Benguela": ["Benguela Sede", "Cassequel", "Quartel"],
  "Huambo": ["Huambo Sede", "Fátima", "Santo António"],
  "Lubango": ["Lubango Sede", "Lucrécia", "N'gola"],
  "Cabinda": ["Cabinda Sede", "Luvassa", "Simulambuco"]
};

export const getNeighborhoods = (municipality: string): string[] => {
  return COMMON_NEIGHBORHOODS[municipality] || ["Centro", "Bairro Operário", "Bairro da Luz", "Bairro Novo"];
};
