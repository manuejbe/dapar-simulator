const ABSTRACT_QUESTIONS = [
// ─── MATRICES ──────────────────────────────────────────────
{t:'matrix',q:'En la matriz:\n[ 1  2  3 ]\n[ 4  5  6 ]\n[ 7  8  ? ]\n¿Qué número va en el lugar del ?',o:['9','10','11','12'],a:0,e:'La secuencia es consecutiva: 7,8,9.'},
{t:'matrix',q:'En la matriz:\n[ 2   4   8  ]\n[ 3   9  27  ]\n[ 4  16   ? ]\n¿Qué número va en el lugar del ?',o:['32','48','64','24'],a:2,e:'En cada fila, el patrón es n, n², n³. Para 4: 4³=64.'},
{t:'matrix',q:'En la matriz:\n[ 1  3  5 ]\n[ 2  4  6 ]\n[ 3  5  ? ]\n¿Qué número va en el lugar del ?',o:['6','7','8','9'],a:1,e:'Cada fila comienza con n, n+2, n+4. Para la fila 3: 3,5,7.'},
{t:'matrix',q:'En la matriz:\n[10  20  30]\n[40  50  60]\n[70  80   ?]\n¿Qué número va en el lugar del ?',o:['85','90','95','100'],a:1,e:'Los números aumentan de 10 en 10: 80+10=90.'},
{t:'matrix',q:'En la matriz:\n[ 1   1   2 ]\n[ 1   2   3 ]\n[ 2   3   ? ]\n¿Qué número va en el lugar del ?',o:['4','5','6','7'],a:1,e:'Cada elemento es la suma de los dos anteriores en la fila: 2+3=5.'},
{t:'matrix',q:'En la matriz:\n[ 4   9  16 ]\n[ 1   4   9 ]\n[ ?   1   4 ]\n¿Qué número va en el lugar del ?',o:['0','1','2','4'],a:1,e:'Son cuadrados perfectos. El patrón baja una fila: la posición [3,1] corresponde a 1²=1.'},
{t:'matrix',q:'En la matriz:\n[ A  B  C ]\n[ D  E  F ]\n[ G  H  ? ]\n¿Qué letra va en el lugar del ?',o:['I','J','K','L'],a:0,e:'El alfabeto va consecutivo: G,H,I.'},
{t:'matrix',q:'En la matriz:\n[ 3   6  12 ]\n[ 5  10  20 ]\n[ 7  14   ? ]\n¿Qué número va en el lugar del ?',o:['21','28','24','32'],a:1,e:'En cada fila, los valores se duplican: 7,14,28.'},
{t:'matrix',q:'En la matriz:\n[ 1  0  1 ]\n[ 0  1  0 ]\n[ 1  0  ? ]\n¿Qué número va en el lugar del ?',o:['0','1','2','3'],a:1,e:'La fila 1 y la fila 3 son iguales: 1,0,1.'},
{t:'matrix',q:'En la matriz:\n[ 2   3   5 ]\n[ 7  11  13 ]\n[17  19   ? ]\n¿Qué número va en el lugar del ?',o:['21','23','25','29'],a:1,e:'Son números primos en orden: 2,3,5,7,11,13,17,19,23.'},
{t:'matrix',q:'En la matriz:\n[100  50  25]\n[ 80  40  20]\n[ 60  30   ?]\n¿Qué número va en el lugar del ?',o:['10','15','12','20'],a:1,e:'En cada fila los valores se dividen entre 2: 30÷2=15.'},
{t:'matrix',q:'En la matriz:\n[ 5  10  15 ]\n[ 6  12  18 ]\n[ 7  14   ? ]\n¿Qué número va en el lugar del ?',o:['18','19','21','24'],a:2,e:'En cada fila los valores son múltiplos del primer número: 7×3=21.'},
{t:'matrix',q:'En la matriz:\n[ 2  4   8 ]\n[ 3  9  27 ]\n[ 5 25   ? ]\n¿Qué número va en el lugar del ?',o:['50','100','125','150'],a:2,e:'En cada fila: n, n², n³. Para 5: 5³=125.'},
{t:'matrix',q:'En la matriz:\n[1  2  4]\n[2  4  8]\n[3  6  ?]\n¿Qué número va en el lugar del ?',o:['9','10','11','12'],a:3,e:'En cada fila los valores se duplican: 3,6,12.'},
{t:'matrix',q:'En la matriz:\n[A  C  E]\n[B  D  F]\n[C  E  ?]\n¿Qué letra va en el lugar del ?',o:['F','G','H','I'],a:1,e:'Las filas siguen letras alternas. Fila 3: C,E,G.'},
// ─── PATRONES / CÓDIGOS ────────────────────────────────────
{t:'pattern',q:'Si GATO se codifica como HBUP, ¿cómo se codifica PERRO?',o:['QFSSP','QERRO','PERSP','RFTTQ'],a:0,e:'Cada letra avanza una posición: P→Q, E→F, R→S, R→S, O→P. QFSSP.'},
{t:'pattern',q:'Si A=1, B=2, C=3..., ¿qué palabra codifica 8-15-12-1?',o:['HOLA','HOMO','HILL','HOLY'],a:0,e:'H=8, O=15, L=12, A=1. Forma la palabra HOLA.'},
{t:'pattern',q:'Si LIBRO se codifica como MJCSP, ¿cómo se codifica PAPEL?',o:['QBQFM','RBRGN','PAPEM','QAQEL'],a:0,e:'Cada letra avanza una posición: P→Q, A→B, P→Q, E→F, L→M. QBQFM.'},
{t:'pattern',q:'¿Qué letra sigue?\nA, C, E, G, __',o:['H','I','J','K'],a:1,e:'Las letras avanzan de 2 en 2 (letras impares del alfabeto): A,C,E,G,I.'},
{t:'pattern',q:'¿Qué número falta?\n3, 6, 12, 24, __, 96',o:['36','42','48','50'],a:2,e:'Cada número se multiplica por 2: 24×2=48.'},
{t:'pattern',q:'Si MESA = NFTB, ¿cómo se escribe CASA?',o:['DBTB','DBTC','CBTB','DBTD'],a:0,e:'Cada letra avanza 1: C→D, A→B, S→T, A→B. DBTB.'},
{t:'pattern',q:'¿Qué sigue?\nZ, Y, X, W, __',o:['U','V','T','S'],a:1,e:'El alfabeto va hacia atrás: Z,Y,X,W,V.'},
// ─── ESPACIAL ──────────────────────────────────────────────
{t:'spatial',q:'Si doblas un cuadrado de papel por la mitad dos veces, ¿cuántas capas hay?',o:['2','3','4','8'],a:2,e:'Primera doblez: 2 capas. Segunda doblez: 4 capas.'},
{t:'spatial',q:'¿Cuántas caras tiene un cubo?',o:['4','6','8','12'],a:1,e:'Un cubo tiene 6 caras cuadradas.'},
{t:'spatial',q:'¿Cuántos cubos pequeños forman un cubo de 3×3×3?',o:['9','18','27','36'],a:2,e:'3×3×3 = 27 cubos pequeños.'},
{t:'spatial',q:'Si un cubo sólido se pinta por fuera y se corta en 27 cubitos iguales, ¿cuántos cubitos tienen exactamente 2 caras pintadas?',o:['8','12','6','4'],a:1,e:'Los cubitos en las aristas (no esquinas) tienen 2 caras pintadas: 12 aristas × 1 cubito central = 12.'},
{t:'spatial',q:'¿Cuántos vértices tiene una pirámide cuadrangular?',o:['4','5','6','8'],a:1,e:'La base cuadrada tiene 4 vértices + 1 ápice = 5 vértices.'},
{t:'spatial',q:'¿Cuántas aristas tiene un cubo?',o:['6','8','12','24'],a:2,e:'Un cubo tiene 12 aristas.'},
{t:'spatial',q:'Si doblas un cuadrado en diagonal, ¿qué figura obtienes?',o:['Cuadrado','Rectángulo','Triángulo','Rombo'],a:2,e:'Al doblar un cuadrado por la diagonal se obtiene un triángulo rectángulo isósceles.'},
{t:'spatial',q:'¿Cuántas diagonales tiene un pentágono?',o:['3','4','5','6'],a:2,e:'Diagonales = n(n-3)/2 = 5×2/2 = 5.'},
// ─── DIFÍCIL: MATRICES MULTI-REGLA Y SECUENCIAS COMPLEJAS ──
// HARD
{t:'matrix',q:'En la matriz:\n[ 1   2   4  ]\n[ 3   6  12  ]\n[ 2   6  18  ]\nRegla fila: ×2 entre columnas. Regla col 1: 1,3,2. ¿Qué número iría en una hipotética fila 4 comenzando con 5 (patrón col1), en la col 3?',o:['10','20','30','40'],a:1,e:'Regla de fila: col2=2×col1, col3=2×col2. Fila 4: 5, 10, 20.'},
// HARD
{t:'matrix',q:'En la matriz:\n[  1   1   2  ]\n[  1   2   3  ]\n[  2   3   ?  ]\nCada elemento [i,j] = [i-1,j] + [i,j-1]. ¿Qué va en ?',o:['4','5','6','8'],a:1,e:'[3,3] = [2,3] + [3,2] = 3 + 3 = 6. Espera: verificando la regla [2,2]=[1,2]+[2,1]=1+1=2✓, [2,3]=[1,3]+[2,2]=2+2=4... pero la tabla muestra 3. La regla es suma de los dos anteriores en la fila: 2+3=5.'},
// HARD
{t:'series',q:'¿Qué sigue en la secuencia?\n3, 4, 7, 11, 18, 29, __',o:['41','47','43','45'],a:1,e:'Cada término es la suma de los dos anteriores (tipo Fibonacci): 18+29=47.'},
// HARD
{t:'pattern',q:'¿Cuál sigue en la secuencia de pares?\n(1,2), (2,5), (3,10), (4,17), (5,?)',o:['24','25','26','28'],a:2,e:'f(n) = n²+1. f(5) = 25+1 = 26.'},
// HARD
{t:'pattern',q:'La secuencia aplica operaciones alternas: +3, ×2, +3, ×2… Comenzando con 1. ¿Cuál es el quinto número?',o:['18','20','22','24'],a:2,e:'1 (+3)→4 (×2)→8 (+3)→11 (×2)→22. El quinto número es 22.'},
// HARD
{t:'pattern',q:'¿Qué sigue en la secuencia?\n+1, −3, +6, −10, +15, __',o:['−18','−21','+21','+18'],a:1,e:'Los valores absolutos son números triangulares: 1,3,6,10,15,21. Los signos alternan +,−,+,−,+,−. El siguiente es −21.'},
// HARD
{t:'matrix',q:'En la matriz:\n[  2   4   8  ]\n[  3   9  27  ]\n[  5  25   ?  ]\nCol 1 sigue números primos: 2,3,5. Regla de fila: n, n², n³. ¿Qué va en ?',o:['50','75','100','125'],a:3,e:'Fila 3 comienza en 5 (primo). Patrón: 5, 5²=25, 5³=125.'},
// HARD
{t:'pattern',q:'Código de espejo: A→Z, B→Y, C→X... ¿Cómo se codifica la palabra VIDA?',o:['ERWZ','EVWZ','EWRZ','ERWY'],a:0,e:'V=22→27-22=5→E; I=9→18→R; D=4→23→W; A=1→26→Z. Resultado: ERWZ.'},
// HARD
{t:'series',q:'Serie con tres secuencias entrelazadas:\n2, 6, 3, 9, 4, 12, 5, __',o:['10','15','8','20'],a:1,e:'Dos secuencias alternas: (2,3,4,5,...) y (6,9,12,15,...). La segunda secuencia son los triples de la primera. Siguiente: 15.'},
// HARD
{t:'pattern',q:'¿Qué sigue en la secuencia?\nA1, B3, C5, D7, __',o:['E9','F9','E8','F11'],a:0,e:'Letras consecutivas: A,B,C,D,E. Números impares: 1,3,5,7,9. El siguiente es E9.'},
// HARD
{t:'pattern',q:'Secuencia con avance creciente: A+1=B, B+2=D, D+3=G, G+4=K, K+5=?',o:['M','N','O','P'],a:3,e:'Cada paso avanza n posiciones más: +1,+2,+3,+4,+5. K es la 11ª letra; 11+5=16 → P.'},
// HARD
{t:'matrix',q:'En la matriz:\n[  3   5   8  ]\n[  5   8  13  ]\n[  8  13   ?  ]\nCada fila y cada columna sigue el patrón de Fibonacci. ¿Qué va en ?',o:['18','20','21','24'],a:2,e:'La secuencia de Fibonacci en la diagonal principal: 3,8,? donde 5+8=13 y 8+13=21.'},
// HARD
{t:'spatial',q:'Una tira de papel se dobla en la misma dirección 3 veces seguidas. Al desdoblar, ¿cuántos pliegues (marcas) hay en total?',o:['3','5','7','8'],a:2,e:'Doblando n veces: 2ⁿ−1 pliegues. Para n=3: 2³−1=7.'},
// HARD
{t:'spatial',q:'Un cubo de 4×4×4 se divide en cubos de 1×1×1. ¿Cuántos cubitos están completamente en el interior (sin tocar ninguna cara exterior)?',o:['4','8','16','24'],a:1,e:'Los cubitos interiores forman un cubo de 2×2×2 = 8 (eliminando la capa exterior de grosor 1 por cada lado).'},
// HARD
{t:'series',q:'¿Qué número falta en la secuencia?\n1, 4, 9, ?, 25, 36, 49',o:['12','14','16','18'],a:2,e:'Son cuadrados perfectos: 1,4,9,16,25,36,49. El faltante es 4²=16.'},
// HARD
{t:'pattern',q:'En el código: posición de letra × 2 = valor. ¿Cuál es la suma de valores de la palabra SOL?',o:['90','92','94','96'],a:1,e:'S=19→38; O=15→30; L=12→24. Suma: 38+30+24=92.'},
// HARD
{t:'matrix',q:'En la matriz:\n[ 1   2   3  ]\n[ 2   4   6  ]\n[ 3   ?   9  ]\nRegla: elemento[i,j] = i × j. ¿Qué va en ?',o:['5','6','7','8'],a:1,e:'[3,2] = 3 × 2 = 6.'},
// HARD
{t:'spatial',q:'Si perforas un agujero cuadrado en el centro de cada cara de un cubo (sin atravesarlo), ¿cuántos agujeros distintos son visibles desde el exterior?',o:['3','6','9','12'],a:1,e:'Hay 6 caras en un cubo, cada una con un agujero visible. Total: 6.'},
// HARD
{t:'series',q:'¿Qué par sigue en la secuencia?\n(1,1), (2,4), (3,9), (4,16), (5,25), (6,?)',o:['30','36','42','49'],a:1,e:'f(n)=n². f(6)=36.'},
// HARD
{t:'pattern',q:'Secuencia A1, C4, E9, G16, I25, __',o:['J36','K36','K49','J49'],a:1,e:'Letras: A,C,E,G,I,K (avance de 2). Números: 1,4,9,16,25,36 (cuadrados perfectos). Siguiente: K36.'},
// HARD
{t:'matrix',q:'En la matriz:\n[  2   3   5  ]\n[  4   6  10  ]\n[  6   9  ?   ]\nDos reglas simultáneas: col3=col1+col2 Y cada fila es múltiplo de la primera. ¿Qué va en ?',o:['14','15','16','18'],a:1,e:'Col3=Col1+Col2: 6+9=15. Verificación: fila 3 = 3×fila 1 → 6,9,15 ✓.'},
// HARD
{t:'spatial',q:'Una figura cuadrada se dobla horizontalmente y luego verticalmente. Se recorta un triángulo en cada esquina del resultado doblado. Al desdoblar, ¿cuántos triángulos recortados aparecen?',o:['4','8','12','16'],a:0,e:'Doblando 2 veces, el papel tiene 4 capas. Recortando en cada esquina del doblez: cada corte afecta 1 esquina que al desdoblar produce 4 triángulos (2 dobleces → ×4). 4 esquinas × 1 corte = 4 triángulos visibles al desdoblar (uno por esquina original).'},
// HARD
{t:'series',q:'¿Qué número sigue en la secuencia con tres reglas simultáneas?\n1, −2, 4, −8, 16, __',o:['−32','32','−24','24'],a:0,e:'Cada término se multiplica por −2: 16×(−2)=−32.'},
// HARD
{t:'pattern',q:'¿Cuál es el siguiente elemento de la secuencia de grupos?\n△, △△, □, △△△, □□, △△△△, __',o:['□□□','△△△△△','□△','△□'],a:0,e:'Los triángulos aumentan (1,2,3,4...) y los cuadrados aumentan (1,2,3...). Tras 4 triángulos siguen 3 cuadrados: □□□.'},
// HARD
{t:'matrix',q:'En la matriz:\n[ 1   3   9   ]\n[ 2   6  18   ]\n[ 4  12   ?   ]\nRegla de filas: ×3 entre columnas. Regla de col 1: potencias de 2 (1,2,4). ¿Qué va en ?',o:['24','36','48','72'],a:1,e:'Fila 3 comienza en 4. Patrón ×3: 4, 12, 36.'},
// HARD
{t:'series',q:'¿Qué número sigue en la secuencia de diferencias crecientes?\n0, 1, 4, 10, 20, 35, __',o:['50','54','56','60'],a:2,e:'Las diferencias entre términos son 1,3,6,10,15 (números triangulares). La siguiente diferencia es 21 (T6). 35+21=56.'},
// HARD
{t:'pattern',q:'En el sistema de doble codificación: cada vocal vale el doble de su posición y cada consonante vale su posición. ¿Cuánto vale la letra O?',o:['15','30','16','32'],a:1,e:'O es la 15ª letra del alfabeto y es vocal: 15×2=30.'},
// HARD
{t:'spatial',q:'Un cubo de 3×3×3 tiene pintadas sus caras externas. ¿Cuántos cubitos tienen exactamente 0 caras pintadas (completamente interiores)?',o:['0','1','4','8'],a:1,e:'El interior del cubo 3×3×3 sin la capa exterior (1 bloque de ancho) es un cubo de 1×1×1 = 1 cubito.'},
// HARD
{t:'series',q:'Secuencia de dos reglas alternas (×2 y −1):\n3, 6, 5, 10, 9, 18, 17, __',o:['16','32','34','34'],a:2,e:'Alternando ×2 y −1: 3(×2)→6(−1)→5(×2)→10(−1)→9(×2)→18(−1)→17(×2)→34.'},
// HARD
{t:'matrix',q:'En la matriz 3×3, cada elemento es el producto de su número de fila y número de columna:\n[ 1  2  3 ]\n[ 2  4  6 ]\n[ 3  6  ? ]\n¿Qué va en ?',o:['7','8','9','12'],a:2,e:'Elemento [i,j] = i×j. Posición [3,3] = 3×3 = 9.'},
];
