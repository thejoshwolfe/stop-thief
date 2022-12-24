function resize() {
  const backgroundDiv = document.getElementById("crimeScannerBackgroundDiv");
  const crimeScannerCanvas = document.getElementById("crimeScannerCanvas");
  const backgroundWidth = backgroundDiv.clientWidth;
  const backgroundHeight = backgroundDiv.clientHeight;
  const backgroundAspectRatio = backgroundWidth / backgroundHeight;
  const foregroundAspectRatio = crimeScannerCanvas.width / crimeScannerCanvas.height;
  let scale;
  let x, y;
  if (backgroundAspectRatio < foregroundAspectRatio) {
    // Width limited.
    scale = backgroundWidth / crimeScannerCanvas.width;
    crimeScannerCanvas.style.width = backgroundWidth;
    const scaledHeight = backgroundWidth / foregroundAspectRatio;
    crimeScannerCanvas.style.height = scaledHeight + "px";
    x = 0;
    y = Math.floor((backgroundHeight - scaledHeight) / 2);
  } else {
    // Height limited.
    scale = backgroundHeight / crimeScannerCanvas.height;
    crimeScannerCanvas.style.height = backgroundHeight;
    const scaledWidth = backgroundHeight * foregroundAspectRatio;
    crimeScannerCanvas.style.width = scaledWidth + "px";
    x = Math.floor((backgroundWidth - scaledWidth) / 2);
    y = 0;
  }
  crimeScannerCanvas.style.left = x + "px";
  crimeScannerCanvas.style.top = y + "px";

  // Position buttons.
  for (let row of buttonBoundingBoxes) {
    const button = document.getElementById("button" + row[0]);
    button.style.left = (x + row[1] * scale) + "px";
    button.style.top = (y + row[2] * scale) + "px";
    button.style.width = row[3] * scale + "px";
    button.style.height = row[4] * scale + "px";
  }

  render();
}
setTimeout(resize, 0);
window.addEventListener("resize", resize);

