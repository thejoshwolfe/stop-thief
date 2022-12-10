const mapCanvas = document.getElementById("mapCanvas");
const tipButton = document.getElementById("tipButton");
const arrestButton = document.getElementById("arrestButton");
const clueButton = document.getElementById("clueButton");
const currentMoveDiv = document.getElementById("currentMoveDiv");
const historyUl = document.getElementById("historyUl");

var persistentState = {
  probabilities: {
    move: 0.75,
    comply: 0.5,
    runFarther: 0.5,
  },
  ui: {
    showMovementGraph: true,
    showThiefMovement: true,
    showMovementRules: true,
    showProbabilities: true,
  },
};
(function loadState() {
  persistentState = recurse(persistentState, JSON.parse(localStorage["stop-thief"] || "null"));
  function recurse(state, loadedData) {
    if (typeof state !== typeof loadedData) return state;
    if ((state == null) !== (loadedData == null)) return state;
    if (Array.isArray(state) !== Array.isArray(loadedData)) return state;
    switch (true) {
      case Array.isArray(state):
        return loadedData;
      case typeof state === "object":
        for (let k in state) {
          state[k] = recurse(state[k], loadedData[k]);
        }
        return state;
      case typeof state === "boolean":
      case typeof state === "number":
      case typeof state === "string":
        return loadedData;
    }
    throw new Error();
  }
})();
function saveState() {
  localStorage["stop-thief"] = JSON.stringify(persistentState);
}

// Show/hide map layers.
["showMovementGraph", "showThiefMovement"].forEach(propertyName => {
  let checkbox = document.getElementById(propertyName + "Checkbox");
  checkbox.checked = persistentState.ui[propertyName];
  checkbox.addEventListener("change", function() {
    persistentState.ui[propertyName] = checkbox.checked;
    saveState();
    renderMap();
  });
});

// Show/hide UI sections.
const showMovementRulesButton = document.getElementById("showMovementRulesButton");
const movementRulesDiv = document.getElementById("movementRulesDiv");
showMovementRulesButton.addEventListener("click", function() {
  setTimeout(function() {
    persistentState.ui.showMovementRules = !persistentState.ui.showMovementRules;
    saveState();
    maybeShowElement(movementRulesDiv, persistentState.ui.showMovementRules);
  }, 0);
});
maybeShowElement(movementRulesDiv, persistentState.ui.showMovementRules);

const showProbabilitiesButton = document.getElementById("showProbabilitiesButton");
const probabilitiesDiv = document.getElementById("probabilitiesDiv");
showProbabilitiesButton.addEventListener("click", function() {
  setTimeout(function() {
    persistentState.ui.showProbabilities = !persistentState.ui.showProbabilities;
    saveState();
    maybeShowElement(probabilitiesDiv, persistentState.ui.showProbabilities);
  }, 0);
});
maybeShowElement(probabilitiesDiv, persistentState.ui.showProbabilities);

function maybeShowElement(element, showIt) {
  element.style.display = showIt ? "block" : "none";
}

// Probabilities
["move", "comply", "runFarther"].forEach(propertyName => {
  let textbox = document.getElementById(propertyName + "ChanceTextbox");
  textbox.addEventListener("change", function() {
    let value = parseFloat(textbox.value);
    if (isNaN(value)) {
      value = persistentState.probabilities[propertyName];
    }
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    persistentState.probabilities[propertyName] = value;
    saveState();
    textbox.value = value;
  });
  textbox.value = persistentState.probabilities[propertyName];
})

