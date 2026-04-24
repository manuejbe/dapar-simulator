const MATH_QUESTIONS = [
// ─── SERIES ────────────────────────────────────────────────
{t:'series',q:'¿Cuál es el siguiente número?\n2, 4, 6, 8, __',o:['9','10','11','12'],a:1,e:'La serie aumenta de 2 en 2: 2,4,6,8,10.'},
{t:'series',q:'¿Cuál es el siguiente número?\n1, 4, 9, 16, __',o:['20','24','25','30'],a:2,e:'Son los cuadrados perfectos: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25.'},
{t:'series',q:'¿Cuál es el siguiente número?\n3, 6, 12, 24, __',o:['36','42','48','54'],a:2,e:'Cada término se multiplica por 2: 3×2=6, 6×2=12, 12×2=24, 24×2=48.'},
{t:'series',q:'¿Cuál es el siguiente número?\n1, 1, 2, 3, 5, 8, __',o:['11','13','14','16'],a:1,e:'Serie de Fibonacci: cada número es la suma de los dos anteriores: 5+8=13.'},
{t:'series',q:'¿Cuál es el siguiente número?\n100, 90, 80, 70, __',o:['65','60','55','50'],a:1,e:'La serie disminuye de 10 en 10: 70-10=60.'},
{t:'series',q:'¿Cuál es el siguiente número?\n2, 6, 18, 54, __',o:['108','162','200','216'],a:1,e:'Cada término se multiplica por 3: 54×3=162.'},
{t:'series',q:'¿Cuál es el siguiente número?\n5, 10, 20, 35, 55, __',o:['75','80','90','70'],a:1,e:'Las diferencias son 5,10,15,20,25. El siguiente es 55+25=80.'},
{t:'series',q:'¿Cuál es el siguiente número?\n1, 8, 27, 64, __',o:['100','125','128','216'],a:1,e:'Son los cubos perfectos: 1³,2³,3³,4³,5³=125.'},
{t:'series',q:'¿Cuál es el siguiente número?\n7, 14, 21, 28, __',o:['32','35','36','42'],a:1,e:'Múltiplos de 7: 7×5=35.'},
{t:'series',q:'¿Cuál es el siguiente número?\n1, 3, 7, 15, 31, __',o:['53','63','65','67'],a:1,e:'Cada término se duplica y se suma 1: 31×2+1=63.'},
{t:'series',q:'¿Cuál es el siguiente número?\n81, 27, 9, 3, __',o:['1','0.5','2','0.3'],a:0,e:'Cada término se divide entre 3: 3÷3=1.'},
{t:'series',q:'¿Cuál es el siguiente número?\n2, 3, 5, 7, 11, 13, __',o:['14','15','17','19'],a:2,e:'Son números primos consecutivos. Después de 13 viene 17.'},
{t:'series',q:'¿Cuál es el siguiente número?\n10, 9, 7, 4, __',o:['0','1','2','-1'],a:0,e:'Las diferencias son -1,-2,-3,-4. El siguiente: 4-4=0.'},
{t:'series',q:'¿Cuál es el siguiente número?\n4, 9, 16, 25, 36, __',o:['42','48','49','50'],a:2,e:'Son cuadrados perfectos empezando en 2²: 7²=49.'},
{t:'series',q:'¿Cuál es el siguiente número?\n1, 2, 4, 7, 11, 16, __',o:['20','22','23','25'],a:1,e:'Las diferencias son 1,2,3,4,5,6. El siguiente: 16+6=22.'},
{t:'series',q:'¿Cuál es el siguiente número?\n0.5, 1, 2, 4, __',o:['6','7','8','9'],a:2,e:'Cada término se multiplica por 2: 4×2=8.'},
{t:'series',q:'¿Cuál es el siguiente número?\n3, 5, 8, 13, 21, __',o:['29','34','38','42'],a:1,e:'Fibonacci desplazado: 13+21=34.'},
{t:'series',q:'¿Cuál es el siguiente número?\n120, 60, 30, 15, __',o:['10','7.5','5','12'],a:1,e:'Cada término se divide entre 2: 15÷2=7.5.'},
{t:'series',q:'¿Cuál es el siguiente número?\n2, 5, 11, 23, __',o:['35','47','45','48'],a:1,e:'Cada término se multiplica por 2 y se suma 1: 23×2+1=47.'},
{t:'series',q:'¿Cuál es el siguiente número?\n16, 8, 4, 2, __',o:['1.5','1','0.5','0'],a:1,e:'Cada término se divide entre 2: 2÷2=1.'},
// ─── ÁLGEBRA ───────────────────────────────────────────────
{t:'algebra',q:'Si 3x + 5 = 20, ¿cuánto vale x?',o:['3','4','5','6'],a:2,e:'3x = 20-5 = 15; x = 15÷3 = 5.'},
{t:'algebra',q:'Si x² = 49, ¿cuánto vale x? (positivo)',o:['6','7','8','9'],a:1,e:'√49 = 7, entonces x = 7.'},
{t:'algebra',q:'¿Cuánto es 15% de 200?',o:['25','30','35','40'],a:1,e:'15% de 200 = 0.15 × 200 = 30.'},
{t:'algebra',q:'Si 2x - 8 = 14, ¿cuánto vale x?',o:['9','10','11','12'],a:2,e:'2x = 14+8 = 22; x = 22÷2 = 11.'},
{t:'algebra',q:'Un número aumentado en 40% da 70. ¿Cuál es el número?',o:['42','50','48','45'],a:1,e:'n × 1.4 = 70; n = 70÷1.4 = 50.'},
{t:'algebra',q:'Si a + b = 10 y a - b = 4, ¿cuánto vale a?',o:['5','6','7','8'],a:2,e:'Sumando: 2a = 14, a = 7. Entonces b = 3.'},
{t:'algebra',q:'Si 5 lápices cuestan 15 soles, ¿cuánto cuestan 8 lápices?',o:['20','24','25','28'],a:1,e:'Precio unitario: 15÷5=3. Costo de 8: 8×3=24.'},
{t:'algebra',q:'Si 2/3 de un número es 18, ¿cuál es el número?',o:['12','24','27','36'],a:2,e:'(2/3)×n = 18; n = 18×(3/2) = 27.'},
{t:'algebra',q:'¿Cuánto es 3² + 4²?',o:['25','14','49','7'],a:0,e:'3² + 4² = 9 + 16 = 25.'},
{t:'algebra',q:'Si 4x + 2 = 3x + 9, ¿cuánto vale x?',o:['5','6','7','8'],a:2,e:'4x - 3x = 9 - 2; x = 7.'},
{t:'algebra',q:'Un producto costaba 80 y subió un 15%. ¿Cuánto cuesta ahora?',o:['88','92','96','90'],a:1,e:'80 × 1.15 = 92.'},
{t:'algebra',q:'Si Pedro tiene 3 veces lo que tiene Juan, y juntos tienen 48, ¿cuánto tiene Juan?',o:['10','12','14','16'],a:1,e:'j + 3j = 48; 4j = 48; j = 12.'},
{t:'algebra',q:'Si 6y - 4 = 2y + 12, ¿cuánto vale y?',o:['2','3','4','5'],a:2,e:'6y - 2y = 12 + 4; 4y = 16; y = 4.'},
// ─── GEOMETRÍA / PROBABILIDAD ──────────────────────────────
{t:'geometry',q:'¿Cuál es el área de un rectángulo de 6 × 9?',o:['30','48','54','56'],a:2,e:'Área = base × altura = 6 × 9 = 54.'},
{t:'geometry',q:'Un cuadrado tiene perímetro 36. ¿Cuánto mide su lado?',o:['6','8','9','12'],a:2,e:'Perímetro = 4 × lado; lado = 36÷4 = 9.'},
{t:'geometry',q:'Un triángulo rectángulo tiene catetos de 3 y 4. ¿Cuánto mide la hipotenusa?',o:['5','6','7','8'],a:0,e:'Pitágoras: c² = 3² + 4² = 9+16 = 25; c = 5.'},
{t:'geometry',q:'Si lanzas un dado de 6 caras, ¿cuál es la probabilidad de sacar un 3?',o:['1/3','1/6','1/2','2/6'],a:1,e:'Hay 1 cara favorable de 6 posibles: P = 1/6.'},
{t:'geometry',q:'El volumen de un cubo de lado 4 es:',o:['16','48','64','32'],a:2,e:'V = lado³ = 4³ = 64.'},
{t:'geometry',q:'En una bolsa hay 3 bolas rojas y 7 azules. ¿Cuál es la probabilidad de sacar una roja?',o:['3/7','7/10','3/10','1/3'],a:2,e:'Bolas rojas: 3. Total: 10. P = 3/10.'},
{t:'geometry',q:'Si una moneda se lanza 2 veces, ¿cuál es la probabilidad de obtener 2 caras?',o:['1/2','1/4','1/3','3/4'],a:1,e:'P(cara)×P(cara) = 1/2 × 1/2 = 1/4.'},
{t:'geometry',q:'El área de un triángulo con base 10 y altura 6 es:',o:['60','30','16','50'],a:1,e:'Área = (base × altura) ÷ 2 = (10×6)÷2 = 30.'},
{t:'geometry',q:'Un punto se ubica en (3,4). ¿A qué distancia está del origen (0,0)?',o:['3','4','5','7'],a:2,e:'d = √(3²+4²) = √(9+16) = √25 = 5.'},
{t:'geometry',q:'Si lanzas 2 dados, ¿cuál es la probabilidad de obtener suma 12?',o:['1/12','1/36','2/36','1/6'],a:1,e:'Solo (6,6) da suma 12. Total de resultados: 36. P = 1/36.'},
// ─── DIFÍCIL ───────────────────────────────────────────────
// HARD
{t:'algebra',q:'Un granjero tiene gallinas y conejos. Cuenta 20 cabezas y 56 patas. ¿Cuántas gallinas hay?',o:['8','12','14','16'],a:1,e:'Sistema: g+c=20 y 2g+4c=56. Sustituyendo: 2g+4(20-g)=56 → -2g=-24 → g=12.'},
// HARD
{t:'algebra',q:'La suma de un número positivo y su cuadrado es 56. ¿Cuál es el número?',o:['6','7','8','9'],a:1,e:'x+x²=56 → x²+x-56=0 → (x+8)(x-7)=0 → x=7 (positivo).'},
// HARD
{t:'combinatorics',q:'¿De cuántas formas se pueden ordenar 5 soldados en fila si el comandante siempre debe ocupar el primer lugar?',o:['24','48','120','60'],a:0,e:'El comandante ocupa el 1er lugar (fijo). Los 4 restantes se ordenan de 4! = 24 formas.'},
// HARD
{t:'probability',q:'El 60% de una unidad son hombres. El 40% de los hombres tienen más de 5 años de servicio. ¿Qué porcentaje del total son hombres con más de 5 años de servicio?',o:['20%','24%','30%','40%'],a:1,e:'P = 0.60 × 0.40 = 0.24 = 24%.'},
// HARD
{t:'number',q:'¿Cuál es el resto de dividir 2¹⁰ entre 7?',o:['1','2','4','6'],a:1,e:'Ciclo de potencias de 2 mod 7: 2,4,1,2,4,1... (período 3). 10 mod 3 = 1, entonces 2¹⁰ ≡ 2¹ = 2 (mod 7).'},
// HARD
{t:'number',q:'¿Cuántos divisores tiene el número 360?',o:['18','24','20','16'],a:1,e:'360 = 2³ × 3² × 5¹. Número de divisores = (3+1)(2+1)(1+1) = 4×3×2 = 24.'},
// HARD
{t:'algebra',q:'Un triángulo tiene lados x, x+2 y x+4. Su perímetro es 24. ¿Cuánto mide el lado más largo?',o:['6','8','10','12'],a:2,e:'x+(x+2)+(x+4)=24 → 3x+6=24 → x=6. Lado mayor: 6+4=10.'},
// HARD
{t:'algebra',q:'La altura de un proyectil es h(t) = −5t² + 20t metros. ¿En qué segundo alcanza la altura máxima?',o:['t=1','t=2','t=3','t=4'],a:1,e:'Vértice de la parábola: t = −b/(2a) = −20/(2×(−5)) = 2 segundos.'},
// HARD
{t:'algebra',q:'A puede completar un trabajo en 6 días, B en 4 días. Trabajando juntos, ¿en cuántos días terminan?',o:['2 días','2.4 días','3 días','5 días'],a:1,e:'Tasa combinada: 1/6+1/4 = 5/12 por día. Tiempo = 12/5 = 2.4 días.'},
// HARD
{t:'combinatorics',q:'¿Cuántos números de 3 dígitos se pueden formar con {1,2,3,4,5} sin repetir dígitos y con el primer dígito impar?',o:['24','36','48','60'],a:1,e:'1er dígito impar: 3 opciones {1,3,5}. 2do dígito: 4 opciones. 3er dígito: 3 opciones. Total: 3×4×3=36.'},
// HARD
{t:'number',q:'¿Cuál es el Mínimo Común Múltiplo de 12, 18 y 30?',o:['90','120','180','360'],a:2,e:'12=2²×3; 18=2×3²; 30=2×3×5. MCM=2²×3²×5=180.'},
// HARD
{t:'algebra',q:'En un examen, cada correcta suma 3 puntos y cada incorrecta resta 1. Ana respondió 20 preguntas y obtuvo 36 puntos. ¿Cuántas respondió correctamente?',o:['12','13','14','15'],a:2,e:'c+i=20 y 3c-i=36. Sumando: 4c=56 → c=14.'},
// HARD
{t:'number',q:'¿Qué dígito ocupa las unidades de 7¹⁰⁰?',o:['1','3','7','9'],a:0,e:'Ciclo de unidades de potencias de 7: 7,9,3,1 (período 4). 100÷4=25 (resto 0). Resto 0 → usar el 4to valor del ciclo: 1.'},
// HARD
{t:'combinatorics',q:'¿De cuántas formas se pueden sentar 4 personas alrededor de una mesa circular?',o:['6','12','24','4'],a:0,e:'Permutaciones circulares: (n-1)! = 3! = 6.'},
// HARD
{t:'algebra',q:'Dos trenes parten en sentidos opuestos desde el mismo punto, a 80 km/h y 60 km/h respectivamente. ¿En cuántas horas estarán a 350 km de distancia?',o:['2h','2.5h','3h','3.5h'],a:1,e:'Distancia combinada: (80+60)×t = 140t = 350 → t = 2.5 horas.'},
// HARD
{t:'algebra',q:'Un cuadrado tiene área 81 cm². Se aumenta cada lado en x cm y el área pasa a 121 cm². ¿Cuánto vale x?',o:['1','2','3','4'],a:1,e:'Lado original = 9. (9+x)² = 121 → 9+x = 11 → x = 2.'},
// HARD
{t:'algebra',q:'Se mezclan 3 litros de solución al 40% con 7 litros de solución al 10%. ¿Cuál es la concentración resultante?',o:['17%','19%','21%','25%'],a:1,e:'(3×0.4 + 7×0.1)/10 = (1.2+0.7)/10 = 1.9/10 = 19%.'},
// HARD
{t:'geometry',q:'¿Cuánto mide cada ángulo interior de un polígono regular de 9 lados?',o:['120°','130°','140°','150°'],a:2,e:'Ángulo interior = (n-2)×180/n = 7×180/9 = 1260/9 = 140°.'},
// HARD
{t:'number',q:'¿Cuántos múltiplos de 7 hay entre 1 y 200 inclusive?',o:['27','28','29','30'],a:1,e:'⌊200/7⌋ = 28 múltiplos.'},
// HARD
{t:'combinatorics',q:'¿De cuántas formas se pueden elegir 3 personas de un grupo de 8 para formar un comité?',o:['24','56','112','336'],a:1,e:'C(8,3) = 8!/(3!×5!) = 56.'},
// HARD
{t:'algebra',q:'Si 2ˣ = 32, ¿cuánto vale 2^(x+2)?',o:['64','128','96','34'],a:1,e:'2ˣ=32=2⁵ → x=5. Entonces 2^(x+2)=2⁷=128.'},
// HARD
{t:'algebra',q:'Un depósito se llena con una tubería en 4 horas y se vacía con otra en 6 horas. Si ambas funcionan a la vez, ¿en cuántas horas se llena?',o:['10h','12h','14h','8h'],a:1,e:'Entrada: 1/4 por hora. Salida: 1/6 por hora. Neta: 1/4−1/6=1/12. Tiempo=12 horas.'},
// HARD
{t:'algebra',q:'El precio de un artículo aumenta un 20% y luego disminuye un 20%. ¿Cuál es la variación porcentual neta?',o:['0%','-4%','+4%','-2%'],a:1,e:'1 × 1.2 × 0.8 = 0.96. La variación neta es −4%.'},
// HARD
{t:'algebra',q:'En tres pruebas Ana sacó 70, 80 y 90. La 1ª cuenta 20%, la 2ª 30% y la 3ª 50%. ¿Cuál es su nota final?',o:['80','81','82','83'],a:3,e:'0.2×70 + 0.3×80 + 0.5×90 = 14 + 24 + 45 = 83.'},
// HARD
{t:'probability',q:'En una urna hay 4 bolas rojas y 6 azules. Se extraen 2 sin reposición. ¿Cuál es la probabilidad de que ambas sean rojas?',o:['2/15','4/25','1/6','8/45'],a:0,e:'P = (4/10)×(3/9) = 12/90 = 2/15.'},
// HARD
{t:'number',q:'¿Cuántos ceros terminales tiene el número 50! (50 factorial)?',o:['10','12','13','14'],a:1,e:'Se cuentan los factores de 5: ⌊50/5⌋+⌊50/25⌋ = 10+2 = 12 ceros.'},
// HARD
{t:'algebra',q:'La progresión aritmética con primer término 3 y razón 4 suma 105 en sus primeros n términos. ¿Cuánto vale n?',o:['6','7','8','9'],a:1,e:'Sₙ = n/2×(2a+(n-1)d) = n(2n+1) = 105. n=7: 7×15=105 ✓.'},
// HARD
{t:'algebra',q:'En un triángulo rectángulo, una cateto mide 5 y la hipotenusa mide 13. ¿Cuánto mide el otro cateto?',o:['8','10','12','9'],a:2,e:'Pitágoras: 5²+b²=13² → 25+b²=169 → b²=144 → b=12.'},
// HARD
{t:'probability',q:'Se lanza una moneda 3 veces. ¿Cuál es la probabilidad de obtener exactamente 2 caras?',o:['1/4','3/8','1/2','1/8'],a:1,e:'C(3,2)×(1/2)²×(1/2)¹ = 3×1/4×1/2 = 3/8.'},
// HARD
{t:'algebra',q:'Si log₂(x) = 5, ¿cuánto vale x?',o:['10','16','32','64'],a:2,e:'log₂(x)=5 significa 2⁵=x → x=32.'},
];