// This can be called by devs to generate the thing.
function _generateMachine() {
  let code = "";
  const crimeScannerCanvas = document.getElementById("crimeScannerCanvas");
  const context = crimeScannerCanvas.getContext("2d");
  context.fillStyle = "#222";
  context.fillRect(0, 0, crimeScannerCanvas.width, crimeScannerCanvas.height);

  // LCD background and frame.
  context.fillStyle = "#111";
  context.beginPath();
  context.roundRect(105, 45, 790, 620, 50);
  context.fill();
  context.fillStyle = "#422";
  context.beginPath();
  context.roundRect(140, 80, 720, 550, 18);
  context.fill();
  context.fillStyle = "#7c0616";
  context.beginPath();
  context.roundRect(291, 120, 434, 186, 2);
  context.fill();

  // LCD painted overlay.
  context.strokeStyle = "#ddd";
  context.fillStyle = "#ddd";
  context.lineWidth = 12;
  // Border and stripes.
  context.beginPath();
  context.roundRect(175, 115, 650, 480, 14);
  context.moveTo(175, 320);
  context.lineTo(825, 320);
  context.moveTo(175, 350);
  context.lineTo(825, 350);
  context.stroke();
  // Text.
  context.font = "bold 37px sans-serif";
  context.fillText("BLDG.", 205, 197, 117);
  context.lineWidth = 4;
  context.moveTo(188, 203); context.lineTo(333, 203);
  context.stroke();
  context.fillText("STREET", 188, 236, 145);
  context.fillText("LOC.", 684, 222, 90);
  context.font = "bold 70px sans-serif";
  context.fillText("ELECTRONIC", 282, 464, 436);
  context.fillText("CRIME SCANNER", 197, 528, 571);
  context.font = "bold 25px sans-serif";
  context.fillText("TM", 768, 500, 35);

  // Button frame.
  context.fillStyle = "#111";
  context.beginPath();
  context.roundRect(0, 716, 1000, 1484, 60);
  context.fill();
  context.fillStyle = "#222";
  context.beginPath();
  context.roundRect(35, 751, 930, 1414, 25);
  context.fill();

  // Button grid.
  const buttonNames = [
    "1", "2", "Settings",
    "3", "4", "On",
    "5", "6", "Tip",
    "7", "8", "Arrest",
    "9", "0", "Clue",
  ];
  const white = "#dfdeda";
  const buttonColors = function() {
    const c1 = "#e2bd3a";
    const c2 = "#e99c0e";
    const c3 = "#d68647";
    const c4 = "#d84334";
    const c5 = c4;
    const c6 = "#ad2764";
    const c7 = "#6a243c";
    const c8 = "#1f2058";
    const c9 = "#0e4780";
    const c0 = "#114739";
    const tip = c4;
    const arrest = c3;
    const clue = c1;
    return [
      c1,c2, c1,c2, white,white,
      c3,c4, c3,c4, white,white,
      c5,c6, c5,c6, tip,tip,
      c7,c8, c7,c8, arrest,arrest,
      c9,c0, c9,c0, clue,clue,
    ];
  }();
  code += "const buttonBoundingBoxes = [\n";
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      let i = r * 3 + c;
      let x = 35 + 125 + (182+67) * c - 22/2;
      let y = 751 + 62 + (187+72) * r - 22/2;
      let width = 182+22;
      let height = 187+22;

      // Two-color background.
      const colorTop    = buttonColors[2*i];
      const colorBottom = buttonColors[2*i + 1];
      context.fillStyle = colorTop;
      context.fillRect(x, y, width, height);
      if (colorTop !== colorBottom) {
        context.fillStyle = colorBottom;
        context.fillRect(x, y + height/2, width, height/2);
      }

      // Text.
      switch (buttonNames[i]) {
        case "1": case "2": case "3": case "4": case "5":
        case "6": case "7": case "8": case "9": case "0":
          context.fillStyle = white;
          context.font = "bold 170px FreeSans";
          context.fillText(buttonNames[i], x + 56, y + 164);
          break;
        case "Settings":
          context.fillStyle = "#407986";
          // A gear.
          context.save();
          {
            context.strokeStyle = context.fillStyle;
            context.lineWidth = 5;
            context.lineJoin = "round";
            context.beginPath();
            const cx = x + width/2;
            const cy = y + height/2;
            const slice_angle = 2*Math.PI/8;
            const r_out = 56;
            const r_mid = 43;
            const r_min = 30;
            const tooth_width = 0.4;
            const slope_width = 0.1;
            const base_width  = 0.4;
            for (let i = 0; i < 9; i++) {
              context.arc(cx, cy, r_out,
                slice_angle * (-tooth_width/2 + i),
                slice_angle * (-tooth_width/2 + i + tooth_width),
              );
              if (i === 8) break;
              context.arc(cx, cy, r_mid,
                slice_angle * (-tooth_width/2 + i + tooth_width + slope_width),
                slice_angle * (-tooth_width/2 + i + tooth_width + slope_width + base_width),
              );
            }
            context.arc(cx, cy, r_min, 0, 2 * Math.PI, true);
            context.fill();
            context.stroke();
          }
          context.restore();
          break;
        case "On":
          context.fillStyle = "#d06951";
          context.font = "bold 60px FreeSans";
          context.fillText("ON", x + 58, y + 126);
          break;
        case "Tip":
          // Ultra narrow letter T.
          context.fillStyle = white;
          context.fillRect(x + 76, y + 35, 54, 24);
          context.fillRect(x + 91, y + 35, 24, 106);
          // The word TIP.
          context.fillStyle = "#111";
          context.font = "bold 27px FreeSans";
          context.fillText("TIP", x + 81, y + 168);
          break;
        case "Arrest":
          context.fillStyle = white;
          context.font = "bold 130px FreeSans";
          context.fillText("A", x + 56, y + 140);
          context.fillStyle = "#111";
          context.font = "bold 27px FreeSans";
          context.fillText("ARREST", x + 49, y + 168);
          break;
        case "Clue":
          context.fillStyle = white;
          context.font = "bold 130px FreeSans";
          context.fillText("C", x + 56, y + 140);
          context.fillStyle = "#111";
          context.font = "bold 27px FreeSans";
          context.fillText("CLUE", x + 67, y + 168);
          break;
        default: throw new Error("not handled: " + buttonNames[i]);
      }

      // Border.
      context.strokeStyle = "#111";
      context.lineWidth = 22;
      context.beginPath();
      context.roundRect(x, y, width, height, 22);
      context.stroke();

      code += `  ["${buttonNames[i]}", ${x}, ${y}, ${width}, ${height}],\n`;
    }
  }
  code += "];\n";

  console.log(code);
}

// Generated image:
const machineImage = new Image();
machineImage.addEventListener("load", render);
machineImage.src = "electronic-crime-scanner.png";
// Generated code:
const buttonBoundingBoxes = [
  ["1", 149, 802, 204, 209],
  ["2", 398, 802, 204, 209],
  ["Settings", 647, 802, 204, 209],
  ["3", 149, 1061, 204, 209],
  ["4", 398, 1061, 204, 209],
  ["On", 647, 1061, 204, 209],
  ["5", 149, 1320, 204, 209],
  ["6", 398, 1320, 204, 209],
  ["Tip", 647, 1320, 204, 209],
  ["7", 149, 1579, 204, 209],
  ["8", 398, 1579, 204, 209],
  ["Arrest", 647, 1579, 204, 209],
  ["9", 149, 1838, 204, 209],
  ["0", 398, 1838, 204, 209],
  ["Clue", 647, 1838, 204, 209],
];
// End generated code.