const gameBoardString = "" +
"                               s      " + // 0
" S<s              s<           ^      " + // 38
" ^<sS<s<S<s<S<s<SsS<sSs<S<s<S<s<SsS<  " + // 76
" s<    D   W   W  s<  W   W   D ^^^<  " + // 114
"  S   ff  fff fff S< fff fff ff   s<  " + // 152
"  ^DfDfC  fFfDfFf ^<DfFf fFfDfFf   S  " + // 190
"  s   fff fff fff s< fff fff ffff  ^s " + // 228
"  ^   fFfDfF   D  ^< fFfDfCf  FfFf s^ " + // 266
"  S    ff ff   ff S< fff ff   ffff S  " + // 304
"  ^    Cf  C   Cf ^<  D       D  fW^  " + // 342
"  s    ff  f   ff s   ffff   ff  f s  " + // 380
"  ^    D   D   D  ^   D  fCfFfC ff ^  " + // 418
"  S    ff fff fff S< ff  fffffffff Sss" + // 456
"  ^    Cf fFf fFfD^<DfC    fFf fFf ^^^" + // 494
"  s fffffffffffff s<  ffff fff fff s  " + // 532
"  ^WfFfffFfFfFf   S<   fFfDfFfDfFfD^  " + // 570
" sS fff fffff     ^<    ff fff fff S  " + // 608
"ss<  D     D    ss<<<s  D   W   W  s  " + // 646
"sS<sS<s<S<s<S<sS^S<<<^SsS<s<S<s<S<sS  " + // 684
"^^<^^<^<^<^<^<^^^^<<<^^^^<^<^<^<^<^^  " + // 722
"  s  W   W   D  ^^<<<^  W   D   W  s  " + // 760
"  S  ff fff ff  ^^<<<^  ffffff fff S  " + // 798
"  ^  FfDfCfWfF  s<<<<^   fCfFf fFfDs  " + // 836
"  s  ff     ff    S<     f  ff fff ^  " + // 874
"  S  D      fFf   s<  FfFf fffDfFf S  " + // 912
"  ^ fff ff  ffff  S< fffff fff fff ^  " + // 950
"s<sWfFf fFfD ffFfDs<Df         fFfWs  " + // 988
"  ^ fff ffff  fff ^< ff      f fff ^s<" + // 1026
"  S fFfDfCfFf  D  S< fFfWfCfDfCfFf S  " + // 1064
"  ^ fff    fff f  ^< fff      ffff ^  " + // 1102
"  sDfCf        F  s< fFf       fFfDs  " + // 1140
"  ^  ff fff fffff ^< fff fff fffff ^  " + // 1178
"  S   fDfFfDfCfFfWS<WfFfDfCfDfC    S  " + // 1216
"s<s<    fff   fff ^< fff     ff  ss<  " + // 1254
"  S<s    W     D  s<  W       D  sS<  " + // 1292
"  ^<^Ss<S<s<S<s<SsC<sSs<S<s<S<s<S^^<  " + // 1330
"                              s       " + // 1368
"                              ^       " + // 1406
"";
const boardSize = 38;
const newsStand = 1348;
const theSubway = -10000;
const subwayStops = [39, 110, 701, 1294, 1326];
if (gameBoardString.length !== boardSize * boardSize) throw new Error();
function toIndex(r, c) {
  return r * boardSize + c;
}
function toCoord(index) {
  return {r: (index / boardSize) >> 0, c: index % boardSize};
}
const adjacentIndexOffsets = [
  -1 - boardSize, -boardSize, 1 - boardSize,
  -1,                         1,
  -1 + boardSize,  boardSize, 1 + boardSize,
];
function isIndoor(room) {
  return !(gameBoardString[room].toUpperCase() === "S" || room === newsStand);
}

