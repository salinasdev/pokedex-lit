# Componente de Eventos Pokémon

Este componente muestra eventos actuales del mundo Pokémon obtenidos dinámicamente desde **Pokémon Blog RSS Feed** con sistema de filtrado por categorías.

## Características

- ✅ **Carga dinámica desde Pokémon Blog** - Noticias reales en tiempo real
- ✅ Sistema de categorías automático (Videojuegos, TCG, Pokémon GO, Anime, General)
- ✅ Filtrado dinámico de eventos
- ✅ Extracción automática de imágenes del RSS
- ✅ Detección inteligente de categorías por palabras clave
- ✅ Limpieza de HTML y formateo de texto
- ✅ Muestra noticias de los últimos 30 días
- ✅ Diseño responsive con grid adaptativo
- ✅ Soporte completo para modo oscuro
- ✅ Animaciones y transiciones suaves
- ✅ Loading states y manejo de errores

## Fuente de Datos

**API Utilizada**: RSS2JSON + Pokémon Blog
- **URL RSS**: `https://pokemonblog.com/feed/`
- **Convertidor**: `https://api.rss2json.com/v1/api.json`
- **Límite**: 50 noticias más recientes
- **Actualización**: En tiempo real al abrir el panel

## Detección Automática de Categorías

El sistema analiza el título y descripción de cada noticia para clasificarla automáticamente:

### 🎮 **Videojuegos**
Palabras clave: `scarlet`, `violet`, `sword`, `shield`, `game`, `nintendo`, `switch`, `tera raid`, `mystery gift`

### 📱 **Pokémon GO**
Palabras clave: `pokemon go`, `pokémon go`, `go event`

### 🃏 **TCG (Trading Card Game)**
Palabras clave: `tcg`, `trading card`, `card game`, `booster`, `expansion`

### 📺 **Anime**
Palabras clave: `anime`, `episode`, `series`, `horizons`, `ash`

### ⭐ **General**
Cualquier noticia que no coincida con las categorías anteriores

## Procesamiento de Datos

1. **Obtención**: Fetch del RSS convertido a JSON
2. **Extracción de imágenes**: Busca `<img>` tags en la descripción HTML
3. **Limpieza de HTML**: Elimina tags y convierte a texto plano
4. **Detección de categoría**: Análisis por palabras clave
5. **Filtrado temporal**: Solo noticias de los últimos 30 días
6. **Ordenamiento**: Por fecha más reciente primero

## Estructura de Datos

Cada evento tiene la siguiente estructura:

```javascript
{
    id: Number,              // ID único del evento
    title: String,           // Título del evento
    description: String,     // Descripción breve
    category: String,        // 'game' | 'tcg' | 'anime' | 'go' | 'general'
    date: String,           // Fecha inicio (formato: YYYY-MM-DD)
    dateEnd: String,        // Fecha fin (formato: YYYY-MM-DD)
    image: String,          // URL de la imagen
    link: String            // URL para más información
}
```

## Integración con APIs Reales

### Opción 1: Pokémon GO Events API (Niantic)
```javascript
async fetchPokemonGOEvents() {
    const response = await fetch('https://pokemongolive.com/api/events');
    const data = await response.json();
    return data.events.map(event => ({
        id: event.id,
        title: event.name,
        description: event.description,
        category: 'go',
        date: event.start_time,
        dateEnd: event.end_time,
        image: event.image_url,
        link: `https://pokemongolive.com/events/${event.id}`
    }));
}
```

### Opción 2: Serebii.net RSS Feed
```javascript
async fetchSerebiiNews() {
    // Usar un proxy CORS si es necesario
    const RSS_URL = 'https://www.serebii.net/news.rss';
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}`);
    const data = await response.json();
    
    return data.items.map((item, index) => ({
        id: `serebii-${index}`,
        title: item.title,
        description: item.description.substring(0, 200) + '...',
        category: this.detectCategory(item.title),
        date: new Date(item.pubDate).toISOString().split('T')[0],
        dateEnd: new Date(item.pubDate).toISOString().split('T')[0],
        image: item.thumbnail || 'default-image-url',
        link: item.link
    }));
}
```

