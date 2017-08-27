const crypto = require('../utils/password-crypto');
const users =  "Wszerad Martynowski,Szymon Piotr Kempny,Grzegorz Drabik,Tomasz Słaboń,Agata Antonkiewicz,Tomasz Wiktorski,Grzegorz Kleszcz,Michal Dyga Mico,Wojtek Wojciech,Marcin Kryska,Dawid Barć,Michał Ryczan,Adam Szymski,Szymon Hamera,Mateusz Jawień,Bolesław Kawik,Michał Bulsza,Konrad Frańczak,Jacek Turczyński,Albert SZ,Marcin Mazański,Krzysztof Pieńkowski,Marcin Rzęsista,Bartek Ad,Jarosław Kaliszewski,Don Dzikus,Katarzyna KZ,Grzegorz Rutkowski,Ali Krk,Roger Leclerc,Andrzej Sierant,Iwo Dra,Marek Piwowarski,Raf Za,Piotr Miś,Wojciech Domański,Krzysztof Walilko,Igor Bęben,Cristian Kencki,Jozef Lysek,Grzegorz Gałek,Dariusz Raglewski,Stanislaw Osika,Patryk Olszewski,Ania M. Huppert,Kuba OX,Grzegorz Olejnik,Sebastian Lenart,Paweł Syc,Jan Irzyk,Czesław Piłat,Krzysztof Dybała,Mariusz Augustyn,Jarosław Burda,Andrzej Kramarczyk,Łukasz Gosek,Wojtek Pszyk,Basia Wieczorek,Mateusz Tomiak,Filip Durda,Karol Bałdyga,Maciej Maciejewski,Tomasz Wróbel,Grzegorz Pulanecki,Cristian Orłowski,Paweł Skowroński,Maciej Kusmierczyk,Marek Długosz,Jakub Fall,Dawid Ćwierz,Wiktor Durło,Zbigniew Batkiewicz,Ja Jaca,Kasia Kendzior,Tomasz Możejko,Kazimierz Kurowski,Jacek Jutka,Kasik Czernicka,Adam ToAdam,Bartek Nowak,Anastazja Pająk,Jakub Szafraniec,Paskal Balcer,Adam Wnęk,Konrad Zygmunt,Asia Martyna,Mirosław Mucha,Andrzej Adamek,Karol Łapczyński,Bartek Kukiełka,Krzysztof Kowalik,Michał Osika,Paweł Pyszno,Szymon Wójcik,Przemek Bulsza,Artur Szwed,Marcin Sigmund,Roman Matyjewicz,Czarek Stefańczyk,Wojciech Parda,Jarosław Lewenko,Jacek Płaszczak,Paweł Ślusarczyk,Jakub Wczelik,Patryk Oleś,Jacek Barski,Antoni Pisarczyk,Leszek Przybyłka,Andrzej Parchyta,Rafał Patrzałek,Piotr Bagazja,Bartek Jemielniak,Maciej Podołowski,Rafal Oksiwzan,Mirosław Mokrzycki,Radosław Repeć,Piotr Hydzik,Michał Klich,Szymon Szczurek,Alexander Banaś,Paweł Wieczorek,Paweł Bahyrycz,Elżbieta Witkowska,Miłosz Bryla,Maciej Brzeziński,Michał Zawadzak,Jakub Janus,Karol Sendorek,Jacek Cichy,Bartek Pajdak,Łukasz Kwiatek,Przemek Zender,Radoslaw Bilcz,Aleksandra Piechnik,Sławomir Smoleń,Wojtek Dyga,Przemysław Surma,Arek Madetko,Tomek Buszewski,Dominik Grzywnowicz,Judyta Gibalska,Piotr Trębacz,Lukasz Janowski,Paweł Witkowski,Grzegorz Kurtyka,Łukasz Piechówka,Przemek Zacharias,Agnieszka Grzesiuła,Łukasz Polowiec,Maciek Łabno,Cezary 'czaro' Drenda,Radek Nadolny,Marcin Wieczorek,Marian Wajda,Tomek Milak,Tom Urban,Waldemar Kuras,Ireneusz Paś,Stanisław Kozak,Andrej Augustynek,Hadrian Polewczak,Łukasz Mocny,Paula Wojciechowska,Darek Piaskowski,Marek Rejko,Kaśka Ko,Maciej Walasek,Artur Szczepaniak,Milena Kubiak,Anna Mazur,Konrad Skwarczek,Szczepan Ostasz,Dawid Zając,Maciej Murawski,Aga Garstka,Piotr Wieczorek,Radosław Rydel,Marek Michalec Noe Balloons,Robert Jończy,Leszek Mańkowski,Sabina Hawryłko,Tomasz Markowski,Łukasz Zuba,Łukasz Stilon,Kilo Mike,Piotr Szafruga,Piotr Słota,Milosz Kubanski,Agnieszka Bednarz,Kajetan Mis,Piotr Wilk,Krzysztof Zdanowski,Mateusz Matula,Aleksander Demian,Pawel Kusmierski,Bartłomiej Szczudło".split(',');
const password = 'haslo';
const ROOTPassword = '?ProF1_#';

module.exports = {
	getRandomUsers() {
		return crypto
			.hash(password)
			.then(pass => {
				return users
					.map(name => {
						return {
							_id: name,
							name,
							email: name.replace(/\s/, '.').toLowerCase(),
							password: pass,
							admin: false,
							instructor: false,
							active: true,
							root: false
						};
					})
					.concat([
						{
							_id: 'Malysz Adam',
							name: 'Malysz Adam',
							email: 'adam',
							password: pass,
							active: false,
							admin: false,
							instructor: false,
							root: false
						},
						{
							_id: 'Norris Chuck',
							name: 'Norris Chuck',
							email: 'chuck',
							password: pass,
							active: true,
							admin: true,
							instructor: false,
							root: false
						},
						{
							_id: 'Iron Man',
							name: 'Iron Man',
							email: 'iron',
							password: pass,
							active: true,
							admin: true,
							instructor: true,
							root: false
						}
					]);
			});
	},
	getROOTUser() {
		return crypto
			.hash(ROOTPassword)
			.then(pass => {
				return {
					_id: 'ROOT',
					name: 'ROOT',
					email: 'ROOT',
					password: pass,
					active: true,
					admin: true,
					instructor: false,
					root: true
				};
			});
	}
};