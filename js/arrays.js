/*
	FIFA World Cup 2022 draw simulator
    Copyright (C) 2022  soheil boodaghie

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

	contact: soheilboodaghie@gmail.com
*/
// ------------------------------------------------------------
/*
 * all teams data: will be used as a database
 * pot value and id values: based on march 2022 FIFA ranking
 * regional value: Africa: 1, Asia: 2, Europe: 3, North America: 4,
 * South America: 5, Play off between Asia & South America: 25,
 * Play off between North America & Pacific: 4
 * flag: key to the flag images downloaded from flagpedia.net
 */
const allTeams = [
	{ id: 1, name: "Qatar", abrv: "qat", pot: 1, region: 2, flag: "qa" },
	{ id: 2, name: "Brazil", abrv: "bra", pot: 1, region: 5, flag: "br" },
	{ id: 3, name: "Belgium", abrv: "bel", pot: 1, region: 3, flag: "be" },
	{ id: 4, name: "France", abrv: "fra", pot: 1, region: 3, flag: "fr" },
	{ id: 5, name: "Argentina", abrv: "arg", pot: 1, region: 5, flag: "ar" },
	{ id: 6, name: "England", abrv: "eng", pot: 1, region: 3, flag: "gb-eng" },
	{ id: 7, name: "Spain", abrv: "esp", pot: 1, region: 3, flag: "es" },
	{ id: 8, name: "Portugal", abrv: "por", pot: 1, region: 3, flag: "pt" },
	{ id: 9, name: "Mexico", abrv: "mex", pot: 2, region: 4, flag: "mx" },
	{ id: 10, name: "Netherlands", abrv: "ned", pot: 2, region: 3, flag: "nl" },
	{ id: 11, name: "Denmark", abrv: "den", pot: 2, region: 3, flag: "dk" },
	{ id: 12, name: "Germany", abrv: "ger", pot: 2, region: 3, flag: "de" },
	{ id: 13, name: "Uruguay", abrv: "uru", pot: 2, region: 5, flag: "uy" },
	{ id: 14, name: "Switzerland", abrv: "sui", pot: 2, region: 3, flag: "ch" },
	{ id: 15, name: "United States", abrv: "usa", pot: 2, region: 4, flag: "us" },
	{ id: 16, name: "Croatia", abrv: "cro", pot: 2, region: 3, flag: "hr" },
	{ id: 17, name: "Senegal", abrv: "sen", pot: 3, region: 1, flag: "sn" },
	{ id: 18, name: "IR Iran", abrv: "irn", pot: 3, region: 2, flag: "ir" },
	{ id: 19, name: "Japan", abrv: "jpn", pot: 3, region: 2, flag: "jp" },
	{ id: 20, name: "Morocco", abrv: "mar", pot: 3, region: 1, flag: "ma" },
	{ id: 21, name: "Serbia", abrv: "srb", pot: 3, region: 3, flag: "rs" },
	{ id: 22, name: "Poland", abrv: "pol", pot: 3, region: 3, flag: "pl" },
	{
		id: 23,
		name: "Korea Republic",
		abrv: "kor",
		pot: 2,
		region: 2,
		flag: "kr",
	},
	{ id: 24, name: "Tunisia", abrv: "tun", pot: 3, region: 1, flag: "tn" },
	{ id: 25, name: "Cameroon", abrv: "cmr", pot: 4, region: 1, flag: "cm" },
	{ id: 26, name: "Canada", abrv: "can", pot: 4, region: 4, flag: "ca" },
	{ id: 27, name: "Ecuador", abrv: "ecu", pot: 4, region: 5, flag: "ec" },
	{ id: 28, name: "Saudi Arabia", abrv: "ksa", pot: 4, region: 2, flag: "sa" },
	{ id: 29, name: "Ghana", abrv: "gha", pot: 4, region: 1, flag: "gh" },
	{
		id: 30,
		name: "IC Play-off 1",
		abrv: "icp 1",
		pot: 4,
		region: 25,
		flag: "fifa",
	},
	{
		id: 31,
		name: "IC Play-off 2",
		abrv: "icp 2",
		pot: 4,
		region: 4,
		flag: "fifa",
	},
	{
		id: 32,
		name: "European Play-off",
		abrv: "eur",
		pot: 4,
		region: 3,
		flag: "uefa",
	},
];
// ------------------------------------------------------------
/*
 * playoff teams data: same structure as all teams data
 * these teams were not determined at the time of the draw
 */
const playOffTeams = [
	{ id: 30, name: "Australia", abrv: "aus", flag: "au" },
	{ id: 31, name: "Costa Rica", abrv: "crc", flag: "cr" },
	{ id: 32, name: "Wales", abrv: "wal", flag: "gb-wls" },
];
// ------------------------------------------------------------
/*
 * an array storing the status of the teams in terms of usability
 * for the groups. a team can be in two situations:
 * 'used': the team is already in a group and can not be reselected
 * 'unused': the team is available
 */
let teams = [];
for (let i = 0; i < 32; i++) {
	teams[i] = "unused";
}
// by default the host team should be placed in group 1
teams[0] = "used";
// ------------------------------------------------------------
// 8 arrays of length 4 inside an array representing the 8 groups
let groups = [];
for (let i = 0; i < 8; i++) {
	groups[i] = [];
	for (let j = 0; j < 4; j++) {
		groups[i][j] = 32;
	}
}
// by default the host team is the first team of the first group
groups[0][0] = 0;
// ------------------------------------------------------------