const indexToRoom = [];
const roomToIndexes = [];
const thiefRoomToAdjacentThiefRooms = [];
const roomToDoorwayOrientation = [];
function computeMapLayout() {
  // Merge '<' and '^' rooms into large rooms.
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      let index = toIndex(r, c);
      let ch = gameBoardString[index];
      switch (ch) {
        case " ":
          indexToRoom[index] = -1;
          break;
        case "^": {
          let room = indexToRoom[toIndex(r - 1, c)];
          indexToRoom[index] = room;
          roomToIndexes[room].push(index);
          break;
        }
        case "<": {
          let room = indexToRoom[toIndex(r, c - 1)];
          indexToRoom[index] = room;
          roomToIndexes[room].push(index);
          break;
        }
        default:
          indexToRoom[index] = index;
          roomToIndexes[index] = [index];
          break;
      }
    }
  }

  // Map out thief space connections.
  for (let startingRoom = 0; startingRoom < roomToIndexes.length; startingRoom++) {
    if (!isThiefRoom(startingRoom)) continue;
    let adjacentThiefRooms = thiefRoomToAdjacentThiefRooms[startingRoom] = [];
    let startingIndoor = isIndoor(startingRoom);
    let reachableRooms = roomToAdjacentRooms(startingRoom);
    let oneSpaceAway = reachableRooms.length;
    for (let i = 0; i < reachableRooms.length; i++) {
      let room = reachableRooms[i];
      if (room === startingRoom) continue;
      if (isThiefRoom(room)) {
        adjacentThiefRooms.push(room);
      } else if (i < oneSpaceAway) {
        // keep moving
        let intermediateIndoor = isIndoor(room);
        for (let otherRoom of roomToAdjacentRooms(room)) {
          if (startingIndoor && !intermediateIndoor && isIndoor(otherRoom)) continue; // can't jump over the street
          addToArraySet(reachableRooms, otherRoom);
        }
      }
    }
    if (adjacentThiefRooms.length < 2) throw new Error();
  }

  // Subway.
  thiefRoomToAdjacentThiefRooms[theSubway] = subwayStops.slice();
  for (let room of subwayStops) {
    thiefRoomToAdjacentThiefRooms[room].push(theSubway);
  }

  // Door/window orientation.
  for (let i = 0; i < gameBoardString.length; i++) {
    if (!(gameBoardString[i] === "D" || gameBoardString[i] === "W")) continue;
    if (gameBoardString[i - boardSize] !== " ") {
      roomToDoorwayOrientation[i] = "v";
    } else if (gameBoardString[i + 1] !== " ") {
      roomToDoorwayOrientation[i] = "h";
    } else {
      // 3-44
      roomToDoorwayOrientation[i] = "d";
    }
  }

  function roomToAdjacentRooms(room) {
    let indexes = roomToIndexes[room];
    if (indexes == null) return [];
    let adjacentRooms = [];
    for (let index of indexes) {
      for (let adjacentIndex of adjacentIndexOffsets.map(offset => index + offset)) {
        let otherRoom = indexToRoom[adjacentIndex];
        if (otherRoom == null || otherRoom === -1 || otherRoom === room) continue;
        addToArraySet(adjacentRooms, otherRoom);
      }
    }
    return adjacentRooms;
  }
  function isThiefRoom(room) {
    let ch = gameBoardString[room];
    return ch != null && ch !== ch.toLowerCase();
  }
}

tipButton.addEventListener("click", function() {
  let currentRoom = movementHistory[movementHistory.length - 1]
  if (currentRoom == null || currentRoom === theSubway) return;
  let exactSpaceNumber = getExactSpaceNumber(currentRoom);
  let formattedSpace = exactSpaceNumber[0] + "-" + exactSpaceNumber[1] + exactSpaceNumber[2];
  if (confirm("--> The tip will appear right here <--")) {
    alert(formattedSpace);
  }
});

arrestButton.addEventListener("click", function() {
  let currentRoom = movementHistory[movementHistory.length - 1]
  if (currentRoom == null || currentRoom === theSubway) return;
  let exactSpaceNumber = getExactSpaceNumber(currentRoom);

  let guess = prompt("Input three digits, e.g. 5-67 or 567");
  if (guess == null || guess.length === 0) return;
  // strip '-' and any other non-digit characters.
  guess = guess.replace(/\D+/g, "");
  if (guess.length !== 3) {
    alert("incorrect formatting");
    return;
  }
  if (guess !== exactSpaceNumber.join("")) {
    alert("wrong");
  } else {
    if (Math.random() < persistentState.probabilities.comply) {
      alert("Successful arrest! (TODO: reset the game state.)");
    } else {
      alert("Thief is running!");
      let runFarther = Math.random() < persistentState.probabilities.runFarther;
      for (let i = 0; i < 5 + runFarther - 1; i++) {
        makeAMove(false);
      }
      makeAMove(true);
      renderHistory();
      renderMap();
    }
  }
});

