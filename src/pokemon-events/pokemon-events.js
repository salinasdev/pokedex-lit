import { LitElement, html, css } from 'lit';

export class PokemonEvents extends LitElement {
    static properties = {
        events: { type: Array },
        loading: { type: Boolean },
        error: { type: String },
        selectedCategory: { type: String },
        isOpen: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
        }

        .events-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .events-overlay.open {
            opacity: 1;
            pointer-events: all;
        }

        .events-container {
            position: absolute;
            top: 0;
            right: 0;
            width: 600px;
            max-width: 90vw;
            height: 100vh;
            background: var(--bg-primary, #f8f9fa);
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            pointer-events: all;
            display: flex;
            flex-direction: column;
        }

        .events-container.open {
            transform: translateX(0);
        }

        .events-header-bar {
            position: sticky;
            top: 0;
            background: var(--bg-card, white);
            padding: 1.5rem;
            border-bottom: 2px solid var(--border-color, #e2e8f0);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .close-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.5rem;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .close-button:hover {
            transform: rotate(90deg) scale(1.1);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }

        .events-content {
            padding: 1.5rem;
            flex: 1;
        }

        .events-header {
            text-align: center;
            margin-bottom: 1.5rem;
        }

        .events-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary, #1a1a1a);
            margin: 0 0 0.5rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .events-subtitle {
            font-size: 0.95rem;
            color: var(--text-secondary, #718096);
            margin: 0;
        }

        .category-filter {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
        }

        .category-btn {
            padding: 0.5rem 1rem;
            border: 2px solid var(--border-color, #e2e8f0);
            background: var(--bg-card, white);
            color: var(--text-primary, #2d3748);
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .category-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .category-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
        }

        .events-grid {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .event-card {
            background: var(--bg-card, white);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 2px solid var(--border-color, #e2e8f0);
        }

        .event-card:hover {
            transform: translateX(-8px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .event-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            background: var(--bg-image-container, #f0f0f0);
        }

        .event-content {
            padding: 1.25rem;
        }

        .event-category {
            display: inline-block;
            padding: 0.35rem 0.7rem;
            border-radius: 16px;
            font-size: 0.75rem;
            font-weight: 700;
            margin-bottom: 0.6rem;
        }

        .category-game {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }

        .category-tcg {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }

        .category-anime {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: white;
        }

        .category-go {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            color: white;
        }

        .category-general {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            color: #2d3748;
        }

        .event-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin: 0 0 0.6rem 0;
            line-height: 1.3;
        }

        .event-description {
            color: var(--text-secondary, #718096);
            font-size: 0.9rem;
            line-height: 1.5;
            margin: 0 0 0.8rem 0;
        }

        .event-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 0.8rem;
            border-top: 2px solid var(--border-color, #e2e8f0);
        }

        .event-date {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: var(--text-secondary, #718096);
            font-size: 0.85rem;
            font-weight: 600;
        }

        .event-link {
            padding: 0.4rem 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 16px;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.3s ease;
        }

        .event-link:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .loading-container {
            text-align: center;
            padding: 4rem 2rem;
        }

        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 5px solid var(--border-color, #e2e8f0);
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .loading-text {
            color: var(--text-secondary, #718096);
            font-size: 1.1rem;
        }

        .error-container {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-primary, #2d3748);
        }

        .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        .error-text {
            font-size: 1.2rem;
            font-weight: 600;
        }

        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary, #718096);
        }

        .empty-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
            .events-container {
                width: 100vw;
                max-width: 100vw;
            }

            .events-title {
                font-size: 1.5rem;
            }

            .category-filter {
                gap: 0.4rem;
            }

            .category-btn {
                padding: 0.4rem 0.8rem;
                font-size: 0.8rem;
            }

            .event-image {
                height: 120px;
            }
        }
    `;

    constructor() {
        super();
        this.events = [];
        this.loading = true;
        this.error = null;
        this.selectedCategory = 'all';
        this.isOpen = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadEvents();
    }

    open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    async loadEvents() {
        this.loading = true;
        this.error = null;

        try {
            // Intentar cargar eventos desde RSS
            const eventsData = await this.fetchEventsData();
            this.events = eventsData;
            console.log('✓ Eventos cargados desde Serebii.net RSS');
        } catch (err) {
            console.error('⚠️ Error cargando eventos desde RSS:', err.message);
            
            // Si falla, dejar el array vacío y mostrar mensaje de error
            this.events = [];
            this.error = 'No se pudieron cargar los eventos desde Serebii.net. Por favor, intenta más tarde.';
        } finally {
            this.loading = false;
        }
    }

    async fetchEventsData() {
        try {
            // Usamos RSS2JSON para convertir el RSS de Serebii a JSON
            const RSS_URL = 'https://www.serebii.net/news.rss';
            const API_KEY = 'seo9oy0y6wvmdkrr4tvvkerwp35ikirjm5pmm9im';
            const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&api_key=${API_KEY}&count=50`;
            
            console.log('Fetching events from Serebii.net RSS...');
            console.log('API URL:', API_URL);
            
            const response = await fetch(API_URL);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('RSS data received:', data);
            
            if (data.status !== 'ok') {
                console.error('RSS2JSON error:', data);
                throw new Error(`RSS2JSON error: ${data.message || 'Unknown error'}`);
            }
            
            if (!data.items || data.items.length === 0) {
                console.warn('No items found in RSS feed');
                return [];
            }
            
            console.log(`Processing ${data.items.length} items from RSS...`);
            
            // Convertir items RSS a formato de eventos
            const allEvents = data.items.map((item, index) => {
                const pubDate = new Date(item.pubDate);
                
                // Detectar categoría basándose en el título y descripción
                const category = this.detectCategoryFromContent(item.title, item.description);
                
                // Extraer imagen si existe en la descripción HTML
                const imageUrl = this.extractImageFromHtml(item.description) || 
                                'https://images.unsplash.com/photo-1542779283-429940ce8336?w=500';
                
                // Limpiar descripción de HTML
                const cleanDescription = this.stripHtml(item.description).substring(0, 200) + '...';
                
                return {
                    id: `serebii-${index}-${pubDate.getTime()}`,
                    title: item.title,
                    description: cleanDescription,
                    category: category,
                    date: pubDate.toISOString().split('T')[0],
                    dateEnd: pubDate.toISOString().split('T')[0],
                    image: imageUrl,
                    link: item.link
                };
            });

            // Filtrar solo eventos actuales y futuros
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const currentAndFutureEvents = allEvents.filter(event => {
                const eventEndDate = new Date(event.dateEnd);
                eventEndDate.setHours(23, 59, 59, 999);
                // Mostrar noticias de los últimos 30 días y futuras
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return eventEndDate >= thirtyDaysAgo;
            });

            // Ordenar por fecha más reciente primero
            currentAndFutureEvents.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            console.log(`Loaded ${currentAndFutureEvents.length} events from Serebii`);
            return currentAndFutureEvents;
            
        } catch (error) {
            console.error('Error fetching events from Serebii:', error);
            console.error('Error details:', error.message, error.stack);
            // En caso de error, devolver array vacío en lugar de simular datos
            throw error;
        }
    }

    detectCategoryFromContent(title, description) {
        const text = `${title} ${description}`.toLowerCase();
        
        // Detectar por palabras clave
        if (text.includes('pokemon go') || text.includes('pokémon go') || text.includes('go event')) {
            return 'go';
        }
        if (text.includes('tcg') || text.includes('trading card') || text.includes('card game') || 
            text.includes('booster') || text.includes('expansion')) {
            return 'tcg';
        }
        if (text.includes('anime') || text.includes('episode') || text.includes('series') || 
            text.includes('horizons') || text.includes('ash')) {
            return 'anime';
        }
        if (text.includes('scarlet') || text.includes('violet') || text.includes('sword') || 
            text.includes('shield') || text.includes('game') || text.includes('nintendo') || 
            text.includes('switch') || text.includes('tera raid') || text.includes('mystery gift')) {
            return 'game';
        }
        
        return 'general';
    }

    extractImageFromHtml(html) {
        // Intentar extraer la primera imagen del HTML
        const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
            let imgUrl = imgMatch[1];
            // Si es una URL relativa, hacerla absoluta
            if (imgUrl.startsWith('/')) {
                imgUrl = 'https://www.serebii.net' + imgUrl;
            } else if (!imgUrl.startsWith('http')) {
                imgUrl = 'https://www.serebii.net/' + imgUrl;
            }
            return imgUrl;
        }
        return null;
    }

    stripHtml(html) {
        // Eliminar tags HTML y decodificar entidades
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    filterEvents(category) {
        this.selectedCategory = category;
    }

    getFilteredEvents() {
        if (this.selectedCategory === 'all') {
            return this.events;
        }
        return this.events.filter(event => event.category === this.selectedCategory);
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    getCategoryLabel(category) {
        const labels = {
            'game': '🎮 Videojuegos',
            'tcg': '🃏 TCG',
            'anime': '📺 Anime',
            'go': '📱 Pokémon GO',
            'general': '⭐ General'
        };
        return labels[category] || category;
    }

    render() {
        const filteredEvents = this.getFilteredEvents();

        return html`
            <div class="events-overlay ${this.isOpen ? 'open' : ''}" @click="${this.close}"></div>
            <div class="events-container ${this.isOpen ? 'open' : ''}">
                <div class="events-header-bar">
                    <h2 style="margin: 0; color: var(--text-primary, #1a1a1a); font-size: 1.5rem;">
                        🎉 Eventos Pokémon
                    </h2>
                    <button class="close-button" @click="${this.close}" title="Cerrar">
                        ✕
                    </button>
                </div>

                <div class="events-content">
                    ${this.loading ? html`
                        <div class="loading-container">
                            <div class="loading-spinner"></div>
                            <p class="loading-text">Cargando eventos...</p>
                        </div>
                    ` : this.error ? html`
                        <div class="error-container">
                            <div class="error-icon">⚠️</div>
                            <p class="error-text">${this.error}</p>
                        </div>
                    ` : html`
                        <div class="events-header">
                            <p class="events-subtitle">Descubre eventos actuales y próximos del mundo Pokémon</p>
                        </div>

                        <div class="category-filter">
                            <button 
                                class="category-btn ${this.selectedCategory === 'all' ? 'active' : ''}"
                                @click="${() => this.filterEvents('all')}">
                                Todos
                            </button>
                            <button 
                                class="category-btn ${this.selectedCategory === 'game' ? 'active' : ''}"
                                @click="${() => this.filterEvents('game')}">
                                🎮 Juegos
                            </button>
                            <button 
                                class="category-btn ${this.selectedCategory === 'tcg' ? 'active' : ''}"
                                @click="${() => this.filterEvents('tcg')}">
                                🃏 TCG
                            </button>
                            <button 
                                class="category-btn ${this.selectedCategory === 'go' ? 'active' : ''}"
                                @click="${() => this.filterEvents('go')}">
                                📱 GO
                            </button>
                            <button 
                                class="category-btn ${this.selectedCategory === 'anime' ? 'active' : ''}"
                                @click="${() => this.filterEvents('anime')}">
                                📺 Anime
                            </button>
                            <button 
                                class="category-btn ${this.selectedCategory === 'general' ? 'active' : ''}"
                                @click="${() => this.filterEvents('general')}">
                                ⭐ General
                            </button>
                        </div>

                        ${filteredEvents.length === 0 ? html`
                            <div class="empty-state">
                                <div class="empty-icon">🔍</div>
                                <p>No hay eventos en esta categoría</p>
                            </div>
                        ` : html`
                            <div class="events-grid">
                                ${filteredEvents.map(event => html`
                                    <div class="event-card">
                                        <img 
                                            class="event-image" 
                                            src="${event.image}" 
                                            alt="${event.title}"
                                            @error="${(e) => e.target.src = 'https://via.placeholder.com/500x150/667eea/ffffff?text=Pokemon+Event'}"
                                        />
                                        <div class="event-content">
                                            <span class="event-category category-${event.category}">
                                                ${this.getCategoryLabel(event.category)}
                                            </span>
                                            <h2 class="event-title">${event.title}</h2>
                                            <p class="event-description">${event.description}</p>
                                            <div class="event-meta">
                                                <div class="event-date">
                                                    📅 ${this.formatDate(event.date)}
                                                    ${event.dateEnd !== event.date ? html` - ${this.formatDate(event.dateEnd)}` : ''}
                                                </div>
                                                <a class="event-link" href="${event.link}" target="_blank" rel="noopener">
                                                    Ver más
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        `}
                    `}
                </div>
            </div>
        `;
    }
}

customElements.define('pokemon-events', PokemonEvents);
