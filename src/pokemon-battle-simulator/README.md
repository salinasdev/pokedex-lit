# ⚔️ Pokemon Battle Simulator

Simulador avanzado de combate Pokémon con IA básica y análisis probabilístico. Permite testear estrategias, comparar Pokémon y predecir resultados de batalla.

## ✨ Características

### 🎮 Configuración de Batalla

#### Selección de Pokémon
- **Búsqueda en Tiempo Real**: Busca entre 898 Pokémon
- **Autocompletado**: Resultados instantáneos mientras escribes
- **Información Completa**:
  - Sprite oficial
  - Tipos con colores distintivos
  - 6 estadísticas base (HP, Ataque, Defensa, At. Especial, Def. Especial, Velocidad)

#### Selección de Movimientos
- **Movimientos Reales**: Cargados desde PokeAPI
- **Filtrado Automático**: Solo movimientos con daño
- **Información Detallada**:
  - Poder del movimiento
  - Precisión
  - Tipo
  - Clase de daño (Físico/Especial)
  - PP disponibles
- **Selección Visual**: Click para elegir movimiento principal

#### Control de IA
- **Toggle para cada jugador**: Activa/desactiva IA
- **IA vs IA**: Simula batallas completamente automáticas
- **Jugador vs IA**: Practica contra oponentes controlados
- **Jugador vs Jugador**: Modo estratégico completo

### ⚔️ Sistema de Combate

#### Mecánicas de Batalla
- **Fórmula de Daño Real**: Basada en Pokémon Generación 5+
  ```
  Daño = ((2×Nivel/5 + 2) × Poder × (Ataque/Defensa)) / 50 + 2
  ```
- **Orden de Ataque**: Determinado por estadística de Velocidad
- **Golpes Críticos**: 6.25% de probabilidad (1.5× daño)
- **Variación Aleatoria**: 85-100% del daño calculado

#### Tabla de Efectividad de Tipos
Sistema completo de efectividad con 18 tipos:
- **Súper Efectivo** (2×): Mensaje especial + color verde
- **No Muy Efectivo** (0.5×): Mensaje + color gris
- **Sin Efecto** (0×): Inmunidad total
- **Doble Efectividad**: Multiplicadores acumulativos (hasta 4× o 0.25×)

Tipos soportados:
- Normal, Fire, Water, Grass, Electric, Ice
- Fighting, Poison, Ground, Flying, Psychic, Bug
- Rock, Ghost, Dragon, Dark, Steel, Fairy

#### Sistema de Turnos
1. **Inicio**: Anuncio de batalla
2. **Determinación de Velocidad**: El más rápido ataca primero
3. **Ejecución de Ataques**:
   - Animación de ataque
   - Cálculo de daño
   - Animación de impacto
   - Actualización de HP
   - Log de batalla
4. **Verificación de KO**: ¿Algún Pokémon derrotado?
5. **Siguiente Turno**: Continúa hasta que uno caiga

### 🎯 IA Básica

#### Estrategia de la IA
- **Priorización de Poder**: Prefiere movimientos con poder > 50
- **Aleatoriedad Inteligente**: Si hay múltiples movimientos potentes, elige aleatoriamente
- **Fallback**: Si no hay movimientos potentes, usa cualquiera disponible
- **Sin Predicción**: La IA no predice movimientos del oponente (básica)

#### Comportamiento
- Selección automática de movimientos cada turno
- No considera efectividad de tipos (IA simple)
- Útil para testeo rápido y simulaciones masivas

### 📊 Análisis Probabilístico

#### Simulaciones Masivas
- **1000 Batallas**: Ejecutadas instantáneamente en segundo plano
- **Mismas Condiciones**: Usa los Pokémon y movimientos seleccionados
- **Cálculo de Win Rate**: Porcentaje de victorias para cada lado

#### Visualización de Datos
- **Gráfico de Barras Vertical**: Muestra probabilidad de victoria
- **Código de Colores**:
  - Azul para Jugador 1
  - Rojo para Jugador 2
- **Porcentajes Precisos**: Calculados con 1 decimal

#### Estadísticas de Batalla
- **Daño Total Infligido**: Por cada combatiente
- **Número de Turnos**: Duración del combate
- **Golpes Críticos**: Conteo de críticos
- **HP Restante**: Salud del ganador al final

### 🎨 Interfaz de Usuario

#### Arena de Batalla
- **Fondo Animado**: Degradado púrpura con patrón circular
- **Sprites en Combate**: Tamaño grande (200×200px) con efectos
- **Animaciones**:
  - **Ataque**: Movimiento hacia adelante
  - **Impacto**: Parpadeo y retroceso
  - **Debilitado**: Escala de grises y opacidad

