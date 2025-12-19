import { LitElement, html, css } from 'lit';

export class PokemonTeamBuilder extends LitElement {
    static properties = {
        team: { type: Array },
        searchQuery: { type: String },
        searchResults: { type: Array },
        searching: { type: Boolean },
        selectedSlot: { type: Number },
        showSearch: { type: Boolean },
        teamAnalysis: { type: Object },
        showAnalysis: { type: Boolean },
        allPokemon: { type: Array },
        pokemonLoaded: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .team-builder-container {
            padding: 2rem;
            background: var(--bg-primary, #f8f9fa);
            min-height: 100vh;
        }

        .team-builder-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .team-builder-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-primary, #1a1a1a);
            margin: 0 0 0.5rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .team-builder-subtitle {
            font-size: 1.1rem;
            color: var(--text-secondary, #718096);
            margin: 0;
        }

        .team-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            max-width: 1200px;
            margin: 0 auto 2rem;
        }

        .team-slot {
            background: var(--bg-card, white);
            border-radius: 20px;
            padding: 1.5rem;
            border: 3px dashed var(--border-color, #e2e8f0);
            min-height: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .team-slot:hover {
            border-color: #667eea;
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
        }

        .team-slot.filled {
            border-style: solid;
            border-color: #48bb78;
        }

        .slot-number {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            background: var(--bg-primary, #f8f9fa);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: var(--text-secondary, #718096);
            font-size: 0.9rem;
        }

        .remove-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: #f56565;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }

        .remove-btn:hover {
            background: #c53030;
            transform: scale(1.1);
        }

        .pokemon-in-slot {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .pokemon-image {
            width: 120px;
            height: 120px;
            object-fit: contain;
            margin-bottom: 0.5rem;
        }

        .pokemon-name {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin-bottom: 0.5rem;
            text-transform: capitalize;
        }

        .pokemon-types {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .type-badge {
            padding: 0.3rem 0.8rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 700;
            color: white;
            text-transform: uppercase;
        }

        .empty-slot {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            color: var(--text-secondary, #718096);
        }

        .empty-icon {
            font-size: 3rem;
        }

        .add-text {
            font-size: 1rem;
            font-weight: 600;
        }

        .action-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            max-width: 1200px;
            margin: 0 auto 2rem;
        }

        .action-btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 16px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .analyze-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .analyze-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .clear-btn {
            background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(245, 101, 101, 0.4);
        }

        .clear-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 101, 101, 0.6);
        }

        .export-btn {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
        }

        .export-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(72, 187, 120, 0.6);
        }

        /* Modal de búsqueda */
        .search-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 2rem;
        }

        .search-content {
            background: var(--bg-card, white);
            border-radius: 20px;
            width: 100%;
            max-width: 800px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .search-header {
            padding: 1.5rem;
            border-bottom: 2px solid var(--border-color, #e2e8f0);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .search-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin: 0;
        }

        .close-search-btn {
            background: #f56565;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .close-search-btn:hover {
            background: #c53030;
            transform: rotate(90deg);
        }

        .search-input-container {
            padding: 1rem 1.5rem;
            border-bottom: 2px solid var(--border-color, #e2e8f0);
        }

        .search-input {
            width: 100%;
            padding: 1rem;
            border: 2px solid var(--border-color, #e2e8f0);
            border-radius: 12px;
            font-size: 1rem;
            background: var(--bg-primary, #f8f9fa);
            color: var(--text-primary, #2d3748);
            transition: all 0.3s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-results {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
        }

        .result-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
        }

        .result-item {
            background: var(--bg-primary, #f8f9fa);
            border-radius: 12px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 2px solid transparent;
        }

        .result-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: #667eea;
        }

        .result-image {
            width: 80px;
            height: 80px;
            object-fit: contain;
        }

        .result-name {
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin-top: 0.5rem;
            text-transform: capitalize;
            text-align: center;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--border-color, #e2e8f0);
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 2rem auto;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Análisis de equipo */
        .analysis-section {
            max-width: 1200px;
            margin: 0 auto;
            background: var(--bg-card, white);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .analysis-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin: 0 0 1.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .weakness-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .weakness-card {
            background: var(--bg-primary, #f8f9fa);
            border-radius: 12px;
            padding: 1rem;
            border-left: 4px solid;
        }

        .weakness-card.critical {
            border-color: #f56565;
            background: linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(245, 101, 101, 0.05) 100%);
        }

        .weakness-card.warning {
            border-color: #ed8936;
            background: linear-gradient(135deg, rgba(237, 137, 54, 0.1) 0%, rgba(237, 137, 54, 0.05) 100%);
        }

        .weakness-card.good {
            border-color: #48bb78;
            background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(72, 187, 120, 0.05) 100%);
        }

        .weakness-type {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }

        .weakness-count {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .weakness-label {
            font-size: 0.85rem;
            color: var(--text-secondary, #718096);
        }

        .coverage-section {
            margin-top: 2rem;
        }

        .coverage-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin-bottom: 1rem;
        }

        .type-coverage {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        @media (max-width: 768px) {
            .team-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .action-buttons {
                flex-direction: column;
            }

            .result-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .team-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    constructor() {
        super();
        this.team = [null, null, null, null, null, null];
        this.searchQuery = '';
        this.searchResults = [];
        this.searching = false;
        this.selectedSlot = null;
        this.showSearch = false;
        this.teamAnalysis = null;
        this.showAnalysis = false;
        this.allPokemon = []; // Cache de todos los Pokémon
        this.pokemonLoaded = false;
        this.searchTimeout = null; // Para debouncing
        
        // Cargar equipo guardado
        this.loadTeam();
        // Cargar lista de Pokémon al iniciar
        this.loadPokemonList();
    }

    async loadPokemonList() {
        try {
            // Obtener lista completa de nombres (muy rápido, una sola petición)
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898');
            const data = await response.json();
            
            // Extraer ID del URL y crear la lista
            this.allPokemon = data.results.map((p, index) => ({
                id: index + 1,
                name: p.name,
                url: p.url
            }));
            
            this.pokemonLoaded = true;
            console.log('Lista de Pokémon cargada:', this.allPokemon.length);
        } catch (error) {
            console.error('Error loading Pokemon list:', error);
        }
    }

    loadTeam() {
        const saved = localStorage.getItem('pokemon-team');
        if (saved) {
            try {
                this.team = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading team:', e);
            }
        }
    }

    saveTeam() {
        localStorage.setItem('pokemon-team', JSON.stringify(this.team));
    }

    openSearch(slotIndex) {
        this.selectedSlot = slotIndex;
        this.showSearch = true;
        this.searchQuery = '';
        this.searchResults = [];
    }

    closeSearch() {
        this.showSearch = false;
        this.selectedSlot = null;
        this.searchQuery = '';
        this.searchResults = [];
    }

    async handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase().trim();
        
        if (this.searchQuery.length < 2) {
            this.searchResults = [];
            return;
        }

        if (!this.pokemonLoaded) {
            this.searching = true;
            this.requestUpdate();
            return;
        }

        // Debouncing: esperar 300ms antes de buscar
        clearTimeout(this.searchTimeout);
        this.searching = true;
        this.requestUpdate();

        this.searchTimeout = setTimeout(async () => {
            await this.performSearch();
        }, 300);
    }

    async performSearch() {
        try {
            // Buscar en la lista cargada (instantáneo)
            const matches = this.allPokemon.filter(p => 
                p.name.includes(this.searchQuery) || 
                String(p.id).includes(this.searchQuery)
            ).slice(0, 30); // Limitar a 30 resultados

            // Cargar sprites solo de los resultados (paralelo, muy rápido)
            const resultsPromises = matches.map(async (p) => {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`);
                    const pokemon = await response.json();
                    return {
                        id: pokemon.id,
                        name: pokemon.name,
                        sprite: pokemon.sprites.front_default,
                        types: pokemon.types.map(t => t.type.name)
                    };
                } catch (err) {
                    return null;
                }
            });

            const results = await Promise.all(resultsPromises);
            this.searchResults = results.filter(r => r !== null);
        } catch (error) {
            console.error('Error searching Pokemon:', error);
        } finally {
            this.searching = false;
            this.requestUpdate();
        }
    }

    async selectPokemon(pokemonData) {
        try {
            // Obtener datos completos del Pokémon
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonData.id}`);
            const fullData = await response.json();

            const pokemon = {
                id: fullData.id,
                name: fullData.name,
                sprite: fullData.sprites.other['official-artwork'].front_default || fullData.sprites.front_default,
                types: fullData.types.map(t => t.type.name),
                stats: fullData.stats.map(s => ({
                    name: s.stat.name,
                    value: s.base_stat
                }))
            };

            this.team[this.selectedSlot] = pokemon;
            this.saveTeam();
            this.closeSearch();
            this.requestUpdate();
        } catch (error) {
            console.error('Error selecting Pokemon:', error);
        }
    }

    removePokemon(slotIndex) {
        this.team[slotIndex] = null;
        this.saveTeam();
        this.requestUpdate();
    }

    clearTeam() {
        if (confirm('¿Seguro que quieres borrar todo el equipo?')) {
            this.team = [null, null, null, null, null, null];
            this.saveTeam();
            this.showAnalysis = false;
            this.requestUpdate();
        }
    }

    analyzeTeam() {
        const filledSlots = this.team.filter(p => p !== null);
        
        if (filledSlots.length === 0) {
            alert('Añade al menos un Pokémon para analizar el equipo');
            return;
        }

        // Análisis de tipos
        const typeEffectiveness = this.calculateTypeEffectiveness(filledSlots);
        const coverage = this.calculateTypeCoverage(filledSlots);

        this.teamAnalysis = {
            pokemonCount: filledSlots.length,
            weaknesses: typeEffectiveness.weaknesses,
            resistances: typeEffectiveness.resistances,
            immunities: typeEffectiveness.immunities,
            coverage: coverage
        };

        this.showAnalysis = true;
        this.requestUpdate();
    }

    calculateTypeEffectiveness(pokemon) {
        // Tabla de efectividad simplificada (los tipos atacantes más comunes)
        const types = [
            'normal', 'fire', 'water', 'electric', 'grass', 'ice',
            'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
            'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
        ];

        const weaknesses = {};
        const resistances = {};
        const immunities = {};

        types.forEach(type => {
            let vulnerableCount = 0;
            let resistantCount = 0;
            let immuneCount = 0;

            pokemon.forEach(p => {
                const effectiveness = this.getTypeEffectiveness(type, p.types);
                if (effectiveness > 1) vulnerableCount++;
                else if (effectiveness < 1 && effectiveness > 0) resistantCount++;
                else if (effectiveness === 0) immuneCount++;
            });

            if (vulnerableCount > 0) weaknesses[type] = vulnerableCount;
            if (resistantCount > 0) resistances[type] = resistantCount;
            if (immuneCount > 0) immunities[type] = immuneCount;
        });

        return { weaknesses, resistances, immunities };
    }

    getTypeEffectiveness(attackType, defenseTypes) {
        // Tabla de efectividad simplificada
        const chart = {
            normal: { rock: 0.5, ghost: 0, steel: 0.5 },
            fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
            water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
            electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
            grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
            ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
            fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
            poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
            ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
            flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
            psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
            bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
            rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
            ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
            dragon: { dragon: 2, steel: 0.5, fairy: 0 },
            dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
            steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
            fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
        };

        let effectiveness = 1;
        defenseTypes.forEach(defType => {
            if (chart[attackType] && chart[attackType][defType] !== undefined) {
                effectiveness *= chart[attackType][defType];
            }
        });

        return effectiveness;
    }

    calculateTypeCoverage(pokemon) {
        const typesInTeam = new Set();
        pokemon.forEach(p => {
            p.types.forEach(type => typesInTeam.add(type));
        });
        return Array.from(typesInTeam);
    }

    exportTeam() {
        const filledPokemon = this.team.filter(p => p !== null);
        
        if (filledPokemon.length === 0) {
            alert('No hay Pokémon en el equipo para exportar');
            return;
        }

        // Formato simple de texto
        let exportText = '=== Mi Equipo Pokémon ===\n\n';
        filledPokemon.forEach((p, index) => {
            exportText += `${index + 1}. ${this.capitalizeFirst(p.name)}\n`;
            exportText += `   Tipos: ${p.types.map(t => this.capitalizeFirst(t)).join(', ')}\n`;
            exportText += `   Stats:\n`;
            p.stats.forEach(s => {
                exportText += `     - ${this.capitalizeFirst(s.name)}: ${s.value}\n`;
            });
            exportText += '\n';
        });

        // Copiar al portapapeles
        navigator.clipboard.writeText(exportText).then(() => {
            alert('¡Equipo copiado al portapapeles!');
        }).catch(() => {
            // Mostrar en un alert si falla el clipboard
            alert(exportText);
        });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getTypeColor(type) {
        const colors = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };
        return colors[type] || '#777';
    }

    render() {
        return html`
            <div class="team-builder-container">
                <div class="team-builder-header">
                    <h1 class="team-builder-title">👥 Constructor de Equipos</h1>
                    <p class="team-builder-subtitle">Crea tu equipo perfecto y analiza sus fortalezas y debilidades</p>
                </div>

                <div class="team-grid">
                    ${this.team.map((pokemon, index) => html`
                        <div class="team-slot ${pokemon ? 'filled' : ''}" 
                             @click="${() => this.openSearch(index)}">
                            <div class="slot-number">${index + 1}</div>
                            
                            ${pokemon ? html`
                                <button class="remove-btn" 
                                        @click="${(e) => { e.stopPropagation(); this.removePokemon(index); }}"
                                        title="Eliminar">
                                    ×
                                </button>
                                <div class="pokemon-in-slot">
                                    <img class="pokemon-image" 
                                         src="${pokemon.sprite}" 
                                         alt="${pokemon.name}">
                                    <div class="pokemon-name">${this.capitalizeFirst(pokemon.name)}</div>
                                    <div class="pokemon-types">
                                        ${pokemon.types.map(type => html`
                                            <span class="type-badge" 
                                                  style="background: ${this.getTypeColor(type)}">
                                                ${type}
                                            </span>
                                        `)}
                                    </div>
                                </div>
                            ` : html`
                                <div class="empty-slot">
                                    <div class="empty-icon">➕</div>
                                    <div class="add-text">Añadir Pokémon</div>
                                </div>
                            `}
                        </div>
                    `)}
                </div>

                <div class="action-buttons">
                    <button class="action-btn analyze-btn" 
                            @click="${this.analyzeTeam}"
                            ?disabled="${this.team.filter(p => p !== null).length === 0}">
                        📊 Analizar Equipo
                    </button>
                    <button class="action-btn export-btn" 
                            @click="${this.exportTeam}"
                            ?disabled="${this.team.filter(p => p !== null).length === 0}">
                        📤 Exportar Equipo
                    </button>
                    <button class="action-btn clear-btn" 
                            @click="${this.clearTeam}"
                            ?disabled="${this.team.filter(p => p !== null).length === 0}">
                        🗑️ Limpiar Todo
                    </button>
                </div>

                ${this.showAnalysis && this.teamAnalysis ? html`
                    <div class="analysis-section">
                        <h2 class="analysis-title">📈 Análisis del Equipo</h2>
                        
                        <h3 class="coverage-title">🛡️ Debilidades del Equipo</h3>
                        <div class="weakness-grid">
                            ${Object.entries(this.teamAnalysis.weaknesses)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 6)
                                .map(([type, count]) => html`
                                <div class="weakness-card ${count >= 4 ? 'critical' : count >= 2 ? 'warning' : 'good'}">
                                    <div class="weakness-type" style="color: ${this.getTypeColor(type)}">
                                        ${this.capitalizeFirst(type)}
                                    </div>
                                    <div class="weakness-count" style="color: ${count >= 4 ? '#f56565' : count >= 2 ? '#ed8936' : '#48bb78'}">
                                        ${count}/${this.teamAnalysis.pokemonCount}
                                    </div>
                                    <div class="weakness-label">Pokémon vulnerables</div>
                                </div>
                            `)}
                        </div>

                        <div class="coverage-section">
                            <h3 class="coverage-title">⚔️ Cobertura de Tipos</h3>
                            <div class="type-coverage">
                                ${this.teamAnalysis.coverage.map(type => html`
                                    <span class="type-badge" style="background: ${this.getTypeColor(type)}">
                                        ${this.capitalizeFirst(type)}
                                    </span>
                                `)}
                            </div>
                        </div>

                        ${Object.keys(this.teamAnalysis.immunities).length > 0 ? html`
                            <div class="coverage-section">
                                <h3 class="coverage-title">🛡️ Inmunidades</h3>
                                <div class="type-coverage">
                                    ${Object.entries(this.teamAnalysis.immunities).map(([type, count]) => html`
                                        <span class="type-badge" style="background: ${this.getTypeColor(type)}">
                                            ${this.capitalizeFirst(type)} (${count})
                                        </span>
                                    `)}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                ${this.showSearch ? html`
                    <div class="search-modal" @click="${this.closeSearch}">
                        <div class="search-content" @click="${(e) => e.stopPropagation()}">
                            <div class="search-header">
                                <h3 class="search-title">Buscar Pokémon</h3>
                                <button class="close-search-btn" @click="${this.closeSearch}">×</button>
                            </div>

                            <div class="search-input-container">
                                <input 
                                    type="text" 
                                    class="search-input" 
                                    placeholder="Busca por nombre o número..."
                                    @input="${this.handleSearch}"
                                    .value="${this.searchQuery}">
                            </div>

                            <div class="search-results">
                                ${!this.pokemonLoaded ? html`
                                    <div style="text-align: center; padding: 2rem;">
                                        <div class="loading-spinner"></div>
                                        <p style="color: var(--text-secondary, #718096); margin-top: 1rem;">
                                            Cargando lista de Pokémon...
                                        </p>
                                    </div>
                                ` : this.searching ? html`
                                    <div class="loading-spinner"></div>
                                ` : this.searchResults.length > 0 ? html`
                                    <div class="result-grid">
                                        ${this.searchResults.map(pokemon => html`
                                            <div class="result-item" 
                                                 @click="${() => this.selectPokemon(pokemon)}">
                                                <img class="result-image" 
                                                     src="${pokemon.sprite}" 
                                                     alt="${pokemon.name}">
                                                <div class="result-name">
                                                    ${this.capitalizeFirst(pokemon.name)}
                                                </div>
                                            </div>
                                        `)}
                                    </div>
                                ` : this.searchQuery.length >= 2 ? html`
                                    <p style="text-align: center; color: var(--text-secondary, #718096); padding: 2rem;">
                                        No se encontraron resultados
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('pokemon-team-builder', PokemonTeamBuilder);
