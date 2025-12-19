# 🌟 Pokemon Shiny Tracker

Componente interactivo para rastrear y gestionar tus cazas de Pokémon shiny.

## ✨ Características

### 📊 Estadísticas Generales
- **Cazas Totales**: Contador de todas las cazas registradas
- **Cazas Completadas**: Número de shinies encontrados
- **Encuentros Totales**: Suma de todos los encuentros
- **Promedio por Shiny**: Encuentros promedio para encontrar un shiny

### 🎯 Métodos de Caza Soportados
1. **Encuentro Aleatorio** (1/4096) - Método estándar
2. **Método Masuda** (1/683) - Crianza con Pokémon de diferentes idiomas
3. **Cadena SOS** (1/315) - Gen 7, llamar refuerzos
4. **Safari Amigo** (1/585) - Gen 6, Friend Safari
5. **DexNav** (1/512) - Gen 6, buscar con DexNav
6. **Poké Radar** (1/99) - Cadena con Poké Radar
7. **Soft Reset** (1/4096) - Reinicio suave para legendarios
8. **Cadena de Pesca** (1/100) - Pesca consecutiva
9. **Horda** (1/820) - Encuentros en horda
10. **Ultraumbral** (1/36) - Ultra Wormholes en Gen 7

### 🔧 Funcionalidades

#### Gestión de Cazas
- ➕ **Nueva Caza**: Crea una nueva caza shiny
  - Búsqueda de Pokémon con autocompletado
  - Selección de método de caza
  - Fecha de inicio
  - Contador de encuentros inicial
  - Notas personalizadas

- ✏️ **Editar Caza**: Modifica cazas existentes
- 🗑️ **Eliminar Caza**: Elimina cazas completadas o abandonadas

#### Seguimiento de Progreso
- **+1 Encuentro**: Incrementa el contador rápidamente
- **✨ ¡Encontrado!**: Marca la caza como completada
- **Calculador de Probabilidades**: Muestra la probabilidad acumulada de encontrar el shiny

#### Filtros y Búsqueda
- 🔍 Filtro por método de caza
- 🎯 Filtro por estado (Activas/Completadas/Todas)
- 🔎 Búsqueda por nombre de Pokémon

#### Exportación de Datos
- 💾 Exporta todas tus cazas en formato JSON
- Backup de tus datos locales

## 📈 Calculador de Probabilidades

El tracker incluye un calculador automático que muestra:
- **Probabilidad Acumulada**: Chance de haber encontrado el shiny después de X encuentros
- **Odds Base**: Probabilidad del método seleccionado
- **Barra de Progreso Visual**: Representación visual de la probabilidad

### Fórmula
```
P(al menos 1 shiny) = 1 - (1 - 1/odds)^encuentros
```

## 💾 Almacenamiento

Los datos se guardan localmente en `localStorage` bajo la clave `shiny-hunts`:
```javascript
{
  id: number,
  pokemonName: string,
  pokemonId: number,
  method: string,
  encounters: number,
  startDate: string (YYYY-MM-DD),
  completed: boolean,
  completedDate: string | null,
  notes: string
}
```

## 🎨 Diseño

### Tarjetas de Caza
- **Activas**: Borde normal con stats y probabilidades
- **Completadas**: Borde verde con ícono ✨ animado
- Hover effect con elevación 3D
- Imágenes oficiales de sprites de Pokémon

### Colores por Método
Cada método tiene su propio badge de color distintivo:
- Púrpura para métodos estándar
- Dorado para métodos de alta probabilidad
- Degradados animados en hover

### Responsive
- Grid adaptativo: `minmax(350px, 1fr)`
- Vista móvil optimizada con una columna
- Botones apilados en pantallas pequeñas

## 🚀 Uso

### Crear una Nueva Caza
1. Click en "➕ Nueva Caza"
2. Busca el Pokémon (escribe al menos 2 letras)
3. Selecciona de la lista desplegable
4. Elige el método de caza
5. Opcionalmente ajusta encuentros iniciales y fecha
6. Guarda

### Durante la Caza
1. Cada encuentro: Click en "+1"
2. Observa la probabilidad acumulada
3. Cuando encuentres el shiny: Click en "✨ ¡Encontrado!"

### Gestión
- Filtra por método para ver cazas similares
- Filtra por estado para ver solo activas o completadas
- Busca por nombre para encontrar cazas específicas
- Exporta tus datos periódicamente como backup

## 📱 Vista de Estadísticas

Cuatro tarjetas principales:
- 🎯 **Cazas Totales**
- ✅ **Cazas Completadas**
- 👁️ **Encuentros Totales**
- 📊 **Promedio por Shiny**

Todas con animación hover y colores consistentes con el tema.

## ⚡ Optimizaciones

- Carga de lista de Pokémon una sola vez al inicializar
- Búsqueda con debounce implícito
- LocalStorage para persistencia instantánea
- Límite de 10 resultados en búsqueda para performance
- Actualización reactiva con LitElement

## 🎯 Casos de Uso

1. **Caza Casual**: Registra tus encuentros aleatorios mientras juegas
2. **Caza Dedicada**: Rastrea múltiples cazas simultáneas (Masuda, Radar, etc.)
3. **Análisis**: Revisa tus estadísticas y compara métodos
4. **Comunidad**: Exporta y comparte tus logros
5. **Histórico**: Mantén un registro de todos tus shinies encontrados

## 🔮 Mejoras Futuras Posibles

- [ ] Gráficos de progreso por tiempo
- [ ] Comparación de métodos (eficiencia)
- [ ] Integración con Pokédex para ver shinies capturados
- [ ] Notificaciones de logros (milestones)
- [ ] Temporizador/cronómetro de sesión
- [ ] Importación de datos desde JSON
- [ ] Modo oscuro/claro
- [ ] Sonidos al completar cazas
- [ ] Compartir en redes sociales
- [ ] Sincronización en la nube

## 🐛 Troubleshooting

**Los Pokémon no aparecen en la búsqueda**
- Verifica conexión a internet (usa PokeAPI)
- Espera unos segundos para la carga inicial

**No se guardan los datos**
- Verifica que el navegador permita localStorage
- Revisa el espacio disponible en localStorage

**Las imágenes no cargan**
- Sprites vienen de GitHub/PokeAPI
- Verifica conexión a internet

## 📄 Licencia

Parte del proyecto Pokédex Lit. Los sprites de Pokémon son propiedad de Nintendo/Game Freak/The Pokémon Company.