// TODO: move all this to persistentState.
var movementHistory = [];
var remainingLoot = [];
var clueHistory = [];
clueButton.addEventListener("click", function() {
  makeAMove(true);
  renderHistory();
  renderMap();
});
function makeAMove(showBuildingNumber) {
  if (movementHistory.length === 0) {
    // start
    let startingRoomOptions = [];
    for (let room = 0; room < gameBoardString.length; room++) {
      if (gameBoardString[room] !== "C") continue;
      remainingLoot.push(room);
      if (room !== newsStand) startingRoomOptions.push(room);
    }
    let startingRoom = randomArrayItem(startingRoomOptions);
    movementHistory.push(startingRoom);
    clueHistory.push(renderMove(startingRoom, showBuildingNumber));
    removeFromArray(remainingLoot, startingRoom);
  } else {
    // move
    let currentRoom = movementHistory[movementHistory.length - 1];
    let previousRoom = movementHistory[movementHistory.length - 2];
    let orientation = roomToDoorwayOrientation[currentRoom];
    let doorwayAllows = (room) => true;
    if (orientation != null) {
      let {r, c} = toCoord(currentRoom);
      switch (orientation) {
        case "v":
          doorwayAllows = (room) => Math.sign(toCoord(room).r - r) === Math.sign(r - toCoord(previousRoom).r);
          break;
        case "h":
          doorwayAllows = (room) => Math.sign(toCoord(room).c - c) === Math.sign(c - toCoord(previousRoom).c);
          break;
        case "d":
          doorwayAllows = (room) => Math.sign(toCoord(room).r - (r - 1)) === Math.sign((r - 1) - toCoord(previousRoom).r);
          break;
      }
    }
    let possibleMoves = [];
    let irresistibleCrimes = [];
    for (let room of thiefRoomToAdjacentThiefRooms[currentRoom]) {
      if (room === previousRoom && currentRoom !== theSubway) continue; // no U-turns, except out of the subway.
      if (!doorwayAllows(room)) continue;
      possibleMoves.push(room);
      if (gameBoardString[room] === "C" && remainingLoot.indexOf(room) !== -1 && room !== newsStand) {
        irresistibleCrimes.push(room);
      }
    }
    let room;
    if (possibleMoves.indexOf(theSubway) !== -1) {
      // I've got to get a(sub)way.
      room = theSubway;
    } else if (irresistibleCrimes.length > 0) {
      // Gotta steal
      room = randomArrayItem(irresistibleCrimes);
    } else {
      // normal movement
      room = randomArrayItem(possibleMoves);
    }
    movementHistory.push(room);
    clueHistory.push(renderMove(room, showBuildingNumber));
    if (remainingLoot.indexOf(room) !== -1) {
      removeFromArray(remainingLoot, room);
    }

    // Restock.
    let previousBuilding = getExactSpaceNumber(movementHistory[movementHistory.length - 2])[0]
    let currentBuilding = getExactSpaceNumber(movementHistory[movementHistory.length - 1])[0]
    if (previousBuilding !== currentBuilding && 1 <= previousBuilding && previousBuilding <= 4) {
      for (let room = 0; room < thiefRoomToAdjacentThiefRooms.length; room++) {
        if (thiefRoomToAdjacentThiefRooms[room] == null) continue;
        if (gameBoardString[room] !== "C") continue;
        if (getExactSpaceNumber(room)[0] !== previousBuilding) continue;
        addToArraySet(remainingLoot, room);
      }
    }
  }
}

function renderMove(room, showBuildingNumber) {
  if (room === theSubway) return "The Subway";
  var typeCode = gameBoardString[room];
  if (typeCode === "C" && remainingLoot.indexOf(room) === -1) {
    // this spaces has been robbed.
    if (room === newsStand) {
      typeCode = "S";
    } else {
      typeCode = "F";
    }
  }
  var result = (function() {
    switch (typeCode) {
      case "S": return "Street";
      case "F": return "Floor";
      case "C": return "Crime";
      case "W": return "Window";
      case "D": return "Door";
      default: throw new Error();
    }
  })();
  if (showBuildingNumber) {
    result += " (" + renderBuildingNumber(getBuildingNumber(room)) + ")";
  }
  return result;
}

function renderBuildingNumber(buildingNumber) {
  if (1 <= buildingNumber && buildingNumber <= 4) return "Building " + buildingNumber;
  if (5 <= buildingNumber && buildingNumber <= 8) return buildingNumber + "th St.";
  throw new Error();
}

