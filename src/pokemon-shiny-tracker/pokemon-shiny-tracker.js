import { LitElement, html, css } from 'lit';

export class PokemonShinyTracker extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .tracker-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .tracker-header {
            text-align: center;
            margin-bottom: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            border-radius: 20px;
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .tracker-title {
            font-size: 3em;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .shiny-icon {
            font-size: 4em;
            animation: sparkle 2s infinite;
        }

        @keyframes sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.1) rotate(-5deg); }
            75% { transform: scale(1.1) rotate(5deg); }
        }

        .tracker-subtitle {
            font-size: 1.2em;
            margin-top: 10px;
            opacity: 0.9;
        }

        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .stat-icon {
            font-size: 3em;
            margin-bottom: 10px;
        }

        .stat-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }

        .stat-label {
            color: #666;
            font-size: 1em;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .action-btn {
            flex: 1;
            min-width: 200px;
            padding: 15px 30px;
            border: none;
            border-radius: 12px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .btn-new-hunt {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-new-hunt:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-view-toggle {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }

        .btn-view-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(240, 147, 251, 0.4);
        }

        .btn-export {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }

        .btn-export:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(79, 172, 254, 0.4);
        }

        .hunts-container {
            margin-top: 30px;
        }

        .hunt-filters {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .filter-select, .filter-input {
            padding: 12px 20px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1em;
            transition: border-color 0.3s ease;
        }

        .filter-select:focus, .filter-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .hunts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }

        .hunt-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .hunt-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .hunt-card.completed {
            border: 3px solid #4caf50;
        }

        .hunt-card.completed::before {
            content: '✨';
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 2em;
            animation: sparkle 2s infinite;
        }

        .hunt-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }

        .hunt-image {
            width: 80px;
            height: 80px;
            object-fit: contain;
        }

        .hunt-info {
            flex: 1;
        }

        .hunt-name {
            font-size: 1.5em;
            font-weight: bold;
            color: #333;
            margin: 0;
        }

        .hunt-method {
            display: inline-block;
            padding: 5px 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 20px;
            font-size: 0.85em;
            margin-top: 5px;
        }

        .hunt-stats {
            margin: 15px 0;
        }

        .hunt-stat-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .hunt-stat-label {
            color: #666;
            font-weight: 500;
        }

        .hunt-stat-value {
            font-weight: bold;
            color: #667eea;
        }

        .hunt-progress {
            margin: 15px 0;
        }

        .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 0.9em;
            color: #666;
        }

        .progress-bar {
            width: 100%;
            height: 10px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
        }

        .hunt-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .hunt-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .btn-increment {
            background: #4caf50;
            color: white;
        }

        .btn-increment:hover {
            background: #45a049;
        }

        .btn-complete {
            background: #ffd700;
            color: #333;
        }

        .btn-complete:hover {
            background: #ffed4e;
        }

        .btn-delete {
            background: #f44336;
            color: white;
        }

        .btn-delete:hover {
            background: #da190b;
        }

        .btn-edit {
            background: #2196F3;
            color: white;
        }

        .btn-edit:hover {
            background: #0b7dda;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-header {
            margin-bottom: 30px;
        }

        .modal-title {
            font-size: 2em;
            color: #333;
            margin: 0;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
        }

        .form-input, .form-select {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1em;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
            background: white;
            color: #333;
        }

        .form-input:focus, .form-select:focus {
            outline: none;
            border-color: #667eea;
        }

        .pokemon-search-results {
            max-height: 200px;
            overflow-y: auto;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            margin-top: 10px;
            display: none;
            background: white;
        }

        .pokemon-search-results.show {
            display: block;
        }

        .pokemon-search-item {
            padding: 12px 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.3s ease;
            color: #333;
        }

        .pokemon-search-item:hover {
            background: #f5f5f5;
        }

        .pokemon-search-item img {
            width: 40px;
            height: 40px;
        }

        .modal-actions {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }

        .modal-btn {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-save {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-cancel {
            background: #e0e0e0;
            color: #333;
        }

        .btn-cancel:hover {
            background: #d0d0d0;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .empty-icon {
            font-size: 5em;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .empty-message {
            font-size: 1.5em;
            margin-bottom: 10px;
            color: #666;
        }

        .odds-calculator {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
        }

        .odds-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .odds-label {
            font-weight: bold;
            color: #666;
        }

        .odds-value {
            font-size: 1.1em;
            color: #667eea;
            font-weight: bold;
        }

        .probability-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 10px;
        }

        .probability-fill {
            height: 100%;
            background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
            transition: width 0.3s ease;
        }

        @media (max-width: 768px) {
            .tracker-title {
                font-size: 2em;
            }

            .action-buttons {
                flex-direction: column;
            }

            .action-btn {
                width: 100%;
            }

            .hunts-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Modo oscuro */
        @media (prefers-color-scheme: dark) {
            .stat-card {
                background: #2c3e50;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }

            .stat-card:hover {
                box-shadow: 0 6px 20px rgba(0,0,0,0.4);
            }

            .stat-value {
                color: #8b9dc3;
            }

            .stat-label {
                color: #bdc3c7;
            }

            .hunt-card {
                background: #2c3e50;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }

            .hunt-card:hover {
                box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            }

            .hunt-card.completed {
                border: 3px solid #2ecc71;
            }

            .hunt-image {
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
            }

            .hunt-name {
                color: #ecf0f1;
            }

            .hunt-stat-row {
                border-bottom: 1px solid #34495e;
            }

            .hunt-stat-label {
                color: #bdc3c7;
            }

            .hunt-stat-value {
                color: #8b9dc3;
            }

            .progress-label {
                color: #bdc3c7;
            }

            .progress-bar {
                background: #34495e;
            }

            .modal {
                background: #2c3e50;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            }

            .modal-title {
                color: #ecf0f1;
            }

            .form-label {
                color: #ecf0f1;
            }

            .form-input, .form-select {
                background: #1a252f;
                color: #ecf0f1;
                border: 2px solid #34495e;
            }

            .form-input:focus, .form-select:focus {
                border-color: #8b9dc3;
            }

            .pokemon-search-results {
                background: #1a252f;
                border: 2px solid #34495e;
            }

            .pokemon-search-item {
                color: #ecf0f1;
            }

            .pokemon-search-item:hover {
                background: #34495e;
            }

            .empty-state {
                color: #95a5a6;
            }

            .empty-icon {
                opacity: 0.5;
            }

            .empty-message {
                color: #bdc3c7;
            }

            .odds-calculator {
                background: #1a252f;
            }

            .odds-label {
                color: #bdc3c7;
            }

            .odds-value {
                color: #8b9dc3;
            }

            .modal-overlay {
                background: rgba(0, 0, 0, 0.8);
            }
        }
    `;

    static properties = {
        hunts: { type: Array },
        showModal: { type: Boolean },
        editingHunt: { type: Object },
        filterMethod: { type: String },
        filterStatus: { type: String },
        searchQuery: { type: String },
        viewMode: { type: String },
        allPokemon: { type: Array },
        searchResults: { type: Array },
        showSearchResults: { type: Boolean },
        selectedPokemon: { type: Object }
    };

    constructor() {
        super();
        this.hunts = this.loadHunts();
        this.showModal = false;
        this.editingHunt = null;
        this.filterMethod = 'all';
        this.filterStatus = 'all';
        this.searchQuery = '';
        this.viewMode = 'grid';
        this.allPokemon = [];
        this.searchResults = [];
        this.showSearchResults = false;
        this.selectedPokemon = null;
        this.loadPokemonList();
    }

    async loadPokemonList() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898');
            const data = await response.json();
            this.allPokemon = data.results;
        } catch (error) {
            console.error('Error loading Pokemon list:', error);
        }
    }

    loadHunts() {
        const saved = localStorage.getItem('shiny-hunts');
        return saved ? JSON.parse(saved) : [];
    }

    saveHunts() {
        localStorage.setItem('shiny-hunts', JSON.stringify(this.hunts));
        this.requestUpdate();
    }

    getTotalHunts() {
        return this.hunts.length;
    }

    getCompletedHunts() {
        return this.hunts.filter(h => h.completed).length;
    }

    getTotalEncounters() {
        return this.hunts.reduce((sum, h) => sum + h.encounters, 0);
    }

    getAverageEncounters() {
        const completed = this.hunts.filter(h => h.completed);
        if (completed.length === 0) return 0;
        const total = completed.reduce((sum, h) => sum + h.encounters, 0);
        return Math.round(total / completed.length);
    }

    getShinyMethods() {
        return [
            { value: 'random-encounter', label: 'Encuentro Aleatorio', odds: 4096 },
            { value: 'masuda-method', label: 'Método Masuda', odds: 683 },
            { value: 'sos-chain', label: 'Cadena SOS', odds: 315 },
            { value: 'friend-safari', label: 'Safari Amigo', odds: 585 },
            { value: 'dexnav', label: 'DexNav', odds: 512 },
            { value: 'pokeradar', label: 'Poké Radar', odds: 99 },
            { value: 'soft-reset', label: 'Soft Reset', odds: 4096 },
            { value: 'fishing-chain', label: 'Cadena de Pesca', odds: 100 },
            { value: 'horde-encounter', label: 'Horda', odds: 820 },
            { value: 'ultra-wormhole', label: 'Ultraumbral', odds: 36 },
            { value: 'shiny-charm-za', label: 'Amuleto Iris - Pokémon Leyendas Z-A', odds: 1024 }
        ];
    }

    getMethodInfo(methodValue) {
        return this.getShinyMethods().find(m => m.value === methodValue) || 
               { label: methodValue, odds: 4096 };
    }

    calculateProbability(encounters, odds) {
        // Probabilidad de encontrar al menos un shiny en X encuentros
        const probability = (1 - Math.pow(1 - (1/odds), encounters)) * 100;
        return probability.toFixed(2);
    }

    openNewHuntModal() {
        this.editingHunt = null;
        this.selectedPokemon = null;
        this.showModal = true;
    }

    openEditModal(hunt) {
        this.editingHunt = { ...hunt };
        this.selectedPokemon = {
            name: hunt.pokemonName,
            id: hunt.pokemonId
        };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingHunt = null;
        this.selectedPokemon = null;
        this.showSearchResults = false;
    }

    handlePokemonSearch(e) {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            this.showSearchResults = false;
            return;
        }

        this.searchResults = this.allPokemon
            .filter(p => p.name.toLowerCase().includes(query))
            .slice(0, 10);
        this.showSearchResults = true;
    }

    selectPokemon(pokemon) {
        const pokemonId = parseInt(pokemon.url.match(/\/(\d+)\//)[1]);
        this.selectedPokemon = {
            name: pokemon.name,
            id: pokemonId
        };
        this.showSearchResults = false;
        
        // Update the search input
        const searchInput = this.shadowRoot.querySelector('#pokemonSearch');
        if (searchInput) {
            searchInput.value = this.capitalizeFirstLetter(pokemon.name);
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    saveHunt(e) {
        e.preventDefault();
        
        if (!this.selectedPokemon) {
            alert('Por favor selecciona un Pokémon');
            return;
        }

        const formData = new FormData(e.target);
        const huntData = {
            id: this.editingHunt?.id || Date.now(),
            pokemonName: this.selectedPokemon.name,
            pokemonId: this.selectedPokemon.id,
            method: formData.get('method'),
            encounters: parseInt(formData.get('encounters')) || 0,
            startDate: formData.get('startDate') || new Date().toISOString().split('T')[0],
            completed: this.editingHunt?.completed || false,
            completedDate: this.editingHunt?.completedDate || null,
            notes: formData.get('notes') || ''
        };

        if (this.editingHunt) {
            const index = this.hunts.findIndex(h => h.id === this.editingHunt.id);
            this.hunts[index] = huntData;
        } else {
            this.hunts.push(huntData);
        }

        this.saveHunts();
        this.closeModal();
    }

    incrementEncounter(huntId) {
        const hunt = this.hunts.find(h => h.id === huntId);
        if (hunt && !hunt.completed) {
            hunt.encounters++;
            this.saveHunts();
        }
    }

    completeHunt(huntId) {
        const hunt = this.hunts.find(h => h.id === huntId);
        if (hunt) {
            hunt.completed = true;
            hunt.completedDate = new Date().toISOString().split('T')[0];
            this.saveHunts();
        }
    }

    deleteHunt(huntId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta caza?')) {
            this.hunts = this.hunts.filter(h => h.id !== huntId);
            this.saveHunts();
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.hunts, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `shiny-tracker-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    getFilteredHunts() {
        return this.hunts.filter(hunt => {
            const matchesMethod = this.filterMethod === 'all' || hunt.method === this.filterMethod;
            const matchesStatus = this.filterStatus === 'all' || 
                (this.filterStatus === 'active' && !hunt.completed) ||
                (this.filterStatus === 'completed' && hunt.completed);
            const matchesSearch = this.searchQuery === '' || 
                hunt.pokemonName.toLowerCase().includes(this.searchQuery.toLowerCase());
            
            return matchesMethod && matchesStatus && matchesSearch;
        });
    }

    render() {
        const filteredHunts = this.getFilteredHunts();
        
        return html`
            <div class="tracker-container">
                <div class="tracker-header">
                    <div class="shiny-icon">✨</div>
                    <h1 class="tracker-title">Shiny Tracker</h1>
                    <p class="tracker-subtitle">Rastrea tus cazas de Pokémon shiny</p>
                </div>

                <div class="stats-overview">
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">${this.getTotalHunts()}</div>
                        <div class="stat-label">Cazas Totales</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-value">${this.getCompletedHunts()}</div>
                        <div class="stat-label">Cazas Completadas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">👁️</div>
                        <div class="stat-value">${this.getTotalEncounters()}</div>
                        <div class="stat-label">Encuentros Totales</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">${this.getAverageEncounters()}</div>
                        <div class="stat-label">Promedio por Shiny</div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="action-btn btn-new-hunt" @click="${this.openNewHuntModal}">
                        <span>➕</span>
                        <span>Nueva Caza</span>
                    </button>
                    <button class="action-btn btn-export" @click="${this.exportData}">
                        <span>💾</span>
                        <span>Exportar Datos</span>
                    </button>
                </div>

                <div class="hunts-container">
                    <div class="hunt-filters">
                        <select class="filter-select" @change="${(e) => { this.filterMethod = e.target.value; }}">
                            <option value="all">Todos los métodos</option>
                            ${this.getShinyMethods().map(method => html`
                                <option value="${method.value}">${method.label}</option>
                            `)}
                        </select>
                        
                        <select class="filter-select" @change="${(e) => { this.filterStatus = e.target.value; }}">
                            <option value="all">Todos los estados</option>
                            <option value="active">Activas</option>
                            <option value="completed">Completadas</option>
                        </select>
                        
                        <input 
                            type="text" 
                            class="filter-input" 
                            placeholder="Buscar Pokémon..."
                            @input="${(e) => { this.searchQuery = e.target.value; }}"
                        />
                    </div>

                    ${filteredHunts.length === 0 ? html`
                        <div class="empty-state">
                            <div class="empty-icon">🔍</div>
                            <div class="empty-message">No hay cazas registradas</div>
                            <p>¡Comienza tu primera caza de shiny!</p>
                        </div>
                    ` : html`
                        <div class="hunts-grid">
                            ${filteredHunts.map(hunt => this.renderHuntCard(hunt))}
                        </div>
                    `}
                </div>

                ${this.showModal ? this.renderModal() : ''}
            </div>
        `;
    }

    renderHuntCard(hunt) {
        const methodInfo = this.getMethodInfo(hunt.method);
        const probability = this.calculateProbability(hunt.encounters, methodInfo.odds);
        
        return html`
            <div class="hunt-card ${hunt.completed ? 'completed' : ''}">
                <div class="hunt-header">
                    <img 
                        class="hunt-image" 
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${hunt.pokemonId}.png"
                        alt="${hunt.pokemonName}"
                    />
                    <div class="hunt-info">
                        <h3 class="hunt-name">${this.capitalizeFirstLetter(hunt.pokemonName)}</h3>
                        <span class="hunt-method">${methodInfo.label}</span>
                    </div>
                </div>

                <div class="hunt-stats">
                    <div class="hunt-stat-row">
                        <span class="hunt-stat-label">Encuentros:</span>
                        <span class="hunt-stat-value">${hunt.encounters}</span>
                    </div>
                    <div class="hunt-stat-row">
                        <span class="hunt-stat-label">Fecha de inicio:</span>
                        <span class="hunt-stat-value">${hunt.startDate}</span>
                    </div>
                    ${hunt.completed ? html`
                        <div class="hunt-stat-row">
                            <span class="hunt-stat-label">Completada:</span>
                            <span class="hunt-stat-value">${hunt.completedDate}</span>
                        </div>
                    ` : ''}
                </div>

                ${!hunt.completed ? html`
                    <div class="odds-calculator">
                        <div class="odds-info">
                            <span class="odds-label">Probabilidad acumulada:</span>
                            <span class="odds-value">${probability}%</span>
                        </div>
                        <div class="probability-bar">
                            <div class="probability-fill" style="width: ${Math.min(probability, 100)}%"></div>
                        </div>
                        <div class="odds-info" style="margin-top: 10px;">
                            <span class="odds-label">Odds base:</span>
                            <span class="odds-value">1/${methodInfo.odds}</span>
                        </div>
                    </div>
                ` : ''}

                <div class="hunt-actions">
                    ${!hunt.completed ? html`
                        <button class="hunt-btn btn-increment" @click="${() => this.incrementEncounter(hunt.id)}">
                            +1
                        </button>
                        <button class="hunt-btn btn-complete" @click="${() => this.completeHunt(hunt.id)}">
                            ✨ ¡Encontrado!
                        </button>
                    ` : ''}
                    <button class="hunt-btn btn-edit" @click="${() => this.openEditModal(hunt)}">
                        ✏️
                    </button>
                    <button class="hunt-btn btn-delete" @click="${() => this.deleteHunt(hunt.id)}">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    renderModal() {
        return html`
            <div class="modal-overlay" @click="${(e) => { if (e.target === e.currentTarget) this.closeModal(); }}">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">${this.editingHunt ? 'Editar Caza' : 'Nueva Caza Shiny'}</h2>
                    </div>

                    <form @submit="${this.saveHunt}">
                        <div class="form-group">
                            <label class="form-label">Pokémon *</label>
                            <input 
                                type="text" 
                                id="pokemonSearch"
                                class="form-input" 
                                placeholder="Buscar Pokémon..."
                                @input="${this.handlePokemonSearch}"
                                value="${this.selectedPokemon ? this.capitalizeFirstLetter(this.selectedPokemon.name) : ''}"
                                required
                            />
                            <div class="pokemon-search-results ${this.showSearchResults ? 'show' : ''}">
                                ${this.searchResults.map(pokemon => html`
                                    <div class="pokemon-search-item" @click="${() => this.selectPokemon(pokemon)}">
                                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.match(/\/(\d+)\//)[1]}.png" alt="${pokemon.name}">
                                        <span>${this.capitalizeFirstLetter(pokemon.name)}</span>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Método de Caza *</label>
                            <select name="method" class="form-select" required>
                                ${this.getShinyMethods().map(method => html`
                                    <option 
                                        value="${method.value}"
                                        ?selected="${this.editingHunt?.method === method.value}"
                                    >
                                        ${method.label} (1/${method.odds})
                                    </option>
                                `)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Encuentros Actuales</label>
                            <input 
                                type="number" 
                                name="encounters" 
                                class="form-input" 
                                min="0"
                                value="${this.editingHunt?.encounters || 0}"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Fecha de Inicio</label>
                            <input 
                                type="date" 
                                name="startDate" 
                                class="form-input"
                                value="${this.editingHunt?.startDate || new Date().toISOString().split('T')[0]}"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Notas</label>
                            <input 
                                type="text" 
                                name="notes" 
                                class="form-input" 
                                placeholder="Notas opcionales..."
                                value="${this.editingHunt?.notes || ''}"
                            />
                        </div>

                        <div class="modal-actions">
                            <button type="submit" class="modal-btn btn-save">
                                ${this.editingHunt ? 'Guardar Cambios' : 'Crear Caza'}
                            </button>
                            <button type="button" class="modal-btn btn-cancel" @click="${this.closeModal}">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('pokemon-shiny-tracker', PokemonShinyTracker);