#### Barras de Salud
- **Visualización en Tiempo Real**: Animación suave
- **Código de Colores**:
  - Verde: > 50% HP
  - Naranja: 20-50% HP
  - Rojo: < 20% HP
- **Información Numérica**: HP actual / HP máximo

#### Battle Log
- **Scroll Automático**: Siempre muestra el último mensaje
- **Mensajes Categorizados**:
  - Normal: Fondo estándar
  - Crítico: Fondo amarillo
  - Súper Efectivo: Fondo verde
  - No Muy Efectivo: Fondo gris
- **Máximo 200px**: Con scroll para batallas largas

#### Pantalla de Resultados
- **Anuncio de Victoria**: Animación de rebote
- **Resumen Comparativo**: Dos tarjetas lado a lado
  - Verde para ganador
  - Rojo para perdedor
- **Análisis Probabilístico**: Sección dedicada con gráficos
- **Botones de Acción**:
  - 🔄 Revancha (mismos Pokémon)
  - ➕ Nueva Batalla (selección nueva)

### 💾 Datos y Persistencia

#### Carga desde PokeAPI
- **Lista de Pokémon**: 898 especies (Gen 1-8)
- **Datos Completos**:
  - Sprites (front_default)
  - Tipos (hasta 2)
  - Estadísticas base
  - Movimientos disponibles (primeros 20)
- **Detalles de Movimientos**:
  - Poder
  - Precisión
  - Tipo
  - Clase de daño
  - PP

#### Sin Persistencia
- No guarda batallas en localStorage (sesión temporal)
- Ideal para testeo rápido sin acumulación de datos
- Posible mejora futura: Historial de batallas

## 🎯 Casos de Uso

### 1. Testeo de Estrategias
**Escenario**: Quieres saber si tu Charizard puede derrotar a un Blastoise
- Selecciona Charizard con Flamethrower
- Selecciona Blastoise con Surf
- Ejecuta la batalla
- Analiza win rate probabilístico
- Ajusta movimientos y repite

### 2. Comparación de Pokémon
**Escenario**: ¿Quién es mejor, Gengar o Alakazam?
- Configura ambos con sus mejores movimientos
- Ejecuta múltiples simulaciones
- Revisa estadísticas de daño y turnos
- Toma decisión basada en datos

### 3. Análisis de Efectividad
**Escenario**: Verificar ventajas de tipos
- Pokémon tipo Agua vs tipo Fuego
- Observa mensajes de efectividad
- Confirma multiplicadores de daño
- Aprende sobre counters

### 4. Práctica Competitiva
**Escenario**: Entrenar para torneos
- Simula matchups comunes
- Prueba diferentes movimientos
- Identifica debilidades
- Optimiza selección de equipo

### 5. Demostración Educativa
**Escenario**: Enseñar mecánicas de combate
- Usa modo IA vs IA para demostración automática
- Muestra cálculos de daño en tiempo real
- Explica sistema de tipos con ejemplos visuales
- Analiza probabilidades con estudiantes

## 🔧 Especificaciones Técnicas

### Arquitectura
- **Web Component**: `<pokemon-battle-simulator>`
- **Framework**: LitElement con reactive properties
- **Estilos**: CSS-in-JS con CSS3 avanzado
- **API**: PokeAPI v2

### Propiedades Reactivas
```javascript
{
  allPokemon: Array,           // Lista completa de Pokémon
  player1Pokemon: Object,       // Pokémon seleccionado J1
  player2Pokemon: Object,       // Pokémon seleccionado J2
  player1Moves: Array,          // Movimientos disponibles J1
  player2Moves: Array,          // Movimientos disponibles J2
  player1HP: Number,            // HP actual J1
  player2HP: Number,            // HP actual J2
  battleLog: Array,             // Registro de eventos
  battleActive: Boolean,        // Estado de batalla
  battleFinished: Boolean,      // Batalla terminada
  winner: String,               // 'player1' o 'player2'
  player1AI: Boolean,           // IA activada J1
  player2AI: Boolean,           // IA activada J2
  simulationResults: Object     // Resultados probabilísticos
}
```

### Métodos Principales
```javascript
// Configuración
loadPokemonList()           // Carga lista desde API
searchPokemon(query, player) // Búsqueda en tiempo real
selectPokemon(pokemon, player) // Selección y carga de datos
loadMoveDetails(moves, player) // Carga info de movimientos
selectMove(move, player)    // Selección de movimiento

// Combate
startBattle()               // Inicia la batalla
battleLoop()                // Loop principal de turnos
executeAttack(attacker)     // Ejecuta un ataque
calculateDamage(...)        // Calcula daño con fórmula
getTypeEffectiveness(...)   // Tabla de efectividad
checkBattleEnd()            // Verifica condiciones de fin

// Análisis
runProbabilitySimulation()  // Ejecuta 1000 simulaciones
simulateBattle()            // Simula una batalla completa

// UI
animateAttack(player)       // Animación de ataque
animateHit(player)          // Animación de impacto
addLog(message, class)      // Agrega entrada al log
```