function getBuildingNumber(room) {
  var exactSpaceNumber = getExactSpaceNumber(room);
  return exactSpaceNumber[0];
}
function getExactSpaceNumber(room) {
  if (room === theSubway) return [-1, -1, -1];
  var y = Math.floor(room / boardSize);
  var x = room - y * boardSize;

  // Building 4
  if (3 <= x && x <= 17 &&
      3 <= y && y <= 17) {
    return [4, (19 - x) / 2, (19 - y)/ 2];
  }
  // Building 1
  if (20 <= x && x <= 34 &&
      3 <= y && y <= 17) {
    return [1, (x - 18) / 2, (19 - y)/ 2];
  }
  // Building 3
  if (3 <= x && x <= 17 &&
      20 <= y && y <= 34) {
    return [3, (19 - x) / 2, (y - 18)/ 2];
  }
  // Building 2
  if (20 <= x && x <= 34 &&
      20 <= y && y <= 34) {
    if (x === 34 && y === 34) {
      // this one is in posistion to be 2,8,8, but really it's outside.
      return [6,9,9];
    }
    return [2, (x - 18) / 2, (y - 18)/ 2];
  }
  // 8th St
  if (x < 17 && y < 20) {
    if (x < 3) x = 0;
    if (y < 3) y = 0;
    return [8, Math.floor((18 - x) / 2), Math.floor((18 - y) / 2)];
  }
  // 5th St
  if (18 <= x && y < 17) {
    if (34 <= x) x = 36;
    if (y <= 2) y = 0;
    else if (y <= 5) y = 4;
    return [5, Math.floor((x - 18) / 2), Math.floor((18 - y) / 2)];
  }
  // 7th St
  if (x <= 18 && 20 <= y) {
    if (x <= 2) x = 1;
    if (y <= 23) y = 20;
    if (34 <= y) y = 36;
    return [7, Math.floor((19 - x) / 2), Math.floor((y - 18) / 2)];
  }
  // 6th St
  if (21 <= x && 18 <= y) {
    if (34 <= x) x = 36;
    if (x <= 22) x = 20;
    if (34 <= y) y = 36;
    return [6, Math.floor((x - 18) / 2), Math.floor((y - 18) / 2)];
  }
  // center space
  if (x === 17 && y === 18) return [5,0,0];

  throw new Error();
}

function renderHistory() {
  currentMoveDiv.textContent = clueHistory.length > 0 ? clueHistory[clueHistory.length - 1] : "";
  var historyHtml = "";
  for (let i = clueHistory.length - 2; i >= 0; i--) {
    historyHtml += '<li>' + clueHistory[i] + '</li>';
  }
  historyUl.innerHTML = historyHtml;
}

