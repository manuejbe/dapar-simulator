const VERBAL_QUESTIONS = [
// ─── ANALOGÍAS ─────────────────────────────────────────────
{t:'analogy',q:'ÁRBOL : BOSQUE :: ?',o:['pez : acuario','soldado : ejército','libro : biblioteca','flor : jardín'],a:1,e:'Un árbol es parte de un bosque, así como un soldado es parte de un ejército (unidad colectiva).'},
{t:'analogy',q:'CUCHILLO : CORTAR :: MARTILLO : ?',o:['pegar','construir','golpear','romper'],a:2,e:'El cuchillo sirve para cortar; el martillo sirve para golpear.'},
{t:'analogy',q:'MÉDICO : HOSPITAL :: MAESTRO : ?',o:['escuela','biblioteca','estudiante','clase'],a:0,e:'El médico trabaja en un hospital, el maestro trabaja en una escuela.'},
{t:'analogy',q:'OSCURO : CLARO :: FRÍO : ?',o:['hielo','templado','caliente','verano'],a:2,e:'Oscuro y claro son opuestos; frío y caliente son opuestos.'},
{t:'analogy',q:'VACA : LECHE :: GALLINA : ?',o:['plumas','huevo','pollito','nido'],a:1,e:'La vaca produce leche; la gallina produce huevos.'},
{t:'analogy',q:'LIBRO : CAPÍTULO :: AÑO : ?',o:['calendario','mes','semana','día'],a:1,e:'Un libro está dividido en capítulos; un año está dividido en meses.'},
{t:'analogy',q:'POETA : POEMA :: ESCULTOR : ?',o:['piedra','pintura','escultura','museo'],a:2,e:'El poeta crea poemas; el escultor crea esculturas.'},
{t:'analogy',q:'OJO : VER :: OÍDO : ?',o:['escuchar','sentir','hablar','oler'],a:0,e:'El ojo sirve para ver; el oído sirve para escuchar.'},
{t:'analogy',q:'MADRID : ESPAÑA :: PARIS : ?',o:['Italia','Bélgica','Francia','Europa'],a:2,e:'Madrid es la capital de España; París es la capital de Francia.'},
{t:'analogy',q:'HAMBRE : COMER :: SED : ?',o:['dormir','beber','cansancio','agua'],a:1,e:'El hambre lleva a comer; la sed lleva a beber.'},
{t:'analogy',q:'LUNA : NOCHE :: SOL : ?',o:['calor','día','luz','verano'],a:1,e:'La luna aparece de noche; el sol aparece de día.'},
{t:'analogy',q:'PAPEL : ESCRITURA :: LIENZO : ?',o:['marco','pintura','tela','arte'],a:1,e:'El papel es el soporte de la escritura; el lienzo es el soporte de la pintura.'},
{t:'analogy',q:'PILOTO : AVIÓN :: CAPITÁN : ?',o:['marinero','mar','barco','puerto'],a:2,e:'El piloto conduce un avión; el capitán conduce un barco.'},
{t:'analogy',q:'RÁPIDO : VELOZ :: INTELIGENTE : ?',o:['sabio','listo','astuto','brillante'],a:1,e:'Rápido y veloz son sinónimos; inteligente y listo son sinónimos.'},
{t:'analogy',q:'AGUA : PECES :: AIRE : ?',o:['viento','pájaros','nubes','cielo'],a:1,e:'Los peces viven en el agua; los pájaros viven en el aire.'},
{t:'analogy',q:'LLAVE : CERRADURA :: CONTRASEÑA : ?',o:['seguridad','sistema','acceso','usuario'],a:2,e:'La llave abre una cerradura; la contraseña da acceso a un sistema.'},
{t:'analogy',q:'INVIERNO : FRÍO :: VERANO : ?',o:['sol','calor','playa','vacaciones'],a:1,e:'El invierno se caracteriza por el frío; el verano se caracteriza por el calor.'},
{t:'analogy',q:'DEDO : MANO :: PÉTALO : ?',o:['jardín','planta','flor','tallo'],a:2,e:'El dedo es parte de la mano; el pétalo es parte de la flor.'},
{t:'analogy',q:'RELOJ : TIEMPO :: TERMÓMETRO : ?',o:['fiebre','temperatura','calor','médico'],a:1,e:'El reloj mide el tiempo; el termómetro mide la temperatura.'},
{t:'analogy',q:'NERVIOSO : TRANQUILO :: VALIENTE : ?',o:['temerario','cobarde','audaz','héroe'],a:1,e:'Nervioso y tranquilo son antónimos; valiente y cobarde son antónimos.'},
{t:'analogy',q:'ARQUITECTO : EDIFICIO :: COMPOSITOR : ?',o:['orquesta','música','sinfonía','instrumento'],a:2,e:'El arquitecto diseña edificios; el compositor crea sinfonías.'},
{t:'analogy',q:'HORMIGA : COLONIA :: ABEJA : ?',o:['colmena','enjambre','panal','flor'],a:1,e:'Las hormigas viven en colonias; las abejas viven en enjambres.'},
{t:'analogy',q:'CALOR : EVAPORACIÓN :: FRÍO : ?',o:['lluvia','hielo','congelación','nieve'],a:2,e:'El calor produce evaporación; el frío produce congelación.'},
{t:'analogy',q:'DETECTIVE : CRIMEN :: ARQUEÓLOGO : ?',o:['pasado','fósil','historia','antigüedad'],a:0,e:'El detective investiga crímenes; el arqueólogo investiga el pasado.'},
{t:'analogy',q:'BOCA : HABLAR :: MANO : ?',o:['agarrar','dedos','escribir','señalar'],a:2,e:'La boca es el órgano principal del habla; la mano es el órgano principal de la escritura.'},
{t:'analogy',q:'OSCURIDAD : MIEDO :: IGNORANCIA : ?',o:['tristeza','enojo','error','confusión'],a:3,e:'La oscuridad genera miedo; la ignorancia genera confusión.'},
{t:'analogy',q:'TENIS : RAQUETA :: BÉISBOL : ?',o:['guante','bate','pelota','estadio'],a:1,e:'En tenis se usa raqueta; en béisbol se usa bate.'},
{t:'analogy',q:'NUBE : LLUVIA :: VOLCÁN : ?',o:['fuego','lava','erupción','montaña'],a:1,e:'La nube produce lluvia; el volcán produce lava.'},
{t:'analogy',q:'EMBRIÓN : BEBÉ :: SEMILLA : ?',o:['árbol','fruto','planta','raíz'],a:2,e:'El embrión se desarrolla en bebé; la semilla se desarrolla en planta.'},
// ─── ANTÓNIMOS ─────────────────────────────────────────────
{t:'antonym',q:'¿Cuál es el antónimo de GENEROSO?',o:['altruista','avaro','bondadoso','dadivoso'],a:1,e:'Generoso significa que da con facilidad; su opuesto es avaro, que retiene o acumula.'},
{t:'antonym',q:'¿Cuál es el antónimo de VALIENTE?',o:['audaz','osado','cobarde','temerario'],a:2,e:'Valiente implica coraje; cobarde implica miedo excesivo.'},
{t:'antonym',q:'¿Cuál es el antónimo de ABUNDANTE?',o:['suficiente','escaso','poco','raro'],a:1,e:'Abundante significa en gran cantidad; escaso significa en poca cantidad.'},
{t:'antonym',q:'¿Cuál es el antónimo de TRANSPARENTE?',o:['cristalino','opaco','claro','diáfano'],a:1,e:'Transparente deja pasar la luz; opaco no la deja pasar.'},
{t:'antonym',q:'¿Cuál es el antónimo de ANTIGUO?',o:['viejo','moderno','clásico','histórico'],a:1,e:'Antiguo se refiere a lo de hace mucho tiempo; moderno se refiere a lo actual o reciente.'},
{t:'antonym',q:'¿Cuál es el antónimo de RÍGIDO?',o:['duro','inflexible','flexible','resistente'],a:2,e:'Rígido no se dobla ni cede; flexible sí lo hace.'},
{t:'antonym',q:'¿Cuál es el antónimo de DIURNO?',o:['solar','matutino','nocturno','vespertino'],a:2,e:'Diurno corresponde al día; nocturno corresponde a la noche.'},
{t:'antonym',q:'¿Cuál es el antónimo de SUPERFICIAL?',o:['somero','leve','profundo','trivial'],a:2,e:'Superficial se queda en la superficie; profundo va al fondo.'},
{t:'antonym',q:'¿Cuál es el antónimo de EFÍMERO?',o:['transitorio','pasajero','eterno','fugaz'],a:2,e:'Efímero dura muy poco; eterno dura para siempre.'},
{t:'antonym',q:'¿Cuál es el antónimo de CAÓTICO?',o:['desordenado','confuso','ordenado','turbulento'],a:2,e:'Caótico implica desorden; ordenado implica organización.'},
{t:'antonym',q:'¿Cuál es el antónimo de AGRESIVO?',o:['violento','hostil','pacífico','tosco'],a:2,e:'Agresivo ataca o intimida; pacífico busca la paz.'},
{t:'antonym',q:'¿Cuál es el antónimo de PEREZA?',o:['holgazanería','indolencia','laboriosidad','flojera'],a:2,e:'Pereza es la falta de ganas de trabajar; laboriosidad es la dedicación al trabajo.'},
{t:'antonym',q:'¿Cuál es el antónimo de FICTICIO?',o:['irreal','imaginario','real','inventado'],a:2,e:'Ficticio es inventado; real existe de verdad.'},
{t:'antonym',q:'¿Cuál es el antónimo de ALTIVO?',o:['soberbio','arrogante','humilde','engreído'],a:2,e:'Altivo/arrogante se siente superior; humilde reconoce sus limitaciones.'},
{t:'antonym',q:'¿Cuál es el antónimo de COMPLEJO?',o:['complicado','intrincado','simple','sofisticado'],a:2,e:'Complejo tiene muchas partes difíciles; simple es fácil de entender.'},
{t:'antonym',q:'¿Cuál es el antónimo de FORTALECER?',o:['reforzar','vigorizar','debilitar','consolidar'],a:2,e:'Fortalecer hace más fuerte; debilitar hace más débil.'},
{t:'antonym',q:'¿Cuál es el antónimo de SILENCIOSO?',o:['callado','quieto','ruidoso','apacible'],a:2,e:'Silencioso no hace ruido; ruidoso produce mucho ruido.'},
{t:'antonym',q:'¿Cuál es el antónimo de SINCERO?',o:['honesto','franco','falso','directo'],a:2,e:'Sincero dice la verdad; falso engaña o miente.'},
{t:'antonym',q:'¿Cuál es el antónimo de ABUNDAR?',o:['sobrar','proliferar','escasear','multiplicar'],a:2,e:'Abundar es tener en exceso; escasear es tener muy poco.'},
// ─── INTRUSOS ──────────────────────────────────────────────
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nManzana · Naranja · Zanahoria · Pera',o:['Manzana','Naranja','Zanahoria','Pera'],a:2,e:'Manzana, naranja y pera son frutas. La zanahoria es una verdura.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nPerro · Gato · Serpiente · Conejo',o:['Perro','Gato','Serpiente','Conejo'],a:2,e:'Perro, gato y conejo son mamíferos domésticos. La serpiente es un reptil.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nRosa · Tulipán · Girasol · Pino',o:['Rosa','Tulipán','Girasol','Pino'],a:3,e:'Rosa, tulipán y girasol son flores. El pino es un árbol.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nMesa · Silla · Sofá · Lavadora',o:['Mesa','Silla','Sofá','Lavadora'],a:3,e:'Mesa, silla y sofá son muebles. La lavadora es un electrodoméstico.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nPiano · Guitarra · Trompeta · Pincel',o:['Piano','Guitarra','Trompeta','Pincel'],a:3,e:'Piano, guitarra y trompeta son instrumentos musicales. El pincel es una herramienta de pintura.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nNeptuno · Saturno · Luna · Júpiter',o:['Neptuno','Saturno','Luna','Júpiter'],a:2,e:'Neptuno, Saturno y Júpiter son planetas. La Luna es un satélite natural.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nFútbol · Baloncesto · Ajedrez · Tenis',o:['Fútbol','Baloncesto','Ajedrez','Tenis'],a:2,e:'Fútbol, baloncesto y tenis son deportes físicos. El ajedrez es un juego de mesa.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nLeón · Tigre · Lobo · Delfín',o:['León','Tigre','Lobo','Delfín'],a:3,e:'León, tigre y lobo son mamíferos terrestres depredadores. El delfín es un mamífero acuático.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nHierro · Cobre · Madera · Aluminio',o:['Hierro','Cobre','Madera','Aluminio'],a:2,e:'Hierro, cobre y aluminio son metales. La madera es un material orgánico.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nFlauta · Oboe · Clarinete · Violín',o:['Flauta','Oboe','Clarinete','Violín'],a:3,e:'Flauta, oboe y clarinete son instrumentos de viento. El violín es de cuerda.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nCorrer · Nadar · Saltar · Pensar',o:['Correr','Nadar','Saltar','Pensar'],a:3,e:'Correr, nadar y saltar son actividades físicas. Pensar es una actividad mental.'},
{t:'intruder',q:'¿Cuál NO pertenece al grupo?\nPerú · Chile · Bolivia · Portugal',o:['Perú','Chile','Bolivia','Portugal'],a:3,e:'Perú, Chile y Bolivia son países sudamericanos. Portugal es un país europeo.'},
// ─── DIFÍCIL: LÓGICA FORMAL Y RAZONAMIENTO RELACIONAL ──────
// HARD
{t:'logic',q:'Todos los oficiales son disciplinados. Algunos soldados son disciplinados. ¿Qué conclusión se puede extraer con certeza?',o:['Todos los soldados son oficiales','Algunos soldados pueden ser oficiales','Ningún soldado es oficial','Todos los oficiales son soldados'],a:1,e:'De las premisas solo se puede concluir que los soldados disciplinados podrían ser oficiales, pero no es necesario. La única conclusión válida es que "algunos soldados pueden ser oficiales".'},
// HARD
{t:'logic',q:'Ningún líder temerario es prudente. Algunos generales son temerarios. ¿Qué se puede concluir?',o:['Ningún general es prudente','Algunos generales no son prudentes','Todos los generales son imprudentes','Ningún general es temerario'],a:1,e:'Solo los generales que son temerarios no son prudentes. Por tanto, algunos generales (los temerarios) no son prudentes.'},
// HARD
{t:'logic',q:'"Tener pasaporte es condición ___ para obtener una visa, pero no ___ ya que también se requiere historial crediticio."',o:['suficiente / necesaria','necesaria / suficiente','necesaria / necesaria','suficiente / suficiente'],a:1,e:'Tener pasaporte es necesario (sin él no hay visa) pero no suficiente (se necesita más). Condición necesaria pero no suficiente.'},
// HARD
{t:'logic',q:'Si "Todo A implica B" y "Ningún B implica C", entonces:',o:['Todo A implica C','Ningún A implica C','Algunos A implican C','Todo C implica A'],a:1,e:'Si A⊂B y B∩C=∅, entonces A∩C=∅. Por lo tanto, ningún A implica C.'},
// HARD
{t:'analogy',q:'DILUCIDACIÓN : CONFUSIÓN :: CATARSIS : ?',o:['Acumulación emocional','Purificación','Drama griego','Tensión dramática'],a:0,e:'Dilucidación (aclarar) es el opuesto de confusión; catarsis (liberación emocional) es el opuesto de acumulación emocional. Relación de antonimia funcional.'},
// HARD
{t:'analogy',q:'PALIMPSESTO : ESCRITURA :: PENTIMENTO : ?',o:['Música','Escultura','Pintura','Arquitectura'],a:2,e:'Un palimpsesto es un manuscrito donde la escritura anterior se borró y se escribió encima. Un pentimento es la huella de una capa pictórica anterior visible bajo la pintura actual.'},
// HARD
{t:'analogy',q:'NEOLOGISMO : LÉXICO :: MUTACIÓN : ?',o:['Genética','Genoma','Evolución','ADN'],a:1,e:'Un neologismo es una palabra nueva incorporada al léxico; una mutación es un cambio nuevo incorporado al genoma de una especie.'},
// HARD
{t:'analogy',q:'EUFEMISMO : CRUDEZA :: PERÍFRASIS : ?',o:['Ambigüedad','Concisión','Metáfora','Redundancia'],a:1,e:'El eufemismo suaviza la crudeza del lenguaje; la perífrasis (rodeo de palabras para no decir algo directamente) se opone a la concisión.'},
// HARD
{t:'antonym',q:'¿Cuál es el antónimo más preciso de MAGNÁNIMO?',o:['Mezquino','Generoso','Benévolo','Indulgente'],a:0,e:'Magnánimo significa noble, generoso y comprensivo. Su antónimo preciso es mezquino: ruin, que actúa con estrechez de miras e interés propio.'},
// HARD
{t:'antonym',q:'¿Cuál es el antónimo más preciso de UBÍCUO?',o:['Omnipresente','Ausente','Puntual','Localizado'],a:3,e:'Ubícuo significa que está presente en todas partes simultáneamente. Su antónimo es localizado: restringido a un único lugar específico.'},
// HARD
{t:'antonym',q:'¿Cuál es el antónimo de ESCRUTINIO?',o:['Examen','Negligencia','Análisis','Indiferencia'],a:1,e:'Escrutinio es un examen minucioso y riguroso. Su antónimo es negligencia: descuido, falta de atención y examen.'},
// HARD
{t:'antonym',q:'¿Cuál es el antónimo de PROLIJIDAD?',o:['Esmero','Brevedad','Lentitud','Concisión'],a:3,e:'Prolijidad significa exceso de palabras o detalles innecesarios. Su antónimo es concisión: expresar mucho con pocas palabras.'},
// HARD
{t:'analogy',q:'AXIOMA : REFUTACIÓN :: DOGMA : ?',o:['Fe','Cuestionamiento','Verdad','Doctrina'],a:1,e:'Un axioma es una verdad que por definición no puede refutarse; un dogma es una creencia que no puede cuestionarse. Ambos resisten su opuesto: la refutación y el cuestionamiento respectivamente.'},
// HARD
{t:'analogy',q:'EMÉRITO : ACADÉMICO :: LAUREADO : ?',o:['Artista','Premio','Poeta','Científico'],a:2,e:'Emérito designa a un académico que ha alcanzado el máximo reconocimiento honorífico; laureado designa a un poeta o artista coronado con laurel por excelencia excepcional. La relación es: título honorífico máximo : campo de distinción.'},
// HARD
{t:'logic',q:'Ana miente los martes y jueves, y dice la verdad el resto de los días. Un día dice: "Ayer mentí". ¿Qué día es hoy?',o:['Lunes','Miércoles','Jueves','Viernes'],a:2,e:'Si hoy fuera miércoles (verdad), ayer fue martes (mentira) → "ayer mentí" sería verdad ✓. Si hoy fuera jueves (mentira), "ayer mentí" sería falso, lo que significa que ayer dijo verdad, y miércoles sí dice verdad ✓. Pero al mentir hoy, la afirmación debe ser falsa. Revisando: jueves miente → "ayer mentí" es mentira → el miércoles no mintió → correcto. Hoy es jueves.'},
// HARD
{t:'analogy',q:'IDIOSINCRASIA : INDIVIDUO :: ZEITGEIST : ?',o:['Época','Filósofo','Cultura','Nación'],a:0,e:'La idiosincrasia es el conjunto de rasgos que definen a un individuo; el Zeitgeist (espíritu del tiempo) es el conjunto de ideas y valores que definen a una época histórica.'},
// HARD
{t:'intruder',q:'¿Cuál NO pertenece al grupo conceptual?\nHipérbole · Metonimia · Sinécdoque · Epíteto · Paradoja',o:['Hipérbole','Metonimia','Sinécdoque','Epíteto'],a:3,e:'Hipérbole, metonimia, sinécdoque y paradoja son tropos (figuras que alteran el significado). El epíteto es una figura de adorno que añade un adjetivo explicativo sin cambiar el significado sustancial.'},
// HARD
{t:'logic',q:'Todos los que aprueban el DAPAR sirven en combate. Ronit no sirve en combate. ¿Qué se puede concluir?',o:['Ronit no aprobó el DAPAR','Ronit aprobó el DAPAR','Ronit es incapaz','No se puede concluir nada'],a:0,e:'Por contrapositivo: si "todo A implica B", entonces "no B implica no A". Si no sirve en combate (no B), entonces no aprobó el DAPAR (no A).'},
// HARD
{t:'analogy',q:'TAUTOLOGÍA : LÓGICA :: PLEONASMO : ?',o:['Retórica','Gramática','Lingüística','Literatura'],a:0,e:'Una tautología es una redundancia en lógica (ej: "A o no A"); un pleonasmo es una redundancia en retórica/expresión verbal (ej: "subir arriba"). Ambos son redundancias en su campo respectivo.'},
// HARD
{t:'analogy',q:'SERENDIPIA : DESCUBRIMIENTO :: HEURÍSTICA : ?',o:['Algoritmo','Resolución de problemas','Intuición','Ciencia'],a:1,e:'La serendipia es un hallazgo fortuito no buscado; la heurística es un método de resolución de problemas por aproximación. La relación es: proceso → resultado asociado.'},
// HARD
{t:'intruder',q:'¿Cuál NO pertenece al grupo semántico de "ausencia de certeza"?\nDuda · Ambigüedad · Incertidumbre · Axioma · Conjetura',o:['Duda','Ambigüedad','Incertidumbre','Axioma'],a:3,e:'Duda, ambigüedad, incertidumbre y conjetura expresan falta de certeza. Un axioma es una verdad aceptada como cierta sin necesidad de demostración: lo opuesto a la duda.'},
// HARD
{t:'logic',q:'"Es suficiente ser ciudadano para votar" significa que:',o:['Todo ciudadano puede votar','Solo los ciudadanos pueden votar','Los votantes deben ser ciudadanos','Ser ciudadano y votar son equivalentes'],a:0,e:'Una condición suficiente A→B significa que si se cumple A (ser ciudadano), entonces B (votar) está garantizado. No implica que solo los ciudadanos voten ni que toda persona que vota sea ciudadana.'},
// HARD
{t:'analogy',q:'SOFISMA : ARGUMENTO :: PLACEBO : ?',o:['Medicamento','Cura','Enfermedad','Tratamiento'],a:0,e:'Un sofisma parece un argumento válido pero no lo es; un placebo parece un medicamento real pero no contiene principio activo. Ambos son imitaciones no funcionales de algo genuino.'},
// HARD
{t:'antonym',q:'¿Cuál es el antónimo más preciso de PARSIMONIOSO?',o:['Pródigo','Avaro','Ahorrativo','Tacaño'],a:0,e:'Parsimonioso significa que actúa con extrema lentitud o moderación en el gasto. Su antónimo es pródigo: que gasta o da con exceso y generosidad desmedida.'},
// HARD
{t:'logic',q:'Si ningún militar cobarde recibe medallas, y Dov recibió una medalla, ¿qué se puede afirmar sobre Dov?',o:['Dov es valiente','Dov no es cobarde','Dov es el mejor soldado','Dov no es militar'],a:1,e:'Por contrapositivo: "si recibió medalla, entonces no es cobarde". No se puede afirmar que es valiente (puede haber grados intermedios), solo que no cumple la condición de cobarde.'},
// HARD
{t:'analogy',q:'CATALIZADOR : REACCIÓN QUÍMICA :: CAPITAL SEMILLA : ?',o:['Empresa consolidada','Startup','Inversión','Beneficio'],a:1,e:'Un catalizador acelera una reacción química sin consumirse; el capital semilla es el recurso inicial que activa y hace posible una startup sin ser el producto final. Ambos habilitan un proceso sin ser el resultado.'},
// HARD
{t:'analogy',q:'ICONOCLASTA : TRADICIÓN :: HETERODOXO : ?',o:['Religión','Dogma','Política','Innovación'],a:1,e:'Un iconoclasta destruye o se opone a la tradición; un heterodoxo se opone al dogma establecido, ya sea religioso, científico o ideológico. Ambos cuestionan la norma vigente en su ámbito.'},
// HARD
{t:'logic',q:'"Para ser médico es necesario terminar la carrera" equivale a:',o:['Terminar la carrera garantiza ser médico','Sin terminar la carrera no se puede ser médico','Los médicos son los únicos que terminan la carrera','Terminar la carrera es suficiente para ser médico'],a:1,e:'Una condición necesaria B←A (o ¬A→¬B) significa que sin ella (sin terminar la carrera) el resultado (ser médico) no puede ocurrir. No implica que sea suficiente.'},
// HARD
{t:'antonym',q:'¿Cuál es el antónimo de LACÓNICO?',o:['Silencioso','Prolijo','Claro','Sucinto'],a:1,e:'Lacónico significa que se expresa con muy pocas palabras, de forma extremadamente breve. Su antónimo es prolijo: que habla o escribe con exceso de palabras y detalles innecesarios.'},
// HARD
{t:'analogy',q:'AMBIVALENCIA : DECISIÓN :: DISONANCIA COGNITIVA : ?',o:['Pensamiento coherente','Emoción intensa','Acción impulsiva','Memoria selectiva'],a:0,e:'La ambivalencia (sentimientos contradictorios simultáneos) dificulta la decisión; la disonancia cognitiva (creencias contradictorias simultáneas) se opone al pensamiento coherente e integrado.'},
];
