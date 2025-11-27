import { html, LitElement ,css} from "lit";
import '../pokemon-data/pokemon-data.js';
import '../pokemon-ficha-listado/pokemon-ficha-listado.js';
import '../pokemon-sidebar/pokemon-sidebar.js';
import '../pokedex-generation-card/pokedex-generation-card.js';

class PokedexMain extends LitElement {

    static get properties(){
        return {
            pokemons: {type: Array},
            generations: {type: Array},
            muestra: {type: String},
            fichaPokemon: {type: Object},
            types: {type: Array},
            encounters: {type: Array},
            expandedVersions: {type: Object, attribute: false},
            speciesInfo: {type: Object},
            evolutionChain: {type: Object},
            searchQuery: {type: String},
            showScrollButton: {type: Boolean},
            capturedPokemon: {attribute: false},
            showProgressBar: {type: Boolean}
        };

    }

    constructor(){
        super();

        this.pokemons = [];
        this.generations = [];
        this.muestra = "listGens";
        this.fichaPokemon = {};
        this.types = [];
        this.encounters = [];
        this.expandedVersions = new Set();
        this.speciesInfo = null;
        this.evolutionChain = null;
        this.searchQuery = '';
        this.showScrollButton = false;
        this.capturedPokemon = new Set();
        this.showProgressBar = true;
        
        // Cargar capturas guardadas desde localStorage
        this.loadCapturedPokemon();
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <div id="listGens">
                <div class="listado">
                    ${this.generations.map(
                        (generation, index) => html`<pokedex-generation-card
                                                    fname="${this.capitalizeFirstLetter(generation.name)}"
                                                    url="${generation.url}"
                                                    @get-generation="${this.getGeneration}" 
                                                   ></pokedex-generation-card>`
                    )}
                </div>
            </div>
            <div id="listPokemon" class="d-none">
                <div class="back-button-container">
                    <button @click="${this.volverAGeneraciones}" class="back-button">
                        ← Volver a Generaciones
                    </button>
                </div>
                <div class="search-container">
                    <input 
                        type="text" 
                        class="search-input"
                        placeholder="🔍 Buscar Pokémon por nombre..."
                        .value="${this.searchQuery}"
                        @input="${this.handleSearchInput}"
                    />
                    ${this.searchQuery ? html`
                        <button class="clear-search-button" @click="${this.clearSearch}">✕</button>
                    ` : ''}
                </div>
                
                ${this.getFilteredPokemons().length > 0 ? html`
                    <div class="capture-progress-bar ${this.showProgressBar ? 'visible' : 'hidden'}">
                        <button @click="${this.toggleProgressBar}" class="toggle-progress-btn" title="${this.showProgressBar ? 'Ocultar barra' : 'Mostrar barra'}">
                            ${this.showProgressBar ? '▼' : '▲'}
                        </button>
                        ${this.showProgressBar ? html`
                            <div class="progress-content">
                                <div class="progress-info">
                                    <span class="progress-label">
                                        <span class="pokeball-icon">⚫</span>
                                        Pokédex
                                    </span>
                                    <span class="progress-stats">
                                        ${this.getCaptureProgress().captured}/${this.getCaptureProgress().total}
                                        <span class="progress-percentage">${this.getCaptureProgress().percentage}%</span>
                                    </span>
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" style="width: ${this.getCaptureProgress().percentage}%">
                                        <div class="progress-bar-shine"></div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div id="peopleList">
                    <div class="listado">
                    ${this.getFilteredPokemons().map(
                        (pokemon, index) => {
                            const pokemonId = parseInt(pokemon.url.match(/\d+/g)[1]);
                            return html`<pokemon-ficha-listado 
                                fname="${this.capitalizeFirstLetter(pokemon.name)}" 
                                numPokedex="${pokemon.idp}"
                                profile="${pokemon.url}"
                                .photo="${{
                                    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemonId +".png",
                                    alt: "pokemon.name"
                                }}"
                                .isCaptured="${this.isCaptured(pokemonId)}"
                                .pokemonId="${pokemonId}"
                                @consulta-pokemon="${this.consultaPokemon}"
                                @toggle-capture="${this.handleCaptureToggle}"
                                ></pokemon-ficha-listado>`;
                        }
                    )}
                    </div>
                    ${this.getFilteredPokemons().length === 0 ? html`
                        <div class="no-results">
                            <p>No se encontraron Pokémon con el nombre "${this.searchQuery}"</p>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div id="fichaPokemon" class="d-none">
                <div class="back-button-container">
                    <button @click="${this.volverAListado}" class="back-button">
                        ← Volver al Listado
                    </button>
                </div>
                <div class="pokemon-detail-container">
                    <div class="pokemon-detail-card">
                        <div class="detail-header">
                            <div class="detail-image-section">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.fichaPokemon.idp}.png" 
                                     alt="${this.capitalizeFirstLetter(this.fichaPokemon.name)}" 
                                     class="detail-pokemon-image">
                            </div>
                            <div class="detail-info-section">
                                <h2 class="detail-title">${this.capitalizeFirstLetter(this.fichaPokemon.name)}</h2>
                                <span class="detail-number">#${this.fichaPokemon.idp}</span>
                                
                                <div class="detail-stats">
                                    <div class="stat-item">
                                        <span class="stat-label">Peso:</span>
                                        <span class="stat-value">${this.mascaraNum(this.fichaPokemon.weight)} kg</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Altura:</span>
                                        <span class="stat-value">${this.mascaraNum(this.fichaPokemon.height)} m</span>
                                    </div>
                                </div>

                                <div class="types-section">
                                    <span class="types-label">Tipos:</span>
                                    <div class="types-container">
                                        ${this.types.map(
                                            (type, index) => {
                                                const typeStyle = this.getTypeStyle(type.type.name);
                                                const typeName = this.getTypeNameInSpanish(type.type.name);
                                                return html`
                                                    <div class="type-badge-modern" style="background: ${typeStyle.gradient}">
                                                        <span class="type-icon">${typeStyle.icon}</span>
                                                        <span class="type-name">${typeName}</span>
                                                    </div>
                                                `;
                                            }
                                        )}
                                    </div>
                                </div>

                                ${this.speciesInfo ? html`
                                    <div class="obtain-methods-section">
                                        <span class="obtain-label">Métodos de obtención:</span>
                                        <div class="obtain-methods">
                                            ${this.isObtainableByBreeding() ? html`
                                                <div class="method-badge baby">
                                                    <span class="method-icon">🥚</span>
                                                    <span class="method-text">Obtenible por crianza</span>
                                                </div>
                                            ` : ''}
                                            ${this.isFossilPokemon() ? html`
                                                <div class="method-badge fossil">
                                                    <span class="method-icon">🦴</span>
                                                    <span class="method-text">Obtenible por fósil${this.getFossilName() ? `: ${this.getFossilName()}` : ''}</span>
                                                </div>
                                            ` : ''}
                                            ${this.speciesInfo.is_legendary ? html`
                                                <div class="method-badge legendary">
                                                    <span class="method-icon">⭐</span>
                                                    <span class="method-text">Legendario</span>
                                                </div>
                                            ` : ''}
                                            ${this.speciesInfo.is_mythical ? html`
                                                <div class="method-badge mythical">
                                                    <span class="method-icon">✨</span>
                                                    <span class="method-text">Singular</span>
                                                </div>
                                            ` : ''}
                                            ${this.speciesInfo.evolves_from_species ? html`
                                                <div class="method-badge evolution">
                                                    <span class="method-icon">🔄</span>
                                                    <span class="method-text">Evoluciona de ${this.capitalizeFirstLetter(this.speciesInfo.evolves_from_species.name)}</span>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>

                                    <div class="species-details-section">
                                        <span class="obtain-label">Información de especie:</span>
                                        <div class="species-info-grid">
                                            ${this.speciesInfo.egg_groups && this.speciesInfo.egg_groups.length > 0 ? html`
                                                <div class="info-item">
                                                    <span class="info-icon">🥚</span>
                                                    <div class="info-content">
                                                        <span class="info-label">Grupos de Huevo:</span>
                                                        <span class="info-value">${this.speciesInfo.egg_groups.map(g => this.getEggGroupName(g.name)).join(', ')}</span>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            
                                            ${this.speciesInfo.hatch_counter !== undefined ? html`
                                                <div class="info-item">
                                                    <span class="info-icon">⏱️</span>
                                                    <div class="info-content">
                                                        <span class="info-label">Pasos para Eclosión:</span>
                                                        <span class="info-value">${(this.speciesInfo.hatch_counter + 1) * 255} pasos</span>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            
                                            ${this.speciesInfo.gender_rate !== undefined ? html`
                                                <div class="info-item">
                                                    <span class="info-icon">⚥</span>
                                                    <div class="info-content">
                                                        <span class="info-label">Ratio de Género:</span>
                                                        <span class="info-value">${this.getGenderRatio(this.speciesInfo.gender_rate)}</span>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            
                                            ${this.speciesInfo.capture_rate !== undefined ? html`
                                                <div class="info-item">
                                                    <span class="info-icon">🎯</span>
                                                    <div class="info-content">
                                                        <span class="info-label">Ratio de Captura:</span>
                                                        <span class="info-value">${this.speciesInfo.capture_rate}/255 (${this.getCapturePercentage(this.speciesInfo.capture_rate)}%)</span>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            
                                            ${this.speciesInfo.base_happiness !== undefined ? html`
                                                <div class="info-item">
                                                    <span class="info-icon">😊</span>
                                                    <div class="info-content">
                                                        <span class="info-label">Felicidad Base:</span>
                                                        <span class="info-value">${this.speciesInfo.base_happiness}/255</span>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            
                                            ${this.speciesInfo.growth_rate ? html`
                                                <div class="info-item">
                                                    <span class="info-icon">📈</span>
                                                    <div class="info-content">
                                                        <span class="info-label">Velocidad de Crecimiento:</span>
                                                        <span class="info-value">${this.getGrowthRateName(this.speciesInfo.growth_rate.name)}</span>
                                                    </div>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        ${this.evolutionChain ? html`
                            <div class="evolution-section">
                                <h3 class="evolution-title">Cadena Evolutiva</h3>
                                <div class="evolution-chain-container">
                                    ${this.renderEvolutionChain(this.evolutionChain)}
                                </div>
                            </div>
                        ` : ''}

                        ${this.encounters.length > 0 ? html`
                            <div class="encounters-section">
                                <h3 class="encounters-title">Ubicaciones por Versión</h3>
                                <div class="versions-container">
                                    ${(() => {
                                        const sortedVersions = Array.from(this.groupEncountersByVersion(this.encounters))
                                            .sort((a, b) => {
                                                const genA = this.getVersionGeneration(a[0]);
                                                const genB = this.getVersionGeneration(b[0]);
                                                if (genA !== genB) return genA - genB;
                                                
                                                const orderA = this.getVersionOrder(a[0]);
                                                const orderB = this.getVersionOrder(b[0]);
                                                return orderA - orderB;
                                            });
                                        
                                        let currentGen = null;
                                        const result = [];
                                        
                                        sortedVersions.forEach(([versionName, locations]) => {
                                            const gen = this.getVersionGeneration(versionName);
                                            
                                            // Añadir encabezado de generación si es diferente
                                            if (gen !== currentGen) {
                                                currentGen = gen;
                                                result.push(html`
                                                    <div class="generation-header">
                                                        <h3 class="generation-title">Generación ${this.getGenerationRoman(gen)}</h3>
                                                    </div>
                                                `);
                                            }
                                            
                                            // Añadir el grupo de versión
                                            result.push(html`
                                                <div class="version-group ${this.expandedVersions.has(versionName) ? 'expanded' : ''}">
                                                    <div class="version-header" @click="${() => this.toggleVersion(versionName)}">
                                                        <img src="${this.getVersionIcon(versionName)}" 
                                                             class="version-header-icon"
                                                             alt="${versionName}">
                                                        <h4 class="version-title">${this.getVersionNameInSpanish(versionName)}</h4>
                                                        <span class="version-count">(${locations.length} ubicaciones)</span>
                                                        <span class="toggle-icon">${this.expandedVersions.has(versionName) ? '▼' : '▶'}</span>
                                                    </div>
                                                    <div class="locations-grid ${this.expandedVersions.has(versionName) ? 'show' : ''}">
                                                        ${locations.map(
                                                            (loc) => html`
                                                            <div class="location-card">
                                                                <img src="../img/areas/${loc.location}.png" 
                                                                     class="location-image" 
                                                                     alt="${loc.locationDisplay}"
                                                                     @error="${(e) => this.handleImageError(e)}"
                                                                     data-location="${loc.locationDisplay}">
                                                                <div class="location-name">${loc.locationDisplay}</div>
                                                            </div>
                                                            `
                                                        )}
                                                    </div>
                                                </div>
                                            `);
                                        });
                                        
                                        return result;
                                    })()}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            <pokemon-data @pokemons-data-updated="${this.pokemonsDataUpdated}" 
                          @generations-data-updated="${this.generationsDataUpdated}"
                          @mipokemon-data-updated="${this.mipokemonDataUpdate}"
                          id="pokeData"></pokemon-data>
            
            <!-- Botón flotante para scroll hacia abajo -->
            ${this.muestra === 'listPokemon' && this.getFilteredPokemons().length > 0 ? html`
                <button class="scroll-to-bottom-btn" @click="${this.scrollToBottom}" title="Ir al final del listado">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="7 13 12 18 17 13"></polyline>
                        <polyline points="7 6 12 11 17 6"></polyline>
                    </svg>
                </button>
            ` : ''}
            
            <!-- Botón flotante para scroll hacia arriba -->
            ${this.muestra === 'listPokemon' && this.getFilteredPokemons().length > 0 ? html`
                <button class="scroll-to-top-btn" @click="${this.scrollToTop}" title="Ir al inicio del listado">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="17 11 12 6 7 11"></polyline>
                        <polyline points="17 18 12 13 7 18"></polyline>
                    </svg>
                </button>
            ` : ''}
            
            <style>
                .themed-grid-col-cab {
                    padding-top: .75rem;
                    padding-bottom: .75rem;
                    background-color: rgba(86, 61, 124, .15);
                    border: 1px solid rgba(86, 61, 124, .2);
                }
            </style>
        `;
    }

    static styles = css`
        .listado {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            max-width: 1400px;
            margin: 2rem auto;
            padding: 2rem 1rem;
        }

        .themed-grid-col-cab {
            padding: 1rem;
            background-color: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(74, 85, 104, 0.2);
            border-radius: 8px;
        }

        #listGens, #listPokemon, #fichaPokemon {
            min-height: 400px;
        }

        .back-button-container {
            max-width: 1400px;
            margin: 2rem auto 0;
            padding: 0 2rem;
        }

        .back-button {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 0.9rem 1.8rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(45, 55, 72, 0.3);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(45, 55, 72, 0.4);
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        }

        .back-button:active {
            transform: translateY(0);
        }

        .search-container {
            max-width: 1400px;
            margin: 1.5rem auto;
            padding: 0 2rem;
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 1rem 3rem 1rem 1.5rem;
            font-size: 1.1rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            background: white;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .search-input:focus {
            outline: none;
            border-color: #4a5568;
            box-shadow: 0 4px 12px rgba(74, 85, 104, 0.15);
        }

        .search-input::placeholder {
            color: #a0aec0;
        }

        .clear-search-button {
            position: absolute;
            right: 2.5rem;
            top: 50%;
            transform: translateY(-50%);
            background: #e2e8f0;
            color: #4a5568;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .clear-search-button:hover {
            background: #cbd5e0;
            transform: translateY(-50%) scale(1.1);
        }

        .no-results {
            text-align: center;
            padding: 4rem 2rem;
            color: #718096;
        }

        .no-results p {
            font-size: 1.2rem;
            font-weight: 500;
        }

        /* Estilos para la barra de progreso de capturas */
        .capture-progress-bar {
            position: relative;
            margin: 1rem auto;
            max-width: 600px;
            width: 90%;
            background: linear-gradient(135deg, rgba(30, 58, 95, 0.98) 0%, rgba(45, 90, 136, 0.98) 100%);
            backdrop-filter: blur(10px);
            padding: 0.75rem 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .capture-progress-bar.visible {
            opacity: 1;
            max-height: 200px;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }

        .capture-progress-bar.hidden {
            opacity: 1;
            max-height: 40px;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            overflow: hidden;
        }

        .capture-progress-bar.hidden .progress-content {
            display: none;
        }

        .toggle-progress-btn {
            position: absolute;
            top: -12px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            color: white;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            transition: all 0.3s ease;
            z-index: 1;
        }

        .toggle-progress-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
        }

        .toggle-progress-btn:active {
            transform: scale(0.95);
        }

        .progress-content {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .progress-label {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.9rem;
            font-weight: 700;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .pokeball-icon {
            font-size: 1.1rem;
            display: inline-block;
            animation: rotateBall 4s linear infinite;
        }

        @keyframes rotateBall {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(360deg); }
        }

        .progress-stats {
            font-size: 1rem;
            font-weight: 700;
            color: #fbbf24;
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }

        .progress-percentage {
            color: #34d399;
            font-weight: 800;
        }

        .progress-bar-container {
            width: 100%;
            height: 20px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.6) 100%);
            border-radius: 50px;
            overflow: hidden;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
            position: relative;
            border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, 
                #3b82f6 0%, 
                #2563eb 100%
            );
            border-radius: 50px;
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            box-shadow: 0 2px 12px rgba(59, 130, 246, 0.6);
            animation: progressGlow 2s ease-in-out infinite;
        }

        @keyframes progressGlow {
            0%, 100% {
                box-shadow: 0 2px 12px rgba(59, 130, 246, 0.6);
            }
            50% {
                box-shadow: 0 4px 20px rgba(59, 130, 246, 0.9);
            }
        }

        .progress-bar-shine {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: linear-gradient(180deg, 
                rgba(255, 255, 255, 0.5) 0%, 
                rgba(255, 255, 255, 0) 100%
            );
            border-radius: 50px 50px 0 0;
        }

        .progress-bar-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.4) 50%, 
                transparent 100%
            );
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .pokemon-detail-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 2rem;
        }

        .pokemon-detail-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }

        .detail-header {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 2rem;
            padding: 2rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .detail-image-section {
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .detail-pokemon-image {
            width: 200px;
            height: 200px;
            object-fit: contain;
        }

        .detail-info-section {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 1rem;
        }

        .detail-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0;
        }

        .detail-number {
            font-size: 1.5rem;
            color: #666;
            font-weight: 600;
        }

        .detail-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-top: 1rem;
        }

        .stat-item {
            background: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .stat-label {
            display: block;
            font-size: 0.9rem;
            color: #666;
            font-weight: 600;
            margin-bottom: 0.3rem;
        }

        .stat-value {
            display: block;
            font-size: 1.3rem;
            color: #1a1a1a;
            font-weight: 700;
        }

        .types-section {
            margin-top: 1rem;
        }

        .types-label {
            display: block;
            font-size: 1rem;
            color: #666;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .types-container {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
        }

        .type-badge {
            height: 35px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .type-badge-modern {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.95rem;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 
                        0 2px 4px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .type-badge-modern:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 
                        0 3px 6px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .type-icon {
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        .type-name {
            letter-spacing: 0.3px;
            text-transform: uppercase;
            font-size: 0.85rem;
        }

        .obtain-methods-section {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e2e8f0;
        }

        .obtain-label {
            display: block;
            font-size: 1rem;
            color: #666;
            font-weight: 600;
            margin-bottom: 0.8rem;
        }

        .obtain-methods {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
        }

        .method-badge {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.7rem 1rem;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .method-badge.baby {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            color: #92400e;
        }

        .method-badge.legendary {
            background: linear-gradient(135deg, #fef08a 0%, #fcd34d 100%);
            color: #78350f;
        }

        .method-badge.mythical {
            background: linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%);
            color: #581c87;
        }

        .method-badge.evolution {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            color: #1e40af;
        }

        .method-badge.fossil {
            background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
            color: #6b21a8;
            border: 2px solid #c4b5fd;
        }

        .method-icon {
            font-size: 1.3rem;
        }

        .method-text {
            flex: 1;
        }

        .species-details-section {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e2e8f0;
        }

        .species-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 0.8rem;
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            padding: 0.8rem 1rem;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }

        .info-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .info-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        .info-content {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            flex: 1;
        }

        .info-label {
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-value {
            font-size: 0.9rem;
            color: #1e293b;
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .species-info-grid {
                grid-template-columns: 1fr;
            }
        }

        .evolution-section {
            padding: 2rem;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-top: 3px solid #bae6fd;
        }

        .evolution-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #0c4a6e;
            margin-bottom: 2rem;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .evolution-chain-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }

        .evolution-stages {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
        }

        .evolution-stage {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }

        .evolution-arrow {
            font-size: 2.5rem;
            color: #0369a1;
            font-weight: bold;
            padding: 0 1rem;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
        }

        .evolution-or {
            font-size: 0.9rem;
            color: #64748b;
            font-weight: 600;
            margin: 0.5rem 0;
        }

        .evolution-pokemon-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
            padding: 1.5rem;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            min-width: 180px;
            border: 2px solid #e0f2fe;
        }

        .evolution-pokemon-card.clickable {
            cursor: pointer;
        }

        .evolution-pokemon-card.clickable:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 8px 24px rgba(3, 105, 161, 0.2);
            border-color: #38bdf8;
        }

        .evolution-pokemon-card.current {
            border: 3px solid #0ea5e9;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
            position: relative;
        }

        .evolution-pokemon-card.current::before {
            content: '★';
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 1.5rem;
            color: #0ea5e9;
        }

        .evolution-pokemon-image {
            width: 96px;
            height: 96px;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .evolution-pokemon-name {
            font-size: 1.1rem;
            font-weight: 700;
            color: #0c4a6e;
            text-align: center;
            text-transform: capitalize;
        }

        .evolution-details {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            width: 100%;
        }

        .evolution-method {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            color: #92400e;
            padding: 0.5rem 0.8rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 968px) {
            .evolution-stages {
                flex-direction: column;
            }

            .evolution-arrow {
                transform: rotate(90deg);
                padding: 1rem 0;
            }
        }

        @media (max-width: 768px) {
            .evolution-section {
                padding: 1.5rem;
            }

            .evolution-title {
                font-size: 1.5rem;
            }

            .evolution-pokemon-card {
                min-width: 150px;
                padding: 1rem;
            }

            .evolution-pokemon-image {
                width: 80px;
                height: 80px;
            }
        }

        .encounters-section {
            padding: 2rem;
            background: #f8f9fa;
        }

        .encounters-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 2rem;
            text-align: center;
        }

        .versions-container {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .generation-header {
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .generation-header:first-child {
            margin-top: 0;
        }

        .generation-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
            border-radius: 12px;
            margin: 0;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-left: 5px solid #4a5568;
        }

        .version-group {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .version-header {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            user-select: none;
        }

        .version-header:hover {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        }

        .version-header-icon {
            width: 40px;
            height: 40px;
            background: white;
            padding: 0.4rem;
            border-radius: 8px;
        }

        .version-title {
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
            text-transform: capitalize;
            flex: 1;
        }

        .version-count {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
            font-weight: 500;
        }

        .toggle-icon {
            color: white;
            font-size: 1.2rem;
            transition: transform 0.3s ease;
        }

        .version-group.expanded .toggle-icon {
            transform: rotate(0deg);
        }

        .locations-grid {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease-out, padding 0.4s ease-out;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
            padding: 0 1.5rem;
        }

        .locations-grid.show {
            max-height: 5000px;
            padding: 1.5rem;
            transition: max-height 0.5s ease-in, padding 0.4s ease-in;
        }

        .location-card {
            background: #f8f9fa;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .location-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .location-image {
            width: 100%;
            height: 140px;
            object-fit: cover;
        }

        .location-image.placeholder-image {
            object-fit: contain;
            background: #f8fafc;
        }

        .location-name {
            padding: 1rem;
            font-size: 0.95rem;
            font-weight: 600;
            color: #2d3748;
            text-align: center;
            background: white;
        }

        @media (max-width: 968px) {
            .detail-header {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .detail-image-section {
                max-width: 300px;
                margin: 0 auto;
            }

            .detail-stats {
                grid-template-columns: 1fr;
            }

            .locations-grid {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }

            .pokemon-detail-container {
                padding: 1rem;
            }
        }

        /* Botón flotante para scroll hacia abajo */
        .scroll-to-bottom-btn {
            position: fixed;
            bottom: 200px;
            right: 30px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(45, 55, 72, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
            animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .scroll-to-bottom-btn:hover {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 25px rgba(45, 55, 72, 0.5);
        }

        .scroll-to-bottom-btn:active {
            transform: translateY(-1px) scale(1.02);
        }

        .scroll-to-bottom-btn svg {
            animation: bounceVertical 1.5s ease-in-out infinite;
        }

        @keyframes bounceVertical {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(5px);
            }
        }

        /* Botón flotante para scroll hacia arriba */
        .scroll-to-top-btn {
            position: fixed;
            top: 100px;
            right: 30px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(45, 55, 72, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
            animation: fadeInDown 0.5s ease;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .scroll-to-top-btn:hover {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 25px rgba(45, 55, 72, 0.5);
        }

        .scroll-to-top-btn:active {
            transform: translateY(-1px) scale(1.02);
        }

        .scroll-to-top-btn svg {
            animation: bounceVerticalUp 1.5s ease-in-out infinite;
        }

        @keyframes bounceVerticalUp {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-5px);
            }
        }

        @media (max-width: 768px) {
            .listado {
                gap: 1rem;
                padding: 1rem 0.5rem;
            }

            .detail-title {
                font-size: 2rem;
            }

            .locations-grid {
                grid-template-columns: 1fr;
            }

            .locations-grid.show {
                padding: 1rem;
            }

            .version-header {
                padding: 1rem;
            }

            .version-title {
                font-size: 1.2rem;
            }

            .version-count {
                display: none;
            }

            .generation-title {
                font-size: 1.2rem;
                padding: 0.8rem 1rem;
            }

            .encounters-section {
                padding: 1rem;
            }

            .scroll-to-bottom-btn {
                width: 48px;
                height: 48px;
                bottom: 150px;
                right: 20px;
            }

            .scroll-to-bottom-btn svg {
                width: 20px;
                height: 20px;
            }

            .capture-progress-bar {
                margin: 0.5rem auto;
                padding: 0.6rem 0.8rem;
                width: 95%;
                max-width: none;
            }

            .capture-progress-bar.visible {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
            }

            .capture-progress-bar.hidden {
                margin-top: 0.3rem;
                margin-bottom: 0.3rem;
            }

            .toggle-progress-btn {
                width: 28px;
                height: 28px;
                font-size: 0.8rem;
                top: -10px;
                right: 15px;
            }

            .progress-info {
                flex-direction: row;
                align-items: center;
                gap: 0.3rem;
            }

            .progress-label {
                font-size: 0.8rem;
            }

            .progress-stats {
                font-size: 0.85rem;
            }

            .progress-bar-container {
                height: 16px;
            }

            .scroll-to-top-btn {
                width: 48px;
                height: 48px;
                top: 80px;
                right: 20px;
            }

            .scroll-to-top-btn svg {
                width: 20px;
                height: 20px;
            }
        }
    `;

    updated(changedProperties){
        console.log("updated de tienda-main");

        if (changedProperties.has("muestra")){
            console.log("Ha cambiado el valor de la propiedad muestra en pokedex-main");
            console.log("muestra vale " + this.muestra);

            switch (this.muestra){
                case "listGens":
                        console.log("entro en listGens updated");
                        this.shadowRoot.getElementById("listGens").classList.remove("d-none");
                        this.shadowRoot.getElementById("listPokemon").classList.add("d-none");
                        this.shadowRoot.getElementById("fichaPokemon").classList.add("d-none");
                    break;
                case "listPokemon":
                        console.log("entro en listPokemon updated");
                        this.shadowRoot.getElementById("listGens").classList.add("d-none");
                        this.shadowRoot.getElementById("listPokemon").classList.remove("d-none");
                        this.shadowRoot.getElementById("fichaPokemon").classList.add("d-none");
                    break;
                case "fichaPokemon":
                        console.log("entro en listPokemon updated");
                        this.shadowRoot.getElementById("listGens").classList.add("d-none");
                        this.shadowRoot.getElementById("listPokemon").classList.add("d-none");
                        this.shadowRoot.getElementById("fichaPokemon").classList.remove("d-none");
                    break;
            }


        }
    }


    pokemonsDataUpdated(e){
        console.log("pokemonsDataUpdated");

        this.pokemons = e.detail.pokemons;
        
        for (let i = 0; i < this.pokemons.length; i++) {
            this.pokemons[i].idp = parseInt(this.pokemons[i].url.match(/\d+/g)[1]);
        }

        this.pokemons.sort(((a, b) => a.idp - b.idp));

        console.log(this.pokemons);
    }

    //Función para poner la primera letra en mayúscula
    capitalizeFirstLetter(s) {
        if (s != null)
            return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // Método para obtener el color y gradiente de cada tipo de Pokémon
    getTypeStyle(typeName) {
        const typeStyles = {
            'normal': { gradient: 'linear-gradient(135deg, #A8A878 0%, #9C9C6F 100%)', icon: '⚪' },
            'fire': { gradient: 'linear-gradient(135deg, #F08030 0%, #DD6610 100%)', icon: '🔥' },
            'water': { gradient: 'linear-gradient(135deg, #6890F0 0%, #386CEB 100%)', icon: '💧' },
            'electric': { gradient: 'linear-gradient(135deg, #F8D030 0%, #F0C108 100%)', icon: '⚡' },
            'grass': { gradient: 'linear-gradient(135deg, #78C850 0%, #5CA935 100%)', icon: '🍃' },
            'ice': { gradient: 'linear-gradient(135deg, #98D8D8 0%, #69C6C6 100%)', icon: '❄️' },
            'fighting': { gradient: 'linear-gradient(135deg, #C03028 0%, #9D2721 100%)', icon: '👊' },
            'poison': { gradient: 'linear-gradient(135deg, #A040A0 0%, #803380 100%)', icon: '☠️' },
            'ground': { gradient: 'linear-gradient(135deg, #E0C068 0%, #D4A82F 100%)', icon: '🏔️' },
            'flying': { gradient: 'linear-gradient(135deg, #A890F0 0%, #9180C4 100%)', icon: '🦅' },
            'psychic': { gradient: 'linear-gradient(135deg, #F85888 0%, #F61C5D 100%)', icon: '🔮' },
            'bug': { gradient: 'linear-gradient(135deg, #A8B820 0%, #8D9A1B 100%)', icon: '🐛' },
            'rock': { gradient: 'linear-gradient(135deg, #B8A038 0%, #9E8B2F 100%)', icon: '🪨' },
            'ghost': { gradient: 'linear-gradient(135deg, #705898 0%, #554374 100%)', icon: '👻' },
            'dragon': { gradient: 'linear-gradient(135deg, #7038F8 0%, #4C08EF 100%)', icon: '🐉' },
            'dark': { gradient: 'linear-gradient(135deg, #705848 0%, #513F34 100%)', icon: '🌙' },
            'steel': { gradient: 'linear-gradient(135deg, #B8B8D0 0%, #9797BA 100%)', icon: '⚙️' },
            'fairy': { gradient: 'linear-gradient(135deg, #EE99AC 0%, #EC6D9A 100%)', icon: '✨' }
        };
        
        return typeStyles[typeName] || { gradient: 'linear-gradient(135deg, #68A090 0%, #5A8F7F 100%)', icon: '❓' };
    }

    // Método para obtener el nombre del tipo en español
    getTypeNameInSpanish(typeName) {
        const typeNames = {
            'normal': 'Normal',
            'fire': 'Fuego',
            'water': 'Agua',
            'electric': 'Eléctrico',
            'grass': 'Planta',
            'ice': 'Hielo',
            'fighting': 'Lucha',
            'poison': 'Veneno',
            'ground': 'Tierra',
            'flying': 'Volador',
            'psychic': 'Psíquico',
            'bug': 'Bicho',
            'rock': 'Roca',
            'ghost': 'Fantasma',
            'dragon': 'Dragón',
            'dark': 'Siniestro',
            'steel': 'Acero',
            'fairy': 'Hada'
        };
        
        return typeNames[typeName] || this.capitalizeFirstLetter(typeName);
    }

    // Método para determinar si un Pokémon es obtenible por crianza
    isObtainableByBreeding() {
        if (!this.speciesInfo) return false;
        
        // Si es un Pokémon baby, definitivamente es obtenible por crianza
        if (this.speciesInfo.is_baby) return true;
        
        // Si es legendario o mítico, NO es obtenible por crianza (con muy pocas excepciones)
        if (this.speciesInfo.is_legendary || this.speciesInfo.is_mythical) return false;
        
        // Si NO evoluciona de ningún Pokémon (es la primera etapa), es obtenible por crianza
        if (!this.speciesInfo.evolves_from_species) {
            // Verificar que esté en un grupo de huevo que permite reproducción
            if (this.speciesInfo.egg_groups && this.speciesInfo.egg_groups.length > 0) {
                // Verificar que no esté en el grupo "no-eggs" o "undiscovered"
                const hasBreedableEggGroup = this.speciesInfo.egg_groups.some(group => 
                    group.name !== 'no-eggs' && group.name !== 'undiscovered'
                );
                return hasBreedableEggGroup;
            }
        }
        
        return false;
    }

    // Método para determinar si un Pokémon se obtiene mediante fósil
    isFossilPokemon() {
        if (!this.fichaPokemon || !this.fichaPokemon.name) return false;
        
        const fossilPokemon = [
            'omanyte', 'omastar',           // Fósil Helix
            'kabuto', 'kabutops',           // Fósil Dome
            'aerodactyl',                   // Ámbar Viejo
            'lileep', 'cradily',            // Fósil Raíz
            'anorith', 'armaldo',           // Fósil Garra
            'cranidos', 'rampardos',        // Fósil Cráneo
            'shieldon', 'bastiodon',        // Fósil Coraza
            'tirtouga', 'carracosta',       // Fósil Tapa
            'archen', 'archeops',           // Fósil Pluma
            'tyrunt', 'tyrantrum',          // Fósil Mandíbula
            'amaura', 'aurorus',            // Fósil Aleta
            'dracozolt',                    // Fósil Electr. + Fósil Ave
            'arctozolt',                    // Fósil Electr. + Fósil Pez
            'dracovish',                    // Fósil Pez + Fósil Ave
            'arctovish'                     // Fósil Pez + Fósil Aleta
        ];
        
        return fossilPokemon.includes(this.fichaPokemon.name.toLowerCase());
    }

    // Método para obtener el nombre del fósil en español
    getFossilName() {
        if (!this.fichaPokemon || !this.fichaPokemon.name) return '';
        
        const fossilNames = {
            'omanyte': 'Fósil Helix',
            'omastar': 'Fósil Helix',
            'kabuto': 'Fósil Dome',
            'kabutops': 'Fósil Dome',
            'aerodactyl': 'Ámbar Viejo',
            'lileep': 'Fósil Raíz',
            'cradily': 'Fósil Raíz',
            'anorith': 'Fósil Garra',
            'armaldo': 'Fósil Garra',
            'cranidos': 'Fósil Cráneo',
            'rampardos': 'Fósil Cráneo',
            'shieldon': 'Fósil Coraza',
            'bastiodon': 'Fósil Coraza',
            'tirtouga': 'Fósil Tapa',
            'carracosta': 'Fósil Tapa',
            'archen': 'Fósil Pluma',
            'archeops': 'Fósil Pluma',
            'tyrunt': 'Fósil Mandíbula',
            'tyrantrum': 'Fósil Mandíbula',
            'amaura': 'Fósil Aleta',
            'aurorus': 'Fósil Aleta',
            'dracozolt': 'Fósil Eléctrico + Fósil Ave',
            'arctozolt': 'Fósil Eléctrico + Fósil Pez',
            'dracovish': 'Fósil Pez + Fósil Ave',
            'arctovish': 'Fósil Pez + Fósil Aleta'
        };
        
        return fossilNames[this.fichaPokemon.name.toLowerCase()] || '';
    }

    nextPokes(e){
        console.log("nextPokes en pokedex-main");
        this.shadowRoot.getElementById("pokeData").adelante = !this.shadowRoot.getElementById("pokeData").adelante;
    }

    backPokes(e){
        console.log("backPokes en pokedex-main");
        this.shadowRoot.getElementById("pokeData").atras = !this.shadowRoot.getElementById("pokeData").atras;
    }

    volverAGeneraciones(e){
        console.log("volverAGeneraciones en pokedex-main");
        this.searchQuery = ''; // Limpiar búsqueda al volver
        this.muestra = "listGens";
    }

    volverAListado(e){
        console.log("volverAListado en pokedex-main");
        this.muestra = "listPokemon";
    }

    // Método para ir a la ficha de un Pokémon específico por ID
    goToPokemonById(pokemonId) {
        console.log("goToPokemonById - Navegando al Pokémon con ID:", pokemonId);
        
        // Cambiar la vista a la ficha del Pokémon
        this.muestra = "fichaPokemon";
        
        // Asignar el ID al componente pokemon-data para que cargue los datos
        this.shadowRoot.getElementById("pokeData").idPokemon = parseInt(pokemonId);
    }

    // Método para hacer scroll hacia abajo
    scrollToBottom() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Método para hacer scroll hacia arriba
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Método para manejar la entrada de búsqueda
    handleSearchInput(e) {
        this.searchQuery = e.target.value;
    }

    // Método para limpiar la búsqueda
    clearSearch() {
        this.searchQuery = '';
    }

    // Método para filtrar Pokémon según la búsqueda (no case sensitive)
    getFilteredPokemons() {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            return this.pokemons;
        }
        
        const query = this.searchQuery.toLowerCase().trim();
        return this.pokemons.filter(pokemon => 
            pokemon.name.toLowerCase().includes(query)
        );
    }

    // Métodos para gestionar capturas de Pokémon
    loadCapturedPokemon() {
        try {
            const saved = localStorage.getItem('capturedPokemon');
            if (saved) {
                this.capturedPokemon = new Set(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Error loading captured pokemon:', e);
            this.capturedPokemon = new Set();
        }
    }

    saveCapturedPokemon() {
        try {
            localStorage.setItem('capturedPokemon', JSON.stringify([...this.capturedPokemon]));
        } catch (e) {
            console.error('Error saving captured pokemon:', e);
        }
    }

    toggleCapture(pokemonId) {
        if (this.capturedPokemon.has(pokemonId)) {
            this.capturedPokemon.delete(pokemonId);
        } else {
            this.capturedPokemon.add(pokemonId);
        }
        this.saveCapturedPokemon();
        this.requestUpdate();
    }

    isCaptured(pokemonId) {
        return this.capturedPokemon.has(pokemonId);
    }

    getCaptureProgress() {
        const total = this.getFilteredPokemons().length;
        if (total === 0) return { captured: 0, total: 0, percentage: 0 };
        
        const captured = this.getFilteredPokemons().filter(pokemon => 
            this.capturedPokemon.has(parseInt(pokemon.url.match(/\d+/g)[1]))
        ).length;
        
        const percentage = Math.round((captured / total) * 100);
        
        return { captured, total, percentage };
    }

    handleCaptureToggle(e) {
        e.stopPropagation();
        const pokemonId = parseInt(e.detail.pokemonId);
        this.toggleCapture(pokemonId);
    }

    toggleProgressBar() {
        this.showProgressBar = !this.showProgressBar;
    }

    toggleVersion(versionName) {
        const newExpanded = new Set(this.expandedVersions);
        if (newExpanded.has(versionName)) {
            newExpanded.delete(versionName);
        } else {
            newExpanded.add(versionName);
        }
        this.expandedVersions = newExpanded;
        this.requestUpdate();
    }

    // Método para manejar errores de carga de imagen
    handleImageError(event) {
        const img = event.target;
        const locationName = img.getAttribute('data-location') || 'Ubicación';
        const originalSrc = img.src;
        
        // Si ya intentamos fuentes alternativas, mostrar placeholder
        if (img.dataset.fallbackAttempted) {
            this.showPlaceholderImage(img, locationName);
            return;
        }
        
        // Marcar que estamos intentando fuentes alternativas
        img.dataset.fallbackAttempted = 'true';
        
        // Intentar con fuentes alternativas
        const locationSlug = img.src.split('/').pop().replace('.png', '');
        
        console.log(`🔍 Buscando imagen para: ${locationSlug}`);
        
        // Lista de URLs alternativas para intentar
        const fallbackUrls = this.getFallbackImageUrls(locationSlug, locationName);
        
        // Función recursiva para intentar cada URL
        const tryNextUrl = (index) => {
            if (index >= fallbackUrls.length) {
                // No quedan más URLs, mostrar placeholder
                console.log(`📍 No se encontró imagen en ninguna fuente para: ${locationSlug}`);
                this.showPlaceholderImage(img, locationName);
                return;
            }
            
            console.log(`🔄 Intentando [${index + 1}/${fallbackUrls.length}]: ${fallbackUrls[index].source}`);
            
            const testImg = new Image();
            // No usar crossOrigin para evitar problemas CORS
            // testImg.crossOrigin = 'anonymous';
            
            testImg.onload = () => {
                // Éxito - usar esta imagen
                img.src = fallbackUrls[index].url;
                img.removeAttribute('crossorigin'); // Asegurar que no haya atributo CORS
                console.log(`✅ Imagen cargada desde: ${fallbackUrls[index].source}`);
            };
            
            testImg.onerror = () => {
                // Error - intentar siguiente URL
                tryNextUrl(index + 1);
            };
            
            testImg.src = fallbackUrls[index].url;
        };
        
        // Comenzar a intentar las URLs alternativas
        tryNextUrl(0);
    }

    // Método para obtener URLs de fallback para una ubicación
    getFallbackImageUrls(locationSlug, locationName) {
        const urls = [];
        
        // 1. Mapeo manual de ubicaciones conocidas que tienen URLs específicas
        const knownUrls = this.getKnownLocationUrls(locationSlug);
        if (knownUrls.length > 0) {
            urls.push(...knownUrls);
        }
        
        // 2. PokeAPI GitHub sprites
        urls.push({
            url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/locations/${locationSlug}.png`,
            source: 'PokeAPI GitHub'
        });
        
        // 3. Bulbapedia/Bulbagarden - varios formatos posibles
        const bulbapediaPaths = this.getBulbapediaImagePaths(locationSlug);
        urls.push(...bulbapediaPaths);
        
        // 4. Serebii.net - varios formatos
        urls.push({
            url: `https://www.serebii.net/pokearth/maps/kanto/${locationSlug}.png`,
            source: 'Serebii Kanto'
        });
        urls.push({
            url: `https://www.serebii.net/pokearth/maps/johto/${locationSlug}.png`,
            source: 'Serebii Johto'
        });
        
        // 5. Wikimedia Commons (muchos mapas de Pokémon)
        urls.push({
            url: `https://upload.wikimedia.org/wikipedia/commons/thumb/${this.getWikimediaPath(locationSlug)}`,
            source: 'Wikimedia Commons'
        });
        
        return urls;
    }

    // Mapeo manual de ubicaciones conocidas problemáticas
    getKnownLocationUrls(locationSlug) {
        const knownMappings = {
            'cinnabar-island-cinnabar-lab': [
                {
                    // URL directa verificada de Cinnabar Island
                    url: 'https://archives.bulbagarden.net/media/upload/5/58/Kanto_Cinnabar_Island_Map.png',
                    source: 'Bulbagarden - Cinnabar Island Map (directo)'
                },
                {
                    // Backup con proxy por si falla CORS
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/5/58/Kanto_Cinnabar_Island_Map.png',
                    source: 'Bulbagarden - Cinnabar Island Map (via proxy)'
                },
                {
                    // Lab interior como alternativa
                    url: 'https://archives.bulbagarden.net/media/upload/f/f3/Cinnabar_Lab_1F_RBY.png',
                    source: 'Bulbagarden - Cinnabar Lab Interior'
                }
            ],
            'viridian-forest-area': [
                {
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/5/5a/Viridian_Forest_RBY.png',
                    source: 'Bulbagarden - Viridian Forest (via proxy)'
                },
                {
                    url: 'https://archives.bulbagarden.net/media/upload/5/5a/Viridian_Forest_RBY.png',
                    source: 'Bulbagarden - Viridian Forest (directo)'
                }
            ],
            'cerulean-cave-area': [
                {
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/3/31/Cerulean_Cave_1F_RBY.png',
                    source: 'Bulbagarden - Cerulean Cave (via proxy)'
                },
                {
                    url: 'https://archives.bulbagarden.net/media/upload/3/31/Cerulean_Cave_1F_RBY.png',
                    source: 'Bulbagarden - Cerulean Cave (directo)'
                }
            ],
            'mt-moon-area': [
                {
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/b/b1/Mt_Moon_1F_RBY.png',
                    source: 'Bulbagarden - Mt Moon (via proxy)'
                },
                {
                    url: 'https://archives.bulbagarden.net/media/upload/b/b1/Mt_Moon_1F_RBY.png',
                    source: 'Bulbagarden - Mt Moon (directo)'
                }
            ],
            'rock-tunnel-area': [
                {
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/2/2e/Rock_Tunnel_1F_RBY.png',
                    source: 'Bulbagarden - Rock Tunnel (via proxy)'
                },
                {
                    url: 'https://archives.bulbagarden.net/media/upload/2/2e/Rock_Tunnel_1F_RBY.png',
                    source: 'Bulbagarden - Rock Tunnel (directo)'
                }
            ],
            'pokemon-tower-area': [
                {
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/7/72/Pokemon_Tower_1F_RBY.png',
                    source: 'Bulbagarden - Pokemon Tower (via proxy)'
                },
                {
                    url: 'https://archives.bulbagarden.net/media/upload/7/72/Pokemon_Tower_1F_RBY.png',
                    source: 'Bulbagarden - Pokemon Tower (directo)'
                }
            ],
            'seafoam-islands-area': [
                {
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/f/f0/Seafoam_Islands_1F_RBY.png',
                    source: 'Bulbagarden - Seafoam Islands (via proxy)'
                },
                {
                    url: 'https://archives.bulbagarden.net/media/upload/f/f0/Seafoam_Islands_1F_RBY.png',
                    source: 'Bulbagarden - Seafoam Islands (directo)'
                }
            ],
            'power-plant-area': [
                {
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/e/e7/Kanto_Power_Plant_RBY.png',
                    source: 'Bulbagarden - Power Plant (via proxy)'
                },
                {
                    url: 'https://archives.bulbagarden.net/media/upload/e/e7/Kanto_Power_Plant_RBY.png',
                    source: 'Bulbagarden - Power Plant (directo)'
                }
            ],
            'victory-road-area': [
                {
                    url: 'https://corsproxy.io/?https://archives.bulbagarden.net/media/upload/9/99/Kanto_Victory_Road_1F_RBY.png',
                    source: 'Bulbagarden - Victory Road (via proxy)'
                },
                {
                    url: 'https://archives.bulbagarden.net/media/upload/9/99/Kanto_Victory_Road_1F_RBY.png',
                    source: 'Bulbagarden - Victory Road (directo)'
                }
            ],
            // Pokémon Mansion - todas las plantas usan el mapa de Isla Canela
            'pokemon-mansion-area': [
                {
                    url: 'https://archives.bulbagarden.net/media/upload/5/58/Kanto_Cinnabar_Island_Map.png',
                    source: 'Bulbagarden - Cinnabar Island Map (Mansion)'
                }
            ],
            'pokemon-mansion-1f': [
                {
                    url: 'https://archives.bulbagarden.net/media/upload/5/58/Kanto_Cinnabar_Island_Map.png',
                    source: 'Bulbagarden - Cinnabar Island Map (Mansion 1F)'
                }
            ],
            'pokemon-mansion-2f': [
                {
                    url: 'https://archives.bulbagarden.net/media/upload/5/58/Kanto_Cinnabar_Island_Map.png',
                    source: 'Bulbagarden - Cinnabar Island Map (Mansion 2F)'
                }
            ],
            'pokemon-mansion-3f': [
                {
                    url: 'https://archives.bulbagarden.net/media/upload/5/58/Kanto_Cinnabar_Island_Map.png',
                    source: 'Bulbagarden - Cinnabar Island Map (Mansion 3F)'
                }
            ],
            'pokemon-mansion-b1f': [
                {
                    url: 'https://archives.bulbagarden.net/media/upload/5/58/Kanto_Cinnabar_Island_Map.png',
                    source: 'Bulbagarden - Cinnabar Island Map (Mansion B1F)'
                }
            ],
            'saffron-city-area': [
                {
                    url: 'https://static.wikia.nocookie.net/espokemon/images/f/f5/Ciudad_Azafr%C3%A1n_mapa.png',
                    source: 'Wikia ES Pokemon - Saffron City'
                },
                {
                    url: 'https://corsproxy.io/?https://static.wikia.nocookie.net/espokemon/images/f/f5/Ciudad_Azafr%C3%A1n_mapa.png',
                    source: 'Wikia ES Pokemon - Saffron City (via proxy)'
                }
            ]
        };
        
        return knownMappings[locationSlug] || [];
    }

    // Método mejorado para construir rutas de Bulbapedia
    getBulbapediaImagePaths(locationSlug) {
        const urls = [];
        
        // Convertir el slug a varios formatos posibles
        const baseName = locationSlug
            .replace(/-area$/, '')
            .replace(/-/g, '_')
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('_');
        
        // Probar varios formatos comunes en Bulbagarden
        const formats = [
            `${baseName}_RBY.png`,
            `${baseName}_FRLG.png`,
            `${baseName}_GSC.png`,
            `${baseName}_HGSS.png`,
            `${baseName}_Map.png`,
            `${baseName}.png`,
            `Kanto_${baseName}.png`
        ];
        
        formats.forEach(format => {
            // Thumbnail
            urls.push({
                url: `https://archives.bulbagarden.net/media/upload/thumb/${this.getBulbagardenHash(format)}/180px-${format}`,
                source: `Bulbagarden - ${format} (thumb)`
            });
            // Full size
            urls.push({
                url: `https://archives.bulbagarden.net/media/upload/${this.getBulbagardenHash(format)}`,
                source: `Bulbagarden - ${format} (full)`
            });
        });
        
        return urls;
    }

    // Generar hash para estructura de Bulbagarden (basado en MD5 del nombre)
    getBulbagardenHash(filename) {
        // Bulbagarden usa una estructura de directorios basada en hash
        // Como no podemos calcular MD5 fácilmente, usaremos una aproximación
        const firstChar = filename.charAt(0).toLowerCase();
        const firstTwoChars = filename.substring(0, 2).toLowerCase();
        return `${firstChar}/${firstTwoChars}/${filename}`;
    }

    // Método para generar path de Wikimedia
    getWikimediaPath(locationSlug) {
        const formatted = locationSlug
            .replace(/-area$/, '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('_');
        
        return `Pokemon_${formatted}_Map.png/300px-Pokemon_${formatted}_Map.png`;
    }

    // Método para mostrar imagen placeholder
    showPlaceholderImage(img, locationName) {
        console.log(`📍 Generando placeholder para: ${locationName}`);
        
        // Crear un canvas con un diseño placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Fondo con gradiente
        const gradient = ctx.createLinearGradient(0, 0, 400, 300);
        gradient.addColorStop(0, '#e2e8f0');
        gradient.addColorStop(1, '#cbd5e0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 300);
        
        // Borde
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, 400, 300);
        
        // Icono de ubicación (pin)
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📍', 200, 120);
        
        // Texto
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Imagen no disponible', 200, 200);
        
        ctx.font = '16px Arial';
        ctx.fillStyle = '#64748b';
        
        // Dividir el nombre de la ubicación en líneas si es muy largo
        const maxWidth = 360;
        const words = locationName.split(' ');
        let line = '';
        let y = 240;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, 200, y);
                line = words[i] + ' ';
                y += 20;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 200, y);
        
        // Reemplazar la imagen con el canvas
        img.src = canvas.toDataURL();
        img.classList.add('placeholder-image');
    }

    // Método para traducir nombres de versiones al español
    getVersionNameInSpanish(versionName) {
        const translations = {
            // Generación I
            'red': 'Rojo',
            'blue': 'Azul',
            'yellow': 'Amarillo',
            'red-blue': 'Rojo/Azul',
            
            // Generación II
            'gold': 'Oro',
            'silver': 'Plata',
            'crystal': 'Cristal',
            
            // Generación III
            'ruby': 'Rubí',
            'sapphire': 'Zafiro',
            'emerald': 'Esmeralda',
            'firered': 'Rojo Fuego',
            'leafgreen': 'Verde Hoja',
            
            // Generación IV
            'diamond': 'Diamante',
            'pearl': 'Perla',
            'platinum': 'Platino',
            'heartgold': 'Oro HeartGold',
            'soulsilver': 'Plata SoulSilver',
            
            // Generación V
            'black': 'Negro',
            'white': 'Blanco',
            'black-2': 'Negro 2',
            'white-2': 'Blanco 2',
            
            // Generación VI
            'x': 'X',
            'y': 'Y',
            'omega-ruby': 'Rubí Omega',
            'alpha-sapphire': 'Zafiro Alfa',
            
            // Generación VII
            'sun': 'Sol',
            'moon': 'Luna',
            'ultra-sun': 'Ultra Sol',
            'ultra-moon': 'Ultra Luna',
            
            // Generación VIII
            'sword': 'Espada',
            'shield': 'Escudo',
            'brilliant-diamond': 'Diamante Brillante',
            'shining-pearl': 'Perla Reluciente',
            'legends-arceus': 'Leyendas Arceus',
            
            // Generación IX
            'scarlet': 'Escarlata',
            'violet': 'Púrpura'
        };
        
        return translations[versionName] || this.capitalizeFirstLetter(versionName);
    }

    // Método para obtener el ícono personalizado de una versión
    getVersionIcon(versionName) {
        const customIcons = {
            'ultra-sun': 'https://images.wikidexcdn.net/mwuploads/wikidex/5/5f/latest/20230318125303/Necrozma_melena_crepuscular_icono_G7.png',
            'ultra-moon': 'https://images.wikidexcdn.net/mwuploads/wikidex/2/25/latest/20230318125051/Necrozma_alas_del_alba_icono_G7.png'
        };
        
        // Si hay un ícono personalizado, usarlo; si no, usar el local
        return customIcons[versionName] || `../img/versions/${versionName}.png`;
    }

    // Método para obtener el número de generación de una versión
    getVersionGeneration(versionName) {
        const generations = {
            // Generación I
            'red': 1, 'blue': 1, 'yellow': 1, 'red-blue': 1,
            
            // Generación II
            'gold': 2, 'silver': 2, 'crystal': 2,
            
            // Generación III
            'ruby': 3, 'sapphire': 3, 'emerald': 3, 
            'firered': 3, 'leafgreen': 3,
            
            // Generación IV
            'diamond': 4, 'pearl': 4, 'platinum': 4, 
            'heartgold': 4, 'soulsilver': 4,
            
            // Generación V
            'black': 5, 'white': 5, 'black-2': 5, 'white-2': 5,
            
            // Generación VI
            'x': 6, 'y': 6, 'omega-ruby': 6, 'alpha-sapphire': 6,
            
            // Generación VII
            'sun': 7, 'moon': 7, 'ultra-sun': 7, 'ultra-moon': 7,
            
            // Generación VIII
            'sword': 8, 'shield': 8, 'brilliant-diamond': 8, 
            'shining-pearl': 8, 'legends-arceus': 8,
            
            // Generación IX
            'scarlet': 9, 'violet': 9
        };
        
        return generations[versionName] || 999; // Si no se encuentra, va al final
    }

    // Método para obtener el orden dentro de la generación
    getVersionOrder(versionName) {
        const order = {
            // Generación I
            'red': 1, 'blue': 2, 'yellow': 3, 'red-blue': 0,
            
            // Generación II
            'gold': 1, 'silver': 2, 'crystal': 3,
            
            // Generación III
            'ruby': 1, 'sapphire': 2, 'emerald': 3, 
            'firered': 4, 'leafgreen': 5,
            
            // Generación IV
            'diamond': 1, 'pearl': 2, 'platinum': 3, 
            'heartgold': 4, 'soulsilver': 5,
            
            // Generación V
            'black': 1, 'white': 2, 'black-2': 3, 'white-2': 4,
            
            // Generación VI
            'x': 1, 'y': 2, 'omega-ruby': 3, 'alpha-sapphire': 4,
            
            // Generación VII
            'sun': 1, 'moon': 2, 'ultra-sun': 3, 'ultra-moon': 4,
            
            // Generación VIII
            'sword': 1, 'shield': 2, 'brilliant-diamond': 3, 
            'shining-pearl': 4, 'legends-arceus': 5,
            
            // Generación IX
            'scarlet': 1, 'violet': 2
        };
        
        return order[versionName] || 999;
    }

    // Método para convertir números a números romanos
    getGenerationRoman(num) {
        const romanNumerals = {
            1: 'I',
            2: 'II',
            3: 'III',
            4: 'IV',
            5: 'V',
            6: 'VI',
            7: 'VII',
            8: 'VIII',
            9: 'IX',
            10: 'X'
        };
        
        return romanNumerals[num] || num;
    }

    generationsDataUpdated(e){
        console.log("generationsDataUpdated");

        this.generations = e.detail.generations;

        console.log(this.generations);
    }

    getGeneration(e){
        console.log("pokedex-main "+ e.detail.url);
        this.shadowRoot.getElementById("pokeData").urlGeneration = e.detail.url;
        this.muestra = "listPokemon";
    }

    consultaPokemon(e){
        console.log("consultaPokemon en pokedex-main " + e.detail.idp);
        this.muestra = "fichaPokemon";
        this.shadowRoot.getElementById("pokeData").idPokemon = e.detail.idp;
    }

    mipokemonDataUpdate(e){
        console.log("mipokemonDataUpdate");
        console.log(e.detail);
        this.fichaPokemon = e.detail;
        this.types = this.fichaPokemon.types;
        this.encounters = this.fichaPokemon.encounters;
        this.speciesInfo = this.fichaPokemon.species_info;
        this.evolutionChain = this.fichaPokemon.evolution_chain;
        console.log("Species Info:", this.speciesInfo);
        console.log("Evolution Chain:", this.evolutionChain);
        console.log("AQUIII");
    }
    mascaraNum(n){
        if(n != null)
            return n/10;
    }

    // Método para agrupar ubicaciones por versión
    groupEncountersByVersion(encounters) {
        const versionMap = new Map();
        
        encounters.forEach(encounter => {
            encounter.version_details.forEach(vdetail => {
                const versionName = vdetail.version.name;
                if (!versionMap.has(versionName)) {
                    versionMap.set(versionName, []);
                }
                versionMap.get(versionName).push({
                    location: encounter.location_area.name,
                    locationDisplay: this.getLugar(encounter.location_area.name)
                });
            });
        });
        
        return versionMap;
    }



    getLugar(string){

        let arrayDeCadenas = this.dividirCadena(string,"-");
        
        //Rutas
        switch(arrayDeCadenas[0]){
            case "johto":
            case "sinnoh":
            case "kalos":
                return "Ruta " + arrayDeCadenas[2] + " - " + this.capitalizeFirstLetter(arrayDeCadenas[0]);
            case "unova":
                    return "Ruta " + arrayDeCadenas[2] + " - " + "Teselia";
            case "kanto":
                if (arrayDeCadenas[1] === "sea"){
                    return "Ruta " + arrayDeCadenas[3] + " - " + this.capitalizeFirstLetter(arrayDeCadenas[0]);
                }else{
                    return "Ruta " + arrayDeCadenas[2] + " - " + this.capitalizeFirstLetter(arrayDeCadenas[0]);
                }
        }

        //Diccionario completo de ubicaciones en español
        const locations = {
            // Kanto - Ciudades y Pueblos
            "pallet-town-area": "Pueblo Paleta",
            "viridian-city-area": "Ciudad Verde",
            "pewter-city-area": "Ciudad Plateada",
            "cerulean-city-area": "Ciudad Celeste",
            "vermilion-city-area": "Ciudad Carmín",
            "lavender-town-area": "Pueblo Lavanda",
            "celadon-city-area": "Ciudad Azafrán",
            "fuchsia-city-area": "Ciudad Fucsia",
            "saffron-city-area": "Ciudad Azafrán",
            "cinnabar-island-area": "Isla Canela",
            
            // Kanto - Edificios y Lugares Especiales
            "cinnabar-island-cinnabar-lab": "Isla Canela - Laboratorio Pokémon",
            "pokemon-mansion-area": "Mansión Pokémon",
            "pokemon-mansion-1f": "Mansión Pokémon - 1ª Planta",
            "pokemon-mansion-2f": "Mansión Pokémon - 2ª Planta",
            "pokemon-mansion-3f": "Mansión Pokémon - 3ª Planta",
            "pokemon-mansion-b1f": "Mansión Pokémon - Sótano",
            "silph-co-area": "Silph S.A.",
            "pokemon-tower-area": "Torre Pokémon",
            "power-plant-area": "Central de Energía",
            "rocket-hideout-area": "Guarida Rocket",
            
            // Kanto - Bosques y Naturaleza
            "viridian-forest-area": "Bosque Verde",
            "digletts-cave-area": "Cueva Diglett",
            "mt-moon-area": "Monte Moon",
            "rock-tunnel-area": "Túnel Roca",
            "victory-road-area": "Ruta Victoria",
            "cerulean-cave-area": "Cueva Celeste",
            "seafoam-islands-area": "Islas Espuma",
            "safari-zone-area": "Zona Safari",
            
            // Johto - Ciudades y Pueblos
            "new-bark-town-area": "Pueblo Primavera",
            "cherrygrove-city-area": "Ciudad Cerezo",
            "violet-city-area": "Ciudad Violeta",
            "azalea-town-area": "Pueblo Azalea",
            "goldenrod-city-area": "Ciudad Trigal",
            "ecruteak-city-area": "Ciudad Ecruteak",
            "olivine-city-area": "Ciudad Olivo",
            "cianwood-city-area": "Ciudad Orquídea",
            "mahogany-town-area": "Pueblo Caoba",
            "blackthorn-city-area": "Ciudad Encina",
            
            // Johto - Lugares Especiales
            "ilex-forest-area": "El Encinar",
            "national-park-area": "Parque Nacional",
            "lake-of-rage-area": "Lago de la Furia",
            "ice-path-area": "Ruta Helada",
            "dark-cave-area": "Cueva Oscura",
            "union-cave-area": "Cueva Unión",
            "slowpoke-well-area": "Pozo Slowpoke",
            "ruins-of-alph-area": "Ruinas Alfa",
            "sprout-tower-area": "Torre Bellsprout",
            "burned-tower-area": "Torre Quemada",
            "tin-tower-area": "Torre Estaño",
            "whirl-islands-area": "Islas Remolino",
            "mt-mortar-area": "Monte Mortero",
            "tohjo-falls-area": "Cataratas Tohjo",
            
            // Hoenn - Ciudades
            "littleroot-town-area": "Pueblo Raíz Pequeña",
            "oldale-town-area": "Pueblo Escaso",
            "petalburg-city-area": "Ciudad Petalia",
            "rustboro-city-area": "Ciudad Férrica",
            "dewford-town-area": "Pueblo Azuliza",
            "slateport-city-area": "Ciudad Portual",
            "mauville-city-area": "Ciudad Malvalona",
            "verdanturf-town-area": "Pueblo Verdegal",
            "lavaridge-town-area": "Pueblo Lavacalda",
            "fallarbor-town-area": "Pueblo Oromar",
            "fortree-city-area": "Ciudad Arborada",
            "lilycove-city-area": "Ciudad Calagua",
            "mossdeep-city-area": "Ciudad Algaria",
            "sootopolis-city-area": "Ciudad Arrecípolis",
            "pacifidlog-town-area": "Pueblo Pacifídico",
            "ever-grande-city-area": "Ciudad Colosalia",
            
            // Sinnoh - Ciudades
            "twinleaf-town-area": "Pueblo Hojaverde",
            "sandgem-town-area": "Pueblo Arena",
            "jubilife-city-area": "Ciudad Jubileo",
            "oreburgh-city-area": "Ciudad Pirita",
            "floaroma-town-area": "Pueblo Aromaflor",
            "eterna-city-area": "Ciudad Vetusta",
            "hearthome-city-area": "Ciudad Corazón",
            "solaceon-town-area": "Pueblo Solaceon",
            "veilstone-city-area": "Ciudad Rocavelo",
            "pastoria-city-area": "Ciudad Pradera",
            "celestic-town-area": "Pueblo Celeste",
            "canalave-city-area": "Ciudad Canal",
            "snowpoint-city-area": "Ciudad Puntaneva",
            "sunyshore-city-area": "Ciudad Pradera",
            
            // Sinnoh - Lugares Especiales
            "eterna-forest-area": "Bosque Vetusto",
            "fuego-ironworks-area": "Fundición Fuego",
            "mt-coronet-area": "Monte Corona",
            "great-marsh-area": "Gran Pantano",
            "victory-road-sinnoh-area": "Ruta Victoria - Sinnoh",
            
            // Unova
            "castelia-city-area": "Ciudad Esmalte",
            "nimbasa-city-area": "Ciudad Mayólica",
            
            // Kalos
            "lumiose-city-area": "Ciudad Luminalia",
            "santalune-forest-area": "Bosque de Novarte",
            
            // Islas Sevii
            "berry-forest-area": "Bosque Baya",
            "bond-bridge-area": "Puente Unión",
            "five-isle-meadow-area": "Prado Isla Inta",
            "pattern-bush-area": "Bosquejo",
            
            // Lugares Genéricos/Desconocidos
            "unknown-all-bugs-area": "Zona Desconocida - Bichos"
        };

        // Buscar en el diccionario
        if (locations[string]) {
            return locations[string];
        }

        // Si no está en el diccionario, intentar formatear el nombre
        return this.formatLocationName(string);
    }

    // Método auxiliar para formatear nombres de ubicaciones no mapeadas
    formatLocationName(string) {
        // Remover sufijos comunes
        let formatted = string.replace(/-area$/, '').replace(/-zone$/, '');
        
        // Dividir por guiones y capitalizar
        const words = formatted.split('-').map(word => {
            // Traducciones de palabras comunes
            const translations = {
                'route': 'Ruta',
                'city': 'Ciudad',
                'town': 'Pueblo',
                'forest': 'Bosque',
                'cave': 'Cueva',
                'mountain': 'Monte',
                'island': 'Isla',
                'lake': 'Lago',
                'tower': 'Torre',
                'path': 'Camino',
                'road': 'Ruta',
                'bridge': 'Puente',
                'bay': 'Bahía',
                'beach': 'Playa',
                'park': 'Parque',
                'garden': 'Jardín',
                'ruins': 'Ruinas',
                'tunnel': 'Túnel',
                'valley': 'Valle',
                'river': 'Río',
                'sea': 'Mar'
            };
            
            const lowerWord = word.toLowerCase();
            return translations[lowerWord] || this.capitalizeFirstLetter(word);
        });
        
        return words.join(' ');
    }

    // Método para obtener el nombre del grupo de huevo en español
    getEggGroupName(eggGroupName) {
        const eggGroups = {
            'monster': 'Monstruo',
            'water1': 'Agua 1',
            'water2': 'Agua 2',
            'water3': 'Agua 3',
            'bug': 'Bicho',
            'flying': 'Volador',
            'field': 'Campo',
            'fairy': 'Hada',
            'grass': 'Planta',
            'human-like': 'Humanoide',
            'mineral': 'Mineral',
            'amorphous': 'Amorfo',
            'ditto': 'Ditto',
            'dragon': 'Dragón',
            'no-eggs': 'No Huevos',
            'undiscovered': 'Indescubierto'
        };
        return eggGroups[eggGroupName] || this.capitalizeFirstLetter(eggGroupName);
    }

    // Método para obtener el ratio de género formateado
    getGenderRatio(genderRate) {
        if (genderRate === -1) {
            return 'Sin género';
        }
        const femalePercent = (genderRate / 8) * 100;
        const malePercent = 100 - femalePercent;
        return `♂ ${malePercent.toFixed(1)}% / ♀ ${femalePercent.toFixed(1)}%`;
    }

    // Método para calcular el porcentaje de captura aproximado
    getCapturePercentage(captureRate) {
        // Fórmula simplificada para HP máximo y sin efectos de estado
        const percentage = ((captureRate / 255) * 100).toFixed(1);
        return percentage;
    }

    // Método para obtener el nombre de velocidad de crecimiento en español
    getGrowthRateName(growthRateName) {
        const growthRates = {
            'slow': 'Lenta',
            'medium': 'Media',
            'fast': 'Rápida',
            'medium-slow': 'Media-Lenta',
            'slow-then-very-fast': 'Lenta luego Muy Rápida',
            'fast-then-very-slow': 'Rápida luego Muy Lenta',
            'erratic': 'Errática',
            'fluctuating': 'Fluctuante'
        };
        return growthRates[growthRateName] || this.capitalizeFirstLetter(growthRateName);
    }

    // Método para renderizar la cadena evolutiva completa
    renderEvolutionChain(chain) {
        const evolutions = this.parseEvolutionChain(chain);
        
        return html`
            <div class="evolution-stages">
                ${evolutions.map((stage, stageIndex) => html`
                    ${stageIndex > 0 ? html`<div class="evolution-arrow">→</div>` : ''}
                    <div class="evolution-stage">
                        ${stage.map((pokemon, pokemonIndex) => {
                            const isCurrentPokemon = pokemon.id === this.fichaPokemon.idp.toString();
                            return html`
                                ${pokemonIndex > 0 ? html`<div class="evolution-or">o</div>` : ''}
                                <div class="evolution-pokemon-card ${isCurrentPokemon ? 'current' : 'clickable'}" 
                                     @click="${!isCurrentPokemon ? () => this.goToPokemonById(pokemon.id) : null}">
                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" 
                                         alt="${this.capitalizeFirstLetter(pokemon.name)}" 
                                         class="evolution-pokemon-image">
                                    <div class="evolution-pokemon-name">${this.capitalizeFirstLetter(pokemon.name)}</div>
                                    ${pokemon.evolutionDetails ? html`
                                        <div class="evolution-details">
                                            ${pokemon.evolutionDetails.map(detail => html`
                                                <div class="evolution-method">
                                                    ${this.getEvolutionMethodText(detail)}
                                                </div>
                                            `)}
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        })}
                    </div>
                `)}
            </div>
        `;
    }

    // Método para parsear la cadena evolutiva en un formato más manejable
    parseEvolutionChain(chain) {
        const stages = [];
        
        const processChain = (chainLink, stageIndex = 0) => {
            if (!stages[stageIndex]) {
                stages[stageIndex] = [];
            }
            
            // Extraer el ID del Pokémon de la URL de especies
            const speciesUrl = chainLink.species.url;
            const pokemonId = speciesUrl.split('/').filter(part => part).pop();
            
            stages[stageIndex].push({
                name: chainLink.species.name,
                id: pokemonId,
                evolutionDetails: chainLink.evolution_details.length > 0 ? chainLink.evolution_details : null
            });
            
            if (chainLink.evolves_to && chainLink.evolves_to.length > 0) {
                chainLink.evolves_to.forEach(evolution => {
                    processChain(evolution, stageIndex + 1);
                });
            }
        };
        
        processChain(chain);
        return stages;
    }

    // Método para obtener el ID del Pokémon a partir de su nombre
    getPokemonIdFromName(name) {
        // Este método ya no es necesario porque ahora extraemos el ID de la URL
        // Pero lo mantenemos por compatibilidad
        return 1;
    }

    // Método para obtener el texto descriptivo del método de evolución
    getEvolutionMethodText(detail) {
        let text = '';
        
        // Evolución por nivel
        if (detail.min_level) {
            text = `Nivel ${detail.min_level}`;
        }
        
        // Evolución por piedra
        if (detail.item) {
            const itemName = this.getItemNameInSpanish(detail.item.name);
            if (text) text += ' + ';
            text += itemName;
        }
        
        // Evolución por felicidad
        if (detail.min_happiness) {
            if (text) text += ', ';
            text += `Felicidad ${detail.min_happiness}`;
        }
        
        // Evolución por amistad/felicidad sin nivel
        if (detail.trigger && detail.trigger.name === 'level-up' && !detail.min_level && detail.min_happiness) {
            text = `Subir nivel con felicidad ${detail.min_happiness}`;
        }
        
        // Evolución por intercambio
        if (detail.trigger && detail.trigger.name === 'trade') {
            text = 'Intercambio';
            if (detail.held_item) {
                text += ` con ${this.getItemNameInSpanish(detail.held_item.name)}`;
            }
        }
        
        // Evolución por belleza
        if (detail.min_beauty) {
            if (text) text += ', ';
            text += `Belleza ${detail.min_beauty}`;
        }
        
        // Evolución con objeto equipado
        if (detail.held_item && detail.trigger && detail.trigger.name === 'level-up') {
            if (text) text += ' + ';
            text += `Con ${this.getItemNameInSpanish(detail.held_item.name)} equipado`;
        }
        
        // Evolución por hora del día
        if (detail.time_of_day) {
            if (text) text += ', ';
            const timeText = detail.time_of_day === 'day' ? 'Día' : detail.time_of_day === 'night' ? 'Noche' : detail.time_of_day;
            text += timeText;
        }
        
        // Evolución por ubicación
        if (detail.location) {
            if (text) text += ', ';
            text += `En ${this.capitalizeFirstLetter(detail.location.name)}`;
        }
        
        // Evolución con Pokémon en el equipo
        if (detail.party_species) {
            if (text) text += ', ';
            text += `Con ${this.capitalizeFirstLetter(detail.party_species.name)} en el equipo`;
        }
        
        // Evolución por género
        if (detail.gender) {
            if (text) text += ', ';
            text += detail.gender === 1 ? '♀ Hembra' : '♂ Macho';
        }
        
        // Evolución por movimiento conocido
        if (detail.known_move) {
            if (text) text += ', ';
            text += `Conociendo ${this.capitalizeFirstLetter(detail.known_move.name)}`;
        }
        
        // Evolución por tipo de movimiento
        if (detail.known_move_type) {
            if (text) text += ', ';
            text += `Con movimiento tipo ${this.capitalizeFirstLetter(detail.known_move_type.name)}`;
        }
        
        // Evolución por afecto (generaciones recientes)
        if (detail.min_affection) {
            if (text) text += ', ';
            text += `Afecto ${detail.min_affection}`;
        }
        
        // Si no hay detalles específicos, mostrar el trigger
        if (!text && detail.trigger) {
            text = this.capitalizeFirstLetter(detail.trigger.name.replace('-', ' '));
        }
        
        return text || 'Método desconocido';
    }

    // Método para traducir nombres de objetos/piedras al español
    getItemNameInSpanish(itemName) {
        const items = {
            'fire-stone': 'Piedra Fuego',
            'water-stone': 'Piedra Agua',
            'thunder-stone': 'Piedra Trueno',
            'leaf-stone': 'Piedra Hoja',
            'moon-stone': 'Piedra Lunar',
            'sun-stone': 'Piedra Solar',
            'shiny-stone': 'Piedra Día',
            'dusk-stone': 'Piedra Noche',
            'dawn-stone': 'Piedra Alba',
            'ice-stone': 'Piedra Hielo',
            'oval-stone': 'Piedra Oval',
            'kings-rock': 'Roca del Rey',
            'metal-coat': 'Revestimiento Metálico',
            'dragon-scale': 'Escama Dragón',
            'upgrade': 'Mejora',
            'prism-scale': 'Escama Bella',
            'protector': 'Protector',
            'electirizer': 'Electrizador',
            'magmarizer': 'Magmatizador',
            'dubious-disc': 'Disco Extraño',
            'reaper-cloth': 'Tela Terrible',
            'razor-claw': 'Garra Afilada',
            'razor-fang': 'Colmillo Agudo',
            'deep-sea-tooth': 'Diente Marino',
            'deep-sea-scale': 'Escama Marina',
            'linking-cord': 'Cordón Unión',
            'black-augurite': 'Mineral Negro',
            'peat-block': 'Bloque de Turba',
            'sweet-apple': 'Manzana Dulce',
            'tart-apple': 'Manzana Ácida',
            'cracked-pot': 'Tetera Agrietada',
            'chipped-pot': 'Tetera Rota',
            'galarica-cuff': 'Brazal Galanuez',
            'galarica-wreath': 'Corona Galanuez'
        };
        return items[itemName] || this.capitalizeFirstLetter(itemName.replace('-', ' '));
    }

    dividirCadena(cadenaADividir,separador) {
        var arrayDeCadenas = cadenaADividir.split(separador);
     
        return arrayDeCadenas;
     }
}

customElements.define('pokedex-main', PokedexMain);