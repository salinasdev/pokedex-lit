import { html, LitElement, css } from "lit";

class PokemonStats extends LitElement {

    static get properties(){
        return {
            allPokemon: {type: Array},
            selectedStat: {type: String},
            selectedGeneration: {type: String},
            topPokemon: {type: Array},
            loading: {type: Boolean},
            viewMode: {type: String}, // 'ranking' or 'comparison'
            pokemon1: {type: Object},
            pokemon2: {type: Object},
            searchQuery1: {type: String},
            searchQuery2: {type: String},
            searchResults1: {type: Array},
            searchResults2: {type: Array}
        };
    }

    constructor(){
        super();
        this.allPokemon = [];
        this.selectedStat = 'hp';
        this.selectedGeneration = 'all';
        this.topPokemon = [];
        this.loading = true;
        this.viewMode = 'ranking';
        this.pokemon1 = null;
        this.pokemon2 = null;
        this.searchQuery1 = '';
        this.searchQuery2 = '';
        this.searchResults1 = [];
        this.searchResults2 = [];
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadAllPokemon();
    }

    async loadAllPokemon() {
        this.loading = true;
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
            const data = await response.json();
            
            const pokemonPromises = data.results.map(async (pokemon) => {
                const detailResponse = await fetch(pokemon.url);
                return await detailResponse.json();
            });

            this.allPokemon = await Promise.all(pokemonPromises);
            this.updateRankings();
        } catch (error) {
            console.error('Error loading Pokemon:', error);
        }
        this.loading = false;
    }

    updateRankings() {
        let filtered = [...this.allPokemon];

        // Filter by generation
        if (this.selectedGeneration !== 'all') {
            const genRanges = {
                '1': [1, 151],
                '2': [152, 251],
                '3': [252, 386],
                '4': [387, 493],
                '5': [494, 649],
                '6': [650, 721],
                '7': [722, 809],
                '8': [810, 905]
            };
            const [min, max] = genRanges[this.selectedGeneration];
            filtered = filtered.filter(p => p.id >= min && p.id <= max);
        }

        // Sort by selected stat
        const statMap = {
            'hp': 0,
            'attack': 1,
            'defense': 2,
            'special-attack': 3,
            'special-defense': 4,
            'speed': 5,
            'total': 'total'
        };

        filtered.sort((a, b) => {
            let valueA, valueB;
            
            if (this.selectedStat === 'total') {
                valueA = a.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
                valueB = b.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
            } else {
                const statIndex = statMap[this.selectedStat];
                valueA = a.stats[statIndex].base_stat;
                valueB = b.stats[statIndex].base_stat;
            }
            
            return valueB - valueA;
        });

        this.topPokemon = filtered.slice(0, 10);
    }

    handleStatChange(e) {
        this.selectedStat = e.target.value;
        this.updateRankings();
    }

    handleGenerationChange(e) {
        this.selectedGeneration = e.target.value;
        this.updateRankings();
    }

    handleViewModeChange(mode) {
        this.viewMode = mode;
    }

    handleSearchInput1(e) {
        this.searchQuery1 = e.target.value.toLowerCase();
        if (this.searchQuery1.length >= 2) {
            this.searchResults1 = this.allPokemon
                .filter(p => p.name.toLowerCase().includes(this.searchQuery1))
                .slice(0, 10);
        } else {
            this.searchResults1 = [];
        }
    }

    handleSearchInput2(e) {
        this.searchQuery2 = e.target.value.toLowerCase();
        if (this.searchQuery2.length >= 2) {
            this.searchResults2 = this.allPokemon
                .filter(p => p.name.toLowerCase().includes(this.searchQuery2))
                .slice(0, 10);
        } else {
            this.searchResults2 = [];
        }
    }

    selectPokemon1(pokemon) {
        this.pokemon1 = pokemon;
        this.searchQuery1 = pokemon.name;
        this.searchResults1 = [];
    }

    selectPokemon2(pokemon) {
        this.pokemon2 = pokemon;
        this.searchQuery2 = pokemon.name;
        this.searchResults2 = [];
    }

    clearPokemon1() {
        this.pokemon1 = null;
        this.searchQuery1 = '';
        this.searchResults1 = [];
    }

    clearPokemon2() {
        this.pokemon2 = null;
        this.searchQuery2 = '';
        this.searchResults2 = [];
    }

    getStatValue(pokemon, statName) {
        if (statName === 'total') {
            return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        }
        const statMap = {
            'hp': 0,
            'attack': 1,
            'defense': 2,
            'special-attack': 3,
            'special-defense': 4,
            'speed': 5
        };
        return pokemon.stats[statMap[statName]].base_stat;
    }

    getStatColor(statName) {
        const colors = {
            'hp': '#FF5959',
            'attack': '#F5AC78',
            'defense': '#FAE078',
            'special-attack': '#9DB7F5',
            'special-defense': '#A7DB8D',
            'speed': '#FA92B2',
            'total': '#7C538C'
        };
        return colors[statName] || '#999';
    }

    getStatLabel(statName) {
        const labels = {
            'hp': 'HP',
            'attack': 'Ataque',
            'defense': 'Defensa',
            'special-attack': 'At. Especial',
            'special-defense': 'Def. Especial',
            'speed': 'Velocidad',
            'total': 'Total'
        };
        return labels[statName] || statName;
    }

    renderRankingView() {
        if (this.loading) {
            return html`
                <div class="loading-container">
                    <div class="pokeball-loader"></div>
                    <p>Cargando estadísticas de Pokémon...</p>
                </div>
            `;
        }

        const maxStat = Math.max(...this.topPokemon.map(p => this.getStatValue(p, this.selectedStat)));

        return html`
            <div class="ranking-container">
                <div class="controls">
                    <div class="control-group">
                        <label>Estadística:</label>
                        <select @change="${this.handleStatChange}" .value="${this.selectedStat}">
                            <option value="hp">HP</option>
                            <option value="attack">Ataque</option>
                            <option value="defense">Defensa</option>
                            <option value="special-attack">At. Especial</option>
                            <option value="special-defense">Def. Especial</option>
                            <option value="speed">Velocidad</option>
                            <option value="total">Total</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Generación:</label>
                        <select @change="${this.handleGenerationChange}" .value="${this.selectedGeneration}">
                            <option value="all">Todas</option>
                            <option value="1">Gen I</option>
                            <option value="2">Gen II</option>
                            <option value="3">Gen III</option>
                            <option value="4">Gen IV</option>
                            <option value="5">Gen V</option>
                            <option value="6">Gen VI</option>
                            <option value="7">Gen VII</option>
                            <option value="8">Gen VIII</option>
                        </select>
                    </div>
                </div>

                <div class="ranking-header">
                    <h2>🏆 Top 10 - ${this.getStatLabel(this.selectedStat)}</h2>
                </div>

                <div class="ranking-list">
                    ${this.topPokemon.map((pokemon, index) => {
                        const statValue = this.getStatValue(pokemon, this.selectedStat);
                        const percentage = (statValue / maxStat) * 100;
                        const statColor = this.getStatColor(this.selectedStat);
                        
                        return html`
                            <div class="ranking-item">
                                <div class="rank-badge ${index < 3 ? 'top-three' : ''}">${index + 1}</div>
                                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-sprite">
                                <div class="pokemon-info">
                                    <div class="pokemon-name">${pokemon.name}</div>
                                    <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
                                </div>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${percentage}%; background: ${statColor};">
                                        <span class="stat-value">${statValue}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    })}
                </div>
            </div>
        `;
    }

    renderComparisonView() {
        if (this.loading) {
            return html`<div class="loading-container">Cargando...</div>`;
        }

        const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
        
        return html`
            <div class="comparison-container">
                <h2>⚔️ Comparador de Pokémon</h2>
                <p class="comparison-description">Selecciona dos Pokémon para comparar sus estadísticas</p>
                
                <div class="pokemon-selector-grid">
                    <!-- Selector Pokémon 1 -->
                    <div class="pokemon-selector">
                        <h3>Pokémon 1</h3>
                        ${!this.pokemon1 ? html`
                            <div class="search-box">
                                <input 
                                    type="text" 
                                    placeholder="Buscar Pokémon..."
                                    .value="${this.searchQuery1}"
                                    @input="${this.handleSearchInput1}"
                                    class="pokemon-search-input"
                                />
                                ${this.searchResults1.length > 0 ? html`
                                    <div class="search-results">
                                        ${this.searchResults1.map(pokemon => html`
                                            <div class="search-result-item" @click="${() => this.selectPokemon1(pokemon)}">
                                                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                                                <span>${pokemon.name}</span>
                                                <span class="result-id">#${pokemon.id}</span>
                                            </div>
                                        `)}
                                    </div>
                                ` : ''}
                            </div>
                        ` : html`
                            <div class="selected-pokemon">
                                <button class="clear-btn" @click="${this.clearPokemon1}">✕</button>
                                <img src="${this.pokemon1.sprites.front_default}" alt="${this.pokemon1.name}" class="selected-sprite">
                                <h3 class="selected-name">${this.pokemon1.name}</h3>
                                <span class="selected-id">#${this.pokemon1.id.toString().padStart(3, '0')}</span>
                                <div class="selected-types">
                                    ${this.pokemon1.types.map(t => html`
                                        <span class="type-badge">${t.type.name}</span>
                                    `)}
                                </div>
                            </div>
                        `}
                    </div>

                    <!-- Selector Pokémon 2 -->
                    <div class="pokemon-selector">
                        <h3>Pokémon 2</h3>
                        ${!this.pokemon2 ? html`
                            <div class="search-box">
                                <input 
                                    type="text" 
                                    placeholder="Buscar Pokémon..."
                                    .value="${this.searchQuery2}"
                                    @input="${this.handleSearchInput2}"
                                    class="pokemon-search-input"
                                />
                                ${this.searchResults2.length > 0 ? html`
                                    <div class="search-results">
                                        ${this.searchResults2.map(pokemon => html`
                                            <div class="search-result-item" @click="${() => this.selectPokemon2(pokemon)}">
                                                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                                                <span>${pokemon.name}</span>
                                                <span class="result-id">#${pokemon.id}</span>
                                            </div>
                                        `)}
                                    </div>
                                ` : ''}
                            </div>
                        ` : html`
                            <div class="selected-pokemon">
                                <button class="clear-btn" @click="${this.clearPokemon2}">✕</button>
                                <img src="${this.pokemon2.sprites.front_default}" alt="${this.pokemon2.name}" class="selected-sprite">
                                <h3 class="selected-name">${this.pokemon2.name}</h3>
                                <span class="selected-id">#${this.pokemon2.id.toString().padStart(3, '0')}</span>
                                <div class="selected-types">
                                    ${this.pokemon2.types.map(t => html`
                                        <span class="type-badge">${t.type.name}</span>
                                    `)}
                                </div>
                            </div>
                        `}
                    </div>
                </div>

                ${this.pokemon1 && this.pokemon2 ? html`
                    <div class="comparison-stats">
                        <h3>📊 Comparación de Estadísticas</h3>
                        <div class="stats-comparison-list">
                            ${stats.map(stat => {
                                const value1 = this.getStatValue(this.pokemon1, stat);
                                const value2 = this.getStatValue(this.pokemon2, stat);
                                const maxValue = Math.max(value1, value2);
                                const percentage1 = (value1 / maxValue) * 100;
                                const percentage2 = (value2 / maxValue) * 100;
                                const statColor = this.getStatColor(stat);
                                
                                return html`
                                    <div class="stat-comparison-row">
                                        <div class="stat-label">${this.getStatLabel(stat)}</div>
                                        <div class="stat-bars">
                                            <div class="comparison-bar left">
                                                <span class="comparison-value">${value1}</span>
                                                <div class="comparison-bar-fill" style="width: ${percentage1}%; background: ${statColor};"></div>
                                            </div>
                                            <div class="comparison-bar right">
                                                <div class="comparison-bar-fill" style="width: ${percentage2}%; background: ${statColor};"></div>
                                                <span class="comparison-value">${value2}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            })}
                            <div class="stat-comparison-row total-row">
                                <div class="stat-label">Total</div>
                                <div class="stat-bars">
                                    <div class="comparison-bar left">
                                        <span class="comparison-value">${this.getStatValue(this.pokemon1, 'total')}</span>
                                        <div class="comparison-bar-fill" style="width: ${(this.getStatValue(this.pokemon1, 'total') / Math.max(this.getStatValue(this.pokemon1, 'total'), this.getStatValue(this.pokemon2, 'total'))) * 100}%; background: ${this.getStatColor('total')};"></div>
                                    </div>
                                    <div class="comparison-bar right">
                                        <div class="comparison-bar-fill" style="width: ${(this.getStatValue(this.pokemon2, 'total') / Math.max(this.getStatValue(this.pokemon1, 'total'), this.getStatValue(this.pokemon2, 'total'))) * 100}%; background: ${this.getStatColor('total')};"></div>
                                        <span class="comparison-value">${this.getStatValue(this.pokemon2, 'total')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : html`
                    <div class="empty-comparison">
                        <p>👆 Selecciona dos Pokémon para ver su comparación</p>
                    </div>
                `}
            </div>
        `;
    }

    render(){
        return html`
            <div class="stats-container">
                <div class="stats-header">
                    <h1>📊 Estadísticas y Rankings</h1>
                    <div class="view-toggle">
                        <button 
                            class="toggle-btn ${this.viewMode === 'ranking' ? 'active' : ''}"
                            @click="${() => this.handleViewModeChange('ranking')}">
                            🏆 Rankings
                        </button>
                        <button 
                            class="toggle-btn ${this.viewMode === 'comparison' ? 'active' : ''}"
                            @click="${() => this.handleViewModeChange('comparison')}">
                            📊 Comparación
                        </button>
                    </div>
                </div>

                ${this.viewMode === 'ranking' ? this.renderRankingView() : this.renderComparisonView()}
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            padding: 2rem;
            background-color: var(--bg-primary, #f5f5f5);
            min-height: 100vh;
        }

        .stats-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .stats-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .stats-header h1 {
            color: var(--text-primary, #333);
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
        }

        .view-toggle {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .toggle-btn {
            background: var(--bg-card, white);
            border: 2px solid var(--border-color, #e0e0e0);
            padding: 0.8rem 2rem;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            color: var(--text-primary, #333);
        }

        .toggle-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .toggle-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
        }

        .loading-container {
            text-align: center;
            padding: 4rem;
            color: var(--text-primary, #333);
        }

        .pokeball-loader {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            border: 4px solid var(--border-color, #e0e0e0);
            border-top: 4px solid #EF5350;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .ranking-container {
            background: var(--bg-card, white);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 10px 30px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .controls {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .control-group label {
            font-weight: 600;
            color: var(--text-secondary, #666);
            font-size: 0.9rem;
        }

        .control-group select {
            padding: 0.8rem 1.2rem;
            border: 2px solid var(--input-border, #e0e0e0);
            border-radius: 10px;
            background: var(--input-bg, white);
            color: var(--text-primary, #333);
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .control-group select:focus {
            outline: none;
            border-color: #667eea;
        }

        .ranking-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--border-color, #e0e0e0);
        }

        .ranking-header h2 {
            color: var(--text-primary, #333);
            font-size: 1.8rem;
            margin: 0;
        }

        .ranking-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .ranking-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-hover, #f8fafc);
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .ranking-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .rank-badge {
            font-size: 1.5rem;
            font-weight: 800;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-card, white);
            border-radius: 50%;
            color: var(--text-secondary, #666);
            box-shadow: 0 2px 8px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .rank-badge.top-three {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: white;
        }

        .pokemon-sprite {
            width: 60px;
            height: 60px;
            image-rendering: pixelated;
        }

        .pokemon-info {
            flex: 0 0 150px;
        }

        .pokemon-name {
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--text-primary, #333);
            text-transform: capitalize;
        }

        .pokemon-id {
            color: var(--text-secondary, #666);
            font-size: 0.9rem;
        }

        .stat-bar-container {
            flex: 1;
            height: 40px;
            background: var(--bg-secondary, #e0e0e0);
            border-radius: 20px;
            overflow: hidden;
            position: relative;
        }

        .stat-bar {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 1rem;
            transition: width 0.5s ease;
            position: relative;
        }

        .stat-value {
            font-weight: 800;
            color: white;
            font-size: 1.1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .comparison-container {
            padding: 2rem;
        }

        .comparison-container h2 {
            text-align: center;
            color: var(--text-primary, #333);
            margin-bottom: 0.5rem;
        }

        .comparison-description {
            text-align: center;
            color: var(--text-secondary, #666);
            margin-bottom: 2rem;
            font-size: 1rem;
        }

        .pokemon-selector-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .pokemon-selector {
            background: var(--bg-card, white);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .pokemon-selector h3 {
            color: var(--text-primary, #333);
            margin: 0 0 1rem 0;
            text-align: center;
            font-size: 1.2rem;
        }

        .search-box {
            position: relative;
        }

        .pokemon-search-input {
            width: 100%;
            padding: 0.8rem;
            border: 2px solid var(--border-color, #e0e0e0);
            border-radius: 8px;
            font-size: 1rem;
            background: var(--input-bg, white);
            color: var(--text-primary, #333);
            box-sizing: border-box;
        }

        .pokemon-search-input:focus {
            outline: none;
            border-color: var(--input-border-focus, #4a5568);
        }

        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-card, white);
            border: 2px solid var(--border-color, #e0e0e0);
            border-radius: 8px;
            margin-top: 0.5rem;
            max-height: 300px;
            overflow-y: auto;
            z-index: 10;
            box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.2));
        }

        .search-result-item {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.8rem;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .search-result-item:hover {
            background: var(--bg-hover, #f8fafc);
        }

        .search-result-item img {
            width: 40px;
            height: 40px;
        }

        .search-result-item span {
            flex: 1;
            font-weight: 600;
            color: var(--text-primary, #333);
            text-transform: capitalize;
        }

        .result-id {
            color: var(--text-secondary, #666);
            font-size: 0.9rem;
        }

        .selected-pokemon {
            position: relative;
            text-align: center;
            padding: 2rem 1rem;
        }

        .clear-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--bg-secondary, #f5f5f5);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--text-secondary, #666);
            transition: all 0.3s ease;
        }

        .clear-btn:hover {
            background: #ff4444;
            color: white;
            transform: scale(1.1);
        }

        .selected-sprite {
            width: 120px;
            height: 120px;
            margin: 0 auto;
        }

        .selected-name {
            color: var(--text-primary, #333);
            margin: 0.5rem 0;
            text-transform: capitalize;
            font-size: 1.5rem;
        }

        .selected-id {
            color: var(--text-secondary, #666);
            font-weight: 600;
            font-size: 1.1rem;
        }

        .selected-types {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            margin-top: 1rem;
        }

        .type-badge {
            padding: 0.3rem 0.8rem;
            border-radius: 8px;
            background: var(--bg-secondary, #e0e0e0);
            color: var(--text-primary, #333);
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: capitalize;
        }

        .comparison-stats {
            background: var(--bg-card, white);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .comparison-stats h3 {
            color: var(--text-primary, #333);
            text-align: center;
            margin: 0 0 2rem 0;
            font-size: 1.5rem;
        }

        .stats-comparison-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .stat-comparison-row {
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 1rem;
            align-items: center;
        }

        .stat-comparison-row.total-row {
            border-top: 3px solid var(--border-color, #e0e0e0);
            padding-top: 1.5rem;
            margin-top: 0.5rem;
        }

        .stat-comparison-row .stat-label {
            font-weight: 700;
            color: var(--text-primary, #333);
            font-size: 1.1rem;
        }

        .stat-bars {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .comparison-bar {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            height: 35px;
        }

        .comparison-bar.left {
            justify-content: flex-end;
        }

        .comparison-bar.right {
            justify-content: flex-start;
        }

        .comparison-value {
            font-weight: 800;
            font-size: 1.1rem;
            color: var(--text-primary, #333);
            min-width: 40px;
            text-align: center;
        }

        .comparison-bar-fill {
            height: 100%;
            border-radius: 8px;
            transition: width 0.8s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .comparison-bar.left .comparison-bar-fill {
            margin-left: auto;
        }

        .comparison-bar.right .comparison-bar-fill {
            margin-right: auto;
        }

        .empty-comparison {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary, #666);
            font-size: 1.2rem;
        }

        @media (max-width: 768px) {
            :host {
                padding: 1rem;
            }

            .stats-header h1 {
                font-size: 1.8rem;
            }

            .ranking-item {
                flex-wrap: wrap;
            }

            .pokemon-info {
                flex: 0 0 100px;
            }

            .stat-bar-container {
                flex: 1 1 100%;
            }

            .pokemon-selector-grid {
                grid-template-columns: 1fr;
            }

            .stat-comparison-row {
                grid-template-columns: 1fr;
                gap: 0.5rem;
            }

            .stat-bars {
                grid-template-columns: 1fr;
            }
        }
    `;
}

customElements.define('pokemon-stats', PokemonStats);
