// State of Keys
const state = {
  tool: 'hintergrund',
  active: {
    hintergrund: false,
    vordergrund: false,
    objektArt: false
  }
};

// Hintergrund-Bilder Array
const bilder = {
  hintergrund: [
    'hintergrund/meer_1.gif', 
    'hintergrund/meer_unter.jpg',
    'hintergrund/meer_unter_1.jpg',
    'hintergrund/meer_unter_2.jpg',
    'hintergrund/nacht.png',
    'hintergrund/wolkenkratzer.jpg',
    'hintergrund/wueste.jpg', 
    'hintergrund/himmel.png'
 ],


  vordergrund: [
    //'hintergrund/test_2.png',
    'vordergrund/wueste.png', 
    'vordergrund/berge2.png',
    'vordergrund/dschungel.png', 
    'vordergrund/feld.png',
  ],

  objektArt: [
    ['objekte/ast.png', 'objekte/steine.png'],      // Taste 1
    ['objekte/blumen.png', 'objekte/ast.png'],      // Taste 2
    ['objekte/steine.png', 'objekte/ast.png'],      // Taste 3
    [],                                             // Taste 4
    [],                                             // Taste 5
    [],                                             // Taste 6
    [],                                             // Taste 7
    [],                                             // Taste 8
    [],                                             // Taste 9
    []                                              // Taste 0
  ]
  
  /*objektArt: Array.from({ length: 10 }, () => [
    ['objekte/ast.png', 'objekte/steine.png'], 
    ['objekte/blumen.png', 'objekte/ast.png'], 
    ['objekte/steine.png', 'objekte/ast.png'], 
    [], [], [], [], [], [], []
   ])*/
};

// Index für Hintergrund/Vordergrund
const index = {
  hintergrund: 0,
  vordergrund: 0
};

// Index für Objektarten (10 Slots)
const objektIndex = Array(10).fill(0);

// aktuell ausgewählter Objekt-Slot
let selectedSlot = 0;

// gespeicherte Auswahl
const saved = {
  hintergrund: null,
  vordergrund: null
};

const objects = [];


// =======================
// UNIVERSAL IMAGE SWITCH
// =======================

function next(layer) {
  if (!bilder[layer] || bilder[layer].length === 0) return;

  index[layer] = (index[layer] + 1) % bilder[layer].length;

  const el = document.getElementById(layer);
  if (!el) return;

  el.src = bilder[layer][index[layer]];
}


// =======================
// OBJEKTART SWITCH (INNERHALB SLOT)
// =======================

function nextObjektArt(slot) {
  const arr = bilder.objektArt[slot];
  if (!arr || arr.length === 0) return;

  objektIndex[slot] = (objektIndex[slot] + 1) % arr.length;

  const el = document.getElementById('objektArt');
  if (!el) return;

  el.src = arr[objektIndex[slot]];
}


// =======================
// SLOT AUSWAHL (1–0)
// =======================

function selectObjektArt(i) {
  selectedSlot = i;

  // optional: direkt Bild anzeigen
  const arr = bilder.objektArt[i];
  if (arr && arr.length > 0) {
    const el = document.getElementById('objektArt');
    if (el) el.src = arr[objektIndex[i]];
  }
}


// =======================
// INNERHALB SLOT BILDER WECHSELN
// =======================

function selectInnerObjektArt(i) {
  nextObjektArt(i);
}


// =======================
// HOTKEY LAYER SWITCH
// =======================

// Strg + ArrowUp == Ebene hoch (Objekt → Vordergrund → Hintergrund)
hotkeys('ctrl+up', function (event) {
  event.preventDefault();

  if (state.tool === 'objektArt') {
    state.tool = 'vordergrund';
  } else if (state.tool === 'vordergrund') {
    state.tool = 'hintergrund';
  }
});

// Strg + ArrowDown == Ebene runter
hotkeys('ctrl+down', function (event) {
  event.preventDefault();

  if (state.tool === 'hintergrund') {
    state.tool = 'vordergrund';
  } else if (state.tool === 'vordergrund') {
    state.tool = 'objektArt';
  }
});


// =======================
// TOOL + NEXT LOGIC
// =======================

// W = Hintergrund
hotkeys('w', () => {
  if (state.tool === 'hintergrund') {
    next('hintergrund');
  } else {
    state.tool = 'hintergrund';
  }
});

// S = Vordergrund
hotkeys('s', () => {
  if (state.tool === 'vordergrund') {
    next('vordergrund');
  } else {
    state.tool = 'vordergrund';
  }
});

// Y = ObjektArt
hotkeys('y', () => {
  state.tool = 'objektArt';
});

// =======================
// OBJEKT AUF BILDSCHIRM HINZUFÜGEN
// =======================

function addObjectToScreen(slot, imgIndex) {
  const img = document.createElement('img');
  img.src = bilder.objektArt[slot][imgIndex];
  img.className = 'objektArt';
  document.body.appendChild(img);
}


// =======================
// SPEICHERN / ADDEN
// =======================
function addObjectToScreen(slot, imgIndex) {
  const img = document.createElement('img');
  img.src = bilder.objektArt[slot][imgIndex];
  img.className = 'placedObject';
  document.body.appendChild(img);

  objects.push({
    slot: slot,
    index: imgIndex,
    element: img
  });
}

hotkeys('a', () => {
  if (state.tool === 'hintergrund') {
    saved.hintergrund = index.hintergrund;
  }

  else if (state.tool === 'vordergrund') {
    saved.vordergrund = index.vordergrund;
  }

  else if (state.tool === 'objektArt') {
    addObjectToScreen(selectedSlot, objektIndex[selectedSlot]);
  }
});


/*hotkeys('a', () => {
  if (state.tool === 'hintergrund') {
    saved.hintergrund = index.hintergrund;
  }

  else if (state.tool === 'vordergrund') {
    saved.vordergrund = index.vordergrund;
  }

  else if (state.tool === 'objektArt') {
    objects.push({
      slot: selectedSlot,
      index: objektIndex[selectedSlot]
    });
  }
});*/
// =======================
// UNDO (Z) - Letztes Objekt entfernen
// =======================

hotkeys('z', () => {
  if (objects.length === 0) return;

  const lastObject = objects.pop();

  if (lastObject.element) {
    lastObject.element.remove();
  }
});

// =======================
// NUMMERN 1–0 SLOT WAHL
// =======================

for (let i = 0; i < 10; i++) {
  const key = i === 9 ? '0' : String(i + 1);

  hotkeys(key, () => {
    selectObjektArt(i);
  });
}


// =======================
// STRG + NUMMER = INNER SLOT BILD
// =======================

function strgUndZahlAuswahl() {
  for (let i = 0; i < 10; i++) {
    const key = i === 9 ? '0' : String(i + 1);

    hotkeys(`ctrl+${key}`, (event) => {
      event.preventDefault();
      selectInnerObjektArt(i);
    });
  }
}
strgUndZahlAuswahl();

//Beim Starten der App
window.onload = () => {
  document.getElementById('hintergrund').src =
    bilder.hintergrund[index.hintergrund];

  document.getElementById('vordergrund').src =
    bilder.vordergrund[index.vordergrund];
};