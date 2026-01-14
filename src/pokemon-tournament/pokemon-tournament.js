import { LitElement, html, css } from 'lit';
import '../pokemon-battle-simulator/pokemon-battle-simulator.js';

export class PokemonTournament extends LitElement {
    static properties = {
        // Estado del torneo
        tournamentState: { type: String }, // 'setup', 'bracket', 'battle', 'results'
        tournamentSize: { type: Number },
        currentRound: { type: Number },
        currentMatch: { type: Number },
        
        // Datos del torneo
        playerPokemon: { type: Object },
        opponents: { type: Array },
        bracket: { type: Array },
        winners: { type: Array },
        
        // Datos del jugador
        playerName: { type: String },
        
        // Ranking
        ranking: { type: Array },
        
        // UI
        allPokemon: { type: Array },
        searchTerm: { type: String },
        selectedSize: { type: Number },
        
        // Batalla actual
        battleInProgress: { type: Boolean },
        currentBattleResult: { type: Object },
        
        // Datos para el simulador
        battlePokemon1: { type: Object },
        battlePokemon2: { type: Object },
        showBattleSimulator: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
        }

        .tournament-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .tournament-header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 15px;
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .tournament-header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .tournament-header p {
            margin: 0;
            font-size: 1.1em;
            opacity: 0.95;
        }

        /* Setup Screen */
        .setup-screen {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            color: #333;
        }

        .setup-section {
            margin-bottom: 30px;
        }

        .setup-section h2 {
            color: #667eea;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .size-selector {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: 15px;
        }

        .size-option {
            background: #f8f9fa;
            border: 3px solid #e0e0e0;
            border-radius: 12px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            color: #333;
        }

        .size-option:hover {
            border-color: #667eea;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
        }

        .size-option.selected {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            color: white;
        }

        .size-option .size-number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .size-option .size-label {
            font-size: 0.9em;
            opacity: 0.8;
        }