### Performance
- **Carga Inicial**: ~500ms (lista de Pokémon)
- **Selección de Pokémon**: ~200ms (datos + movimientos)
- **Batalla**: Tiempo real con delays visuales
- **1000 Simulaciones**: ~50-100ms (sin animaciones)

### Responsive Design
- **Desktop** (>1024px): Layout de 2 columnas
- **Tablet** (768-1024px): Layout apilado
- **Mobile** (<768px): Vista compacta de una columna

## 🎨 Personalización

### Colores del Tema
```css
--battle-primary: #e74c3c;    /* Rojo de combate */
--battle-secondary: #c0392b;  /* Rojo oscuro */
--player1-color: #3498db;     /* Azul */
--player2-color: #e74c3c;     /* Rojo */
--success-color: #2ecc71;     /* Verde */
```

### Animaciones Configurables
- Duración de ataques: 500ms
- Duración de impactos: 500ms
- Delay entre turnos: 1500ms
- Transiciones de HP: 500ms

## 🚀 Mejoras Futuras Posibles

### Funcionalidad
- [ ] IA avanzada con evaluación de efectividad
- [ ] Soporte para habilidades Pokémon
- [ ] Items de combate (Berry, Potion, etc.)
- [ ] Condiciones de estado (Paralysis, Burn, etc.)
- [ ] Combates 2v2 o 3v3
- [ ] Mega evoluciones / Formas alternativas
- [ ] Guardado de equipos preconfigurados
- [ ] Historial de batallas

### UI/UX
- [ ] Modo pantalla completa
- [ ] Sonidos de combate
- [ ] Sprites animados
- [ ] Efectos de partículas
- [ ] Cámara lenta en momentos clave
- [ ] Replay de batallas
- [ ] Compartir resultados

### Análisis
- [ ] Gráficos de daño por turno
- [ ] Distribución de probabilidades
- [ ] Comparación con meta competitivo
- [ ] Recomendaciones de movimientos
- [ ] Análisis de type coverage

## 📱 Integración

### En Menú Principal
Tarjeta "Simulador de Combate":
- Icono: ⚔️
- Badge: "Hot"
- Colores: Rojo/Rojo oscuro
- Posición: Entre Shiny Tracker y Pokémon Aleatorio

### Navegación
```
Menú Principal → Simulador de Combate
  ↓
Configuración (Selección de Pokémon)
  ↓
Batalla (Arena animada)
  ↓
Resultados (Análisis probabilístico)
  ↓
Revancha / Nueva Batalla
```

## 🐛 Troubleshooting

**Los movimientos no cargan**
- Algunos Pokémon no tienen movimientos con daño en su lista inicial
- Solución: El sistema filtra automáticamente y muestra los disponibles

**La IA no ataca**
- Verifica que el Pokémon tenga movimientos seleccionables
- La IA elige automáticamente si no hay selección

**Las simulaciones dan 50/50**
- Pokémon muy equilibrados pueden dar resultados parejos
- Prueba con matchups más extremos para ver diferencias

**Animaciones lentas**
- Las animaciones tienen delays intencionales para visualización
- Son necesarias para seguir la batalla

## 📄 Licencia

Parte del proyecto Pokédex Lit. Los datos de Pokémon son propiedad de Nintendo/Game Freak/The Pokémon Company.

---

## 🎓 Notas de Desarrollo

### Fórmula de Daño Simplificada
La fórmula implementada es una versión simplificada de la fórmula oficial:
- No incluye: STAB, Weather, Critical multiplier exacto, Items
- Incluye: Nivel, Stats, Poder de movimiento, Efectividad, Críticos, Random
- Suficiente para testeo de estrategias básicas

### IA Simple vs Avanzada
La IA actual es intencionalmente simple:
- **Pro**: Rápida, predecible, útil para testeo
- **Con**: No optimiza, no considera tipos
- **Mejora futura**: Evaluación de efectividad, predicción de movimientos

### Limitaciones Conocidas
1. Solo considera un movimiento por Pokémon
2. No incluye habilidades pasivas
3. No simula condiciones de estado
4. Estadísticas base sin EVs/IVs
5. Nivel fijo (50) para todos los Pokémon

Estas limitaciones son intencionales para mantener el simulador simple y enfocado en testeo estratégico básico.
