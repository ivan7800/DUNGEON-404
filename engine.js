/* DUNGEON 404 v1.6 — original RPG rules. Works in browsers and Node tests. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DungeonEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const VERSION = 16;
  const V14_SAVE_KEY = 'dungeon404-save-v14';
  const V13_SAVE_KEY = 'dungeon404-save-v13';
  const V12_SAVE_KEY = 'dungeon404-save-v12';
  const V11_SAVE_KEY = 'dungeon404-save-v11';
  const V10_SAVE_KEY = 'dungeon404-save-v10';
  const V9_SAVE_KEY = 'dungeon404-save-v9';
  const V15_SAVE_KEY = 'dungeon404-save-v15';
  const SAVE_KEY = 'dungeon404-save-v16';
  const V8_SAVE_KEY = 'dungeon404-save-v8';
  const V7_SAVE_KEY = 'dungeon404-save-v7';
  const PREVIOUS_SAVE_KEY = 'dungeon404-save-v6';
  const V5_SAVE_KEY = 'dungeon404-save-v5';
  const LEGACY_SAVE_KEY = 'dungeon404-save-v3';
  const V4_SAVE_KEY = 'dungeon404-save-v4';
  const LEVEL = [
    '###############',
    '#S....#.......#',
    '#.##..#.###.#.#',
    '#..#....#...#.#',
    '##.#.####.#.#.#',
    '#..#......#...#',
    '#.#####.#####.#',
    '#...#...#.....#',
    '#.#.#.###.###.#',
    '#.#...#...#...#',
    '#.#####.###.#.#',
    '#...K...#...#.#',
    '###.#####.###.#',
    '#...P.....G.X.#',
    '###############'
  ];
  const LOWER = [
    '###############',
    '#S....#.......#',
    '#.#...#....#..#',
    '#.#.#...##...##',
    '#...#.#....#..#',
    '###...#..#....#',
    '#...###..##.#.#',
    '#.##....#....##',
    '#....##.#.##..#',
    '##.#....#.....#',
    '#...##..#..##.#',
    '#...R...#...#.#',
    '###.#####.###.#',
    '#...P.....B.X.#',
    '###############'
  ];
  // Third depth keeps the navigational grammar but changes the floor's story and encounters.
  // Unlike v0.8, the Archive now has its own layout, side chambers and looping routes.
  const LABYRINTH = [
    '###############',
    '#S....#.......#',
    '#.###.#.##....#',
    '#...#.#....##.#',
    '###.#...##....#',
    '#...###....##.#',
    '#.##...##.#...#',
    '#....#........#',
    '##.#.#.##.....#',
    '#...#....#.##.#',
    '#.###.##...#..#',
    '#...A...#...#.#',
    '###.#####.###.#',
    '#...P.....B.X.#',
    '###############'
  ];
  const ABYSS = [
    '###############',
    '#S.....#......#',
    '#....#.#..##..#',
    '#.#..#...#....#',
    '#....##..##...#',
    '#.......#.....#',
    '#...#....#....#',
    '#....#........#',
    '#.#..#..####..#',
    '#....#........#',
    '#....#.##..#..#',
    '#.#.R...#...#.#',
    '#.###.###.###.#',
    '#...........X.#',
    '###############'
  ];
  const WIDTH = LEVEL[0].length, HEIGHT = LEVEL.length;
  if(!LOWER.every(r=>r.length===WIDTH))throw Error('Invalid lower floor geometry');
  if(!LABYRINTH.every(r=>r.length===WIDTH))throw Error('Invalid labyrinth geometry');
  if(!ABYSS.every(r=>r.length===WIDTH))throw Error('Invalid abyss geometry');
  if (!LEVEL.every(r => r.length === WIDTH)) throw Error('Invalid level geometry');
  const DIRS = [[0,-1],[1,0],[0,1],[-1,0]];
  const HEROES = [
    {name:'Aldric',role:'Guerrero',hp:34,max:34,damage:9,defense:3,level:1,xp:0,mana:0,maxMana:0,weapon:'Espada de hierro',armor:'Cota de malla'},
    {name:'Mara',role:'Pícara',hp:25,max:25,damage:7,defense:2,level:1,xp:0,mana:0,maxMana:0,weapon:'Dagas gemelas',armor:'Cuero reforzado'},
    {name:'Ilyra',role:'Maga',hp:19,max:19,damage:11,defense:0,level:1,xp:0,mana:18,maxMana:18,weapon:'Bastón de ceniza',armor:'Túnica rúnica'},
    {name:'Borin',role:'Clérigo',hp:27,max:27,damage:6,defense:2,level:1,xp:0,mana:14,maxMana:14,weapon:'Maza bendita',armor:'Escudo de roble'}
  ];
  const START_MONSTERS = [
    {floor:1,x:5,y:3,hp:18,max:18,name:'Penitente sin rostro',damage:4,kind:'lurker'},
    {floor:1,x:11,y:7,hp:22,max:22,name:'Larva del coro',damage:5,kind:'crawler'},
    {floor:1,x:10,y:13,hp:42,max:42,name:'Confesor desollado',damage:7,kind:'warden'}
  ];
  const LOWER_MONSTERS = [
    {floor:2,x:5,y:3,hp:28,max:28,name:'Ahogado del Umbral',damage:6,kind:'specter',cosmicType:'drowned',mindStrikes:0},
    {floor:2,x:11,y:7,hp:32,max:32,name:'Larva de la Marea Negra',damage:7,kind:'crawler',cosmicType:'tideborn',mindStrikes:0},
    {floor:2,x:10,y:13,hp:68,max:68,name:'El Bibliotecario de las Mil Lenguas',damage:9,kind:'king',cosmicType:'librarian',mindStrikes:0}
  ];
  const LABYRINTH_MONSTERS = [
    {floor:3,x:5,y:3,hp:40,max:40,name:'Monje sin ojos',damage:8,kind:'specter'},
    {floor:3,x:11,y:7,hp:45,max:45,name:'Engendro de la grieta',damage:9,kind:'crawler'},
    {floor:3,x:10,y:13,hp:92,max:92,name:'El Archivista Vacío',damage:11,kind:'archivist'}
  ];
  const ABYSS_MONSTERS = [
    {floor:4,x:3,y:5,hp:47,max:47,name:'Acólito del Eclipse',damage:9,kind:'specter'},
    {floor:4,x:11,y:7,hp:54,max:54,name:'Centinela de Sal',damage:10,kind:'crawler'},
    {floor:4,x:10,y:13,hp:118,max:118,name:'El Primer Nombre',damage:12,kind:'firstname'}
  ];
  // Four roaming cosmic entities give each depth its own silhouette and threat.
  // Stable IDs let older saves receive them once without reviving defeated ones.
  const COSMIC_ROAMERS = [
    {id:'roamer-starseer',floor:1,x:7,y:7,hp:26,max:26,name:'El Astrónomo Ciego',damage:6,kind:'starseer',mindStrikes:0},
    {id:'roamer-chorus',floor:2,x:7,y:7,hp:34,max:34,name:'La Madre de la Marea',damage:7,kind:'chorus',mindStrikes:0},
    {id:'roamer-cartographer',floor:3,x:8,y:3,hp:38,max:38,name:'El Cartógrafo de la Herida',damage:8,kind:'cartographer',mindStrikes:0},
    {id:'roamer-voidmoth',floor:4,x:8,y:3,hp:46,max:46,name:'La Polilla del Último Cielo',damage:9,kind:'voidmoth',mindStrikes:0}
  ];
  const GEAR = {
    sword:{id:'sword',label:'Espada de los sepultados',slot:'weapon',bonus:5},
    mail:{id:'mail',label:'Coraza de ceniza',slot:'armor',bonus:3},
    staff:{id:'staff',label:'Bastón de los ecos',slot:'weapon',bonus:3,role:'Maga'},
    amulet:{id:'amulet',label:'Amuleto del silencio',slot:'armor',bonus:2,role:'Clérigo'},
    daggers:{id:'daggers',label:'Puñales del Eco Roto',slot:'weapon',bonus:6,role:'Pícara'},
    bulwark:{id:'bulwark',label:'Coraza del Último Vigía',slot:'armor',bonus:5,role:'Guerrero'}
  };
  const LORES = {
    '5,1':'Inscripción de los custodios: «El nombre de un dios puede ser una jaula». Pulsa I para investigar.',
    '7,5':'Un códice húmedo describe una campana que suena debajo del mar. Pulsa I para investigar.',
    '3,11':'Tres bocas cinceladas rodean una lápida: aquí puede practicarse el rito del silencio.',
    '9,13':'El confesionario está abierto. Detrás de la reja, un penitente todavía respira.'
  };
  const DEPTH_LORES=Object.freeze({
    2:{'5,1':'Un manuscrito flota sin mojarse. Descifra las mareas sin luna (U).','7,5':'Entre dos estantes hay un códice sujeto con hilo de cobre. Descífralo (U).','3,11':'La losa ofrece dos respuestas: sellar o escuchar. Conoce ambos manuscritos antes de decidir en el Códice.','9,13':'Miles de lenguas pronuncian una sola sílaba detrás de la reja. El Bibliotecario os espera.'},
    3:{'5,1':'Una aguja de latón gira cuando pronunciáis un nombre. La piedra conserva las marcas de otras expediciones.','7,5':'Un bastón de ceniza descansa sobre una carta del cielo. Revisa el equipo de Ilyra en el Inventario.','3,11':'El sigilo se hunde bajo vuestros pies. Un conducto de luz recorre el muro hacia la reja del Archivo.','9,13':'Las páginas del último atril están en blanco. El Archivista busca un nombre para llenarlas.'},
    4:{'5,1':'Cada nicho conserva una cavidad del tamaño de una boca. La compañía pasa en silencio.','7,5':'Las velas siguen calientes, pero la ceniza no deja huellas. Alguien acaba de retirarse.','3,11':'La runa del último nombre está junto a este sepulcro. Al fondo queda el custodio del umbral.','9,13':'El Primer Nombre respira al otro lado. La salida exige la runa y el silencio del custodio.'}
  });
  const loreAt=(s,pos)=>s.floor===1?LORES[pos]:DEPTH_LORES[s.floor]?.[pos];
  // One-shot narrative beats on each descent, reusing loreRead for old-save compatibility.
  const DESCENT_BEATS = Object.freeze({
    1:Object.freeze({'6,5':'Los pasos que os preceden se detienen cuando os detenéis. Al reanudar la marcha, se oye un quinto par de botas.','9,9':'Una campana suena bajo la piedra. Nadie recuerda haberla oído, pero todos conocen la melodía.'}),
    2:Object.freeze({'5,5':'El agua trepa por los muros y se queda suspendida sobre vuestras cabezas. Algo golpea desde el otro lado.','10,9':'En la superficie negra aparecen vuestros reflejos, salvo que uno de ellos sigue andando cuando vosotros paráis.'}),
    3:Object.freeze({'3,5':'El corredor regresa al mismo lugar. Una inscripción nueva dice: «No habéis pasado por aquí todavía».','6,9':'El mapa de Mara se ha dibujado solo. La tinta marca una ruta que termina en el nombre de quien lo sostiene.'}),
    4:Object.freeze({'1,7':'Los nichos están vacíos. Al pasar, algo dentro de cada uno pronuncia un nombre distinto.','7,3':'Una luz atraviesa el osario desde abajo. Las sombras de la compañía apuntan hacia la salida.'})
  });
  // One-shot exploration discoveries with a small, readable mechanical payoff.
  const BEAT_REWARDS=Object.freeze({
    '1:9,9':{run(s){const before=s.lucidity;s.lucidity=Math.min(10,s.lucidity+1);return `La melodía os devuelve un recuerdo propio (+${s.lucidity-before} lucidez).`; }},
    '2:10,9':{run(s){s.sanity=clampSanity(s.sanity-3);return 'El reflejo tardío os roba un fragmento de cordura (-3).';}},
    '3:6,9':{run(s){s.ether=Math.min(1000,s.ether+1);return 'La tinta deja una esencia atrapada en el mapa (+1 esencia).';}},
    '4:7,3':{run(s){s.sanity=clampSanity(s.sanity+5);return 'La luz bajo el osario calma el pulso (+5 cordura).';}}
  });
  // Side-chamber echoes are optional, one-choice discoveries separate from existing beat rewards.
  const ECHO_SITES=Object.freeze({
    '1:6,5':Object.freeze({name:'El quinto paso',text:'El eco espera a que la compañía respire al unísono.',choiceB:'Linterna del Quinto Paso',relic:'lantern'}),
    '2:5,5':Object.freeze({name:'La bóveda suspendida',text:'Tras el agua inmóvil, una voz ofrece calma o poder.',choiceB:'Espejo de Marea',relic:'mirror'}),
    '3:3,5':Object.freeze({name:'El corredor que vuelve',text:'La inscripción cambia cuando apartas la mirada.',choiceB:'Brújula de Tinta',relic:'compass'}),
    '4:1,7':Object.freeze({name:'El nicho que pronuncia',text:'Una voz ofrece descanso a cambio de que olvidéis su rostro.',choiceB:'Campana de Nichos Vacíos',relic:'bell'})
  });
  const RELICS=Object.freeze({lantern:{name:'Linterna del Quinto Paso',use:'Recupera 15 de cordura.'},mirror:{name:'Espejo de Marea',use:'Santuario para la siguiente fase enemiga.'},compass:{name:'Brújula de Tinta',use:'Recupera 2 de lucidez.'},bell:{name:'Campana de Nichos Vacíos',use:'Interrumpe a los enemigos visibles hasta a dos casillas.'}});
  function echoAt(s){return ECHO_SITES[`${s.floor}:${s.x},${s.y}`]||null;}
  function resolveEcho(s,events,choice){
    const id=`${s.floor}:${s.x},${s.y}`,site=ECHO_SITES[id];
    if(!site||s.echoes.includes(id)){report(s,'Aquí no queda ningún eco sin resolver.',events,'warning');return;}
    s.echoes.push(id);s.echoChoices.push(`${id}:${choice}`);
    if(choice==='memory'){
      if(s.floor===1)s.lucidity=Math.min(10,s.lucidity+1);
      else if(s.floor===2)s.sanity=clampSanity(s.sanity+8);
      else if(s.floor===3)s.lucidity=Math.min(10,s.lucidity+1);
      else s.sanity=clampSanity(s.sanity+6);
      report(s,`${site.name}: conservas el recuerdo. La memoria permanecerá en la compañía.`,events,'lore');
    }else{
      if(!s.relics.includes(site.relic))s.relics.push(site.relic);
      report(s,`${site.name}: tomas ${site.choiceB}. ${RELICS[site.relic].use} El eco se apaga.`,events,'loot');
    }
  }
  function useRelic(s,events,id,rng){
    if(!s.relics.includes(id)){report(s,'La reliquia no está en el inventario.',events,'warning');return;}
    if(id==='lantern')s.sanity=clampSanity(s.sanity+15);
    else if(id==='mirror')s.ward=3;
    else if(id==='compass')s.lucidity=Math.min(10,s.lucidity+2);
    else if(id==='bell'){
      const targets=s.monsters.filter(m=>m.hp>0&&(m.floor||1)===s.floor&&distance(m,s)<=2&&inLineOfSight(s,m,2));
      if(!targets.length){report(s,'La campana no encuentra ninguna presencia a la que responder.',events,'warning');return;}
      for(const m of targets){m.telegraph=false;m.frozen=Math.max(m.frozen||0,1);}
    }else return;
    s.relics=s.relics.filter(v=>v!==id);
    report(s,`${RELICS[id].name}: ${RELICS[id].use} Reliquia consumida.`,events,id==='mirror'?'ward':id==='bell'?'frost':'lore');
    if(id==='mirror'||id==='bell')enemyTurn(s,events,rng);
  }
  const TRAPS = new Set(['3,7','9,11']);
  // Hidden masonry: discover it by facing a suspicious wall and interacting (E).
  // Every location has its own reward; caches can only be opened once per save.
  const SECRETS = Object.freeze({
    '1:0,1':{name:'Sepulcro de los Custodios',reward:'potion',amount:2,lore:'Tras el ladrillo falso hay vendas y sangre de draco.'},
    '1:6,1':{name:'Nicho del Testigo Ahogado',reward:'lucidity',amount:2,lore:'Una mano esquelética aún señala rutas olvidadas. En su palma, una certeza resiste al miedo.'},
    '2:0,1':{name:'Sepulcro de la Vigilia',reward:'ether',amount:2,lore:'Una lámpara agotada conserva dos esencias.'},
    '2:6,1':{name:'Altar de los Desposeídos',reward:'potion',amount:2,lore:'La inscripción promete amparo a quien descienda.'},
    '3:0,1':{name:'Osario de los Murmullos',reward:'ether',amount:3,lore:'Los cráneos siguen pronunciando nombres imposibles.'},
    '3:6,1':{name:'Archivo Oculto',reward:'ward',amount:1,lore:'Las paredes contienen mapas trazados sobre piel. Una ruta de tinta conduce a un sello protector.'},
    '4:0,1':{name:'Altar del Eco Inmóvil',reward:'potion',amount:3,lore:'En la piedra late una sangre que no es humana.'},
    '4:6,1':{name:'Capilla del Último Testigo',reward:'ether',amount:3,lore:'Queda una llama azul entre los huesos.'}
  });
  // Cosmic Descent v3.5: finite, deterministic discoveries; optional ritual never blocks legacy victory.
  const COSMIC_CLUES = Object.freeze({
    '5,1':Object.freeze({id:'custodians',title:'El juramento de los custodios',text:'La campana no convoca a los muertos: les recuerda que aún son soñados.',cost:7}),
    '7,5':Object.freeze({id:'drowned',title:'La carta del investigador sumergido',text:'Aguas negras bajo el archivo. Al mirar hacia arriba vi estrellas que no pertenecen a este cielo.',cost:9}),
    '3,11':Object.freeze({id:'seal',title:'El sello de las tres bocas',text:'El silencio se consigue nombrando aquello que tememos y negándonos a obedecerlo.',cost:5})
  });
  const clampSanity=n=>Math.max(0,Math.min(100,n));
  // v3.6: one-use forbidden books and a separate, bounded lucidity resource.
  const FORBIDDEN_TOMES = Object.freeze({
    '5,1':Object.freeze({id:'silenced',name:'Las páginas que no hacen ruido',sanityCost:12,lucidityGain:2,text:'Las letras parecen recordar una voz anterior a quien las escribió.'}),
    '7,5':Object.freeze({id:'abyssal',name:'El tratado de las estrellas hundidas',sanityCost:16,lucidityGain:3,text:'Descubres la forma del cielo que existía antes del firmamento.'})
  });
  function readTome(s,events){
    if(s.floor!==1){report(s,'No hay tomos de la primera expedición en esta profundidad.',events,'lore');return;}
    const [dx,dy]=DIRS[s.dir];
    const tome=FORBIDDEN_TOMES[at(s.x,s.y)]||FORBIDDEN_TOMES[at(s.x+dx,s.y+dy)];
    if(!tome){report(s,'No encuentras un tomo legible aquí.',events,'lore');return;}
    if(s.tomesRead.includes(tome.id)){report(s,`Ya has leído ${tome.name}. Sus páginas ahora están en blanco.`,events,'lore');return;}
    s.tomesRead.push(tome.id);
    s.sanity=clampSanity(s.sanity-tome.sanityCost);
    s.lucidity=Math.min(10,s.lucidity+tome.lucidityGain);
    report(s,`${tome.name}: ${tome.text} Cordura -${tome.sanityCost}; lucidez +${tome.lucidityGain}.`,events,'lore');
  }
  function focusMind(s,events){
    if(s.lucidity<2){report(s,'Necesitas al menos 2 puntos de lucidez para concentrarte.',events,'warning');return;}
    if(s.sanity>=100){report(s,'Tu mente está serena. No necesitas gastar lucidez.',events,'info');return;}
    s.lucidity-=2;s.sanity=clampSanity(s.sanity+12);
    report(s,'Reconstruyes un recuerdo verdadero. Cordura +12; lucidez -2.',events,'heal');
  }

  function witnessHorror(s,events){
    if(s.floor!==1)return;
    for(const m of s.monsters){
      if(m.floor!==1||m.hp<=0||distance(m,s)>2||s.witnessed.includes(m.kind))continue;
      s.witnessed.push(m.kind);
      const loss=m.kind==='warden'?13:m.kind==='crawler'?8:6;
      s.sanity=clampSanity(s.sanity-loss);
      report(s,`La visión de ${m.name} erosiona vuestra cordura (-${loss}).`,events,'warning');
    }
  }
  function investigate(s,events){
    if(s.floor!==1){report(s,'Aquí no quedan testimonios de la primera expedición.',events,'lore');return;}
    const [dx,dy]=DIRS[s.dir];
    const clue=COSMIC_CLUES[at(s.x,s.y)]||COSMIC_CLUES[at(s.x+dx,s.y+dy)];
    if(!clue){report(s,'Inspeccionas las piedras: no encuentras palabras descifrables.',events,'lore');return;}
    if(s.knowledge.includes(clue.id)){report(s,`Ya conoces este testimonio: ${clue.title}.`,events,'lore');return;}
    s.knowledge.push(clue.id);
    s.sanity=clampSanity(s.sanity-clue.cost);
    report(s,`${clue.title}: ${clue.text} (cordura -${clue.cost}; conocimiento +1).`,events,'lore');
  }
  function sealRitual(s,events){
    if(s.floor!==1||at(s.x,s.y)!=='3,11'){report(s,'El rito solo puede ejecutarse ante la lápida de las tres bocas (3,11).',events,'warning');return;}
    if(s.ritualSealed){report(s,'El sello permanece en silencio. Ya completaste el rito.',events,'lore');return;}
    if(!s.knowledge.includes('custodians')||!s.knowledge.includes('seal')){
      report(s,'Faltan dos testimonios: el juramento de los custodios y el sello de las tres bocas.',events,'warning');return;
    }
    s.ritualSealed=true;s.ether=Math.min(1000,s.ether+2);s.sanity=clampSanity(s.sanity+18);
    report(s,'El rito apaga las voces durante un instante. Cordura +18; esencias +2. El sello queda consumido.',events,'loot');
  }
  // v3.7: optional flooded-library subquest with irreversible, one-time choice.
  const DROWNED_TEXTS=Object.freeze({
    '5,1':Object.freeze({id:'tide',title:'Las mareas sin luna',text:'El agua negra obedece a las palabras olvidadas; no a la gravedad.',cost:4}),
    '7,5':Object.freeze({id:'bell',title:'El códice de la campana sumergida',text:'Dos testimonios deben pronunciarse ante la losa para responder al abismo.',cost:6})
  });
  function investigateDrowned(s,events){
    if(s.floor!==2){report(s,'Estos manuscritos pertenecen a la Biblioteca Sumergida (profundidad II).',events,'lore');return;}
    const [dx,dy]=DIRS[s.dir];
    const clue=DROWNED_TEXTS[at(s.x,s.y)]||DROWNED_TEXTS[at(s.x+dx,s.y+dy)];
    if(!clue){report(s,'No distingues manuscritos legibles en esta estancia.',events,'lore');return;}
    if(s.drownedClues.includes(clue.id)){report(s,`Ya has descifrado ${clue.title}.`,events,'lore');return;}
    s.drownedClues.push(clue.id);s.sanity=clampSanity(s.sanity-clue.cost);
    report(s,`${clue.title}: ${clue.text} Cordura -${clue.cost}.`,events,'lore');
  }
  function floodedRitual(s,events,choice){
    if(s.floor!==2||at(s.x,s.y)!=='3,11'){report(s,'El altar de marea se encuentra en (3,11) de la segunda profundidad.',events,'warning');return;}
    if(s.drownedRitual!=='none'){report(s,'El altar ya ha respondido. La decisión es irreversible.',events,'lore');return;}
    if(!s.drownedClues.includes('tide')||!s.drownedClues.includes('bell')){
      report(s,'El altar exige conocer ambos manuscritos de la Biblioteca Sumergida.',events,'warning');return;
    }
    if(choice==='seal'){
      s.drownedRitual='seal';s.sanity=clampSanity(s.sanity+15);s.potions=Math.min(1000,s.potions+1);
      report(s,'Sellas la marea: cordura +15 y una poción hallada bajo la losa. Las voces callan.',events,'loot');
    }else if(choice==='listen'){
      s.drownedRitual='listen';s.sanity=clampSanity(s.sanity-12);s.lucidity=Math.min(10,s.lucidity+3);
      report(s,'Escuchas la marea: cordura -12 y lucidez +3. Una voz pronuncia el nombre anterior al agua.',events,'lore');
    }
  }
  const PORTCULLIS = {x:8,y:13,floor:2};
  const LABYRINTH_GATE = {x:8,y:13,floor:3};
  const LABYRINTH_SWITCH = {x:3,y:11,floor:3};
  const PRESSURE_PLATE = {x:3,y:11,floor:2};
  const tile = (x,y,floor=1) => Number.isInteger(x) && Number.isInteger(y) ? ((floor===4?ABYSS:floor===3?LABYRINTH:floor===2?LOWER:LEVEL)[y]?.[x] || '#') : '#';
  const gateAt = (x,y,floor=1) => (floor===2 || floor===3) && x===PORTCULLIS.x && y===PORTCULLIS.y;
  const wallAt = (x,y,floor=1,state=null) => tile(x,y,floor) === '#' || tile(x,y,floor) === 'X' || (gateAt(x,y,floor) && state && !(floor===3?state.labyrinthGateOpen:state.gateOpen));
  const passable = (x,y,floor=1,state=null) => !wallAt(x,y,floor,state);
  const at = (x,y) => `${x},${y}`;
  const distance = (a,b) => Math.abs(a.x-b.x) + Math.abs(a.y-b.y);
  const rngInt = (rng, n) => Math.min(n-1, Math.max(0, Math.floor(rng()*n)));
  function createGame() {
    return {
      schema:VERSION, floor:1, x:1,y:1,dir:1,party:HEROES.map(h=>({...h})),selected:0,
      potions:3,ether:2,scrolls:1,key:false,sigil:false,voidHeart:false,finalRune:false,turn:0,won:false,ending:null,dead:false,guard:null,ward:0,
      sanity:100,lucidity:0,tomesRead:[],knowledge:[],witnessed:[],ritualSealed:false,drownedClues:[],drownedRitual:'none',secretsFound:[],gear:[],gearFound:[],gateOpen:false,labyrinthGateOpen:false,disarmedTraps:[],visitedByFloor:{1:['1,1'],2:[],3:[],4:[]},
      shrines:[],echoes:[],echoChoices:[],relics:[],
      visited:['1,1'],monsters:[...START_MONSTERS,...LOWER_MONSTERS,...LABYRINTH_MONSTERS,...ABYSS_MONSTERS,...COSMIC_ROAMERS].map(m=>({...m})),
      items:['3,11','4,13'],trapsTriggered:[],loreRead:[],
      messages:['Prólogo: la expedición ha desaparecido. Las campanas suenan bajo la tierra. Investiga las inscripciones (I).']
    };
  }
  // v4.0: stable, deterministic endings based on choices already made.
  // The ending is not recalculated once committed to a completed save.
  const ENDINGS = Object.freeze({
    silence:Object.freeze({title:'EL SILENCIO',text:'Las campanas cesan. Los nombres olvidados vuelven a la piedra, y la compañía abandona la cripta sin saber qué soñó bajo ella.'}),
    seal:Object.freeze({title:'EL PACTO DE LA MAREA',text:'Los sellos de la Cripta y la Biblioteca responden al último juramento. La marea se repliega. La compañía escapa, pero alguien deberá custodiar el santuario.'}),
    revelation:Object.freeze({title:'EL SUEÑO INVERTIDO',text:'Has escuchado la Marea y comprendido dos manuscritos. El Nombre Anterior reconoce su propio eco en la compañía: una puerta imposible se abre hacia un cielo que no debería existir.'})
    ,remembrance:Object.freeze({title:'LA CATEDRAL RECUERDA',text:'Habéis conservado los cuatro ecos sin venderlos por poder. Bajo el mar, la catedral pronuncia vuestros nombres verdaderos y abre una salida que no exige sacrificio: por primera vez, la Marea os deja marchar.'})
  });
  function resolveEnding(s){
    // The four preserved echoes are the campaign's hardest optional route and take priority when complete.
    if((s.echoChoices||[]).length===4&&(s.echoChoices||[]).every(v=>v.endsWith(':memory'))&&(s.lucidity||0)>=4)return 'remembrance';
    if(s.drownedRitual==='listen' && (s.drownedClues||[]).length===2 && (s.lucidity||0)>=4)return 'revelation';
    if(s.drownedRitual==='seal' && s.ritualSealed)return 'seal';
    return 'silence';
  }
  const monsterAt = (s,x,y) => s.monsters.find(m=>(m.floor||1)===s.floor && m.x===x && m.y===y && m.hp>0);
  function report(s, text, events, effect='info') {
    s.messages.unshift(text);
    s.messages.length = Math.min(s.messages.length, 24);
    events.push({text,effect});
  }
  const BESTIARY = Object.freeze({
    lurker:{title:'Penitente sin rostro',trait:'Persigue al grupo entre los sepulcros y responde al movimiento cercano.'},
    crawler:{title:'Carroñero óseo',trait:'Se impulsa dos casillas cada tercer turno si el camino está despejado.'},
    warden:{title:'Confesor desollado',trait:'Su armadura resiste 2 PV; en fase II se abre y anuncia golpes más fuertes.'},
    specter:{title:'Espectro hambriento',trait:'Puede alcanzar con su aliento frío desde dos casillas en línea recta.'},
    king:{title:'Rey sin Rostro',trait:'Drena 2 PM cada cuarto turno de ataque; en fase II drena 3 PM.'},
    archivist:{title:'Archivista Vacío',trait:'Drena maná; en fase II su pulso alcanza dos casillas en línea recta.'},
    firstname:{title:'El Primer Nombre',trait:'Resiste ataques físicos y roba el eco de la magia.'},
    starseer:{title:'El Astrónomo Ciego',trait:'Alinea las estrellas antes de lanzar un rayo por tres casillas despejadas; la visión hiere la cordura.'},
    chorus:{title:'La Madre de la Marea',trait:'Abre sus bocas antes de atacar; su canto puede drenar cordura y maná.'},
    cartographer:{title:'El Cartógrafo de la Herida',trait:'Traza una grieta luminosa antes de marcar a la compañía desde tres casillas.'},
    voidmoth:{title:'La Polilla del Último Cielo',trait:'Extiende sus alas antes de rasgar el velo y herir la memoria.'}
  });
  function inLineOfSight(s,m,maxDistance=2){
    if(m.x!==s.x && m.y!==s.y)return false;
    const d=distance(m,s);if(d<1||d>maxDistance)return false;
    const dx=Math.sign(s.x-m.x),dy=Math.sign(s.y-m.y);
    for(let t=1;t<d;t++)if(wallAt(m.x+dx*t,m.y+dy*t,s.floor,s))return false;
    return true;
  }
  const COSMIC_ENEMIES=Object.freeze({
    drowned:Object.freeze({name:'Ahogado del Umbral',trait:'Su canto salino erosiona la mente dos veces por encuentro.',loss:3}),
    tideborn:Object.freeze({name:'Larva de la Marea Negra',trait:'Su organismo aberrante transmite recuerdos ajenos.',loss:4}),
    librarian:Object.freeze({name:'El Bibliotecario de las Mil Lenguas',trait:'Su voz contiene miles de lenguas muertas.',loss:6})
  });
  function psychicAssault(s,m,events){
    const type=COSMIC_ENEMIES[m.cosmicType];
    if(s.floor!==2||!type||(m.mindStrikes||0)>=2||s.turn%3!==0)return;
    m.mindStrikes=(m.mindStrikes||0)+1;
    const reduction=s.drownedRitual==='seal'?Math.ceil(type.loss/2):0;
    const loss=type.loss-reduction;
    s.sanity=clampSanity(s.sanity-loss);
    if(s.drownedRitual==='listen')s.lucidity=Math.min(10,s.lucidity+1);
    const consequence=s.drownedRitual==='seal'?' El sello amortigua la visión.':s.drownedRitual==='listen'?' Comprendes un fragmento de la marea (+1 lucidez).':'';
    report(s,`${m.name} provoca una visión imposible: cordura -${loss}.${consequence}`,events,'warning');
  }
  const ROAMER_VISIONS=Object.freeze({
    starseer:Object.freeze({loss:4,text:'clava una constelación imposible en vuestra memoria'}),
    chorus:Object.freeze({loss:5,text:'canta vuestros nombres desde el fondo del agua'}),
    cartographer:Object.freeze({loss:5,text:'traza una salida sobre la piel de quien mira'}),
    voidmoth:Object.freeze({loss:6,text:'bate las alas y borra una estrella del recuerdo'})
  });
  function roamerAssault(s,m,events,d){
    const vision=ROAMER_VISIONS[m.kind];
    if(!vision||d>3||s.turn%4!==0||(m.mindStrikes||0)>=2||!inLineOfSight(s,m,3))return;
    m.mindStrikes=(m.mindStrikes||0)+1;
    s.sanity=clampSanity(s.sanity-vision.loss);
    let suffix='';
    if(m.kind==='chorus'||m.kind==='cartographer'){
      const caster=s.party.find(p=>p.hp>0&&p.mana>0);
      if(caster){caster.mana=Math.max(0,caster.mana-1);suffix=` ${caster.name} pierde 1 PM.`;}
    }
    report(s,`${m.name} ${vision.text}: cordura -${vision.loss}.${suffix}`,events,'warning');
  }
  const BOSS_KINDS=['warden','king','archivist','firstname'];
  const SPECIALTIES=Object.freeze({
    Guerrero:{name:'Juramento de hierro',detail:'Intercepta todos los golpes de esta fase y bloquea 6 PV de cada uno. Recuperación: 3 turnos.',cooldown:3},
    Pícara:{name:'Corte del silencio',detail:'Golpea al enemigo adyacente con daño reforzado e interrumpe su ataque durante una fase. Recuperación: 4 turnos.',cooldown:4},
    Maga:{name:'Escarcha del Olvido',detail:'7 PM. Alcanza dos casillas; hiere y congela durante dos fases. Recuperación: 3 turnos.',cooldown:3},
    Clérigo:{name:'Santuario de la marea',detail:'6 PM. Reduce en 3 PV cada golpe recibido por el grupo durante tres fases. Recuperación: 3 turnos.',cooldown:3}
  });
  const PATHS=Object.freeze({
    bulwark:'Bastión · +6 PV máximos y +1 defensa',
    edge:'Filo · +2 daño y especialidad más fuerte'
  });
  function choosePath(s,events,path){
    const p=s.party[s.selected];
    if(!p||p.hp<=0||p.level<2||p.path){report(s,'Esta elección requiere nivel 2 y solo se realiza una vez por aventurero.',events,'warning');return;}
    if(path==='bulwark'){p.max+=6;p.hp+=6;p.defense+=1;}
    else {p.damage+=2;}
    p.path=path;
    report(s,`${p.name} jura ${PATHS[path]}. La elección queda guardada.`,events,'level');
  }
  function shrine(s,events,choice){
    if(s.x!==1||s.y!==1||s.shrines.includes(s.floor)){report(s,'Este altar de entrada ya respondió o estás lejos de él.',events,'warning');return;}
    s.shrines.push(s.floor);
    if(choice==='mind'){s.sanity=clampSanity(s.sanity+12);report(s,'El altar ahogado conserva un nombre: cordura +12. Su luz se extingue.',events,'lore');}
    else {s.ether=Math.min(1000,s.ether+1);report(s,'Retiras una esencia del relicario del altar. Su luz se extingue.',events,'loot');}
  }
  function signature(s,events,rng){
    const p=s.party[s.selected],spec=SPECIALTIES[p?.role];
    if(!p||p.hp<=0||!spec){report(s,'Selecciona a un aventurero vivo.',events,'warning');return;}
    if((p.skillReadyAt||0)>s.turn){report(s,`La especialidad estará lista en ${p.skillReadyAt-s.turn} turnos.`,events,'warning');return;}
    const before=s.turn;
    if(p.role==='Guerrero'){
      s.intercept=s.selected;s.guard=s.selected;
      report(s,'Aldric se interpone: todos los ataques de esta fase recaen sobre su guardia.',events,'guard');
      enemyTurn(s,events,rng);
    }else if(p.role==='Pícara'){
      const [dx,dy]=DIRS[s.dir],m=monsterAt(s,s.x+dx,s.y+dy);
      if(!m){report(s,'Mara necesita un enemigo en la casilla de enfrente.',events,'warning');return;}
      const damage=Math.max(1,p.damage+(GEAR[p.equippedWeapon]?.bonus||0)+4+p.level+(p.path==='edge'?3:0));
      m.hp=Math.max(0,m.hp-damage);m.telegraph=false;m.staggered=m.hp?1:0;
      if(!m.hp)reward(s,m,events);
      report(s,`Mara corta el canto de ${m.name}: ${damage} de daño y una fase interrumpida.`,events,'attack');
      enemyTurn(s,events,rng);
    }else if(p.role==='Maga')frost(s,events,rng);
    else ward(s,events,rng);
    if(s.turn>before)p.skillReadyAt=s.turn+spec.cooldown;
  }
  // Readable forecast uses the same range and line-of-sight rules as enemyTurn.
  function threats(s){
    return s.monsters.filter(m=>m.hp>0&&(m.floor||1)===s.floor&&inLineOfSight(s,m,3)).map(m=>{
      const d=distance(m,s),ranged=((m.kind==='specter'||(m.kind==='archivist'&&m.phaseAwakened)||(m.kind==='firstname'&&m.phaseAwakened))&&d===2)||(m.kind==='starseer'&&d<=3)||(m.kind==='cartographer'&&d===3)||(m.kind==='voidmoth'&&d===2);
      return {name:m.name,hp:m.hp,max:m.max,phase:BOSS_KINDS.includes(m.kind)&&m.hp<=m.max/2?2:1,
        text:m.frozen||m.staggered?'INMOVILIZADO':m.telegraph&&(d===1||ranged)?'ATAQUE PREPARADO · defiende, interrumpe o rompe la línea de visión':d===1||ranged?'EN ALCANCE · puede atacar en tu próxima acción':'SE APROXIMA',
        danger:!m.frozen&&!m.staggered&&!!m.telegraph&&(d===1||ranged)};
    });
  }
  // Contextual hints use the same positions and completion flags as the actions.
  // They reveal opportunities within reach, without exposing the unexplored map.
  function opportunities(s){
    if(s.dead||s.won)return [];
    const [dx,dy]=DIRS[s.dir],here=at(s.x,s.y),ahead=at(s.x+dx,s.y+dy),out=[];
    if(s.x===1&&s.y===1&&!s.shrines.includes(s.floor))out.push({page:'quest',label:'Altar de entrada',detail:'Elige cordura o esencia en Juramento.'});
    const echo=echoAt(s);
    if(echo&&!s.echoes.includes(`${s.floor}:${here}`))out.push({page:'quest',label:echo.name,detail:'Recuerdo o reliquia: decide en Juramento.'});
    if(s.floor===1){
      const clue=COSMIC_CLUES[here]||COSMIC_CLUES[ahead],tome=FORBIDDEN_TOMES[here]||FORBIDDEN_TOMES[ahead];
      if(clue&&!s.knowledge.includes(clue.id))out.push({action:'investigate',label:'Leer inscripción',detail:`${clue.title} · cordura −${clue.cost}.`});
      if(tome&&!s.tomesRead.includes(tome.id))out.push({action:'readTome',label:'Abrir tomo',detail:`Cordura −${tome.sanityCost}; lucidez +${tome.lucidityGain}.`});
      if(here==='3,11'&&!s.ritualSealed)out.push({action:'ritual',label:'Rito del silencio',detail:'Requiere los testimonios de los custodios y del sello. Recupera 18 de cordura y 2 esencias.'});
    }
    if(s.floor===2){
      const manuscript=DROWNED_TEXTS[here]||DROWNED_TEXTS[ahead];
      if(manuscript&&!s.drownedClues.includes(manuscript.id))out.push({action:'investigateDrowned',label:'Descifrar manuscrito',detail:`${manuscript.title} · cordura −${manuscript.cost}.`});
      if(here==='3,11'&&s.drownedRitual==='none')out.push({page:'lore',label:'Responder a la Marea',detail:'Sellar o escuchar: consulta las consecuencias en Códice.'});
    }
    const secretId=`${s.floor}:${ahead}`;
    if(SECRETS[secretId]&&!s.secretsFound.includes(secretId))out.push({action:'search',label:'Examinar mampostería',detail:'Una juntura interrumpe el relieve de la pared.'});
    if(tile(s.x+dx,s.y+dy,s.floor)==='X')out.push({action:'interact',label:s.floor===4?'Abrir último umbral':'Descender',detail:'Necesitas la reliquia de la zona y derrotar a su custodio.'});
    return out;
  }
  function enemyTurn(s, events, rng) {
    if(s.won||s.dead) return;
    s.turn++;
    const wardActive=s.ward>0;
    if(wardActive)s.ward--;
    for(const m of s.monsters){
      if(m.hp<=0 || (m.floor||1)!==s.floor) continue;
      if(m.staggered>0){m.staggered--;report(s,`${m.name} recompone su postura tras el corte de Mara.`,events,'guard');continue;}
      if(m.frozen>0){m.frozen--;report(s,`${m.name} permanece inmóvil bajo el hielo.`,events,'frost');continue;}
      const d=distance(m,s);
      const boss=BOSS_KINDS.includes(m.kind);
      if(boss&&m.hp<=m.max/2&&!m.phaseAwakened){
        m.phaseAwakened=true;
        report(s,`${m.name} rompe su sello: FASE II. ${m.kind==='warden'?'Su armadura se abre, pero el golpe anunciado será más fuerte.':m.kind==='king'?'Su drenaje aumenta a 3 PM; el golpe anunciado será más fuerte.':m.kind==='archivist'?'Su pulso alcanza dos casillas; el golpe anunciado será más fuerte.':'El golpe anunciado rasgará el velo con más fuerza.'}`,events,'warning');
      }
      const ranged=((m.kind==='specter'||(m.kind==='archivist'&&m.phaseAwakened)||(m.kind==='firstname'&&m.phaseAwakened))&&d===2&&inLineOfSight(s,m))||
        (m.kind==='starseer'&&d<=3&&inLineOfSight(s,m,3))||
        (m.kind==='cartographer'&&d===3&&inLineOfSight(s,m,3))||
        (m.kind==='voidmoth'&&d===2&&inLineOfSight(s,m));
      roamerAssault(s,m,events,d);
      if(d===1||ranged){
        const cosmicRoamer=Object.hasOwn(ROAMER_VISIONS,m.kind);
        if((cosmicRoamer||(boss&&(s.turn%3===0||m.hp<=m.max/2)))&&!m.telegraph){
          m.telegraph=true;
          const warning={
            starseer:'El Astrónomo inclina el rostro vacío; las estrellas se alinean sobre la compañía.',
            chorus:'La Madre abre sus tres bocas. El agua de las paredes empieza a cantar.',
            cartographer:'El Cartógrafo traza una herida luminosa en el aire. Algo va a cruzarla.',
            voidmoth:'La Polilla extiende sus alas y cubre la luz. Un polvo negro cae sobre vosotros.',
            warden:m.phaseAwakened?'El Confesor golpea el suelo: la onda alcanza a quien permanezca a su alcance.':'El Confesor alza el hierro ritual. Interrúmpelo o prepara la guardia.',
            king:m.phaseAwakened?'El Rey pronuncia un nombre. El siguiente impacto robará fuerza y maná.':'El Rey traza una runa en el aire. El golpe está por llegar.',
            archivist:m.phaseAwakened?'El Archivista abre el libro: su pulso alcanza dos casillas despejadas.':'Las páginas del Archivista se vuelven solas. Algo se prepara.',
            firstname:m.phaseAwakened?'El Primer Nombre rasga el velo: el impacto cubrirá dos casillas despejadas.':'El Primer Nombre contiene el aliento de la cripta.'
          }[m.kind]||`${m.name} eleva su arma ritual. El próximo golpe será devastador: defiende o interrumpe.`;
          report(s,warning,events,'warning');
          continue;
        }
        const living=s.party.filter(p=>p.hp>0);
        if(!living.length) break;
        const protector=s.party[s.intercept];
        const target=Number.isInteger(s.intercept)&&protector?.hp>0?protector:living[(s.turn+m.x)%living.length];
        let amount=Math.max(1,m.damage-target.defense-(GEAR[target.equippedArmor]?.bonus||0)+rngInt(rng,3)-1);
        if((cosmicRoamer||boss)&&m.telegraph){amount=Math.ceil(amount*(boss&&m.hp<=m.max/2?1.65:1.35));m.telegraph=false;}
        if(wardActive)amount=Math.max(0,amount-(s.party.some(p=>p.hp>0&&p.role==='Clérigo'&&p.path==='edge')?4:3));
        if(ranged)amount=Math.max(1,amount-2);
        if(s.guard===s.party.indexOf(target)){
          amount=Math.max(0,amount-(target.role==='Guerrero'&&target.path==='edge'?8:6));
          report(s,`${target.name} bloquea parte del ataque.`,events,'guard');
        }
        target.hp=Math.max(0,target.hp-amount);
        const rangedVerb=m.kind==='starseer'?'fulmina':m.kind==='cartographer'?'marca':m.kind==='voidmoth'?'rasga el velo y hiere':'congela';
        report(s,`${m.name} ${ranged?rangedVerb:'hiere'} a ${target.name} (${amount} PV).`,events,'hurt');
        psychicAssault(s,m,events);
        if((m.kind==='king'||m.kind==='archivist'||m.kind==='firstname') && s.turn%4===0){
          const caster=living.find(p=>p.mana>0);
          if(caster){const drain=m.kind==='king'&&m.phaseAwakened?3:2;caster.mana=Math.max(0,caster.mana-drain);report(s,`${m.name} absorbe ${drain} PM de la compañía.`,events,'spell');}
        }
      } else if(d<=4 && s.turn%2===0){
        const tryMove=()=>{
          const opts=DIRS.map(([dx,dy])=>({x:m.x+dx,y:m.y+dy}))
            .filter(p=>passable(p.x,p.y,s.floor,s) && !monsterAt(s,p.x,p.y) && (p.x!==s.x || p.y!==s.y));
          opts.sort((a,b)=>distance(a,s)-distance(b,s));
          if(opts.length && distance(opts[0],s)<distance(m,s)){m.x=opts[0].x;m.y=opts[0].y;return true;}
          return false;
        };
        const advanced=tryMove();
        if(advanced && m.kind==='crawler' && s.turn%6===0 && distance(m,s)>1)tryMove();
      }
    }
    s.guard=null;delete s.intercept;
    if(s.party.every(p=>p.hp===0)){
      s.dead=true;
      report(s,'La compañía ha caído. Carga una partida o comienza de nuevo.',events,'defeat');
    }
  }
  function reward(s,m,events){
    for(const p of s.party){
      if(p.hp<=0)continue;
      p.xp+=m.max;
      while(p.xp>=p.level*35){
        p.xp-=p.level*35;
        p.level++;
        p.max+=5;
        p.hp=Math.min(p.max,p.hp+5);
        p.damage+=2;
        if(p.maxMana){p.maxMana+=3;p.mana=p.maxMana;}
        report(s,`${p.name} asciende al nivel ${p.level}.`,events,'level');
      }
    }
  }
  function move(s,dx,dy,events,rng){
    const x=s.x+dx,y=s.y+dy;
    const m=monsterAt(s,x,y);
    if(m){report(s,`${m.name} te bloquea. ¡Combate!`,events,'warning');return;}
    if(!passable(x,y,s.floor,s)){
      if(SECRETS[`${s.floor}:${x},${y}`]){search(s,events);return;}
    if(gateAt(x,y,s.floor) && !(s.floor===3?s.labyrinthGateOpen:s.gateOpen))report(s,'Una reja de hierro bloquea el pasillo. Busca una losa de presión.',events,'warning');
      else if(tile(x,y,s.floor)==='X')interact(s,events);
      else report(s,'La piedra maciza corta el paso.',events,'warning');
      return;
    }
    s.x=x;s.y=y;
    const pos=at(x,y);
    if(!s.visited.includes(pos))s.visited.push(pos);
    s.visitedByFloor[s.floor]=s.visited;
    if(s.floor===3 && x===LABYRINTH_SWITCH.x && y===LABYRINTH_SWITCH.y && !s.labyrinthGateOpen){
      s.labyrinthGateOpen=true; report(s,'Un gong sin sonido vibra. Se abre la puerta del Archivo Negro.',events,'loot');
    }
    if(s.floor===2 && x===PRESSURE_PLATE.x && y===PRESSURE_PLATE.y && !s.gateOpen){
      s.gateOpen=true; report(s,'¡CLAC! La losa hundida libera la reja del corredor del Rey.',events,'loot');
    }
    if(s.floor===3 && !s.gearFound.includes('3:'+pos) && (pos==='7,5'||pos==='3,11')){
      const gear=pos==='7,5'?GEAR.staff:GEAR.amulet;
      s.gear.push(gear.id);s.gearFound.push('3:'+pos);
      report(s,`Encuentras ${gear.label}. Puedes equiparlo en los pertrechos.`,events,'loot');
    } else if(s.floor===4 && !s.gearFound.includes('4:'+pos) && (pos==='1,5'||pos==='9,7')){
      const item=pos==='1,5'?GEAR.daggers:GEAR.bulwark;
      s.gear.push(item.id);s.gearFound.push('4:'+pos);
      report(s,`Descubres ${item.label}: un equipo reservado para ${item.role}.`,events,'loot');
    } else if(s.floor===1 && s.items.includes(pos)){
      s.items=s.items.filter(i=>i!==pos);
      s.potions++;
      report(s,'Hallaste un vial de sangre de draco: +1 poción.',events,'loot');
    } else if(s.floor===4 && tile(x,y,4)==='R' && !s.finalRune){
      s.finalRune=true;report(s,'Recoges la Runa del Último Nombre. Algo despierta al fondo del osario.',events,'loot');
    } else if(s.floor===3 && tile(x,y,3)==='A' && !s.voidHeart){
      s.voidHeart=true;report(s,'Recoges el Corazón del Vacío. El Archivo parece despertarse.',events,'loot');
    } else if(s.floor===2 && tile(x,y,2)==='R' && !s.sigil){
      s.sigil=true;report(s,'¡Has recuperado el Sello de los Nombres!',events,'loot');
    } else if(s.floor===2 && !s.gearFound.includes(pos) && (pos==='3,11'||pos==='7,5')){
      const gear=pos==='3,11'?GEAR.sword:GEAR.mail;
      s.gear.push(gear.id);s.gearFound.push(pos);
      report(s,`Encuentras ${gear.label}. Equípalo desde los pertrechos.`,events,'loot');
    } else if(tile(x,y,s.floor)==='K'&&!s.key){
      s.key=true;report(s,'¡Has encontrado la llave de obsidiana!',events,'loot');
    } else if(loreAt(s,pos)&&!s.loreRead.includes(s.floor===1?pos:`${s.floor}:${pos}`)){
      s.loreRead.push(s.floor===1?pos:`${s.floor}:${pos}`);report(s,loreAt(s,pos),events,'lore');
    } else report(s,'Avanzas entre ecos y humedad.',events,'move');
    const beat=DESCENT_BEATS[s.floor]?.[pos],beatId=`beat:${s.floor}:${pos}`;
    if(beat&&!s.loreRead.includes(beatId)){
      s.loreRead.push(beatId);
      report(s,beat,events,'warning');
      const reward=BEAT_REWARDS[`${s.floor}:${pos}`];
      if(reward)report(s,reward.run(s),events,'lore');
    }
    const trapId=`${s.floor}:${pos}`;
    if(TRAPS.has(pos)&&!s.trapsTriggered.includes(trapId)&&!s.disarmedTraps.includes(trapId)){
      s.trapsTriggered.push(trapId);
      const living=s.party.filter(p=>p.hp>0);
      if(living.length){
        const p=living[rngInt(rng,living.length)];
        const damage=Math.max(1,5-p.defense);
        p.hp=Math.max(0,p.hp-damage);
        report(s,`¡Trampa de espinas! ${p.name} pierde ${damage} PV.`,events,'hurt');
        if(s.party.every(h=>h.hp===0)){s.dead=true;report(s,'La compañía ha caído.',events,'defeat');}
      }
    }
    enemyTurn(s,events,rng);
    witnessHorror(s,events);
  }
  function search(s,events){
    const [dx,dy]=DIRS[s.dir],x=s.x+dx,y=s.y+dy;
    const id=`${s.floor}:${x},${y}`;
    if(s.secretsFound.includes(id)){
      report(s,'El escondrijo ya está vacío.',events,'lore');return;
    }
    const cache=SECRETS[id];
    if(!cache){report(s,'No descubres ningún mecanismo oculto frente a ti.',events,'lore');return;}
    s.secretsFound.push(id);
    let gain='';
    if(cache.reward==='potion'){s.potions+=cache.amount;gain=`+${cache.amount} pociones`;}
    else if(cache.reward==='ether'){s.ether+=cache.amount;gain=`+${cache.amount} esencias`;}
    else if(cache.reward==='scroll'){s.scrolls+=cache.amount;gain=`+${cache.amount} pergaminos`;}
    else if(cache.reward==='lucidity'){const old=s.lucidity;s.lucidity=Math.min(10,s.lucidity+cache.amount);gain=`+${s.lucidity-old} lucidez`;}
    else if(cache.reward==='ward'){s.ward=Math.min(3,s.ward+cache.amount);gain='el sello os protege durante el próximo encuentro';}
    report(s,`¡RELIQUIA OCULTA! ${cache.name}. ${cache.lore} ${gain}.`,events,'loot');
  }
  function interact(s,events){
    const [dx,dy]=DIRS[s.dir],x=s.x+dx,y=s.y+dy;
    if(SECRETS[`${s.floor}:${x},${y}`]){search(s,events);return;}
    if(gateAt(x,y,s.floor) && !(s.floor===3?s.labyrinthGateOpen:s.gateOpen)){report(s,'La reja solo cederá cuando se active la losa de presión.',events,'warning');return;}
    if(tile(x,y,s.floor)==='X'){
      if(s.floor===1){
        const guardian=s.monsters.some(m=>m.kind==='warden'&&m.hp>0);
        if(!s.key)report(s,'El Umbral exige la llave de obsidiana.',events,'warning');
        else if(guardian)report(s,'El sello persiste mientras viva el Guardián.',events,'warning');
        else {
          s.visitedByFloor[1]=s.visited;
          s.floor=2;s.x=1;s.y=1;s.dir=1;
          s.visited=s.visitedByFloor[2].length?s.visitedByFloor[2]:['1,1'];
          s.visitedByFloor[2]=s.visited;
          report(s,'DESCENSO II: La Biblioteca Sumergida. Algo conoce vuestros nombres.',events,'victory');
        }
      }else if(s.floor===2){
        const king=s.monsters.some(m=>m.kind==='king'&&m.hp>0);
        if(!s.sigil)report(s,'La salida exige el Sello de los Nombres.',events,'warning');
        else if(king)report(s,'El Rey sin Rostro mantiene la salida sellada.',events,'warning');
        else {
          s.visitedByFloor[2]=s.visited;s.floor=3;s.x=1;s.y=1;s.dir=1;
          s.visited=s.visitedByFloor[3].length?s.visitedByFloor[3]:['1,1'];s.visitedByFloor[3]=s.visited;
          report(s,'DESCENSO III: El Laberinto Olvidado. El Archivo Negro os espera.',events,'victory');
        }
      }else if(s.floor===3){
        const archivist=s.monsters.some(m=>m.kind==='archivist'&&m.hp>0);
        if(!s.voidHeart)report(s,'El último Umbral exige el Corazón del Vacío.',events,'warning');
        else if(!s.labyrinthGateOpen)report(s,'El Archivo permanece sellado. Busca el sigilo de apertura.',events,'warning');
        else if(archivist)report(s,'El Archivista Vacío aún protege el Umbral.',events,'warning');
        else {
          s.visitedByFloor[3]=s.visited;s.floor=4;s.x=1;s.y=1;s.dir=1;
          s.visited=s.visitedByFloor[4].length?s.visitedByFloor[4]:['1,1'];s.visitedByFloor[4]=s.visited;
          report(s,'DESCENSO IV: El Osario del Primer Nombre. La última verdad permanece enterrada.',events,'victory');
        }
      }else{
        const boss=s.monsters.some(m=>m.kind==='firstname'&&m.hp>0);
        if(!s.finalRune)report(s,'El último portón exige la Runa del Último Nombre.',events,'warning');
        else if(boss)report(s,'El Primer Nombre mantiene cerrado el umbral.',events,'warning');
        else {s.won=true;s.ending=resolveEnding(s);report(s,'¡VICTORIA! '+ENDINGS[s.ending].title+' — '+ENDINGS[s.ending].text,events,'victory');}
      }
    } else if(tile(x,y,s.floor)==='K'&&!s.key){
      s.key=true;report(s,'Recoges la llave de obsidiana.',events,'loot');
    } else if(loreAt(s,at(x,y))){
      report(s,loreAt(s,at(x,y)),events,'lore');
    } else report(s,'No hay nada con lo que interactuar.',events);
  }
  function disarm(s,events,rng){
    const hero=s.party[s.selected];
    if(!hero||hero.hp<=0||hero.role!=='Pícara'){report(s,'Selecciona a Mara, la pícara, para desactivar trampas.',events,'warning');return;}
    const [dx,dy]=DIRS[s.dir],x=s.x+dx,y=s.y+dy,pos=at(x,y),trapId=`${s.floor}:${pos}`;
    if(!TRAPS.has(pos)||s.disarmedTraps.includes(trapId)||s.trapsTriggered.includes(trapId)){report(s,'No hay ninguna trampa activa frente a ti.',events,'warning');return;}
    s.disarmedTraps.push(trapId);
    report(s,`Mara desmonta el mecanismo de espinas de ${pos}.`,events,'loot');
    enemyTurn(s,events,rng);
  }
  function guard(s,events,rng){
    const p=s.party[s.selected];
    if(!p||p.hp<=0){report(s,'Selecciona un aventurero vivo para defender.',events,'warning');return;}
    s.guard=s.selected;
    report(s,`${p.name} alza la guardia: hasta 6 puntos menos del próximo ataque de este turno.`,events,'guard');
    enemyTurn(s,events,rng);
  }
  function attack(s,events,rng){
    const p=s.party[s.selected];
    if(!p||p.hp<=0){report(s,'Elige a un aventurero vivo.',events,'warning');return;}
    const [dx,dy]=DIRS[s.dir],m=monsterAt(s,s.x+dx,s.y+dy);
    if(!m){report(s,'El acero silba en el vacío.',events);enemyTurn(s,events,rng);return;}
    const armor=m.kind==='warden'?(m.phaseAwakened?0:2):m.kind==='firstname'?3:0;
    const damage=Math.max(1,p.damage-armor+(GEAR[p.equippedWeapon]?.bonus||0)+rngInt(rng,5)-2);
    m.hp=Math.max(0,m.hp-damage);
    if(m.hp===0)reward(s,m,events);
    report(s,`${p.name} causa ${damage} de daño a ${m.name}.${m.hp?'':' ¡Cae derrotado!'}`,events,'attack');
    enemyTurn(s,events,rng);
  }
  function spell(s,events,rng){
    const p=s.party[s.selected];
    if(!p||p.hp<=0){report(s,'Elige a un aventurero vivo.',events,'warning');return;}
    if(p.role==='Maga'){
      if(p.mana<5){report(s,'Ilyra necesita 5 PM.',events,'warning');return;}
      const [dx,dy]=DIRS[s.dir],m=monsterAt(s,s.x+dx,s.y+dy);
      if(!m){report(s,'No hay objetivo frente a la maga.',events,'warning');return;}
      p.mana-=5;
      const damage=13+p.level*3+(p.equippedWeapon==='staff'?GEAR.staff.bonus:0);
      m.hp=Math.max(0,m.hp-damage);
      if(m.hp===0)reward(s,m,events);
      report(s,`Ilyra descarga el relámpago umbrío: ${damage} de daño.`,events,'spell');
      enemyTurn(s,events,rng);
    }else if(p.role==='Clérigo'){
      if(p.mana<4){report(s,'Borin necesita 4 PM.',events,'warning');return;}
      const hurt=s.party.filter(h=>h.hp>0&&h.hp<h.max).sort((a,b)=>a.hp/a.max-b.hp/b.max);
      if(!hurt.length){report(s,'No hay heridos a los que sanar.',events);return;}
      p.mana-=4;
      const target=hurt[0],amount=12+p.level*2;
      target.hp=Math.min(target.max,target.hp+amount);
      report(s,`Borin invoca la luz: ${target.name} recupera salud.`,events,'heal');
      enemyTurn(s,events,rng);
    }else report(s,'Solo la maga y el clérigo pueden conjurar.',events,'warning');
  }
  function ward(s,events,rng){
    const p=s.party[s.selected];
    if(!p||p.hp<=0||p.role!=='Clérigo'){
      report(s,'Selecciona a Borin, el clérigo, para invocar el Santuario.',events,'warning');return;
    }
    if(p.mana<6){report(s,'Borin necesita 6 PM para el Santuario.',events,'warning');return;}
    p.mana-=6;
    // Three enemy phases including this one: a party-wide magical barrier.
    s.ward=3;
    report(s,'Borin invoca el Santuario: el grupo resiste 3 puntos de daño durante tres turnos.',events,'ward');
    enemyTurn(s,events,rng);
  }
  function frost(s,events,rng){
    const p=s.party[s.selected];
    if(!p||p.hp<=0||p.role!=='Maga'){report(s,'Selecciona a Ilyra para lanzar Escarcha del Olvido.',events,'warning');return;}
    if(p.mana<7){report(s,'Ilyra necesita 7 PM para invocar la escarcha.',events,'warning');return;}
    const [dx,dy]=DIRS[s.dir];
    let target=null;
    for(let i=1;i<=2;i++){
      const x=s.x+dx*i,y=s.y+dy*i;
      if(wallAt(x,y,s.floor,s))break;
      target=monsterAt(s,x,y);if(target)break;
    }
    if(!target){report(s,'La escarcha requiere un objetivo en línea recta hasta dos casillas.',events,'warning');return;}
    p.mana-=7;
    const damage=7+p.level*2+(p.equippedWeapon==='staff'?GEAR.staff.bonus:0)+(p.path==='edge'?3:0);
    target.hp=Math.max(0,target.hp-damage);
    target.frozen=target.hp>0?2:0;target.telegraph=false;
    if(target.hp===0)reward(s,target,events);
    report(s,`Ilyra congela a ${target.name}: ${damage} de daño y hasta dos turnos inmóvil.`,events,'frost');
    enemyTurn(s,events,rng);
  }
  function pulse(s,events,rng){
    const p=s.party[s.selected];
    if(!p||p.hp<=0||p.role!=='Maga'){report(s,'Solo Ilyra puede canalizar Pulso del Vacío.',events,'warning');return;}
    if(p.mana<9){report(s,'Ilyra necesita 9 PM para el Pulso del Vacío.',events,'warning');return;}
    // A cone of up to two cells in front; solid geometry stops the spell.
    const [dx,dy]=DIRS[s.dir],targets=[];
    for(let step=1;step<=2;step++){
      const xx=s.x+dx*step,yy=s.y+dy*step;
      if(wallAt(xx,yy,s.floor,s))break;
      const m=monsterAt(s,xx,yy);
      if(m)targets.push(m);
    }
    if(!targets.length){report(s,'No hay enemigos alcanzables por el pulso.',events,'warning');return;}
    p.mana-=9;
    for(const m of targets){
      const damage=8+p.level*2+(p.equippedWeapon==='staff'?GEAR.staff.bonus:0);
      m.hp=Math.max(0,m.hp-damage);
      if(!m.hp)reward(s,m,events);
      report(s,`Pulso del Vacío golpea a ${m.name}: ${damage} de daño.`,events,'spell');
    }
    enemyTurn(s,events,rng);
  }
  function potion(s,events,rng){
    const p=s.party[s.selected];
    if(s.potions<1||!p||p.hp<=0||p.hp===p.max){report(s,'No puedes usar una poción ahora.',events,'warning');return;}
    s.potions--;
    p.hp=Math.min(p.max,p.hp+18);
    report(s,`${p.name} bebe una poción y restaura su salud.`,events,'heal');
    enemyTurn(s,events,rng);
  }
  function ether(s,events,rng){
    const p=s.party[s.selected];
    if(s.ether<1||!p||p.hp<=0||!p.maxMana||p.mana===p.maxMana){
      report(s,'No puedes utilizar una esencia con este personaje.',events,'warning');return;
    }
    s.ether--;
    p.mana=Math.min(p.maxMana,p.mana+12);
    report(s,`${p.name} absorbe esencia etérea.`,events,'heal');
    enemyTurn(s,events,rng);
  }
  function rest(s,events,rng){
    if(s.monsters.some(m=>m.hp>0&&(m.floor||1)===s.floor&&distance(m,s)<=3)){
      report(s,'Hay monstruos demasiado cerca para descansar.',events,'warning');return;
    }
    for(const p of s.party)if(p.hp>0){p.hp=Math.min(p.max,p.hp+8);p.mana=Math.min(p.maxMana,p.mana+8);}
    if(s.floor===1)s.sanity=clampSanity(s.sanity+4);
    report(s,'La compañía descansa junto a las piedras heladas.',events,'heal');
    for(let t=0;t<3;t++)enemyTurn(s,events,rng);
  }
  function scroll(s,events,rng){
    if(s.scrolls<1){report(s,'No quedan pergaminos cartográficos.',events,'warning');return;}
    s.scrolls--;
    for(let y=s.y-3;y<=s.y+3;y++)for(let x=s.x-3;x<=s.x+3;x++){
      if(passable(x,y,s.floor,s)&&!s.visited.includes(at(x,y)))s.visited.push(at(x,y));
    }
    s.visitedByFloor[s.floor]=s.visited;
    report(s,'Las runas revelan caminos próximos en el automapa.',events,'lore');
    enemyTurn(s,events,rng);
  }
  function equip(s,events,id){
    if(!s.gear.includes(id)){report(s,'No posees ese equipo.',events,'warning');return;}
    const hero=s.party[s.selected];if(!hero||hero.hp<=0)return;
    const item=GEAR[id];if(!item)return;
    if(item.role && hero.role!==item.role){report(s,`${item.label} solo puede equiparlo un personaje de clase ${item.role}.`,events,'warning');return;}
    const key=item.slot==='weapon'?'equippedWeapon':'equippedArmor';
    const previous=s.party.find(p=>p[key]===id);
    if(previous)delete previous[key];
    hero[key]=id;
    report(s,`${hero.name} equipa ${item.label} (+${item.bonus} ${item.slot==='weapon'?'ataque':'defensa'}).`,events,'loot');
  }
  function unequip(s,events,slot){
    const hero=s.party[s.selected];
    if(!hero||hero.hp<=0)return;
    const key=slot==='weapon'?'equippedWeapon':'equippedArmor';
    if(!hero[key]){report(s,`${hero.name} ya utiliza su equipo básico en esa ranura.`,events,'info');return;}
    const item=GEAR[hero[key]];
    delete hero[key];
    report(s,`${hero.name} guarda ${item.label} y recupera su equipo básico.`,events,'loot');
  }
  function dispatch(s,action,rng=Math.random){
    const events=[];
    if(s.won||s.dead){return events;}
    if(action==='left')s.dir=(s.dir+3)%4;
    else if(action==='right')s.dir=(s.dir+1)%4;
    else if(action==='forward')move(s,...DIRS[s.dir],events,rng);
    else if(action==='back')move(s,...DIRS[(s.dir+2)%4],events,rng);
    else if(action==='strafeLeft')move(s,...DIRS[(s.dir+3)%4],events,rng);
    else if(action==='strafeRight')move(s,...DIRS[(s.dir+1)%4],events,rng);
    else if(action==='signature')signature(s,events,rng);
    else if(action==='path:bulwark'||action==='path:edge')choosePath(s,events,action.slice(5));
    else if(action==='shrine:mind'||action==='shrine:ether')shrine(s,events,action.slice(7));
    else if(action==='echo:memory'||action==='echo:material')resolveEcho(s,events,action.slice(5));
    else if(typeof action==='string'&&action.startsWith('relic:'))useRelic(s,events,action.slice(6),rng);
    else if(action==='attack')attack(s,events,rng);
    else if(action==='guard')guard(s,events,rng);
    else if(action==='interact')interact(s,events);
    else if(action==='search')search(s,events);
    else if(action==='investigate')investigate(s,events);
    else if(action==='ritual')sealRitual(s,events);
    else if(action==='readTome')readTome(s,events);
    else if(action==='focusMind')focusMind(s,events);
    else if(action==='investigateDrowned')investigateDrowned(s,events);
    else if(action==='drownedSeal')floodedRitual(s,events,'seal');
    else if(action==='drownedListen')floodedRitual(s,events,'listen');
    else if(action==='potion')potion(s,events,rng);
    else if(action==='ether')ether(s,events,rng);
    else if(action==='spell')spell(s,events,rng);
    else if(action==='frost')frost(s,events,rng);
    else if(action==='ward')ward(s,events,rng);
    else if(action==='rest')rest(s,events,rng);
    else if(action==='disarm')disarm(s,events,rng);
    else if(action==='scroll')scroll(s,events,rng);
    else if(action==='unequipWeapon')unequip(s,events,'weapon');
    else if(action==='unequipArmor')unequip(s,events,'armor');
    else if(typeof action==='string' && action.startsWith('equip:') && Object.hasOwn(GEAR,action.slice(6)))equip(s,events,action.slice(6));
    else if(action==='equipDaggers')equip(s,events,'daggers');
    else if(action==='equipBulwark')equip(s,events,'bulwark');
    else if(action==='equipSword')equip(s,events,'sword');
    else if(action==='equipMail')equip(s,events,'mail');
    else if(action==='equipStaff')equip(s,events,'staff');
    else if(action==='equipAmulet')equip(s,events,'amulet');
    else if(action==='pulse')pulse(s,events,rng);
    return events;
  }
  function validGame(s){
    // Imported JSON is untrusted. Check containers before reading nested fields.
    if(!s||typeof s!=='object'||Array.isArray(s))return false;
    if(!Array.isArray(s.party)||s.party.length!==4||s.party.some(p=>!p||typeof p!=='object'||!Object.hasOwn(SPECIALTIES,p.role)))return false;
    if(!Array.isArray(s.monsters)||s.monsters.some(m=>!m||typeof m!=='object'))return false;
    if(!Array.isArray(s.loreRead)||s.loreRead.length>100||s.loreRead.some(v=>typeof v!=='string'||v.length>100))return false;
    if(!Array.isArray(s.trapsTriggered)||s.trapsTriggered.length>12||s.trapsTriggered.some(v=>typeof v!=='string'||!/^([1-4]):\d+,\d+$/.test(v)))return false;
    if(s.ending!==undefined && s.ending!==null && (!Object.hasOwn(ENDINGS,s.ending)||!s.won))return false;
    if(s.drownedRitual!==undefined&&!['none','seal','listen'].includes(s.drownedRitual))return false;
    if(s.drownedClues!==undefined&&(!Array.isArray(s.drownedClues)||s.drownedClues.length>2||new Set(s.drownedClues).size!==s.drownedClues.length||s.drownedClues.some(id=>!['tide','bell'].includes(id))))return false;
    if(s.lucidity!==undefined && (!Number.isInteger(s.lucidity)||s.lucidity<0||s.lucidity>10))return false;
    if(s.tomesRead!==undefined && (!Array.isArray(s.tomesRead)||s.tomesRead.length>2||new Set(s.tomesRead).size!==s.tomesRead.length||s.tomesRead.some(t=>!['silenced','abyssal'].includes(t))))return false;
    if(s.sanity!==undefined && (!Number.isInteger(s.sanity)||s.sanity<0||s.sanity>100))return false;
    if(s.knowledge!==undefined && (!Array.isArray(s.knowledge)||s.knowledge.length>3||new Set(s.knowledge).size!==s.knowledge.length||s.knowledge.some(k=>!['custodians','drowned','seal'].includes(k))))return false;
    if(s.witnessed!==undefined && (!Array.isArray(s.witnessed)||s.witnessed.length>3||new Set(s.witnessed).size!==s.witnessed.length||s.witnessed.some(k=>!['lurker','crawler','warden'].includes(k))))return false;
    if(s.ritualSealed!==undefined && typeof s.ritualSealed!=='boolean')return false;
    if(s.shrines!==undefined&&(!Array.isArray(s.shrines)||s.shrines.length>4||new Set(s.shrines).size!==s.shrines.length||s.shrines.some(v=>![1,2,3,4].includes(v))))return false;
    if(s.echoes!==undefined&&(!Array.isArray(s.echoes)||s.echoes.length>4||new Set(s.echoes).size!==s.echoes.length||s.echoes.some(v=>!Object.hasOwn(ECHO_SITES,v))))return false;
    if(s.echoChoices!==undefined&&(!Array.isArray(s.echoChoices)||s.echoChoices.length>4||new Set(s.echoChoices).size!==s.echoChoices.length||s.echoChoices.some(v=>!Object.keys(ECHO_SITES).some(id=>v===id+':memory'||v===id+':material'))||new Set(s.echoChoices.map(v=>v.slice(0,v.lastIndexOf(':')))).size!==s.echoChoices.length||s.echoChoices.some(v=>!s.echoes?.includes(v.slice(0,v.lastIndexOf(':'))))))return false;
    if(s.relics!==undefined&&(!Array.isArray(s.relics)||s.relics.length>4||new Set(s.relics).size!==s.relics.length||s.relics.some(v=>!Object.hasOwn(RELICS,v)||!s.echoChoices?.includes(Object.keys(ECHO_SITES).find(id=>ECHO_SITES[id].relic===v)+':material'))))return false;
    const coord=(p,floor)=>Number.isInteger(p.x)&&Number.isInteger(p.y)&&passable(p.x,p.y,floor||1);
    const natural=(v,max=100000)=>Number.isInteger(v)&&v>=0&&v<=max;
    return !!s&&typeof s==='object'&&coord(s,s.floor)&&natural(s.dir,3)&&natural(s.selected,3)&&
      natural(s.turn)&&natural(s.potions,1000)&&natural(s.ether,1000)&&natural(s.scrolls,1000)&&
      typeof s.key==='boolean'&&typeof s.sigil==='boolean'&&[1,2,3,4].includes(s.floor)&&
      Array.isArray(s.secretsFound)&&s.secretsFound.length<=8&&s.secretsFound.every(k=>Object.hasOwn(SECRETS,k))&&new Set(s.secretsFound).size===s.secretsFound.length&&
      Array.isArray(s.gear)&&s.gear.length<=6&&s.gear.every(k=>Object.hasOwn(GEAR,k))&&
      new Set(s.gear).size===s.gear.length&&
      s.party.every(h=>['equippedWeapon','equippedArmor'].every(k=>h[k]===undefined||(Object.hasOwn(GEAR,h[k])&&s.gear.includes(h[k])&&GEAR[h[k]].slot===(k==='equippedWeapon'?'weapon':'armor')&&(!GEAR[h[k]].role||GEAR[h[k]].role===h.role))))&&
      ['equippedWeapon','equippedArmor'].every(k=>{const equipped=s.party.map(h=>h[k]).filter(Boolean);return new Set(equipped).size===equipped.length;})&&
      Array.isArray(s.gearFound)&&s.gearFound.length<=6&&
      typeof s.gateOpen==='boolean'&&typeof s.labyrinthGateOpen==='boolean'&&typeof s.voidHeart==='boolean'&&typeof s.finalRune==='boolean'&&Array.isArray(s.disarmedTraps)&&s.disarmedTraps.length<=12&&
      s.disarmedTraps.every(k=>typeof k==='string'&&/^[1-4]:\d+,\d+$/.test(k))&&
      !!s.visitedByFloor&&[1,2,3,4].every(k=>Array.isArray(s.visitedByFloor[k])&&s.visitedByFloor[k].length<=WIDTH*HEIGHT&&s.visitedByFloor[k].every(v=>typeof v==='string'&&/^\d+,\d+$/.test(v)))&&
      typeof s.won==='boolean'&&typeof s.dead==='boolean'&&natural(s.ward,3)&&(s.guard===null||natural(s.guard,3))&&
      Array.isArray(s.party)&&s.party.length===4&&s.party.every(p=>p&&typeof p.name==='string'&&p.name.length<50&&
        typeof p.role==='string'&&typeof p.weapon==='string'&&typeof p.armor==='string'&&
        Number.isFinite(p.hp)&&Number.isFinite(p.max)&&p.max>0&&p.max<10000&&p.hp>=0&&p.hp<=p.max&&
        (p.skillReadyAt===undefined||natural(p.skillReadyAt,100000))&&(p.path===undefined||(['bulwark','edge'].includes(p.path)&&p.level>=2))&&natural(p.level,1000)&&p.level>=1&&natural(p.xp)&&natural(p.mana)&&natural(p.maxMana,10000)&&p.mana<=p.maxMana&&
        Number.isFinite(p.damage)&&Number.isFinite(p.defense))&&
      Array.isArray(s.monsters)&&s.monsters.length<=28&&s.monsters.every(m=>m&&coord(m,m.floor)&&
        (m.telegraph===undefined||typeof m.telegraph==='boolean')&&(m.phaseAwakened===undefined||typeof m.phaseAwakened==='boolean')&&
        (m.cosmicType===undefined||((m.floor||1)===2&&Object.hasOwn(COSMIC_ENEMIES,m.cosmicType)))&&
        (m.mindStrikes===undefined||natural(m.mindStrikes,2))&&
        typeof m.name==='string'&&m.name.length<100&&Number.isFinite(m.hp)&&m.hp>=0&&m.hp<=m.max&&
        (m.staggered===undefined||natural(m.staggered,1))&&(m.frozen===undefined||natural(m.frozen,2))&&Number.isFinite(m.max)&&m.max>0&&m.max<10000&&Number.isFinite(m.damage))&&
      Array.isArray(s.visited)&&s.visited.length<=WIDTH*HEIGHT&&s.visited.every(k=>typeof k==='string'&&/^\d+,\d+$/.test(k))&&
      Array.isArray(s.items)&&s.items.length<=30&&s.items.every(k=>typeof k==='string'&&/^\d+,\d+$/.test(k))&&
      Array.isArray(s.messages)&&s.messages.length<=50&&s.messages.every(t=>typeof t==='string'&&t.length<500);
  }
  function importSave(raw){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
    if(raw.schema!==undefined&&(!Number.isInteger(raw.schema)||raw.schema<3||raw.schema>VERSION))return null;
    if(!Array.isArray(raw.monsters)||raw.monsters.some(m=>!m||typeof m!=='object'||typeof m.name!=='string'))return null;
    if(!Array.isArray(raw.party)||raw.party.length!==4||raw.party.some(p=>!p||typeof p!=='object'))return null;
    if(!Array.isArray(raw.visited))return null;
    const previous=raw.schema||3;
    const s={...raw,schema:VERSION,shrines:raw.shrines===undefined?[]:raw.shrines,echoes:raw.echoes===undefined?[]:raw.echoes,echoChoices:raw.echoChoices===undefined?[]:raw.echoChoices,relics:raw.relics===undefined?[]:raw.relics,
      ending:raw.ending===undefined?(raw.won?'silence':null):raw.ending,
      sanity:raw.sanity===undefined?100:raw.sanity,
      lucidity:raw.lucidity===undefined?0:raw.lucidity,
      tomesRead:raw.tomesRead===undefined?[]:raw.tomesRead,
      drownedClues:raw.drownedClues===undefined?[]:raw.drownedClues,
      drownedRitual:raw.drownedRitual===undefined?'none':raw.drownedRitual,
      knowledge:raw.knowledge===undefined?[]:raw.knowledge,
      witnessed:raw.witnessed===undefined?[]:raw.witnessed,
      ritualSealed:raw.ritualSealed===undefined?false:raw.ritualSealed,
      floor:previous<5?1:raw.floor,
      guard:previous<7?null:raw.guard,
      secretsFound:previous<14?[]:raw.secretsFound,
      finalRune:previous<15?false:raw.finalRune,
      ward:previous<11?0:raw.ward,
      voidHeart:previous<8?false:raw.voidHeart,
      labyrinthGateOpen:previous<8?false:raw.labyrinthGateOpen,
      sigil:previous<5?false:raw.sigil,
      gear:previous<5?[]:raw.gear,
      gateOpen:previous<6?false:raw.gateOpen,
      disarmedTraps:previous<6?[]:raw.disarmedTraps,
      gearFound:previous<5?[]:raw.gearFound,
      visitedByFloor:previous<5?{1:raw.visited,2:[],3:[],4:[]}:
        previous<8?{...raw.visitedByFloor,3:[],4:[]}:
        previous<15?{...raw.visitedByFloor,4:[]}:raw.visitedByFloor,
      trapsTriggered: Array.isArray(raw.trapsTriggered)?raw.trapsTriggered.map(k=>previous<5&&!String(k).includes(':')?'1:'+k:k):[],
      loreRead: Array.isArray(raw.loreRead)?raw.loreRead:[],
      monsters:Array.isArray(raw.monsters)?raw.monsters.map(m=>({
        ...m,floor:m.floor||1,kind:m.kind||((m.floor||1)===1&&m.x===10&&m.y===13?'warden':(m.name||'').includes('Guardián')?'warden':'lurker'),
        ...(m.floor===2 && !m.cosmicType ? {
          cosmicType:m.kind==='king'?'librarian':m.kind==='specter'?'drowned':m.kind==='crawler'?'tideborn':undefined,
          mindStrikes:0
        } : {})
      })).concat(previous<5?LOWER_MONSTERS.map(m=>({...m})):[]).concat(previous<8?LABYRINTH_MONSTERS.map(m=>({...m})):[]).concat(previous<15?ABYSS_MONSTERS.map(m=>({...m})):[])
        .concat(COSMIC_ROAMERS.filter(m=>!raw.monsters.some(saved=>saved.id===m.id||
          (saved.floor===m.floor&&saved.x===m.x&&saved.y===m.y))).map(m=>({...m}))):[]};
    // A completed v0.3/v0.4 run represents clearing the first depth,
    // not completing the newly added two-floor campaign.
    if(previous<5 && raw.won===true){
      s.won=false;s.floor=2;s.x=1;s.y=1;s.dir=1;
      s.visited=['1,1'];s.visitedByFloor[2]=s.visited;
      s.key=true;
    }
    // Floor-two veterans may be past the new reja; opening it prevents trapping a legacy party.
    if(previous<6 && s.floor===2 && (s.x>=8 || s.visited.includes('8,13') || s.visited.includes('3,11')))s.gateOpen=true;
    // A v0.7 completed adventure becomes the entrance to the new third act.
    if(previous<8 && raw.won===true && previous>=5){
      s.won=false;s.floor=3;s.x=1;s.y=1;s.dir=1;s.visited=['1,1'];s.visitedByFloor[3]=s.visited;
    }
    if(previous<15 && previous>=8 && raw.won===true){
      s.won=false;s.floor=4;s.x=1;s.y=1;s.dir=1;s.visited=['1,1'];s.visitedByFloor[4]=s.visited;
    }
    if(previous<9 && s.floor===3 && !passable(s.x,s.y,3,s)){s.x=1;s.y=1;s.dir=1;s.visited=['1,1'];s.visitedByFloor[3]=s.visited;}
    if(!s.won)s.ending=null;
    if(!validGame(s))return null;
    if(previous < 4){
      // v0.3 mistakenly placed a potion on the key tile. Never let it shadow the key.
      s.items=s.items.map(pos=>pos==='4,11'?'3,11':pos);
      s.items=[...new Set(s.items)];
      if(s.x===4&&s.y===11)s.key=true;
    }
    s.messages=s.messages.slice(0,24);
    return s;
  }
  return {VERSION,SAVE_KEY,V15_SAVE_KEY,V14_SAVE_KEY,V13_SAVE_KEY,SECRETS,V12_SAVE_KEY,V11_SAVE_KEY,V10_SAVE_KEY,V9_SAVE_KEY,V8_SAVE_KEY,V7_SAVE_KEY,PREVIOUS_SAVE_KEY,V5_SAVE_KEY,LEGACY_SAVE_KEY,V4_SAVE_KEY,LEVEL,LOWER,LABYRINTH,ABYSS,COSMIC_CLUES,FORBIDDEN_TOMES,DROWNED_TEXTS,COSMIC_ENEMIES,ENDINGS,resolveEnding,WIDTH,HEIGHT,DIRS,LORES,TRAPS,GEAR,BESTIARY,PORTCULLIS,PRESSURE_PLATE,gateAt,
    SPECIALTIES,PATHS,ECHO_SITES,RELICS,echoAt,threats,opportunities,tile,wallAt,passable,createGame,monsterAt,dispatch,validGame,importSave};
});
