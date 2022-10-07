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
// takes the id of a group and returns its letter title
let giveGroupName = (num) => {
	let title;

	switch (num) {
		case 0:
			title = "A";
			break;
		case 1:
			title = "B";
			break;
		case 2:
			title = "C";
			break;
		case 3:
			title = "D";
			break;
		case 4:
			title = "E";
			break;
		case 5:
			title = "F";
			break;
		case 6:
			title = "G";
			break;
		case 7:
			title = "H";
			break;
	}

	return title;
};
// ------------------------------------------------------------------------------------------
// creates groups elements on the page
let displayGroups = () => {
	let pageGroup = document.getElementById("groups");
	pageGroup.innerHTML = "";

	// 8 groups containing 4 teams in each
	for (let i = 0; i < 8; i++) {
		let group = document.createElement("div");
		group.classList.add("group");
		group.id = `group-${i + 1}`;

		// the name of the group
		let groupName = document.createElement("div");
		let title = giveGroupName(i);
		groupName.innerHTML = `<p><span class="hideable">Group</span> ${title}</p>`;
		groupName.classList.add("title");
		group.appendChild(groupName);

		// 4 teams in each group with a flag and a name
		// content may differ depending on the situation of each team
		for (let j = 0; j < 4; j++) {
			let team = document.createElement("div");
			team.classList.add(`team`);

			// ------------------------------
			// flag
			let teamFlag = document.createElement("div");
			teamFlag.classList.add("flag");

			// name
			let teamName = document.createElement("div");
			teamName.classList.add("name");

			// ------------------------------
			// creates flag empty section
			let emptyFlag = document.createElement("div");
			emptyFlag.classList.add("flag-section");

			// creates name empty section
			let emptyName = document.createElement("div");
			emptyName.classList.add("name-section");

			teamFlag.appendChild(emptyFlag);
			teamName.appendChild(emptyName);
			// ------------------------------
			// creates occupied flag and name
			let occupiedFlag = document.createElement("div");
			occupiedFlag.classList.add("flag-section");

			let occupiedName = document.createElement("div");
			occupiedName.classList.add("name-section");

			let teamId = groups[i][j];

			// if this position of the group is occupied creates team occupied section
			if (teamId !== 32) {
				team.classList.add("occupied");

				occupiedFlag.style.backgroundImage = `url("/assets/flags/${allTeams[teamId].flag}.png")`;
				occupiedName.innerText = allTeams[teamId].abrv;
			}

			teamFlag.appendChild(occupiedFlag);
			teamName.appendChild(occupiedName);
			// ------------------------------
			// if this team is one of the playoff teams creates team playoff section
			if (teamId !== 32 && teamId >= 29) {
				// creates flag playoff section
				let playOffFlag = document.createElement("div");
				playOffFlag.classList.add("flag-section");
				playOffFlag.style.backgroundImage = `url("/assets/flags/${
					playOffTeams[teamId - 29].flag
				}.png")`;

				// creates name playoff section
				let playOffName = document.createElement("div");
				playOffName.classList.add("name-section");
				playOffName.innerText = playOffTeams[teamId - 29].abrv;

				teamFlag.appendChild(playOffFlag);
				teamName.appendChild(playOffName);

				// at page refresh checks previous status to display the playoff winners
				team.classList.add("playoff");
				if (
					localStorage.getItem("process") === "done" &&
					localStorage.getItem("playoff") === "revealed"
				) {
					team.classList.add("revealed");
				}
			}

			team.appendChild(teamFlag);
			team.appendChild(teamName);
			group.appendChild(team);
		}
		pageGroup.appendChild(group);
	}
};
// ------------------------------------------------------------------------------------------
/*
 * changes the appearance of the groups
 * displays putting the selected team in the selected place of the target group
 */