const tileSize = 20;
function renderMap() {
  mapCanvas.width = boardSize * tileSize;
  mapCanvas.height = boardSize * tileSize;
  let context = mapCanvas.getContext("2d");
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      let ch = gameBoardString[toIndex(r, c)];
      let spaceColor;
      switch (ch) {
        case "^": case "<": continue;
        case " ": spaceColor = null;      break;
        case "s": spaceColor = "#a99faa"; break;
        case "S": spaceColor = "#6d666d"; break;
        case "f": spaceColor = "#c5b593"; break;
        case "F": spaceColor = "#867a63"; break;
        case "C": spaceColor = "#ed3822"; break;
        case "W": spaceColor = "#4d8a53"; break;
        case "D": spaceColor = "#965b4e"; break;
        default: throw new Error();
      }

      let {span_r, span_c} = coordToSpan(r, c);
      let x = c * tileSize;
      let y = r * tileSize;
      let width = span_c * tileSize;
      let height = span_r * tileSize;
      context.fillStyle = "black";
      context.fillRect(x, y, width, height);
      context.fillStyle = spaceColor;
      context.fillRect(x + 1, y + 1, width - 2, height - 2);
    }
  }

  if (persistentState.ui.showMovementGraph) {
    context.fillStyle = "rgba(255,255,255,0.5)";
    context.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    context.fillStyle = "black";
    context.strokeStyle = "black";
    context.lineWidth = tileSize / 10;

    for (let thiefRoom = 0; thiefRoom < thiefRoomToAdjacentThiefRooms.length; thiefRoom++) {
      let adjacentThiefRooms = thiefRoomToAdjacentThiefRooms[thiefRoom];
      if (adjacentThiefRooms == null) continue;
      let {x, y} = getCenterOfRoom(thiefRoom);
      context.beginPath();
      context.arc(x, y, tileSize / 5, 0, Math.PI*2);
      context.fill();
      let orientation = roomToDoorwayOrientation[thiefRoom];
      switch (orientation) {
        case "v":
          context.beginPath();
          context.moveTo(x - tileSize, y);
          context.lineTo(x + tileSize, y);
          context.stroke();
          break;
        case "h":
          context.beginPath();
          context.moveTo(x, y - tileSize);
          context.lineTo(x, y + tileSize);
          context.stroke();
          break;
        case "d":
          context.beginPath();
          context.moveTo(x - tileSize, y - tileSize);
          context.lineTo(x + tileSize, y + tileSize);
          context.stroke();
          break;
      }
      for (let otherRoom of adjacentThiefRooms) {
        if (otherRoom < thiefRoom) continue; // already drawn
        context.beginPath();
        context.moveTo(x, y);
        let {x:other_x, y:other_y} = getCenterOfRoom(otherRoom);
        context.lineTo(other_x, other_y);
        context.stroke();
      }
    }
  }

  if (persistentState.ui.showThiefMovement) {
    if (movementHistory.length > 0) {
      context.fillStyle = context.strokeStyle = "#f3a6ff";
      context.lineWidth = tileSize / 10;
      for (let i = 0; i < movementHistory.length - 1; i++) {
        let room = movementHistory[i]
        let nextRoom = movementHistory[i + 1];

        // Draw a dot here.
        let {x, y} = getCenterOfRoom(room);
        context.beginPath();
        context.arc(x, y, tileSize / 5, 0, Math.PI*2);
        context.fill();
        if (nextRoom === theSubway) {
          // Entering the subway.
          context.beginPath()
          context.moveTo(x, y);
          context.lineTo(x - tileSize * 0.6, y + tileSize * 0.8);
          context.stroke();
        } else if (room === theSubway) {
          // Exiting the subway.
          let {x:other_x, y:other_y} = getCenterOfRoom(nextRoom);
          context.beginPath()
          context.moveTo(other_x, other_y);
          context.lineTo(other_x - tileSize * 0.6, other_y + tileSize * 0.8);
          context.stroke();
        } else {
          // Connect rooms with a line.
          context.beginPath();
          context.moveTo(x, y);
          let {x:other_x, y:other_y} = getCenterOfRoom(nextRoom);
          context.lineTo(other_x, other_y);
          context.stroke();
        }
      }
      let currentRoom = movementHistory[movementHistory.length - 1];
      if (currentRoom !== theSubway) {
        // Big circle around current location.
        context.lineWidth = tileSize / 6;
        context.beginPath();
        let {x, y} = getCenterOfRoom(currentRoom);
        context.arc(x, y, Math.sqrt(1/2) * tileSize, 0, Math.PI*2);
        context.stroke();
      }
    }
  }
}
function getCenterOfRoom(room) {
  var {r, c} = toCoord(room);
  let {span_r, span_c} = coordToSpan(r, c);
  return {
    x: (c + span_c/2) * tileSize,
    y: (r + span_r/2) * tileSize,
  };
}
function coordToSpan(r, c) {
  let span_r = 1;
  for (; r + span_r < boardSize; span_r++) {
    if (gameBoardString[toIndex(r + span_r, c)] !== "^") break;
  }
  let span_c = 1;
  for (; c + span_c < boardSize; span_c++) {
    if (gameBoardString[toIndex(r, c + span_c)] !== "<") break;
  }
  return {span_r, span_c};
}

function addToArraySet(array, item) {
  if (array.indexOf(item) !== -1) return;
  array.push(item);
}
function removeFromArray(array, item) {
  var index = array.indexOf(item);
  if (index === -1) throw new Error();
  array.splice(index, 1);
}
function randomArrayItem(array) {
  if (array.length === 0) throw new Error();
  return array[Math.floor(Math.random() * array.length)];
}

function init() {
  computeMapLayout();
  renderMap();
}

init();