        .player-name-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 1.1em;
            margin-top: 10px;
            transition: all 0.3s;
            background: white;
            color: #333;
        }

        .player-name-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .pokemon-search {
            width: 100%;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 1.1em;
            margin-bottom: 15px;
            background: white;
            color: #333;
        }

        .pokemon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            max-height: 400px;
            overflow-y: auto;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .pokemon-card {
            background: white;
            border: 3px solid #e0e0e0;
            border-radius: 12px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            color: #333;
        }

        .pokemon-card:hover {
            border-color: #667eea;
            transform: scale(1.05);
        }

        .pokemon-card.selected {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            color: white;
        }

        .pokemon-card img {
            width: 80px;
            height: 80px;
            object-fit: contain;
        }

        .pokemon-card .name {
            font-weight: bold;
            margin-top: 8px;
            text-transform: capitalize;
        }

        .start-tournament-btn {
            width: 100%;
            padding: 20px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.3em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
        }

        .start-tournament-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(17, 153, 142, 0.3);
        }

        .start-tournament-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        /* Bracket Screen */
        .bracket-screen {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            color: #333;
        }

        .bracket-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
        }

        .bracket-info {
            font-size: 1.2em;
        }

        .bracket-container {
            display: grid;
            gap: 30px;
            overflow-x: auto;
            padding: 20px;
        }

        .round-column {
            min-width: 250px;
        }

        .round-title {
            text-align: center;
            font-size: 1.3em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .matches-list {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        .match-card {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s;
            color: #333;
        }

        .match-card:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .match-card.current {
            border-color: #667eea;
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
        }

        .match-participant {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            transition: all 0.3s;
        }

        .match-participant.winner {
            background: #d4edda;
            font-weight: bold;
        }

        .match-participant.loser {
            opacity: 0.5;
        }

        .match-participant.player {
            background: #e3f2fd;
        }

        .participant-sprite {
            width: 50px;
            height: 50px;
            object-fit: contain;
        }

        .participant-info {
            flex: 1;
        }

        .participant-name {
            font-weight: bold;
            font-size: 1.1em;
            text-transform: capitalize;
        }

        .participant-details {
            font-size: 0.85em;
            color: #666;
            margin-top: 3px;
        }

        .match-vs {
            text-align: center;
            padding: 5px;
            background: #f8f9fa;
            font-weight: bold;
            color: #667eea;
        }

        .battle-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border: none;
            border-radius: 0 0 10px 10px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }

        .battle-btn:hover {
            transform: scale(1.02);
        }

        /* Battle Screen */
        .battle-screen {
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            color: #333;
        }

        .battle-info {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
        }

        .battle-participant {
            text-align: center;
            flex: 1;
        }

        .battle-participant img {
            width: 120px;
            height: 120px;
            image-rendering: pixelated;
        }

        .battle-participant h3 {
            margin: 10px 0 5px 0;
            color: #667eea;
            font-size: 1.3em;
        }

        .battle-participant p {
            margin: 5px 0;
            color: #666;
            font-weight: bold;
        }

        .battle-details {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 10px;
            font-size: 0.9em;
            color: #666;
        }

        .battle-vs {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
            padding: 0 30px;
        }

        .battle-container {
            margin: 20px 0;
        }

        /* Results Screen */
        .results-screen {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            text-align: center;
            color: #333;
        }

        .trophy-icon {
            font-size: 6em;
            margin-bottom: 20px;
            animation: trophyBounce 1s ease-in-out infinite;
        }

        @keyframes trophyBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        .results-title {
            font-size: 2.5em;
            color: #667eea;
            margin-bottom: 20px;
        }

        .champion-display {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }

        .champion-sprite {
            width: 150px;
            height: 150px;
            object-fit: contain;
        }

        .champion-name {
            font-size: 2em;
            font-weight: bold;
            margin-top: 15px;
            text-transform: capitalize;
        }

        .tournament-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 30px 0;
        }

        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #e0e0e0;
            color: #333;
        }

        .stat-label {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }

        .action-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 30px;
        }

        .action-btn {
            padding: 18px;
            border: none;
            border-radius: 12px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }

        .new-tournament-btn {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
        }

        .view-ranking-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .action-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        /* Ranking Screen */
        .ranking-screen {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            color: #333;
        }

        .ranking-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .ranking-header h2 {
            font-size: 2em;
            color: #667eea;
            margin-bottom: 10px;
        }

        .ranking-header p {
            color: #666;
        }

        .ranking-list {
            max-width: 800px;
            margin: 0 auto;
        }

        .ranking-item {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
            margin-bottom: 15px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 2px solid #e0e0e0;
            transition: all 0.3s;
            color: #333;
        }

        .ranking-item:hover {
            border-color: #667eea;
            transform: translateX(5px);
        }

        .ranking-item.top-1 {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            border-color: #ffd700;
            color: #333;
        }

        .ranking-item.top-2 {
            background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
            border-color: #c0c0c0;
            color: #333;
        }

        .ranking-item.top-3 {
            background: linear-gradient(135deg, #cd7f32 0%, #d4a574 100%);
            border-color: #cd7f32;
            color: #333;
        }

        .ranking-position {
            font-size: 2em;
            font-weight: bold;
            min-width: 50px;
            text-align: center;
        }

        .ranking-pokemon {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
        }

        .ranking-sprite {
            width: 60px;
            height: 60px;
            object-fit: contain;
        }

        .ranking-details {
            flex: 1;
        }

        .ranking-name {
            font-size: 1.3em;
            font-weight: bold;
            text-transform: capitalize;
        }

        .ranking-player {
            font-size: 0.9em;
            color: #666;
            margin-top: 3px;
        }

        .ranking-stats {
            text-align: right;
        }

        .ranking-wins {
            font-size: 1.5em;
            font-weight: bold;
            color: #11998e;
        }

        .ranking-label {
            font-size: 0.8em;
            color: #666;
        }

        .back-btn {
            width: 100%;
            padding: 18px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            margin-top: 30px;
            transition: all 0.3s;
        }

        .back-btn:hover {
            background: #5a6268;
            transform: translateY(-2px);
        }

        /* LIGHT MODE (Explicit) */
        @media (prefers-color-scheme: light) {
            :host {
                color: #333 !important;
            }

            .setup-screen,
            .bracket-screen,
            .battle-screen,
            .results-screen,
            .ranking-screen {
                background: white !important;
                color: #333 !important;
            }

            .setup-section h2 {
                color: #667eea !important;
            }

            .size-option {
                background: #f8f9fa !important;
                border-color: #e0e0e0 !important;
                color: #333 !important;
            }

            .player-name-input,
            .pokemon-search {
                background: white !important;
                border-color: #ddd !important;
                color: #333 !important;
            }

            .pokemon-grid {
                background: #f8f9fa !important;
            }

            .pokemon-card {
                background: white !important;
                border-color: #e0e0e0 !important;
                color: #333 !important;
            }

            .round-title {
                color: #667eea !important;
                background: #f8f9fa !important;
            }

            .match-card {
                background: white !important;
                border-color: #e0e0e0 !important;
                color: #333 !important;
            }

            .match-participant {
                color: #333 !important;
            }

            .match-participant.winner {
                background: #d4edda !important;
            }

            .match-participant.player {
                background: #e3f2fd !important;
            }

            .match-vs {
                background: #f8f9fa !important;
                color: #667eea !important;
            }

            .participant-details {
                color: #666 !important;
            }

            .results-title {
                color: #667eea !important;
            }

            .champion-display {
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%) !important;
                color: #333 !important;
            }

            .stat-card {
                background: #f8f9fa !important;
                border-color: #e0e0e0 !important;
                color: #333 !important;
            }

            .stat-label {
                color: #666 !important;
            }

            .stat-value {
                color: #667eea !important;
            }

            .ranking-header h2 {
                color: #667eea !important;
            }

            .ranking-header p {
                color: #666 !important;
            }

            .ranking-item {
                background: #f8f9fa !important;
                border-color: #e0e0e0 !important;
                color: #333 !important;
            }

            .ranking-item.top-1 {
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%) !important;
                border-color: #ffd700 !important;
                color: #333 !important;
            }

            .ranking-item.top-2 {
                background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%) !important;
                border-color: #c0c0c0 !important;
                color: #333 !important;
            }

            .ranking-item.top-3 {
                background: linear-gradient(135deg, #cd7f32 0%, #d4a574 100%) !important;
                border-color: #cd7f32 !important;
                color: #333 !important;
            }

            .ranking-player,
            .ranking-label {
                color: #666 !important;
            }

            .back-btn {
                background: #6c757d !important;
            }

            .back-btn:hover {
                background: #5a6268 !important;
            }

            .battle-info {
                background: #f8f9fa !important;
            }

            .battle-participant h3 {
                color: #667eea !important;
            }

            .battle-participant p,
            .battle-details {
                color: #666 !important;
            }

            .battle-vs {
                color: #667eea !important;
            }
        }

        /* DARK MODE */
        @media (prefers-color-scheme: dark) {
            .setup-screen,
            .bracket-screen,
            .battle-screen,
            .results-screen,
            .ranking-screen {
                background: #1a1a2e;
                color: #e0e0e0;
            }

            .setup-section h2 {
                color: #8b9ff5;
            }

            .size-option {
                background: #2d2d44;
                border-color: #3d3d5c;
                color: #e0e0e0;
            }

            .size-option:hover {
                border-color: #8b9ff5;
                box-shadow: 0 5px 15px rgba(139, 159, 245, 0.3);
            }

            .player-name-input,
            .pokemon-search {
                background: #2d2d44;
                border-color: #3d3d5c;
                color: #e0e0e0;
            }

            .player-name-input:focus,
            .pokemon-search:focus {
                border-color: #8b9ff5;
                box-shadow: 0 0 0 3px rgba(139, 159, 245, 0.2);
            }

            .pokemon-grid {
                background: #2d2d44;
            }

            .pokemon-card {
                background: #2d2d44;
                border-color: #3d3d5c;
                color: #e0e0e0;
            }

            .pokemon-card:hover {
                border-color: #8b9ff5;
            }

            .round-title {
                color: #8b9ff5;
                background: #2d2d44;
            }

            .match-card {
                background: #2d2d44;
                border-color: #3d3d5c;
            }

            .match-card:hover {
                box-shadow: 0 5px 15px rgba(139, 159, 245, 0.2);
            }

            .match-participant {
                color: #e0e0e0;
            }

            .match-participant.winner {
                background: rgba(76, 175, 80, 0.3);
            }

            .match-participant.player {
                background: rgba(33, 150, 243, 0.3);
            }

            .match-vs {
                background: #2d2d44;
                color: #8b9ff5;
            }

            .participant-details {
                color: #b0b0b0;
            }

            .results-screen {
                color: #e0e0e0;
            }

            .results-title {
                color: #8b9ff5;
            }

            .champion-display {
                background: linear-gradient(135deg, #b8860b 0%, #daa520 100%);
                color: #1a1a2e;
            }

            .stat-card {
                background: #2d2d44;
                border-color: #3d3d5c;
                color: #e0e0e0;
            }

            .stat-label {
                color: #b0b0b0;
            }

            .stat-value {
                color: #8b9ff5;
            }

            .ranking-header h2 {
                color: #8b9ff5;
            }

            .ranking-header p {
                color: #b0b0b0;
            }

            .ranking-item {
                background: #2d2d44;
                border-color: #3d3d5c;
                color: #e0e0e0;
            }

            .ranking-item:hover {
                border-color: #8b9ff5;
            }

            .ranking-item.top-1 {
                background: linear-gradient(135deg, #b8860b 0%, #daa520 100%);
                border-color: #b8860b;
                color: #1a1a2e;
            }

            .ranking-item.top-2 {
                background: linear-gradient(135deg, #6c757d 0%, #8a939b 100%);
                border-color: #6c757d;
                color: #e0e0e0;
            }

            .ranking-item.top-3 {
                background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
                border-color: #8b4513;
                color: #e0e0e0;
            }

            .ranking-player,
            .ranking-label {
                color: #b0b0b0;
            }

            .ranking-item.top-1 .ranking-player,
            .ranking-item.top-1 .ranking-label {
                color: #1a1a2e;
            }

            .back-btn {
                background: #3d3d5c;
            }

            .back-btn:hover {
                background: #4d4d6c;
            }

            .battle-info {
                background: #2d2d44;
            }

            .battle-participant h3 {
                color: #8b9ff5;
            }

            .battle-participant p,
            .battle-details {
                color: #b0b0b0;
            }

            .battle-vs {
                color: #8b9ff5;
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .size-selector {
                grid-template-columns: 1fr;
            }

            .pokemon-grid {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            }

            .tournament-stats {
                grid-template-columns: 1fr;
            }

            .action-buttons {
                grid-template-columns: 1fr;
            }
        }
    `;

    constructor() {
        super();
        this.tournamentState = 'setup';
        this.tournamentSize = 8;
        this.currentRound = 0;
        this.currentMatch = 0;
        this.playerPokemon = null;
        this.opponents = [];
        this.bracket = [];
        this.winners = [];
        this.playerName = 'Entrenador';
        this.allPokemon = [];
        this.searchTerm = '';
        this.selectedSize = 8;
        this.battleInProgress = false;
        this.currentBattleResult = null;
        this.battlePokemon1 = null;
        this.battlePokemon2 = null;
        this.showBattleSimulator = false;
        this.ranking = this.loadRanking();
        this.loadAllPokemon();
    }

    async loadAllPokemon() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
            const data = await response.json();
            this.allPokemon = data.results.map((p, index) => ({
                name: p.name,
                id: index + 1,
                url: p.url
            }));
        } catch (error) {
            console.error('Error loading Pokemon:', error);
        }
    }

    async selectPlayerPokemon(pokemon) {
        this.playerPokemon = await this.loadPokemonData(pokemon.url);
        this.requestUpdate();
    }

    async loadPokemonData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            // Cargar datos de los primeros 20 movimientos
            const movePromises = data.moves.slice(0, 20).map(async m => {
                try {
                    const moveResponse = await fetch(m.move.url);
                    const moveData = await moveResponse.json();
                    return {
                        name: moveData.name,
                        displayName: moveData.name.replace(/-/g, ' ').split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' '),
                        type: moveData.type.name,
                        power: moveData.power || 0,
                        accuracy: moveData.accuracy || 100,
                        category: moveData.damage_class.name,
                        pp: moveData.pp
                    };
                } catch (error) {
                    console.error('Error loading move:', m.move.name, error);
                    return null;
                }
            });
            
            const moves = (await Promise.all(movePromises)).filter(m => m !== null);
            
            return {
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                types: data.types.map(t => t.type.name),
                stats: {
                    hp: data.stats[0].base_stat,
                    attack: data.stats[1].base_stat,
                    defense: data.stats[2].base_stat,
                    spAttack: data.stats[3].base_stat,
                    spDefense: data.stats[4].base_stat,
                    speed: data.stats[5].base_stat
                },
                abilities: data.abilities.map(a => ({
                    name: a.ability.name,
                    isHidden: a.is_hidden
                })),
                moves: moves
            };
        } catch (error) {
            console.error('Error loading Pokemon data:', error);
            return null;
        }
    }

    getRandomAbility(abilities) {
        const randomIndex = Math.floor(Math.random() * abilities.length);
        return abilities[randomIndex].name;
    }

    getRandomItem() {
        const items = [
            'leftovers', 'choice-band', 'choice-specs', 'choice-scarf',
            'life-orb', 'expert-belt', 'focus-sash', 'focus-band',
            'charcoal', 'mystic-water', 'miracle-seed', 'magnet',
            'sitrus-berry', 'lum-berry'
        ];
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    getRandomMoves(moves, count = 4) {
        const shuffled = [...moves].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, moves.length));
    }

    async generateOpponents() {
        const needed = this.tournamentSize - 1;
        const availablePokemon = this.allPokemon.filter(p => p.name !== this.playerPokemon.name);
        const shuffled = [...availablePokemon].sort(() => Math.random() - 0.5);
        
        this.opponents = [];
        for (let i = 0; i < needed; i++) {
            const pokemonData = await this.loadPokemonData(shuffled[i].url);
            if (pokemonData) {
                pokemonData.ability = this.getRandomAbility(pokemonData.abilities);
                pokemonData.item = this.getRandomItem();
                pokemonData.selectedMoves = this.getRandomMoves(pokemonData.moves);
                pokemonData.isOpponent = true;
                this.opponents.push(pokemonData);
            }
        }
    }

    async startTournament() {
        if (!this.playerPokemon) return;
        
        this.tournamentState = 'generating';
        this.requestUpdate();
        
        // Preparar el Pokémon del jugador
        this.playerPokemon.ability = this.getRandomAbility(this.playerPokemon.abilities);
        this.playerPokemon.item = this.getRandomItem();
        this.playerPokemon.selectedMoves = this.getRandomMoves(this.playerPokemon.moves);
        this.playerPokemon.isPlayer = true;
        
        await this.generateOpponents();
        this.generateBracket();
        
        this.tournamentState = 'bracket';
        this.currentRound = 0;
        this.currentMatch = 0;
    }

    generateBracket() {
        // Crear el bracket inicial mezclando jugador y oponentes
        const allParticipants = [this.playerPokemon, ...this.opponents];
        const shuffled = [...allParticipants].sort(() => Math.random() - 0.5);
        
        // Crear estructura del bracket
        this.bracket = [];
        const rounds = Math.log2(this.tournamentSize);
        
        for (let round = 0; round < rounds; round++) {
            this.bracket[round] = [];
        }
        
        // Primera ronda
        for (let i = 0; i < shuffled.length; i += 2) {
            this.bracket[0].push({
                participant1: shuffled[i],
                participant2: shuffled[i + 1],
                winner: null,
                completed: false
            });
        }
    }

    getRoundName(roundIndex) {
        const totalRounds = this.bracket.length;
        if (roundIndex === totalRounds - 1) return 'Final';
        if (roundIndex === totalRounds - 2) return 'Semifinales';
        if (roundIndex === totalRounds - 3) return 'Cuartos de Final';
        return `Ronda ${roundIndex + 1}`;
    }

    getCurrentMatch() {
        if (!this.bracket[this.currentRound]) return null;
        return this.bracket[this.currentRound][this.currentMatch];
    }

    async startBattle() {
        const match = this.getCurrentMatch();
        if (!match) return;
        
        const isPlayerMatch = match.participant1.isPlayer || match.participant2.isPlayer;
        
        if (isPlayerMatch) {
            // Si es combate del jugador, usar el simulador real
            this.battleInProgress = true;
            this.showBattleSimulator = true;
            
            // Preparar los datos para el simulador
            if (match.participant1.isPlayer) {
                this.battlePokemon1 = match.participant1;
                this.battlePokemon2 = match.participant2;
            } else {
                this.battlePokemon1 = match.participant2;
                this.battlePokemon2 = match.participant1;
            }
            
            console.log('🎯 Iniciando batalla del torneo:', {
                battlePokemon1: this.battlePokemon1?.name,
                battlePokemon2: this.battlePokemon2?.name,
                state: this.tournamentState
            });
            
            this.tournamentState = 'battle';
            this.requestUpdate();
        } else {
            // Si es combate CPU vs CPU, simular automáticamente
            await this.simulateBattle(match);
        }
    }

    async simulateBattle(match) {
        // Simular tiempo de batalla para combates CPU vs CPU
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Determinar ganador aleatoriamente para CPU vs CPU
        const winner = Math.random() < 0.5 ? match.participant1 : match.participant2;
        
        match.winner = winner;
        match.completed = true;
        this.battleInProgress = false;
        
        // Avanzar al siguiente combate
        this.advanceToNextMatch();
    }

    // Manejar el resultado de una batalla real del jugador
    handleBattleResult(event) {
        const { winner, winnerPlayer, isDraw } = event.detail;
        const match = this.getCurrentMatch();
        
        if (!match) return;
        
        // En caso de empate, decidir aleatoriamente (o el jugador gana por defecto)
        if (isDraw) {
            // Dar ventaja al jugador en caso de empate
            match.winner = match.participant1.isPlayer ? match.participant1 : match.participant2;
        } else {
            // Determinar quién ganó basándose en el Pokémon ganador
            if (winner.name === match.participant1.name) {
                match.winner = match.participant1;
            } else {
                match.winner = match.participant2;
            }
        }
        
        match.completed = true;
        this.battleInProgress = false;
        this.showBattleSimulator = false;
        this.tournamentState = 'bracket';
        
        // Avanzar al siguiente combate
        this.advanceToNextMatch();
    }

    // Volver al bracket sin completar la batalla
    cancelBattle() {
        this.showBattleSimulator = false;
        this.battleInProgress = false;
        this.tournamentState = 'bracket';
    }

    advanceToNextMatch() {
        this.currentMatch++;
        
        // Si terminamos todos los combates de la ronda
        if (this.currentMatch >= this.bracket[this.currentRound].length) {
            // Avanzar a la siguiente ronda
            this.advanceToNextRound();
        }
        
        this.requestUpdate();
    }

    advanceToNextRound() {
        const nextRoundIndex = this.currentRound + 1;
        
        // Si no hay más rondas, el torneo terminó
        if (nextRoundIndex >= this.bracket.length) {
            this.finishTournament();
            return;
        }
        
        // Crear los combates de la siguiente ronda con los ganadores
        const winners = this.bracket[this.currentRound]
            .filter(match => match.completed && match.winner)
            .map(match => match.winner);
        
        this.bracket[nextRoundIndex] = [];
        for (let i = 0; i < winners.length; i += 2) {
            this.bracket[nextRoundIndex].push({
                participant1: winners[i],
                participant2: winners[i + 1],
                winner: null,
                completed: false
            });
        }
        
        this.currentRound = nextRoundIndex;
        this.currentMatch = 0;
    }

    finishTournament() {
        const champion = this.bracket[this.bracket.length - 1][0].winner;
        this.winners.push(champion);
        
        // Actualizar ranking si el jugador ganó
        if (champion.isPlayer) {
            this.updateRanking(champion);
        }
        
        this.tournamentState = 'results';
    }

    updateRanking(pokemon) {
        const existing = this.ranking.find(r => r.pokemonName === pokemon.name && r.playerName === this.playerName);
        
        if (existing) {
            existing.wins++;
            existing.lastWin = new Date().toISOString();
        } else {
            this.ranking.push({
                pokemonName: pokemon.name,
                pokemonId: pokemon.id,
                playerName: this.playerName,
                wins: 1,
                lastWin: new Date().toISOString()
            });
        }
        
        // Ordenar por victorias
        this.ranking.sort((a, b) => b.wins - a.wins);
        
        // Guardar en localStorage
        this.saveRanking();
    }

    loadRanking() {
        try {
            const saved = localStorage.getItem('pokemon-tournament-ranking');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    saveRanking() {
        try {
            localStorage.setItem('pokemon-tournament-ranking', JSON.stringify(this.ranking));
        } catch (error) {
            console.error('Error saving ranking:', error);
        }
    }

    newTournament() {
        this.tournamentState = 'setup';
        this.currentRound = 0;
        this.currentMatch = 0;
        this.playerPokemon = null;
        this.opponents = [];
        this.bracket = [];
        this.winners = [];
        this.requestUpdate();
    }

    viewRanking() {
        this.tournamentState = 'ranking';
    }

    get filteredPokemon() {
        if (!this.searchTerm) return this.allPokemon;
        return this.allPokemon.filter(p => 
            p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    render() {
        console.log('🎨 Tournament render() - State:', this.tournamentState);
        console.log('🎨 battlePokemon1:', this.battlePokemon1?.name);
        console.log('🎨 battlePokemon2:', this.battlePokemon2?.name);
        
        return html`
            <div class="tournament-container">
                <!-- Debug visible -->
                <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-family: monospace; font-size: 12px;">
                    <div>Estado: <strong>${this.tournamentState}</strong></div>
                    <div>Pokemon1: ${this.battlePokemon1?.name || 'null'}</div>
                    <div>Pokemon2: ${this.battlePokemon2?.name || 'null'}</div>
                </div>
                
                ${this.tournamentState === 'setup' ? this.renderSetup() : ''}
                ${this.tournamentState === 'generating' ? this.renderGenerating() : ''}
                ${this.tournamentState === 'bracket' ? this.renderBracket() : ''}
                ${this.tournamentState === 'battle' ? this.renderBattle() : ''}
                ${this.tournamentState === 'results' ? this.renderResults() : ''}
                ${this.tournamentState === 'ranking' ? this.renderRanking() : ''}
            </div>
        `;
    }

    renderSetup() {
        return html`
            <div class="tournament-header">
                <h1>🏆 Modo Torneo Pokémon</h1>
                <p>¡Demuestra que eres el mejor entrenador!</p>
            </div>

            <div class="setup-screen">
                <div class="setup-section">
                    <h2>👤 Tu Nombre</h2>
                    <input
                        type="text"
                        class="player-name-input"
                        .value="${this.playerName}"
                        @input="${(e) => this.playerName = e.target.value}"
                        placeholder="Ingresa tu nombre..."
                    />
                </div>

                <div class="setup-section">
                    <h2>🎯 Tamaño del Torneo</h2>
                    <div class="size-selector">
                        ${[8, 16, 32].map(size => html`
                            <div 
                                class="size-option ${this.selectedSize === size ? 'selected' : ''}"
                                @click="${() => { this.selectedSize = size; this.tournamentSize = size; }}"
                            >
                                <div class="size-number">${size}</div>
                                <div class="size-label">Participantes</div>
                            </div>
                        `)}
                    </div>
                </div>

                <div class="setup-section">
                    <h2>⚡ Selecciona tu Pokémon</h2>
                    <input
                        type="text"
                        class="pokemon-search"
                        .value="${this.searchTerm}"
                        @input="${(e) => this.searchTerm = e.target.value}"
                        placeholder="Buscar Pokémon..."
                    />
                    <div class="pokemon-grid">
                        ${this.filteredPokemon.map(pokemon => html`
                            <div 
                                class="pokemon-card ${this.playerPokemon?.name === pokemon.name ? 'selected' : ''}"
                                @click="${() => this.selectPlayerPokemon(pokemon)}"
                            >
                                <img 
                                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png"
                                    alt="${pokemon.name}"
                                />
                                <div class="name">${pokemon.name}</div>
                            </div>
                        `)}
                    </div>
                </div>

                <button 
                    class="start-tournament-btn"
                    ?disabled="${!this.playerPokemon}"
                    @click="${this.startTournament}"
                >
                    ${this.playerPokemon ? '¡Comenzar Torneo! 🎮' : 'Selecciona un Pokémon primero'}
                </button>
            </div>
        `;
    }

    renderGenerating() {
        return html`
            <div class="tournament-header">
                <h1>🏆 Generando Torneo</h1>
                <p>Preparando oponentes aleatorios...</p>
            </div>
            <div class="setup-screen" style="text-align: center; padding: 60px;">
                <div style="font-size: 4em;">⚡</div>
                <div style="font-size: 1.5em; margin-top: 20px;">Cargando...</div>
            </div>
        `;
    }

    renderBracket() {
        const currentMatch = this.getCurrentMatch();
        const totalMatches = this.bracket.reduce((sum, round) => sum + round.length, 0);
        const completedMatches = this.bracket.reduce((sum, round) => 
            sum + round.filter(m => m.completed).length, 0
        );

        return html`
            <div class="bracket-header">
                <div class="bracket-info">
                    <div style="font-size: 1.5em; margin-bottom: 5px;">
                        ${this.getRoundName(this.currentRound)}
                    </div>
                    <div style="font-size: 0.9em; opacity: 0.9;">
                        Combate ${this.currentMatch + 1} de ${this.bracket[this.currentRound].length}
                    </div>
                </div>
                <div class="bracket-info">
                    <div style="font-size: 0.9em; opacity: 0.9;">Progreso Total</div>
                    <div style="font-size: 1.3em;">${completedMatches} / ${totalMatches} combates</div>
                </div>
            </div>

            <div class="bracket-screen">
                ${currentMatch ? this.renderCurrentMatch(currentMatch) : html`
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 3em;">🏆</div>
                        <div style="font-size: 1.5em; margin-top: 20px;">
                            ¡Torneo Completado!
                        </div>
                    </div>
                `}

                ${this.bracket.length > 0 ? html`
                    <div style="margin-top: 40px;">
                        <h3 style="text-align: center; color: #667eea; margin-bottom: 20px;">
                            📊 Progreso del Bracket
                        </h3>
                        ${this.bracket.map((round, roundIndex) => html`
                            <div style="margin-bottom: 20px;">
                                <div class="round-title">${this.getRoundName(roundIndex)}</div>
                                <div class="matches-list">
                                    ${round.map((match, matchIndex) => this.renderMatch(match, roundIndex, matchIndex))}
                                </div>
                            </div>
                        `)}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderCurrentMatch(match) {
        return html`
            <div class="match-card current" style="max-width: 600px; margin: 0 auto;">
                <div class="match-participant ${match.participant1.isPlayer ? 'player' : ''}">
                    <img class="participant-sprite" src="${match.participant1.sprite}" alt="${match.participant1.name}">
                    <div class="participant-info">
                        <div class="participant-name">
                            ${match.participant1.isPlayer ? '👤 ' : '🤖 '}
                            ${match.participant1.name}
                        </div>
                        <div class="participant-details">
                            ${match.participant1.ability} • ${match.participant1.item}
                        </div>
                    </div>
                </div>
                
                <div class="match-vs">⚔️ VS ⚔️</div>
                
                <div class="match-participant ${match.participant2.isPlayer ? 'player' : ''}">
                    <img class="participant-sprite" src="${match.participant2.sprite}" alt="${match.participant2.name}">
                    <div class="participant-info">
                        <div class="participant-name">
                            ${match.participant2.isPlayer ? '👤 ' : '🤖 '}
                            ${match.participant2.name}
                        </div>
                        <div class="participant-details">
                            ${match.participant2.ability} • ${match.participant2.item}
                        </div>
                    </div>
                </div>

                <button 
                    class="battle-btn"
                    ?disabled="${this.battleInProgress}"
                    @click="${this.startBattle}"
                >
                    ${this.battleInProgress ? '⚔️ Batalla en curso...' : '⚔️ ¡Iniciar Batalla!'}
                </button>
            </div>
        `;
    }

    renderMatch(match, roundIndex, matchIndex) {
        const isCurrent = roundIndex === this.currentRound && matchIndex === this.currentMatch;
        
        return html`
            <div class="match-card ${isCurrent ? 'current' : ''}">
                <div class="match-participant ${match.winner === match.participant1 ? 'winner' : match.completed ? 'loser' : ''} ${match.participant1.isPlayer ? 'player' : ''}">
                    <img class="participant-sprite" src="${match.participant1.sprite}" alt="${match.participant1.name}">
                    <div class="participant-info">
                        <div class="participant-name">
                            ${match.participant1.isPlayer ? '👤 ' : ''}${match.participant1.name}
                        </div>
                    </div>
                    ${match.winner === match.participant1 ? html`<div style="font-size: 1.5em;">✓</div>` : ''}
                </div>
                
                <div class="match-vs">VS</div>
                
                <div class="match-participant ${match.winner === match.participant2 ? 'winner' : match.completed ? 'loser' : ''} ${match.participant2.isPlayer ? 'player' : ''}">
                    <img class="participant-sprite" src="${match.participant2.sprite}" alt="${match.participant2.name}">
                    <div class="participant-info">
                        <div class="participant-name">
                            ${match.participant2.isPlayer ? '👤 ' : ''}${match.participant2.name}
                        </div>
                    </div>
                    ${match.winner === match.participant2 ? html`<div style="font-size: 1.5em;">✓</div>` : ''}
                </div>
            </div>
        `;
    }

    renderBattle() {
        console.log('🎮 renderBattle() llamado');
        console.log('battlePokemon1:', this.battlePokemon1);
        console.log('battlePokemon2:', this.battlePokemon2);
        
        if (!this.battlePokemon1 || !this.battlePokemon2) {
            console.log('❌ No hay Pokemon para la batalla');
            return html`
                <div style="padding: 40px; background: #ffebee; border: 3px solid red; border-radius: 10px; margin: 20px;">
                    <h2 style="color: red;">⚠️ ERROR: No hay Pokemon para la batalla</h2>
                    <p>battlePokemon1: ${this.battlePokemon1 ? this.battlePokemon1.name : 'null'}</p>
                    <p>battlePokemon2: ${this.battlePokemon2 ? this.battlePokemon2.name : 'null'}</p>
                    <p>tournamentState: ${this.tournamentState}</p>
                    <button class="back-btn" @click="${this.cancelBattle}">← Volver</button>
                </div>
            `;
        }
        
        // Debug: Verificar datos antes de pasar al simulador
        console.log('✅ Pokemon cargados, renderizando batalla:', {
            pokemon1: {
                name: this.battlePokemon1.name,
                ability: this.battlePokemon1.ability,
                item: this.battlePokemon1.item,
                selectedMoves: this.battlePokemon1.selectedMoves,
                stats: this.battlePokemon1.stats
            },
            pokemon2: {
                name: this.battlePokemon2.name,
                ability: this.battlePokemon2.ability,
                item: this.battlePokemon2.item,
                selectedMoves: this.battlePokemon2.selectedMoves,
                stats: this.battlePokemon2.stats
            }
        });
        
        return html`
            <div class="battle-screen">
                <div class="tournament-header">
                    <h2>⚔️ Combate del Torneo</h2>
                    <p>Ronda ${this.getRoundName(this.currentRound)} - Combate ${this.currentMatch + 1}</p>
                </div>
                
                <div style="padding: 20px; background: #e8f5e9; border: 3px solid #4caf50; border-radius: 10px; margin: 20px;">
                    <h3 style="color: #2e7d32;">✅ TEST: La vista de batalla se está renderizando</h3>
                    <p>Pokemon 1: ${this.battlePokemon1.name}</p>
                    <p>Pokemon 2: ${this.battlePokemon2.name}</p>
                </div>
                
                <div class="battle-info">
                    <div class="battle-participant">
                        <img src="${this.battlePokemon1.sprite}" alt="${this.battlePokemon1.name}">
                        <h3>${this.capitalizeFirstLetter(this.battlePokemon1.name)}</h3>
                        <p>🎮 Jugador</p>
                        <div class="battle-details">
                            <span>Habilidad: ${this.capitalizeFirstLetter(this.battlePokemon1.ability)}</span>
                            <span>Objeto: ${this.capitalizeFirstLetter(this.battlePokemon1.item)}</span>
                        </div>
                    </div>
                    
                    <div class="battle-vs">VS</div>
                    
                    <div class="battle-participant">
                        <img src="${this.battlePokemon2.sprite}" alt="${this.battlePokemon2.name}">
                        <h3>${this.capitalizeFirstLetter(this.battlePokemon2.name)}</h3>
                        <p>🤖 Oponente</p>
                        <div class="battle-details">
                            <span>Habilidad: ${this.capitalizeFirstLetter(this.battlePokemon2.ability)}</span>
                            <span>Objeto: ${this.capitalizeFirstLetter(this.battlePokemon2.item)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="battle-container">
                    <h3 style="background: yellow; padding: 20px;">🔍 DEBUG: Verificando datos del simulador</h3>
                    <pre style="background: #f0f0f0; padding: 10px; overflow: auto;">
battlePokemon1: ${JSON.stringify({
    name: this.battlePokemon1?.name,
    sprite: this.battlePokemon1?.sprite,
    ability: this.battlePokemon1?.ability,
    item: this.battlePokemon1?.item,
    movesCount: this.battlePokemon1?.selectedMoves?.length,
    hasStats: !!this.battlePokemon1?.stats
}, null, 2)}

battlePokemon2: ${JSON.stringify({
    name: this.battlePokemon2?.name,
    sprite: this.battlePokemon2?.sprite,
    ability: this.battlePokemon2?.ability,
    item: this.battlePokemon2?.item,
    movesCount: this.battlePokemon2?.selectedMoves?.length,
    hasStats: !!this.battlePokemon2?.stats
}, null, 2)}
                    </pre>
                    
                    <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border: 2px solid #ffc107; border-radius: 10px;">
                        <h4>⚠️ Intentando renderizar pokemon-battle-simulator...</h4>
                    </div>
                    
                    <pokemon-battle-simulator
                        id="tournament-battle-simulator"
                        .player1Pokemon="${this.battlePokemon1}"
                        .player2Pokemon="${this.battlePokemon2}"
                        .player1Ability="${this.battlePokemon1.ability}"
                        .player2Ability="${this.battlePokemon2.ability}"
                        .player1Item="${this.battlePokemon1.item}"
                        .player2Item="${this.battlePokemon2.item}"
                        .player1SelectedMoves="${this.battlePokemon1.selectedMoves}"
                        .player2SelectedMoves="${this.battlePokemon2.selectedMoves}"
                        .player1AI="${false}"
                        .player2AI="${true}"
                        .fromTournament="${true}"
                        @battle-ended="${this.handleBattleResult}"
                    ></pokemon-battle-simulator>
                    
                    <div style="background: #d4edda; padding: 20px; margin: 20px 0; border: 2px solid #28a745; border-radius: 10px;">
                        <h4>✅ pokemon-battle-simulator renderizado (debería aparecer arriba)</h4>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button class="back-btn" @click="${this.cancelBattle}">
                        ← Volver al Bracket (Abandonar)
                    </button>
                </div>
            </div>
        `;
    }

    capitalizeFirstLetter(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    renderResults() {
        const champion = this.bracket[this.bracket.length - 1][0].winner;
        const isPlayerChampion = champion.isPlayer;
        const totalBattles = this.bracket.reduce((sum, round) => sum + round.length, 0);

        return html`
            <div class="tournament-header">
                <h1>🏆 ${isPlayerChampion ? '¡Felicidades!' : 'Fin del Torneo'}</h1>
                <p>${isPlayerChampion ? '¡Eres el Campeón del Torneo!' : 'Mejor suerte la próxima vez'}</p>
            </div>

            <div class="results-screen">
                <div class="trophy-icon">${isPlayerChampion ? '🏆' : '🥈'}</div>
                
                <div class="results-title">
                    ${isPlayerChampion ? '¡Victoria!' : 'Subcampeón'}
                </div>

                <div class="champion-display">
                    <img class="champion-sprite" src="${champion.sprite}" alt="${champion.name}">
                    <div class="champion-name">${champion.name}</div>
                    <div style="margin-top: 10px; font-size: 1.1em;">
                        ${champion.isPlayer ? this.playerName : 'CPU'}
                    </div>
                </div>

                <div class="tournament-stats">
                    <div class="stat-card">
                        <div class="stat-label">Participantes</div>
                        <div class="stat-value">${this.tournamentSize}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Total Batallas</div>
                        <div class="stat-value">${totalBattles}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Rondas</div>
                        <div class="stat-value">${this.bracket.length}</div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="action-btn new-tournament-btn" @click="${this.newTournament}">
                        🔄 Nuevo Torneo
                    </button>
                    <button class="action-btn view-ranking-btn" @click="${this.viewRanking}">
                        📊 Ver Ranking
                    </button>
                </div>
            </div>
        `;
    }

    renderRanking() {
        return html`
            <div class="tournament-header">
                <h1>📊 Ranking de Campeones</h1>
                <p>Los mejores entrenadores y sus Pokémon</p>
            </div>

            <div class="ranking-screen">
                <div class="ranking-header">
                    <h2>🏆 Top Campeones</h2>
                    <p>Ordenados por victorias en torneos</p>
                </div>

                <div class="ranking-list">
                    ${this.ranking.length === 0 ? html`
                        <div style="text-align: center; padding: 40px; color: #666;">
                            <div style="font-size: 3em; margin-bottom: 20px;">🏆</div>
                            <div style="font-size: 1.2em;">
                                Aún no hay campeones registrados
                            </div>
                            <div style="margin-top: 10px;">
                                ¡Gana tu primer torneo para aparecer aquí!
                            </div>
                        </div>
                    ` : this.ranking.map((entry, index) => html`
                        <div class="ranking-item ${index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : ''}">
                            <div class="ranking-position">
                                ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </div>
                            <div class="ranking-pokemon">
                                <img 
                                    class="ranking-sprite"
                                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.pokemonId}.png"
                                    alt="${entry.pokemonName}"
                                />
                                <div class="ranking-details">
                                    <div class="ranking-name">${entry.pokemonName}</div>
                                    <div class="ranking-player">Entrenador: ${entry.playerName}</div>
                                </div>
                            </div>
                            <div class="ranking-stats">
                                <div class="ranking-wins">${entry.wins}</div>
                                <div class="ranking-label">victoria${entry.wins !== 1 ? 's' : ''}</div>
                            </div>
                        </div>
                    `)}
                </div>

                <button class="back-btn" @click="${() => this.tournamentState = 'setup'}">
                    ← Volver al Inicio
                </button>
            </div>
        `;
    }
}

customElements.define('pokemon-tournament', PokemonTournament);