let alterGroupsView = (groupNum, placeNum) => {
	// loops through all group elements and finds the target group
	// changes the HTML content of the selected place of the target group
	let pageGroups = document.querySelector("#groups").querySelectorAll(".group");
	pageGroups.forEach((pageGroup, idg) => {
		// checks for the id of the target group
		if (idg === groupNum) {
			let pageTeams = pageGroup.querySelectorAll(".team");
			// loops through all team elements of the target group
			// and finds the selected place
			pageTeams.forEach((pageTeam, idt) => {
				// checks for place number
				if (idt === placeNum) {
					let teamId = groups[groupNum][placeNum];
					pageTeam.classList.add("occupied");

					// ------------------------------
					// takes the related flag and name sections
					let occupiedFlag = pageTeam.querySelectorAll(".flag-section")[1];
					let occupiedName = pageTeam.querySelectorAll(".name-section")[1];

					// changes background and text
					occupiedFlag.style.backgroundImage = `url("/assets/flags/${allTeams[teamId].flag}.png")`;
					occupiedName.innerText = allTeams[teamId].abrv;
					// ------------------------------
					/*
					 * if a team is a playoff team it has the third flag and name sections
					 * and after pressing the clear button to repeating the selection process
					 * these sections would still remains in the dom and cause some troubles.
					 */

					// checks for the third sections and deletes them
					if (
						pageTeam.querySelector(".name").querySelectorAll(".name-section")[2]
					) {
						pageTeam
							.querySelector(".flag")
							.querySelectorAll(".flag-section")[2]
							.remove();

						pageTeam
							.querySelector(".name")
							.querySelectorAll(".name-section")[2]
							.remove();
					}
					// ------------------------------
					// if the team is a playoff team adds the third flag and name sections
					if (teamId >= 29) {
						pageTeam.classList.add("playoff");

						let teamFlag = pageTeam.querySelector(".flag");
						let teamName = pageTeam.querySelector(".name");

						let playOffFlag = document.createElement("div");
						playOffFlag.classList.add("flag-section");
						playOffFlag.style.backgroundImage = `url("/assets/flags/${
							playOffTeams[teamId - 29].flag
						}.png")`;

						let playOffName = document.createElement("div");
						playOffName.classList.add("name-section");
						playOffName.innerText = playOffTeams[teamId - 29].abrv;

						teamFlag.appendChild(playOffFlag);
						teamName.appendChild(playOffName);
					}
				}
			});
		}
	});
};
// ------------------------------------------------------------------------------------------
// creates the pots elements
let displayPots = () => {
	let pagePots = document.getElementById("pots");

	// 4 pots each containing 8 teams
	for (let i = 0; i < 4; i++) {
		let pot = document.createElement("div");
		pot.classList.add("pot");
		pot.id = `pot-${i + 1}`;

		// creates the 8 teams in the pot and gives them required classes and id
		for (let j = 0; j < 8; j++) {
			let teamId = i * 8 + j;
			let team = document.createElement("div");
			team.classList.add("team");
			team.classList.add(`${teams[teamId]}`);
			team.id = `team-${teamId + 1}`;

			// flags and names
			team.innerHTML = `
			<div class="flag" style="background-image: url(${
				"/assets/flags/" + allTeams[teamId].flag + ".png"
			})"></div>
			<p class="name">${allTeams[teamId].name}</p>
			<input type="hidden" name="id" value="${allTeams[teamId].id}">
		`;
			pot.appendChild(team);
		}

		pagePots.appendChild(pot);
	}
};
// ------------------------------------------------------------------------------------------
/*
 * if all the teams in the current pot are selected,
 * moves all pots depending on screen size to up or left to displays the next pot
 */
let alterPotsView = () => {
	let pots = document.querySelector("#pots").querySelectorAll(".pot");
	pots.forEach((pot) => {
		let width = window.innerWidth;
		let height = window.innerHeight;
		if (width > 600 && width < 992 && height > 450 && height < 700) {
			pot.style.transform = "translateX(-" + Math.floor(cycle / 8) * 100 + "%)";
		} else {
			pot.style.transform = "translateY(-" + Math.floor(cycle / 8) * 100 + "%)";
		}
	});
};
// ------------------------------------------------------------------------------------------
/*
 * gets a regional value and a group id as inputs
 * checks if there is a team with same regional value in the group
 * teams from the same region cannot be drawn in the same group except
 * in the case of Europe where a maximum of two European teams can be in the same group
 */
