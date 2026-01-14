# 🏆 Modo Torneo Pokémon

## Descripción

El **Modo Torneo** es una funcionalidad completa que te permite competir en torneos de Pokémon con oponentes aleatorios generados por el sistema. Elige tu Pokémon favorito y demuestra que eres el mejor entrenador.

## Características Principales

### 🎯 Configuración del Torneo

- **Selección de Tamaño**: Elige entre torneos de 8, 16 o 32 participantes
- **Nombre de Entrenador**: Personaliza tu nombre de entrenador
- **Selección de Pokémon**: Elige tu Pokémon desde una lista completa con búsqueda integrada

### ⚡ Generación Automática de Oponentes

El sistema genera automáticamente oponentes con:
- **Pokémon aleatorios** de toda la primera generación
- **Habilidades aleatorias** (incluyendo habilidades ocultas)
- **Objetos equipados aleatorios** (entre 14 opciones disponibles)
- **Movimientos aleatorios** (4 movimientos por Pokémon)

### 🎮 Sistema de Bracket

- Bracket de eliminación simple
- Visualización clara de:
  - Ronda actual (Cuartos, Semifinales, Final)
  - Combates completados y pendientes
  - Ganadores de cada enfrentamiento
- Indicador visual del jugador (icono 👤)
- Progreso del torneo en tiempo real

### ⚔️ Simulación de Batallas

- Sistema de batalla integrado (actualmente simulado)
- Favorece ligeramente al jugador (60% probabilidad de victoria)
- Batallas CPU vs CPU completamente automáticas
- Progresión automática al siguiente combate

### 📊 Sistema de Ranking

El ranking persiste usando **localStorage** y registra:
- **Pokémon campeón** con sprite e ID
- **Nombre del entrenador**
- **Número de victorias** en torneos
- **Fecha de última victoria**

#### Características del Ranking:
- Top 3 con medallas especiales (🥇🥈🥉)
- Diseño con degradados especiales para los primeros lugares
- Ordenado por número de victorias
- Visualización de sprite del Pokémon
- Información del entrenador

### 🎨 Interfaz de Usuario

#### Pantalla de Configuración
- Grid responsive para selección de tamaño
- Buscador de Pokémon con filtrado en tiempo real
- Grid de tarjetas de Pokémon con sprites oficiales
- Validación antes de iniciar torneo

#### Pantalla de Bracket
- Vista de todas las rondas del torneo
- Combate actual destacado
- Información detallada de cada participante:
  - Sprite del Pokémon
  - Nombre
  - Habilidad equipada
  - Objeto equipado
- Indicadores visuales de ganadores/perdedores
- Barra de progreso del torneo

#### Pantalla de Resultados
- Trofeo animado para el campeón
- Display del Pokémon ganador con degradado dorado
- Estadísticas del torneo:
  - Número de participantes
  - Total de batallas
  - Número de rondas
- Botones para:
  - Nuevo torneo
  - Ver ranking

#### Pantalla de Ranking
- Lista completa de campeones
- Diseño especial para top 3
- Información detallada por entrada
- Botón para volver al inicio

## Tecnologías Utilizadas

- **LitElement**: Framework base para Web Components
- **CSS Grid & Flexbox**: Layout responsive
- **localStorage**: Persistencia de ranking
- **PokeAPI**: Datos de Pokémon en tiempo real
- **CSS Animations**: Efectos visuales (bounce, hover, transitions)

## Objetos Disponibles

Los oponentes pueden equipar cualquiera de estos objetos:

| Objeto | Efecto |
|--------|--------|
| Restos (Leftovers) | Recupera 1/16 HP por turno |
| Cinta Elegida (Choice Band) | +50% Ataque, bloqueado en un movimiento |
| Gafas Elegidas (Choice Specs) | +50% At. Especial, bloqueado |
| Pañuelo Elegido (Choice Scarf) | +50% Velocidad, bloqueado |
| Orbe Vida (Life Orb) | +30% daño, 10% recoil |
| Cinta Experto (Expert Belt) | +20% en ataques super efectivos |
| Banda Focus (Focus Sash) | Sobrevive con 1 HP desde full HP |
| Cinta Focus (Focus Band) | 10% chance de sobrevivir con 1 HP |
| Carbón (Charcoal) | +20% daño tipo Fuego 🔥 |
| Agua Mística (Mystic Water) | +20% daño tipo Agua 💧 |
| Semilla Milagro (Miracle Seed) | +20% daño tipo Planta 🌿 |
| Imán (Magnet) | +20% daño tipo Eléctrico ⚡ |
| Baya Sitrus (Sitrus Berry) | Cura 25% HP al llegar a 50% |
| Baya Lum (Lum Berry) | Cura problemas de estado |

## Habilidades Implementadas

Los Pokémon pueden tener cualquiera de sus habilidades naturales, incluyendo las ocultas, como:

- **Espesura / Mar Llamas / Torrente**: 1.5× daño al estar bajo de HP
- **Levitación**: Inmune a ataques de tipo Tierra
- **Intimidación**: Reduce ataque del oponente al entrar
- **Robustez**: Sobrevive con 1 HP a golpes letales desde full HP
- **Experto**: 1.5× daño en movimientos de potencia ≤60
- **Potencia**: Duplica el ataque físico
- Y muchas más...

## Flujo de Juego

1. **Configuración**
   - Ingresa tu nombre
   - Selecciona tamaño del torneo (8/16/32)
   - Elige tu Pokémon (con búsqueda)
   
2. **Generación**
   - Sistema genera oponentes aleatorios
   - Asigna habilidades y objetos a todos
   - Crea el bracket inicial

3. **Competición**
   - Avanza ronda por ronda
   - Inicia batallas manualmente
   - Sistema simula el combate
   - Avance automático al siguiente match

4. **Finalización**
   - Pantalla de resultados
   - Actualización del ranking (si ganas)
   - Opción de nuevo torneo o ver ranking

## Posibles Mejoras Futuras

- [ ] Integración real con el simulador de combates
- [ ] Replay de batallas anteriores
- [ ] Estadísticas detalladas por Pokémon
- [ ] Exportar/importar ranking
- [ ] Torneos multijugador
- [ ] Sistema de trofeos y logros
- [ ] Modo "Desafío" con reglas especiales
- [ ] Guardar historial de torneos completos
- [ ] Análisis de matchups (ventajas de tipos)
- [ ] Modo "Random Team" (equipo aleatorio completo)

## Arquitectura del Código

```
pokemon-tournament/
├── pokemon-tournament.js    # Componente principal
└── index.js                 # Exportación

Propiedades principales:
- tournamentState: 'setup' | 'bracket' | 'results' | 'ranking'
- tournamentSize: 8 | 16 | 32
- playerPokemon: Object
- opponents: Array
- bracket: Array (estructura de rondas)
- ranking: Array (persistido en localStorage)
```

## Integración con la Pokedex

El modo torneo está completamente integrado con la aplicación principal:

1. **Menú Principal**: Nueva tarjeta con badge "¡Nuevo!"
2. **Navegación**: Botón "Volver al Menú Principal"
3. **Estilos Consistentes**: Diseño coherente con el resto de la app
4. **Responsive**: Funciona en móvil, tablet y escritorio

## Capturas de Pantalla

(Aquí irían las capturas de pantalla una vez que pruebes la funcionalidad)

## Notas de Desarrollo

- El sistema de batallas actualmente está simulado
- La probabilidad de victoria del jugador es del 60%
- El ranking se guarda en `localStorage` con la clave `pokemon-tournament-ranking`
- Los Pokémon se cargan de la primera generación (151 Pokémon)
- Las batallas CPU vs CPU son automáticas y aleatorias

---

¡Diviértete compitiendo y convirtiéndote en el Campeón del Torneo Pokémon! 🏆⚡