### Opción 3: Pokémon Official API
```javascript
async fetchOfficialEvents() {
    const response = await fetch('https://www.pokemon.com/api/events');
    const data = await response.json();
    
    return data.results.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category: this.mapCategory(event.type),
        date: event.start_date,
        dateEnd: event.end_date,
        image: event.image_url,
        link: event.url
    }));
}
```

### Opción 4: Datos desde Backend Propio
```javascript
async fetchEventsFromBackend() {
    const response = await fetch('http://tu-servidor.com/api/pokemon-events');
    const data = await response.json();
    return data;
}
```

## Implementación de API Real

Para conectar con una API real, modifica el método `fetchEventsData()` en `pokemon-events.js`:

```javascript
async fetchEventsData() {
    try {
        // Reemplaza esto con tu API real
        const response = await fetch('TU_API_URL');
        
        if (!response.ok) {
            throw new Error('Error al obtener eventos');
        }
        
        const data = await response.json();
        
        // Asegúrate de mapear los datos al formato esperado
        return data.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            category: event.category,
            date: event.date,
            dateEnd: event.dateEnd,
            image: event.image,
            link: event.link
        }));
        
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}
```

## APIs Recomendadas

1. **Pokémon GO Live**: https://pokemongolive.com/api
2. **Serebii.net**: https://www.serebii.net (RSS Feed)
3. **Bulbapedia API**: Para eventos de juegos principales
4. **RSS2JSON**: https://rss2json.com (Para convertir RSS a JSON)
5. **PokéAPI**: https://pokeapi.co (Limitado para eventos)

## Manejo de CORS

Si encuentras problemas de CORS, considera:

1. **Usar un proxy CORS**:
```javascript
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const response = await fetch(CORS_PROXY + API_URL);
```

2. **Crear tu propio backend proxy**
3. **Usar servicios como Cloudflare Workers**

## Actualización Automática

Para actualizar eventos automáticamente:

```javascript
connectedCallback() {
    super.connectedCallback();
    this.loadEvents();
    
    // Actualizar cada hora
    this.updateInterval = setInterval(() => {
        this.loadEvents();
    }, 3600000); // 1 hora = 3600000ms
}

disconnectedCallback() {
    super.disconnectedCallback();
    if (this.updateInterval) {
        clearInterval(this.updateInterval);
    }
}
```

## Caché con LocalStorage

Para mejorar el rendimiento:

```javascript
async loadEvents() {
    const cacheKey = 'pokemon-events-cache';
    const cacheTime = 'pokemon-events-cache-time';
    const CACHE_DURATION = 3600000; // 1 hora
    
    const cached = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(cacheTime);
    
    if (cached && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age < CACHE_DURATION) {
            this.events = JSON.parse(cached);
            this.loading = false;
            return;
        }
    }
    
    // Si no hay caché o está expirado, obtener nuevos datos
    const events = await this.fetchEventsData();
    localStorage.setItem(cacheKey, JSON.stringify(events));
    localStorage.setItem(cacheTime, Date.now().toString());
    this.events = events;
}
```

## Personalización

### Añadir nuevas categorías:

1. Añadir en el método `getCategoryLabel()`:
```javascript
getCategoryLabel(category) {
    const labels = {
        'game': '🎮 Videojuegos',
        'tcg': '🃏 TCG',
        'anime': '📺 Anime',
        'go': '📱 Pokémon GO',
        'general': '⭐ General',
        'nuevaCategoria': '🆕 Nueva Categoría'  // Añadir aquí
    };
    return labels[category] || category;
}
```

2. Añadir estilos en CSS:
```css
.category-nuevaCategoria {
    background: linear-gradient(135deg, #color1 0%, #color2 100%);
    color: white;
}
```

## Soporte

Para más información sobre el componente o reportar issues:
- Repository: https://github.com/salinasdev/pokedex-lit
- Issues: https://github.com/salinasdev/pokedex-lit/issues