let groupRegion = (reg_val, gr_num) => {
	// for counting teams with same regional value
	let counter = 0;

	for (let i = 0; i < 4; i++) {
		if (groups[gr_num][i] !== 32) {
			let teamID = groups[gr_num][i];
			switch (reg_val) {
				case 25:
					// for the playoff game between south america and asia
					// checks if there is an asian team or a south american team in the group
					if (allTeams[teamID].region === 2 || allTeams[teamID].region === 5) {
						counter++;
					}
					break;

				default:
					if (allTeams[teamID].region === reg_val) {
						counter++;
					}
					break;
			}
		}
	}

	// 'counter' must be at most 1 for a european team and 0 for other teams
	return !((counter > 0 && reg_val !== 3) || (counter > 1 && reg_val === 3));
};
// ------------------------------------------------------------------------------------------
// counts the occupied places in a given group
// checks if it is equal to a specified number
let checkGroupCapacity = (groupId, number) => {
	let count = 0;
	for (let i = 0; i < 4; i++) {
		if (groups[groupId][i] !== 32) {
			count++;
		}
	}

	return count === number;
};
// ------------------------------------------------------------------------------------------
// a recursive function: checks if all groups and teams in the given relational matrix
// can be successfully assigned
let checkRelations = (relations) => {
	let length = relations.length;

	// calculates the number of options each team and group has
	// if a team or a group ends up with no option returns false
	for (let i = 0; i < length; i++) {
		// --------------------
		// counts the options of a team
		let teamOptions = 0;
		for (let j = 0; j < length; j++) {
			teamOptions += relations[i][j];
		}

		if (teamOptions === 0) {
			return false;
		}

		// --------------------
		// counts the options of a group
		let groupOptions = 0;
		for (let j = 0; j < length; j++) {
			groupOptions += relations[j][i];
			// row = j;
		}

		if (groupOptions === 0) {
			return false;
		}
	}
	// ----------------------------------------
	// for each relationship between a team and a group creates a smaller
	// relational matrix which has excluded that team and group
	if (length > 1) {
		for (let i = 0; i < length; i++) {
			for (let j = 0; j < length; j++) {
				if (relations[i][j] === 1) {
					let subRel = [];
					let row, col;
					for (let t = 0; t < length; t++) {
						if (t !== i) {
							t < i ? (row = t) : (row = t - 1);
							subRel[row] = [];
							for (let g = 0; g < length; g++) {
								if (g !== j) {
									g < j ? (col = g) : (col = g - 1);
									subRel[row][col] = relations[t][g];
								}
							}
						}
					}

					// now checks the smaller relational matrix: recursive function pattern
					if (checkRelations(subRel)) {
						return true;
					}
				}
			}
		}
	} else {
		// there is only one team and one group left and they can be assigned to each other
		return true;
	}
};
// ------------------------------------------------------------------------------------------
/*
 * gets the id of the selected team as input
 * finds the first eligible group that can contain the selected team then
 * evaluates the consequences of this choice on further steps to make sure
 * all remaining teams in the pot will have a chance to be placed in at least one group
 */