buttonBoundingBoxes.forEach(row => {
  const name = row[0];
  const button = document.createElement("button");
  button.id = "button" + name;
  button.style.position = "absolute";
  button.classList.add("invisibleButton");
  // This might be findable by a screen reader or something:
  button.textContent = name;
  // It goes in the background div.
  document.getElementById("crimeScannerBackgroundDiv").appendChild(button);
  const handler = function() {
    switch (name) {
      case "1": case "2": case "3": case "4": case "5":
      case "6": case "7": case "8": case "9": case "0":
        const number = parseInt(name);
        return () => handleNumber(number);
      case "Settings": return handleSettings;
      case "On":       return handleNewGame;
      case "Tip":      return handleTip;
      case "Arrest":   return handleArrest;
      case "Clue":     return handleClue;
      default: throw new Error("not handled: " + buttonNames[i]);
    }
  }();
  button.addEventListener("click", handler);
});

window.addEventListener("keydown", function(event) {
  const SHIFT = 1 << 0;
  const CTRL =  1 << 1;
  const ALT =   1 << 2;
  const META =  1 << 3;
  const modifiers = (
    event.shiftKey * SHIFT |
    event.ctrlKey * CTRL |
    event.altKey * ALT |
    event.metaKey * META
  );
  switch (event.key) {
      case "1": case "2": case "3": case "4": case "5":
      case "6": case "7": case "8": case "9": case "0":
        if (modifiers === 0) {
          event.preventDefault();
          const number = parseInt(event.key);
          handleNumber(number);
        }
        break;
    case " ":
      if (modifiers === 0) {
        event.preventDefault();
        handleClue();
      }
      break;
    case "Escape":
      if (modifiers === 0) {
        event.preventDefault();
        handleSettings();
      }
      break;
    case "Backspace":
      if (modifiers === 0) {
        event.preventDefault();
        // TODO: backspace typed numbers.
      }
      break;
    case "T": case "t":
      if (modifiers === SHIFT) {
        event.preventDefault();
        handleTip();
      }
      break;
    case "A": case "a":
      if (modifiers === SHIFT) {
        event.preventDefault();
        handleArrest();
      }
      break;
    case "N": case "n":
      if (modifiers === SHIFT) {
        event.preventDefault();
        handleNewGame();
      }
      break;
  }
});

function render() {
  const crimeScannerCanvas = document.getElementById("crimeScannerCanvas");
  const context = crimeScannerCanvas.getContext("2d");

  context.drawImage(machineImage, 0, 0);

  // TODO: LCD numbers
}


function handleSettings() {
  const everythingElseDiv = document.getElementById("everythingElseDiv");
  if (everythingElseDiv.style.display == "none") {
    everythingElseDiv.style.display = "block";
    everythingElseDiv.scrollIntoView({behavior:"smooth"});
  } else {
    everythingElseDiv.style.display = "none";
  }
}
function handleNewGame() {
  // TODO
}
function handleTip() {
  // TODO
}
function handleArrest() {
  // TODO
}
function handleClue() {
  // TODO: check if game is running.
  doClue();
}
function handleNumber(number) {
  // TODO
}


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
var waitTimeHere = 0;
clueButton.addEventListener("click", handleClue);

function doClue() {
  if (movementHistory.length === 0 || Math.random() < persistentState.probabilities.move) {
    makeAMove(true);
    renderMap();
  } else {
    // Wait
    waitTimeHere++;
  }
  renderHistory();
}
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
  waitTimeHere = 0;
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
  let listedHistory;
  if (waitTimeHere > 0) {
    listedHistory = clueHistory.slice();
    let displayText = "Wait";
    if (waitTimeHere > 1) {
      displayText += " x" + waitTimeHere;
    }
    displayText += " (" + renderBuildingNumber(getBuildingNumber(movementHistory[movementHistory.length - 1])) + ")";
    currentMoveDiv.textContent = displayText;
  } else {
    listedHistory = clueHistory.slice(0, clueHistory.length - 1);
    currentMoveDiv.textContent = clueHistory[clueHistory.length - 1] || "";
  }
  listedHistory.reverse();
  var historyHtml = "";
  for (let clue of listedHistory) {
    historyHtml += '<li>' + clue + '</li>';
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