let findTargetGroup = (num) => {
	// regional value of the selected team
	let region = allTeams[num].region;

	// the number of teams that should be in each group at the beginning of this stage
	let stageNumber = Math.floor(cycle / 8);

	// loop through groups
	let groupId = 0;
	while (groupId < 8) {
		// calculates the number of teams already in the group
		// if the group has the capacity of a new team, checks for regional collisions
		if (
			checkGroupCapacity(groupId, stageNumber) &&
			groupRegion(region, groupId)
		) {
			// in first stage there is no need for more processing cause the group is empty
			if (stageNumber !== 0) {
				/*
				 * the current group is eligible for having the selected team but because of
				 * so many regional restrictions between unselected teams in the pot and the
				 * teams in the group it needs to make sure that by assigning the selected team
				 * to this group, no group will end up without a team and no team without a group
				 *
				 * to do that:
				 * it creates relation matrix between remaining teams and groups
				 * and by using a recursive function checks all possible states of the teams
				 * selection and if even in one path it leads to a state where all teams and
				 * groups are successfully assigned, the current group can be selected.
				 */

				// ------------------------------------------------------------
				// remaining teams at this stage without considering any regional restrictions
				let availableTeams = 0;

				// loops through teams in the current pot
				for (let t = 0; t < 8; t++) {
					let teamId = stageNumber * 8 + t;
					if (teams[teamId] === "unused" && teamId !== num) {
						availableTeams++;
					}
				}

				// ------------------------------------------------------------
				// remaining groups at this stage without considering any regional restrictions
				let availableGroups = 0;

				// loops through the groups
				for (let g = 0; g < 8; g++) {
					if (checkGroupCapacity(g, stageNumber) && g !== groupId) {
						availableGroups++;
					}
				}
				// ------------------------------------------------------------
				// relations matrix: logical relations between remaining teams and groups
				let relations = [];

				// sets every index to 0
				for (let t = 0; t < availableGroups; t++) {
					relations[t] = [];
					for (let g = 0; g < availableTeams; g++) {
						relations[t][g] = 0;
					}
				}

				// if a team has no restriction to be placed in one group
				// sets the [team number, group number] index to 1
				let unavailableTeams = 0;
				for (let t = 0; t < 8; t++) {
					let teamId = stageNumber * 8 + t;
					if (teams[teamId] === "used" || teamId === num) {
						unavailableTeams++;
					} else {
						let unavailableGroups = 0;
						for (let g = 0; g < 8; g++) {
							if (!checkGroupCapacity(g, stageNumber) || g === groupId) {
								unavailableGroups++;
							} else {
								let teamReg = allTeams[teamId].region;
								if (groupRegion(teamReg, g)) {
									relations[t - unavailableTeams][g - unavailableGroups] = 1;
								}
							}
						}
					}
				}
				// ------------------------------------------------------------
				// if everything is ok then returns the id of this group
				if (checkRelations(relations)) {
					return groupId;
				}
			} else {
				// in first stage there is no restriction between pot teams and groups
				// so it just returns the selected group id
				return groupId;
			}
		}
		// selecting this group is not a good choice, goes to the next one
		groupId++;
	}
};
// ------------------------------------------------------------------------------------------
// distinguishes the target group from others
let showCurrentGroup = (num) => {
	let pageGroups = document.querySelector("#groups").querySelectorAll(".group");
	pageGroups.forEach((pageGroup, idx) => {
		if (num === idx) {
			pageGroup.classList.add("current");
		}
	});
};
// ------------------------------------------------------------------------------------------
// removes the apparent distinction of the target group
let removeCurrentGroup = () => {
	let pageGroups = document.querySelector("#groups").querySelectorAll(".group");
	pageGroups.forEach((pageGroup) => {
		pageGroup.classList.remove("current");
	});
};
// ------------------------------------------------------------------------------------------
// creates the position selections panel on the page
let createPositionPanel = () => {
	let positions = document.querySelector("#positions");

	// 4 elements to represent 4 teams in a group
	for (let i = 0; i < 4; i++) {
		let position = document.createElement("div");
		position.classList.add("position");
		position.classList.add("occupied");
		position.id = `position-${i + 1}`;
		position.innerHTML = `<p class="tag new">${
			i + 1
		}</p><p class="tag old"></p>`;
		positions.appendChild(position);
	}
};
// ------------------------------------------------------------------------------------------
// updates the position selections panel
// swaps the old and new tag of each position selector
let updatePositionTag = () => {
	let positionTags = document.querySelectorAll(".tag");

	positionTags.forEach((positionTag) => {
		if (positionTag.classList.contains("old")) {
			positionTag.classList.remove("old");
			positionTag.classList.add("new");
		} else {
			positionTag.classList.remove("new");
			positionTag.classList.add("old");
		}
	});
};
// ------------------------------------------------------------------------------------------
// removes any sign of selection
let clearSelectionMarks = () => {
	// resets the view of the position selections panel
	let positions = document
		.querySelector("#positions")
		.querySelectorAll(".position");

	positions.forEach((position) => {
		position.className = "position occupied";
		let id = position.id.replace("position-", "");

		// updates the tag that will be displayed
		let oldTag = position.querySelector(".old");
		oldTag.innerHTML = id;
	});

	// swaps position selectors tags
	updatePositionTag();

	// if a pot team was selected removes 'selected' class from it
	// and makes it selectable again
	let teams = document.querySelectorAll(".team.unused");
	teams.forEach((team) => {
		team.classList.remove("selected");
	});

	// removes the apparent distinction of the target group
	removeCurrentGroup();
};
// ------------------------------------------------------------------------------------------
// displays putting the selected team in the selected place of the target group
// updates groups array and teams array
let simplePlacement = (place, groupNum, teamNum, teamEl) => {
	// removes the apparent distinction of the target group remained from previous step
	removeCurrentGroup();

	// changes the appearance of the target group
	showCurrentGroup(groupNum);

	// ------------------------------------------------------------
	// updates the groups array
	groups[groupNum][place] = teamNum;

	// updates groups array in local storage
	localStorage.setItem("groups", JSON.stringify(groups));

	// updates teams array and tags the selected team as 'used'
	teams[teamNum] = "used";

	// updates teams array in local storage
	localStorage.setItem("teams", JSON.stringify(teams));

	// displays putting the selected team in the selected place of the target group
	alterGroupsView(groupNum, place);

	// ------------------------------------------------------------
	// updates the appearance of the selected team in the pots
	teamEl.classList.remove("selected");
	teamEl.classList.remove("unused");
	teamEl.classList.add("used");

	// removes event listener of the team
	teamEl.removeEventListener("click", findTeamNGroup);

	// ------------------------------------------------------------
	// increases the 'cycle' value
	cycle++;

	// updates cycle value in local storage
	localStorage.setItem("cycle", cycle);

	// displays the next pot if teams in the current pot are all selected
	alterPotsView();

	// to reset the appearance of the target group and panels after a few seconds
	selectionAppearance = setTimeout(() => {
		clearSelectionMarks();
	}, 4000);

	if (cycle === 32) {
		// all teams and groups are settled
		finishSelection();
	} else {
		// selects the next team
		selectTeams();
	}
};
// ------------------------------------------------------------------------------------------
// chooses the place of the selected team in the target group manually
let advancedPlacement = (e) => {
	// removes event listeners on all position selectors to prevent multiple selection
	let positions = document
		.querySelector("#positions")
		.querySelectorAll(".position");
	positions.forEach((position) => {
		position.removeEventListener("click", advancedPlacement);
	});

	// gets input arguments
	let groupNum = e.currentTarget.groupNum;
	let teamNum = e.currentTarget.teamNum;
	let teamEl = e.currentTarget.teamEl;

	// takes the selected position selector element and changes the appearance of it
	let position = e.target;

	// "pressed": a temporary class for a better visual effect transition
	position.classList.add("pressed");

	setTimeout(() => {
		position.classList.remove("pressed");
		position.classList.add("occupied");
	}, 300);

	// takes the id of the selected position selector
	let place = position.id.replace("position-", "") - 1;

	// updates teams and groups arrays and displays putting the selected team in the target group
	simplePlacement(place, groupNum, teamNum, teamEl);
};
// ------------------------------------------------------------------------------------------
/*
 * gets the IDs of the selected team and group and the selected team element
 * updates the position selectors content and appearance based on inputs
 * determines the position of the selected team in the target group
 * gives the inputs to 'advancedPlacement' function
 */
let selectPlace = (groupNum, teamNum, teamEl) => {
	// removes the apparent distinction of the target group from previous step
	removeCurrentGroup();

	// changes the appearance of the current target group
	showCurrentGroup(groupNum);

	// gets group letter title
	let title = giveGroupName(groupNum);

	let positions = document
		.querySelector("#positions")
		.querySelectorAll(".position");

	// displays the positioning choices based on the status of the target group
	positions.forEach((position, idx) => {
		// removes any classes from previous steps
		position.classList.remove("occupied");
		position.classList.remove("force");

		// teams in pot one must be the first team of their groups
		// the rest of the options will be ignored
		if (Math.floor(cycle / 8) === 0) {
			if (idx === 0) {
				position.classList.add("force");

				// event listener on click to run 'advancedPlacement' function
				position.addEventListener("click", advancedPlacement);

				// 'advancedPlacement' function arguments
				position.groupNum = groupNum;
				position.teamNum = teamNum;
				position.teamEl = teamEl;
			} else {
				position.classList.add("occupied");
			}
		} else {
			// if the correspond position in the target group is vacant makes the selector selectable
			if (groups[groupNum][idx] === 32) {
				// event listener on click to run 'advancedPlacement' function
				position.addEventListener("click", advancedPlacement);

				// 'advancedPlacement' function arguments
				position.groupNum = groupNum;
				position.teamNum = teamNum;
				position.teamEl = teamEl;
			} else {
				position.classList.add("occupied");
			}
		}

		// updates the tag that will be displayed
		let oldTag = position.querySelector(".old");
		oldTag.innerHTML = `${title}${idx + 1}`;
	});

	// swaps position selectors tags
	updatePositionTag();
};
// ------------------------------------------------------------------------------------------
// adds event listener to each remaining team in the pots
// if a team is selected runs 'findTeamNGroup' function
let selectTeams = () => {
	let potTeams = document
		.querySelector("#pots")
		.querySelectorAll(".team.unused");

	potTeams.forEach(function (potTeam) {
		potTeam.addEventListener("click", findTeamNGroup);
	});
};
// ------------------------------------------------------------------------------------------
// finds the id of the selected team and change its appearance
// finds the target group for the selected team and changes its appearance
// sends those ids to the 'selectPlace' function
let findTeamNGroup = (e) => {
	// a new team has been selected
	// removes the timeout for resetting the appearance of previous selection process
	clearTimeout(selectionAppearance);

	// by assuming that another team was selected before clicking on the current team
	// removes the 'selected' class from all pot teams
	let potTeams = document
		.querySelector("#pots")
		.querySelectorAll(".team.unused");
	potTeams.forEach((potTeam) => {
		potTeam.classList.remove("selected");
	});

	// selected team element
	let teamEl = e.currentTarget;

	// extracts the id of the selected team
	let elementID = teamEl.id;
	let teamID = elementID.replace("team-", "") - 1;

	// changes the appearance of the selected team
	teamEl.classList.add("selected");

	// ------------------------------------------------------------
	// finds the first eligible group to put the selected team in it
	let targetGroup = findTargetGroup(teamID);

	// puts the selected team in the target group and displays the process on the screen
	if (localStorage.getItem("position") === "manual") {
		// determining the position of the team in the target group will be chosen manually
		selectPlace(targetGroup, teamID, teamEl);
	} else {
		// finds the first empty place in the target group and puts the team in there
		let place;
		for (let i = 0; i < 4; i++) {
			if (groups[targetGroup][i] === 32) {
				place = i;
				break;
			}
		}
		simplePlacement(place, targetGroup, teamID, teamEl);
	}
};
// ------------------------------------------------------------------------------------------
// all teams have been placed in the groups
// changes the appearance of the page
let finishSelection = () => {
	// removes the apparent distinction of the target group
	removeCurrentGroup();

	// adds 'done' class to the main-container element
	let mainContainer = document.getElementById("main-container");
	mainContainer.classList.add("done");

	// updates 'process' value in local storage
	localStorage.setItem("process", "done");

	// to skip "pressed" class transition for the last team selection
	let positions = document.querySelectorAll(".position");
	positions.forEach((position) => {
		position.classList.remove("pressed");
		position.classList.add("occupied");
	});

	// updates dual button appearance: displays playoff button
	let playOffBtn = document.getElementById("playoff-btn");
	let posBtn = document.getElementById("position-btn");

	playOffBtn.style.transform = "translateX(0)";
	posBtn.style.transform = "translateX(-100%)";
};
// ------------------------------------------------------------------------------------------
// the clear button has been pressed
// resets cycle to 1, resets groups and teams arrays to their defaults
// displays pot one and makes all teams selectable again
let resetEverything = () => {
	// resets the cycle value and updates it in local storage
	cycle = 1;
	localStorage.setItem("cycle", cycle);

	// resets pots ----------------------------------------
	// resets teams array and updates it in local storage
	for (let i = 1; i < 32; i++) {
		teams[i] = "unused";
	}
	localStorage.setItem("teams", JSON.stringify(teams));

	// updates pot teams view
	let potTeams = document.querySelector("#pots").querySelectorAll(".team.used");
	potTeams.forEach((potTeam, idx) => {
		if (idx !== 0) {
			potTeam.classList.remove("used");
			potTeam.classList.add("unused");
			potTeam.addEventListener("click", findTeamNGroup);
		}
	});

	// moves the pots to their initial position
	let pots = document.querySelector("#pots").querySelectorAll(".pot");
	pots.forEach((pot) => {
		pot.style.transform = "translate(0, 0)";
	});

	// resets groups ----------------------------------------
	// resets groups array and updates it in local storage
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 4; j++) {
			if (i !== 0 || j !== 0) {
				groups[i][j] = 32;
			}
		}
	}
	localStorage.setItem("groups", JSON.stringify(groups));

	// ----------------------------------------
	// clears group teams backgrounds and names remained from previous selection
	let flagSections = document.querySelectorAll(".flag-section");
	let nameSections = document.querySelectorAll(".name-section");

	setTimeout(() => {
		flagSections.forEach((flagSection, idx) => {
			if (idx > 1) {
				flagSection.style.background = "";
			}
		});

		nameSections.forEach((nameSection, idx) => {
			if (idx > 1) {
				nameSection.innerText = "";
			}
		});
	}, 1000);
	// ----------------------------------------
	// clears the group teams classes
	let pageTeams = document.querySelector("#groups").querySelectorAll(".team");
	pageTeams.forEach((pageTeam, idx) => {
		if (idx !== 0) {
			pageTeam.classList.remove("occupied");
		}
		pageTeam.classList.remove("playoff");
		pageTeam.classList.remove("revealed");
	});

	// ----------------------------------------
	// clears selection completion and makes sure that all panels are displaying
	localStorage.setItem("process", "ongoing");

	// turns pots, positions and groups view to their defaults
	let mainContainer = document.getElementById("main-container");
	let positions = document.getElementById("positions");

	if (mainContainer.classList.contains("done")) {
		mainContainer.classList.remove("done");

		clearTimeout(selectionAppearance);

		// 'rerun': a temporary class for positions panel for a better visual transition
		// when clear button is pressed after completion of the selection process
		positions.classList.add("rerun");

		setTimeout(() => {
			positions.classList.remove("rerun");
		}, 600);
	} else {
		// 'reset': a temporary class for positions panel for a better visual transition
		// when clear button is pressed in the middle of selection process
		positions.classList.add("reset");

		setTimeout(() => {
			positions.classList.remove("reset");
		}, 300);
	}
	// ----------------------------------------
	// resets the appearance and state of the buttons
	let playOffBtn = document.getElementById("playoff-btn");
	let posBtn = document.getElementById("position-btn");
	let clearBtn = document.getElementById("clear-btn");

	localStorage.setItem("playoff", "waiting");
	playOffBtn.className = "waiting";

	playOffBtn.style.transform = "translateX(100%)";
	posBtn.style.transform = "translateX(0)";

	clearBtn.classList.add("erasing");
	setTimeout(() => {
		clearBtn.classList.remove("erasing");
	}, 400);

	// ----------------------------------------
	// removes any sign of previous team selection
	clearSelectionMarks();
};
// ------------------------------------------------------------------------------------------
// loads values from local storage and displays the page based on previous state
let loadPreviousState = () => {
	// loads elements of the page that their appearances may change
	let body = document.getElementsByTagName("body")[0];
	let themeBtn = document.getElementById("theme-btn");
	let posBtn = document.getElementById("position-btn");
	let positions = document.getElementById("positions");
	let playOffBtn = document.getElementById("playoff-btn");

	// if it is the first time the program runs
	if (!localStorage.getItem("cycle")) {
		// saves cycle value in local storage
		localStorage.setItem("cycle", "1");
	}

	// loads previous theme value from local storage
	// changes the appearance of the page and the theme button
	if (localStorage.getItem("theme") === "dark") {
		body.classList.add("dark");
		themeBtn.classList.add("dark");
	} else {
		body.classList.remove("dark");
		themeBtn.classList.remove("dark");
	}

	// loads previous position value from local storage
	// changes the appearance of the position panel and the position button
	if (localStorage.getItem("position") === "manual") {
		posBtn.classList.remove("auto");
		posBtn.classList.add("manual");

		positions.classList.remove("auto");
		positions.classList.add("manual");
	} else {
		posBtn.classList.remove("manual");
		posBtn.classList.add("auto");

		positions.classList.remove("manual");
		positions.classList.add("auto");
	}

	// loads groups array from local storage
	if (localStorage.getItem("groups")) {
		groups = JSON.parse(localStorage.getItem("groups"));
	}

	// loads teams array from local storage
	if (localStorage.getItem("teams")) {
		teams = JSON.parse(localStorage.getItem("teams"));
	}

	// if the selection process is finished
	if (localStorage.getItem("process") === "done") {
		finishSelection();

		if (localStorage.getItem("playoff") === "revealed") {
			playOffBtn.className = "revealed";
		} else {
			playOffBtn.className = "waiting";
		}
	}

	// enables transition times after page load
	window.addEventListener("load", () => {
		body.classList.remove("preload");
	});
};
// ------------------------------------------------------------------------------------------
// the theme button has been pressed
// changes theme value and background theme of the page
let changeTheme = () => {
	let themeBtn = document.getElementById("theme-btn");
	themeBtn.classList.toggle("dark");

	let body = document.getElementsByTagName("body")[0];

	if (themeBtn.classList.contains("dark")) {
		localStorage.setItem("theme", "dark");
		body.classList.add("dark");
	} else {
		localStorage.setItem("theme", "light");
		body.classList.remove("dark");
	}
};
// ------------------------------------------------------------------------------------------
// position button has been pressed
// changes user access for selecting the position of the selected team in the target group
let manualAccess = () => {
	let posBtn = document.getElementById("position-btn");
	let positions = document.getElementById("positions");

	// removes any sign of previous team selection
	clearSelectionMarks();

	// toggles between manual and auto for position selection panel and position button
	// and updates it in local storage
	if (posBtn.classList.contains("manual")) {
		posBtn.classList.remove("manual");
		posBtn.classList.add("auto");

		positions.classList.remove("manual");
		positions.classList.add("auto");

		localStorage.setItem("position", "auto");
	} else {
		posBtn.classList.remove("auto");
		posBtn.classList.add("manual");

		positions.classList.remove("auto");
		positions.classList.add("manual");

		localStorage.setItem("position", "manual");
	}
};
// ------------------------------------------------------------------------------------------
// playoff button has been pressed
// reveals or hides the playoff teams in groups
let playOffWinners = () => {
	let playOffBtn = document.getElementById("playoff-btn");
	let pageWinners = document.querySelectorAll(".playoff");

	if (localStorage.getItem("playoff") === "waiting") {
		playOffBtn.className = "revealed";
		localStorage.setItem("playoff", "revealed");

		pageWinners.forEach((pageWinner) => {
			pageWinner.classList.add("revealed");
		});
	} else {
		playOffBtn.className = "waiting";
		localStorage.setItem("playoff", "waiting");

		pageWinners.forEach((pageWinner) => {
			pageWinner.classList.remove("revealed");
		});
	}
};
// ----------------------------------------
// theme button: changes theme
document.getElementById("theme-btn").addEventListener("click", () => {
	changeTheme();
});
// ----------------------------------------
// position button: changes user access for selecting group positions
document.getElementById("position-btn").addEventListener("click", () => {
	manualAccess();
});
// ----------------------------------------
// clear button: resets the selection process
document.getElementById("clear-btn").addEventListener("click", () => {
	resetEverything();
});
// ----------------------------------------
// playoff button: after the selection is complete, makes it possible to display
// the playoff games winners in their groups
document.getElementById("playoff-btn").addEventListener("click", () => {
	playOffWinners();
});
// ----------------------------------------
// ready to change the appearance of the pots if the screen size suddenly changes
window.addEventListener("resize", () => {
	alterPotsView();
});
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// displays the page based on previous state and values
loadPreviousState();

// loads cycle value
let cycle = localStorage.getItem("cycle");

// to contain a timeout function that resets the appearance of the target group
// and positions panel after a few seconds
// it needs to be initialed here
let selectionAppearance;

// displays teams in the pots
displayPots();

// based on current cycle value displays the Proportional pot
alterPotsView();

// creates the position selection panel
createPositionPanel();

// creates and displays the 8 groups on the page
displayGroups();

// ready to select a team
selectTeams();
