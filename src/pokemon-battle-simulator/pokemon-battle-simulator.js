import { LitElement, html, css } from 'lit';

export class PokemonBattleSimulator extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .simulator-container {
            max-width: 1600px;
            margin: 0 auto;
        }

        .simulator-header {
            text-align: center;
            margin-bottom: 40px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            padding: 40px 20px;
            border-radius: 20px;
            color: white;
            box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3);
        }

        .simulator-title {
            font-size: 3em;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .battle-icon {
            font-size: 4em;
            margin-bottom: 10px;
            animation: shake 2s infinite;
        }

        @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
        }

        .simulator-subtitle {
            font-size: 1.2em;
            margin-top: 10px;
            opacity: 0.9;
        }

        .setup-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }

        .team-setup {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .team-setup.player1 {
            border-left: 5px solid #3498db;
        }

        .team-setup.player2 {
            border-left: 5px solid #e74c3c;
        }

        .team-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .team-title {
            font-size: 1.8em;
            font-weight: bold;
            margin: 0;
        }

        .team-title.player1 {
            color: #5dade2;
        }

        .team-title.player2 {
            color: #ec7063;
        }

        .ai-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #333;
        }

        .toggle-switch {
            position: relative;
            width: 60px;
            height: 30px;
            background: #ccc;
            border-radius: 15px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .toggle-switch.active {
            background: #2ecc71;
        }

        .toggle-slider {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 24px;
            height: 24px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }

        .toggle-switch.active .toggle-slider {
            transform: translateX(30px);
        }

        .pokemon-selector {
            margin-bottom: 20px;
        }

        .search-box {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1em;
            transition: border-color 0.3s;
            box-sizing: border-box;
            background: white;
            color: #333;
        }

        .search-box:focus {
            outline: none;
            border-color: #3498db;
        }

        .pokemon-results {
            max-height: 200px;
            overflow-y: auto;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            margin-top: 10px;
            display: none;
            background: white;
        }

        .pokemon-results.show {
            display: block;
        }

        .pokemon-result-item {
            padding: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.3s;
            color: #333;
        }

        .pokemon-result-item:hover {
            background: #f5f5f5;
        }

        .pokemon-result-item img {
            width: 40px;
            height: 40px;
        }

        .selected-pokemon {
            background: white;
            border-radius: 15px;
            padding: 20px;
            margin-top: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .selected-pokemon-display {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 15px;
        }

        .pokemon-sprite {
            width: 120px;
            height: 120px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .pokemon-info {
            flex: 1;
        }

        .pokemon-name {
            font-size: 1.8em;
            font-weight: bold;
            color: #333;
            margin: 0 0 10px 0;
        }

        .pokemon-types {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        }

        .type-badge {
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            font-size: 0.85em;
        }

        .level-selector {
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .level-label {
            font-size: 0.9em;
            color: #666;
            font-weight: bold;
        }

        .level-input {
            width: 70px;
            padding: 8px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1em;
            text-align: center;
            font-weight: bold;
            color: #333;
        }

        .level-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .stats-display {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .stat-item {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e0e0e0;
        }

        .stat-label {
            font-size: 0.8em;
            color: #666;
            margin-bottom: 5px;
        }

        .stat-value {
            font-size: 1.3em;
            font-weight: bold;
            color: #e74c3c;
        }

        .moves-selector {
            margin-top: 15px;
        }

        .moves-title {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }

        .available-moves {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            max-height: 200px;
            overflow-y: auto;
        }

        .move-item {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .move-item:hover {
            border-color: #3498db;
            transform: translateY(-2px);
            background: #f5f5f5;
        }

        .move-item.selected {
            border-color: #4caf50;
            background: #e8f5e9;
        }

        .move-name {
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }

        .move-details {
            font-size: 0.85em;
            color: #666;
        }

        .battle-controls {
            text-align: center;
            margin: 30px 0;
        }

        .battle-btn {
            padding: 20px 60px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 1.5em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 5px 20px rgba(231, 76, 60, 0.3);
        }

        .battle-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(231, 76, 60, 0.5);
        }

        .battle-btn:disabled {
            background: #95a5a6;
            cursor: not-allowed;
            transform: none;
        }

        .battle-arena {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            color: white;
            min-height: 400px;
            position: relative;
            overflow: hidden;
        }

        .battle-arena::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/></svg>');
            background-size: 100px 100px;
            opacity: 0.3;
        }

        .battlefield {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 40px 0;
            z-index: 1;
        }

        .battler {
            text-align: center;
            position: relative;
        }

        .battler-sprite {
            width: 200px;
            height: 200px;
            image-rendering: pixelated;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
            transition: all 0.3s;
        }

        .battler-sprite.attacking {
            animation: attack 0.5s;
        }

        @keyframes attack {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(20px); }
        }

        .battler-sprite.hit {
            animation: hit 0.5s;
        }

        @keyframes hit {
            0%, 100% { transform: translateX(0); filter: brightness(1); }
            50% { transform: translateX(-10px); filter: brightness(1.5); }
        }

        .battler-sprite.fainted {
            opacity: 0.3;
            filter: grayscale(1);
        }

        .health-bar-container {
            margin-top: 15px;
            background: rgba(0,0,0,0.3);
            border-radius: 20px;
            padding: 10px;
        }

        .battler-name {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .health-bar {
            width: 200px;
            height: 25px;
            background: rgba(0,0,0,0.3);
            border-radius: 15px;
            overflow: hidden;
            border: 2px solid white;
        }

        .health-fill {
            height: 100%;
            transition: width 0.5s ease, background 0.5s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9em;
        }

        .health-fill.high {
            background: linear-gradient(90deg, #2ecc71, #27ae60);
        }

        .health-fill.medium {
            background: linear-gradient(90deg, #f39c12, #e67e22);
        }

        .health-fill.low {
            background: linear-gradient(90deg, #e74c3c, #c0392b);
        }

        .battle-log {
            background: rgba(0,0,0,0.3);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1;
            position: relative;
        }

        .log-entry {
            margin-bottom: 8px;
            padding: 8px 12px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            animation: slideIn 0.3s;
        }

        @keyframes slideIn {
            from {
                transform: translateX(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .log-entry.critical {
            background: rgba(241, 196, 15, 0.3);
            border-left: 3px solid #f1c40f;
        }

        .log-entry.super-effective {
            background: rgba(46, 204, 113, 0.3);
            border-left: 3px solid #2ecc71;
        }

        .log-entry.not-effective {
            background: rgba(149, 165, 166, 0.3);
            border-left: 3px solid #95a5a6;
        }

        .log-entry.self-destruct {
            background: rgba(231, 76, 60, 0.3);
            border-left: 3px solid #e74c3c;
            font-weight: bold;
        }

        .log-entry.draw {
            background: rgba(243, 156, 18, 0.3);
            border-left: 3px solid #f39c12;
            font-weight: bold;
        }

        .move-selector-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .move-selector-panel {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            max-width: 600px;
            width: 90%;
            animation: slideUp 0.3s;
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

        .move-selector-title {
            text-align: center;
            font-size: 2em;
            color: #ecf0f1;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .battle-moves {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .battle-move-button {
            padding: 20px;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            color: white;
            font-size: 1em;
            font-weight: bold;
        }

        .battle-move-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }

        .battle-move-button:active {
            transform: translateY(-2px);
        }

        .battle-move-name {
            font-size: 1.3em;
            margin-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .battle-move-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9em;
            opacity: 0.95;
        }

        .move-type-badge {
            background: rgba(0,0,0,0.3);
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 0.85em;
        }

        .results-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .results-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .winner-announcement {
            font-size: 3em;
            font-weight: bold;
            color: #4caf50;
            margin-bottom: 10px;
            animation: bounce 1s;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        .battle-summary {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            background: #f9f9f9;
            border-radius: 15px;
            padding: 20px;
            border: 1px solid #e0e0e0;
        }

        .summary-card.winner {
            border: 3px solid #4caf50;
        }

        .summary-card.loser {
            border: 3px solid #e74c3c;
        }

        .summary-title {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }

        .summary-stats {
            display: grid;
            gap: 10px;
        }

        .summary-stat {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: white;
            border-radius: 8px;
            color: #333;
            border: 1px solid #e0e0e0;
        }

        .probability-analysis {
            background: #f9f9f9;
            border-radius: 15px;
            padding: 30px;
            margin-top: 30px;
            border: 1px solid #e0e0e0;
        }

        .probability-title {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        .probability-chart {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .probability-bar {
            flex: 1;
            text-align: center;
        }

        .probability-label {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 1.2em;
            color: #333;
        }

        .probability-visual {
            height: 200px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column-reverse;
        }

        .probability-fill {
            background: linear-gradient(180deg, #3498db, #2980b9);
            transition: height 0.5s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.5em;
        }

        .probability-details {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }

        .detail-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid #e0e0e0;
        }

        .detail-icon {
            font-size: 2em;
            margin-bottom: 10px;
        }

        .detail-value {
            font-size: 1.8em;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 5px;
        }

        .detail-label {
            color: #666;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        }

        .action-btn {
            padding: 15px 40px;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-rematch {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
        }

        .btn-rematch:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
        }

        .btn-new-battle {
            background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
            color: white;
        }

        .btn-new-battle:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        .empty-icon {
            font-size: 5em;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .empty-state p {
            color: #666;
        }

        @media (max-width: 1024px) {
            .setup-container {
                grid-template-columns: 1fr;
            }

            .battlefield {
                flex-direction: column;
                gap: 40px;
            }

            .battle-summary {
                grid-template-columns: 1fr;
            }

            .probability-chart {
                flex-direction: column;
            }
        }

        @media (max-width: 768px) {
            .simulator-title {
                font-size: 2em;
            }

            .stats-display {
                grid-template-columns: repeat(2, 1fr);
            }

            .available-moves {
                grid-template-columns: 1fr;
            }

            .probability-details {
                grid-template-columns: 1fr;
            }
        }

        /* Modo oscuro */
        @media (prefers-color-scheme: dark) {
            .team-setup {
                background: #2c3e50;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }

            .team-setup.player1,
            .team-setup.player2 {
                border-left-width: 5px;
            }

            .team-setup.player1 {
                border-color: #5dade2;
            }

            .team-setup.player2 {
                border-color: #ec7063;
            }

            .search-box {
                background: #1a252f;
                color: #ecf0f1;
                border: 2px solid #34495e;
            }

            .search-box:focus {
                border-color: #5dade2;
            }

            .pokemon-results {
                background: #1a252f;
                border: 2px solid #34495e;
            }

            .pokemon-result-item {
                color: #ecf0f1;
            }

            .pokemon-result-item:hover {
                background: #34495e;
            }

            .selected-pokemon {
                background: #1a252f;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }

            .pokemon-name {
                color: #ecf0f1;
            }

            .pokemon-sprite {
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
            }

            .stat-item {
                background: #34495e;
                border: none;
            }

            .stat-label {
                color: #bdc3c7;
            }

            .stat-value {
                color: #ec7063;
            }

            .moves-title {
                color: #ecf0f1;
            }

            .move-item {
                background: #34495e;
                border: 2px solid #2c3e50;
            }

            .move-item:hover {
                background: #2c3e50;
                border-color: #5dade2;
            }

            .move-item.selected {
                background: #1e5631;
                border-color: #2ecc71;
            }

            .move-name {
                color: #ecf0f1;
            }

            .move-details {
                color: #bdc3c7;
            }

            .results-container {
                background: #2c3e50;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }

            .winner-announcement {
                color: #2ecc71;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }

            .summary-card {
                background: #1a252f;
                border: 1px solid #34495e;
            }

            .summary-card.winner {
                border: 3px solid #2ecc71;
            }

            .summary-card.loser {
                border: 3px solid #ec7063;
            }

            .summary-title {
                color: #ecf0f1;
            }

            .summary-stat {
                background: #34495e;
                color: #ecf0f1;
                border: none;
            }

            .probability-analysis {
                background: #1a252f;
                border: none;
            }

            .probability-title {
                color: #ecf0f1;
            }

            .probability-label {
                color: #ecf0f1;
            }

            .probability-visual {
                background: #34495e;
            }

            .detail-card {
                background: #34495e;
                border: none;
            }

            .detail-value {
                color: #ec7063;
            }

            .detail-label {
                color: #bdc3c7;
            }

            .empty-state {
                color: #95a5a6;
            }

            .empty-icon {
                opacity: 0.5;
            }

            .empty-state p {
                color: #bdc3c7;
            }

            .ai-toggle {
                color: #ecf0f1;
            }

            .level-label {
                color: #bdc3c7;
            }

            .level-input {
                background: #1a252f;
                color: #ecf0f1;
                border: 2px solid #34495e;
            }

            .level-input:focus {
                border-color: #5dade2;
            }

            .move-selector-panel {
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            }

            .move-selector-title {
                color: #ecf0f1;
            }

            .battle-move-name {
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }

            .move-selector-overlay {
                background: rgba(0, 0, 0, 0.85);
            }

            .battle-log {
                background: #1a252f;
            }

            .log-entry {
                color: #ecf0f1;
            }

            .battler-name {
                color: #8b9dc3;
            }

            .battle-arena {
                background: #1a252f;
            }

            .battlefield {
                background: linear-gradient(135deg, #1a252f 0%, #2c3e50 100%);
            }

            .btn-new-battle {
                background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            }
        }
    `;

    static properties = {
        allPokemon: { type: Array },
        player1Pokemon: { type: Object },
        player2Pokemon: { type: Object },
        player1Level: { type: Number },
        player2Level: { type: Number },
        player1Moves: { type: Array },
        player2Moves: { type: Array },
        player1SelectedMoves: { type: Array },
        player2SelectedMoves: { type: Array },
        player1HP: { type: Number },
        player2HP: { type: Number },
        player1MaxHP: { type: Number },
        player2MaxHP: { type: Number },
        battleLog: { type: Array },
        battleActive: { type: Boolean },
        battleFinished: { type: Boolean },
        winner: { type: String },
        player1AI: { type: Boolean },
        player2AI: { type: Boolean },
        searchResults1: { type: Array },
        searchResults2: { type: Array },
        showResults1: { type: Boolean },
        showResults2: { type: Boolean },
        battleStats: { type: Object },
        simulationResults: { type: Object },
        currentTurn: { type: Number },
        waitingForPlayerMove: { type: Boolean },
        currentAttacker: { type: Number }
    };

    constructor() {
        super();
        this.allPokemon = [];
        this.player1Pokemon = null;
        this.player2Pokemon = null;
        this.player1Level = 50;
        this.player2Level = 50;
        this.player1Moves = [];
        this.player2Moves = [];
        this.player1SelectedMoves = [];
        this.player2SelectedMoves = [];
        this.player1HP = 100;
        this.player2HP = 100;
        this.player1MaxHP = 100;
        this.player2MaxHP = 100;
        this.battleLog = [];
        this.battleActive = false;
        this.battleFinished = false;
        this.winner = null;
        this.player1AI = false;
        this.player2AI = true;
        this.searchResults1 = [];
        this.searchResults2 = [];
        this.showResults1 = false;
        this.showResults2 = false;
        this.battleStats = {
            player1: { damage: 0, turns: 0, crits: 0 },
            player2: { damage: 0, turns: 0, crits: 0 }
        };
        this.simulationResults = null;
        this.currentTurn = 0;
        this.waitingForPlayerMove = false;
        this.currentAttacker = 0;
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

    async searchPokemon(query, player) {
        if (query.length < 2) {
            if (player === 1) {
                this.showResults1 = false;
            } else {
                this.showResults2 = false;
            }
            return;
        }

        const results = this.allPokemon
            .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10);

        if (player === 1) {
            this.searchResults1 = results;
            this.showResults1 = true;
        } else {
            this.searchResults2 = results;
            this.showResults2 = true;
        }
    }

    calculateRealStats(baseStats, level) {
        // Fórmula de Pokémon para calcular stats reales
        // HP: floor(((2 * Base + IV + floor(EV/4)) * Level) / 100) + Level + 10
        // Other stats: floor((floor(((2 * Base + IV + floor(EV/4)) * Level) / 100) + 5) * Nature)
        // Asumimos IV=31 (perfect), EV=0, Nature=1.0 (neutral)
        
        const IV = 31;
        const EV = 0;
        
        return {
            hp: Math.floor(((2 * baseStats.hp + IV + Math.floor(EV / 4)) * level) / 100) + level + 10,
            attack: Math.floor(((2 * baseStats.attack + IV + Math.floor(EV / 4)) * level) / 100) + 5,
            defense: Math.floor(((2 * baseStats.defense + IV + Math.floor(EV / 4)) * level) / 100) + 5,
            spAttack: Math.floor(((2 * baseStats.spAttack + IV + Math.floor(EV / 4)) * level) / 100) + 5,
            spDefense: Math.floor(((2 * baseStats.spDefense + IV + Math.floor(EV / 4)) * level) / 100) + 5,
            speed: Math.floor(((2 * baseStats.speed + IV + Math.floor(EV / 4)) * level) / 100) + 5
        };
    }

    updatePokemonStats(player) {
        const pokemon = player === 1 ? this.player1Pokemon : this.player2Pokemon;
        const level = player === 1 ? this.player1Level : this.player2Level;
        
        if (!pokemon || !pokemon.baseStats) return;
        
        const realStats = this.calculateRealStats(pokemon.baseStats, level);
        pokemon.stats = realStats;
        
        if (player === 1) {
            this.player1MaxHP = realStats.hp;
            this.player1HP = realStats.hp;
        } else {
            this.player2MaxHP = realStats.hp;
            this.player2HP = realStats.hp;
        }
        
        this.requestUpdate();
    }

    changeLevel(player, level) {
        const newLevel = Math.max(1, Math.min(100, parseInt(level) || 50));
        
        if (player === 1) {
            this.player1Level = newLevel;
        } else {
            this.player2Level = newLevel;
        }
        
        this.updatePokemonStats(player);
    }

    async selectPokemon(pokemon, player) {
        try {
            const pokemonId = parseInt(pokemon.url.match(/\/(\d+)\//)[1]);
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const data = await response.json();

            // Filtrar movimientos que pueden aprenderse por nivel o MT/MO
            const learnableMoves = data.moves.filter(m => {
                return m.version_group_details.some(vg => 
                    vg.move_learn_method.name === 'level-up' || 
                    vg.move_learn_method.name === 'machine' ||
                    vg.move_learn_method.name === 'tutor'
                );
            }).map(m => ({
                name: m.move.name,
                url: m.move.url
            }));

            const pokemonData = {
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                types: data.types,
                baseStats: {
                    hp: data.stats[0].base_stat,
                    attack: data.stats[1].base_stat,
                    defense: data.stats[2].base_stat,
                    spAttack: data.stats[3].base_stat,
                    spDefense: data.stats[4].base_stat,
                    speed: data.stats[5].base_stat
                },
                stats: {}, // Se calculará con el nivel
                moves: learnableMoves
            };

            const level = player === 1 ? this.player1Level : this.player2Level;
            pokemonData.stats = this.calculateRealStats(pokemonData.baseStats, level);

            if (player === 1) {
                this.player1Pokemon = pokemonData;
                this.player1HP = pokemonData.stats.hp;
                this.player1MaxHP = pokemonData.stats.hp;
                this.showResults1 = false;
                this.player1Moves = [];
                this.player1SelectedMoves = [];
                await this.loadMoveDetails(pokemonData.moves, 1);
            } else {
                this.player2Pokemon = pokemonData;
                this.player2HP = pokemonData.stats.hp;
                this.player2MaxHP = pokemonData.stats.hp;
                this.showResults2 = false;
                this.player2Moves = [];
                this.player2SelectedMoves = [];
                await this.loadMoveDetails(pokemonData.moves, 2);
            }
        } catch (error) {
            console.error('Error loading Pokemon details:', error);
        }
    }

    async loadMoveDetails(moves, player) {
        try {
            // Obtener detalles de todos los movimientos
            const movePromises = moves.map(move => 
                fetch(move.url)
                    .then(r => r.json())
                    .catch(err => {
                        console.warn(`Error loading move ${move.name}:`, err);
                        return null;
                    })
            );
            const moveDetails = await Promise.all(movePromises);

            // Filtrar solo movimientos ofensivos (con poder) y ordenar por poder
            const movesWithDetails = moveDetails
                .filter(move => move !== null && move.power !== null && move.power > 0)
                .sort((a, b) => b.power - a.power) // Ordenar por poder descendente
                .slice(0, 20) // Tomar los mejores 20 movimientos
                .map(move => {
                    // Buscar el nombre en español
                    const spanishName = move.names.find(n => n.language.name === 'es');
                    return {
                        name: move.name, // Nombre interno para identificación
                        displayName: spanishName ? spanishName.name : this.capitalizeFirstLetter(move.name),
                        power: move.power,
                        accuracy: move.accuracy || 100, // Si no tiene accuracy, asumir 100%
                        type: move.type.name,
                        damageClass: move.damage_class.name,
                        pp: move.pp
                    };
                });

            if (player === 1) {
                this.player1Moves = movesWithDetails;
            } else {
                this.player2Moves = movesWithDetails;
            }
        } catch (error) {
            console.error('Error loading move details:', error);
        }
    }

    selectMove(move, player) {
        const selectedMoves = player === 1 ? this.player1SelectedMoves : this.player2SelectedMoves;
        const moveIndex = selectedMoves.findIndex(m => m.name === move.name);

        if (moveIndex !== -1) {
            // Deseleccionar si ya está seleccionado
            if (player === 1) {
                this.player1SelectedMoves = selectedMoves.filter(m => m.name !== move.name);
            } else {
                this.player2SelectedMoves = selectedMoves.filter(m => m.name !== move.name);
            }
        } else {
            // Seleccionar si no se han alcanzado los 4 movimientos
            if (selectedMoves.length < 4) {
                if (player === 1) {
                    this.player1SelectedMoves = [...selectedMoves, move];
                } else {
                    this.player2SelectedMoves = [...selectedMoves, move];
                }
            }
        }
        this.requestUpdate();
    }

    getTypeColor(type) {
        const colors = {
            normal: '#A8A878', fire: '#F08030', water: '#6890F0',
            electric: '#F8D030', grass: '#78C850', ice: '#98D8D8',
            fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
            flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
            rock: '#B8A038', ghost: '#705898', dragon: '#7038F8',
            dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC'
        };
        return colors[type] || '#A8A878';
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' ');
    }

    canStartBattle() {
        return this.player1Pokemon && 
               this.player2Pokemon && 
               this.player1SelectedMoves.length === 4 &&
               this.player2SelectedMoves.length === 4;
    }

    async startBattle() {
        if (!this.canStartBattle()) return;

        this.battleActive = true;
        this.battleFinished = false;
        this.battleLog = [];
        this.player1HP = this.player1MaxHP;
        this.player2HP = this.player2MaxHP;
        this.currentTurn = 1;
        this.waitingForPlayerMove = false;
        this.currentAttacker = 0;
        this.battleStats = {
            player1: { damage: 0, turns: 0, crits: 0 },
            player2: { damage: 0, turns: 0, crits: 0 }
        };

        this.addLog(`¡Comienza la batalla entre ${this.capitalizeFirstLetter(this.player1Pokemon.name)} y ${this.capitalizeFirstLetter(this.player2Pokemon.name)}!`);

        await this.sleep(1000);
        await this.battleLoop();
    }

    async battleLoop() {
        while (this.player1HP > 0 && this.player2HP > 0 && this.battleActive) {
            this.addLog(`--- Turno ${this.currentTurn} ---`);
            
            // Determinar orden de ataque por velocidad
            const p1Speed = this.player1Pokemon.stats.speed;
            const p2Speed = this.player2Pokemon.stats.speed;
            
            const firstAttacker = p1Speed >= p2Speed ? 1 : 2;
            const secondAttacker = firstAttacker === 1 ? 2 : 1;

            // Primer ataque
            await this.executeTurnAttack(firstAttacker);
            if (this.checkBattleEnd()) {
                this.finishBattle();
                return;
            }

            await this.sleep(1500);

            // Segundo ataque
            await this.executeTurnAttack(secondAttacker);
            if (this.checkBattleEnd()) {
                this.finishBattle();
                return;
            }

            this.currentTurn++;
            await this.sleep(1500);
        }

        // Si salimos del while por otra razón, también terminar la batalla
        if (!this.battleFinished) {
            this.finishBattle();
        }
    }

    async executeTurnAttack(attacker) {
        const isPlayer1 = attacker === 1;
        const isAI = isPlayer1 ? this.player1AI : this.player2AI;
        const selectedMoves = isPlayer1 ? this.player1SelectedMoves : this.player2SelectedMoves;

        let selectedMove;

        if (isAI) {
            // IA elige el movimiento
            selectedMove = this.selectAIMove(selectedMoves);
            await this.sleep(500);
        } else {
            // Jugador debe elegir
            this.currentAttacker = attacker;
            this.waitingForPlayerMove = true;
            this.requestUpdate();

            // Esperar a que el jugador elija un movimiento
            selectedMove = await this.waitForPlayerMoveSelection();
            this.waitingForPlayerMove = false;
        }

        // Ejecutar el ataque
        await this.executeAttack(attacker, selectedMove);
    }

    waitForPlayerMoveSelection() {
        return new Promise((resolve) => {
            this._moveSelectionResolver = resolve;
        });
    }

    selectMoveForBattle(move) {
        if (this._moveSelectionResolver) {
            this._moveSelectionResolver(move);
            this._moveSelectionResolver = null;
        }
    }

    selectAIMove(moves) {
        // IA mejorada: prioriza movimientos poderosos
        const sortedMoves = [...moves].sort((a, b) => b.power - a.power);
        // Elige entre los 2 mejores movimientos aleatoriamente
        const topMoves = sortedMoves.slice(0, 2);
        return topMoves[Math.floor(Math.random() * topMoves.length)];
    }

    async executeAttack(attacker, selectedMove) {
        const isPlayer1 = attacker === 1;
        const attackerPokemon = isPlayer1 ? this.player1Pokemon : this.player2Pokemon;
        const defenderPokemon = isPlayer1 ? this.player2Pokemon : this.player1Pokemon;
        const attackerLevel = isPlayer1 ? this.player1Level : this.player2Level;

        // Detectar movimientos de autodestrucción
        const isSelfDestructMove = this.isSelfDestructMove(selectedMove.name);

        // Calcular daño
        const damage = this.calculateDamage(
            attackerPokemon,
            defenderPokemon,
            selectedMove,
            attackerLevel
        );

        // Aplicar daño al defensor
        if (isPlayer1) {
            this.player2HP = Math.max(0, this.player2HP - damage.amount);
            this.battleStats.player1.damage += damage.amount;
            this.battleStats.player1.turns++;
            if (damage.critical) this.battleStats.player1.crits++;
        } else {
            this.player1HP = Math.max(0, this.player1HP - damage.amount);
            this.battleStats.player2.damage += damage.amount;
            this.battleStats.player2.turns++;
            if (damage.critical) this.battleStats.player2.crits++;
        }

        // Animaciones
        this.animateAttack(attacker);
        await this.sleep(300);
        this.animateHit(attacker === 1 ? 2 : 1);

        // Log
        let logMessage = `${this.capitalizeFirstLetter(attackerPokemon.name)} usa ${selectedMove.displayName}! (${damage.amount} de daño)`;
        let logClass = '';

        if (damage.critical) {
            logMessage += ' ¡Golpe crítico!';
            logClass = 'critical';
        }
        if (damage.effectiveness > 1) {
            logMessage += ' ¡Es súper efectivo!';
            logClass = 'super-effective';
        } else if (damage.effectiveness < 1) {
            logMessage += ' No es muy efectivo...';
            logClass = 'not-effective';
        }

        this.addLog(logMessage, logClass);

        // Si es un movimiento de autodestrucción, debilitar al atacante
        if (isSelfDestructMove) {
            await this.sleep(500); // Pausa antes de la autodestrucción
            if (isPlayer1) {
                this.player1HP = 0;
            } else {
                this.player2HP = 0;
            }
            this.addLog(`¡${this.capitalizeFirstLetter(attackerPokemon.name)} se debilita por usar ${selectedMove.displayName}!`, 'self-destruct');
            this.requestUpdate();
            await this.sleep(800); // Pausa después para que se vea el mensaje
        }

        this.requestUpdate();
    }

    calculateDamage(attacker, defender, move, level = 50) {
        // Fórmula simplificada de daño de Pokémon
        const attack = move.damageClass === 'physical' ? 
            attacker.stats.attack : attacker.stats.spAttack;
        const defense = move.damageClass === 'physical' ?
            defender.stats.defense : defender.stats.spDefense;

        // Calcular efectividad de tipo
        const effectiveness = this.getTypeEffectiveness(
            move.type,
            defender.types.map(t => t.type.name)
        );

        // Golpe crítico (6.25% de probabilidad)
        const critical = Math.random() < 0.0625;
        const criticalMultiplier = critical ? 1.5 : 1;

        // Variación aleatoria (85-100%)
        const random = 0.85 + Math.random() * 0.15;

        // Calcular daño
        const baseDamage = ((2 * level / 5 + 2) * move.power * (attack / defense)) / 50 + 2;
        const finalDamage = Math.floor(baseDamage * effectiveness * criticalMultiplier * random);

        return {
            amount: finalDamage,
            critical: critical,
            effectiveness: effectiveness
        };
    }

    getTypeEffectiveness(attackType, defenderTypes) {
        // Tabla de efectividad simplificada
        const effectiveness = {
            fire: { grass: 2, ice: 2, bug: 2, steel: 2, water: 0.5, fire: 0.5, rock: 0.5, dragon: 0.5 },
            water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
            grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
            electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
            ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
            fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
            poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
            ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
            flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
            psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
            bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
            rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
            ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
            dragon: { dragon: 2, steel: 0.5, fairy: 0 },
            dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
            steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
            fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 }
        };

        let totalEffectiveness = 1;
        defenderTypes.forEach(defType => {
            if (effectiveness[attackType] && effectiveness[attackType][defType] !== undefined) {
                totalEffectiveness *= effectiveness[attackType][defType];
            }
        });

        return totalEffectiveness;
    }

    isSelfDestructMove(moveName) {
        // Lista de movimientos de autodestrucción (en inglés y español)
        const selfDestructMoves = [
            'self-destruct', 'selfdestruct', 'autodestrucción', 'autodestruccion',
            'explosion', 'explosión', 'explosion',
            'misty-explosion', 'mistyexplosion',
            'final-gambit', 'finalgambit'
        ];
        return selfDestructMoves.includes(moveName.toLowerCase().replace(/\s/g, '-'));
    }

    checkBattleEnd() {
        return this.player1HP <= 0 || this.player2HP <= 0;
    }

    finishBattle() {
        console.log('finishBattle called - Player1 HP:', this.player1HP, 'Player2 HP:', this.player2HP);
        
        this.battleActive = false;
        this.battleFinished = true;
        
        // Determinar ganador o empate
        if (this.player1HP <= 0 && this.player2HP <= 0) {
            this.winner = 'draw';
            this.addLog('¡Es un empate! Ambos Pokémon se han debilitado.', 'draw');
            console.log('EMPATE detectado');
        } else {
            this.winner = this.player1HP > 0 ? 'player1' : 'player2';
            const winnerName = this.winner === 'player1' ?
                this.capitalizeFirstLetter(this.player1Pokemon.name) :
                this.capitalizeFirstLetter(this.player2Pokemon.name);
            this.addLog(`¡${winnerName} gana la batalla!`);
            console.log('Ganador:', this.winner);
        }

        console.log('battleFinished:', this.battleFinished, 'winner:', this.winner);
        
        // Calcular resultados probabilísticos
        this.runProbabilitySimulation();
        
        // Forzar actualización de la UI
        this.requestUpdate();
        
        console.log('requestUpdate called');
    }

    async runProbabilitySimulation() {
        const simulations = 1000;
        let player1Wins = 0;

        for (let i = 0; i < simulations; i++) {
            const result = this.simulateBattle();
            if (result === 'player1') player1Wins++;
        }

        this.simulationResults = {
            player1WinRate: (player1Wins / simulations * 100).toFixed(1),
            player2WinRate: ((simulations - player1Wins) / simulations * 100).toFixed(1),
            totalSimulations: simulations
        };
    }

    simulateBattle() {
        let p1HP = this.player1MaxHP;
        let p2HP = this.player2MaxHP;

        const p1Move = this.player1Moves.find(m => m.selected) || this.player1Moves[0];
        const p2Move = this.player2Moves.find(m => m.selected) || this.player2Moves[0];

        while (p1HP > 0 && p2HP > 0) {
            // Ataque jugador 1
            const damage1 = this.calculateDamage(this.player1Pokemon, this.player2Pokemon, p1Move);
            p2HP -= damage1.amount;
            if (p2HP <= 0) return 'player1';

            // Ataque jugador 2
            const damage2 = this.calculateDamage(this.player2Pokemon, this.player1Pokemon, p2Move);
            p1HP -= damage2.amount;
            if (p1HP <= 0) return 'player2';
        }

        return p1HP > 0 ? 'player1' : 'player2';
    }

    animateAttack(player) {
        const sprite = this.shadowRoot.querySelector(
            player === 1 ? '.battler:first-child .battler-sprite' : '.battler:last-child .battler-sprite'
        );
        if (sprite) {
            sprite.classList.add('attacking');
            setTimeout(() => sprite.classList.remove('attacking'), 500);
        }
    }

    animateHit(player) {
        const sprite = this.shadowRoot.querySelector(
            player === 1 ? '.battler:first-child .battler-sprite' : '.battler:last-child .battler-sprite'
        );
        if (sprite) {
            sprite.classList.add('hit');
            setTimeout(() => sprite.classList.remove('hit'), 500);
        }
    }

    addLog(message, cssClass = '') {
        this.battleLog = [...this.battleLog, { message, class: cssClass }];
        this.requestUpdate();
        
        // Auto-scroll to latest log
        setTimeout(() => {
            const logContainer = this.shadowRoot.querySelector('.battle-log');
            if (logContainer) {
                logContainer.scrollTop = logContainer.scrollHeight;
            }
        }, 100);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetBattle() {
        this.battleActive = false;
        this.battleFinished = false;
        this.battleLog = [];
        this.player1HP = this.player1MaxHP;
        this.player2HP = this.player2MaxHP;
        this.winner = null;
        this.simulationResults = null;
    }

    newBattle() {
        this.player1Pokemon = null;
        this.player2Pokemon = null;
        this.player1Moves = [];
        this.player2Moves = [];
        this.resetBattle();
    }

    getHealthPercentage(player) {
        const hp = player === 1 ? this.player1HP : this.player2HP;
        const maxHP = player === 1 ? this.player1MaxHP : this.player2MaxHP;
        return (hp / maxHP * 100);
    }

    getHealthClass(percentage) {
        if (percentage > 50) return 'high';
        if (percentage > 20) return 'medium';
        return 'low';
    }

    render() {
        console.log('render() - battleFinished:', this.battleFinished, 'battleActive:', this.battleActive, 'winner:', this.winner);
        
        if (this.battleFinished) {
            console.log('Rendering results...');
            return this.renderResults();
        }

        if (this.battleActive) {
            console.log('Rendering battle...');
            return this.renderBattle();
        }

        console.log('Rendering setup...');
        return this.renderSetup();
    }

    renderSetup() {
        return html`
            <div class="simulator-container">
                <div class="simulator-header">
                    <div class="battle-icon">⚔️</div>
                    <h1 class="simulator-title">Simulador de Combate</h1>
                    <p class="simulator-subtitle">Simula batallas Pokémon con IA y análisis probabilístico</p>
                </div>

                <div class="setup-container">
                    ${this.renderTeamSetup(1)}
                    ${this.renderTeamSetup(2)}
                </div>

                <div class="battle-controls">
                    <button 
                        class="battle-btn" 
                        @click="${this.startBattle}"
                        ?disabled="${!this.canStartBattle()}"
                    >
                        ⚔️ ¡Iniciar Batalla!
                    </button>
                </div>
            </div>
        `;
    }

    renderTeamSetup(player) {
        const isPlayer1 = player === 1;
        const pokemon = isPlayer1 ? this.player1Pokemon : this.player2Pokemon;
        const moves = isPlayer1 ? this.player1Moves : this.player2Moves;
        const selectedMoves = isPlayer1 ? this.player1SelectedMoves : this.player2SelectedMoves;
        const isAI = isPlayer1 ? this.player1AI : this.player2AI;
        const searchResults = isPlayer1 ? this.searchResults1 : this.searchResults2;
        const showResults = isPlayer1 ? this.showResults1 : this.showResults2;

        return html`
            <div class="team-setup ${isPlayer1 ? 'player1' : 'player2'}">
                <div class="team-header">
                    <h2 class="team-title ${isPlayer1 ? 'player1' : 'player2'}">
                        ${isPlayer1 ? '👤 Jugador 1' : '🤖 Jugador 2'}
                    </h2>
                    <div class="ai-toggle">
                        <span>IA:</span>
                        <div 
                            class="toggle-switch ${isAI ? 'active' : ''}"
                            @click="${() => {
                                if (isPlayer1) {
                                    this.player1AI = !this.player1AI;
                                } else {
                                    this.player2AI = !this.player2AI;
                                }
                            }}"
                        >
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                </div>

                <div class="pokemon-selector">
                    <input 
                        type="text"
                        class="search-box"
                        placeholder="Buscar Pokémon..."
                        @input="${(e) => this.searchPokemon(e.target.value, player)}"
                    />
                    <div class="pokemon-results ${showResults ? 'show' : ''}">
                        ${searchResults.map(p => html`
                            <div 
                                class="pokemon-result-item"
                                @click="${() => this.selectPokemon(p, player)}"
                            >
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.url.match(/\/(\d+)\//)[1]}.png" alt="${p.name}">
                                <span>${this.capitalizeFirstLetter(p.name)}</span>
                            </div>
                        `)}
                    </div>
                </div>

                ${pokemon ? html`
                    <div class="selected-pokemon">
                        <div class="selected-pokemon-display">
                            <img class="pokemon-sprite" src="${pokemon.sprite}" alt="${pokemon.name}">
                            <div class="pokemon-info">
                                <h3 class="pokemon-name">${this.capitalizeFirstLetter(pokemon.name)}</h3>
                                <div class="pokemon-types">
                                    ${pokemon.types.map(t => html`
                                        <span class="type-badge" style="background: ${this.getTypeColor(t.type.name)}">
                                            ${this.capitalizeFirstLetter(t.type.name)}
                                        </span>
                                    `)}
                                </div>
                                <div class="level-selector">
                                    <span class="level-label">Nivel:</span>
                                    <input 
                                        type="number" 
                                        class="level-input" 
                                        min="1" 
                                        max="100" 
                                        .value="${String(player === 1 ? this.player1Level : this.player2Level)}"
                                        @input="${(e) => this.changeLevel(player, e.target.value)}"
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="stats-display">
                            <div class="stat-item">
                                <div class="stat-label">HP</div>
                                <div class="stat-value">${pokemon.stats.hp}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Ataque</div>
                                <div class="stat-value">${pokemon.stats.attack}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Defensa</div>
                                <div class="stat-value">${pokemon.stats.defense}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">At. Esp</div>
                                <div class="stat-value">${pokemon.stats.spAttack}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Def. Esp</div>
                                <div class="stat-value">${pokemon.stats.spDefense}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Velocidad</div>
                                <div class="stat-value">${pokemon.stats.speed}</div>
                            </div>
                        </div>

                        ${moves.length > 0 ? html`
                            <div class="moves-selector">
                                <div class="moves-title">
                                    Selecciona 4 movimientos (${selectedMoves.length}/4):
                                </div>
                                <div class="available-moves">
                                    ${moves.map(move => {
                                        const isSelected = selectedMoves.some(m => m.name === move.name);
                                        return html`
                                            <div 
                                                class="move-item ${isSelected ? 'selected' : ''}"
                                                @click="${() => this.selectMove(move, player)}"
                                            >
                                                <div class="move-name">${move.displayName}</div>
                                                <div class="move-details">
                                                    Poder: ${move.power} | Precisión: ${move.accuracy}%
                                                </div>
                                            </div>
                                        `;
                                    })}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : html`
                    <div class="empty-state">
                        <div class="empty-icon">🔍</div>
                        <p>Busca y selecciona un Pokémon</p>
                    </div>
                `}
            </div>
        `;
    }

    renderBattle() {
        const p1Percentage = this.getHealthPercentage(1);
        const p2Percentage = this.getHealthPercentage(2);

        return html`
            <div class="simulator-container">
                <div class="battle-arena">
                    <div class="battlefield">
                        <div class="battler">
                            <img 
                                class="battler-sprite ${this.player1HP <= 0 ? 'fainted' : ''}" 
                                src="${this.player1Pokemon.sprite}" 
                                alt="${this.player1Pokemon.name}"
                            />
                            <div class="health-bar-container">
                                <div class="battler-name">${this.capitalizeFirstLetter(this.player1Pokemon.name)}</div>
                                <div class="health-bar">
                                    <div 
                                        class="health-fill ${this.getHealthClass(p1Percentage)}"
                                        style="width: ${p1Percentage}%"
                                    >
                                        ${this.player1HP}/${this.player1MaxHP}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="battler">
                            <img 
                                class="battler-sprite ${this.player2HP <= 0 ? 'fainted' : ''}" 
                                src="${this.player2Pokemon.sprite}" 
                                alt="${this.player2Pokemon.name}"
                            />
                            <div class="health-bar-container">
                                <div class="battler-name">${this.capitalizeFirstLetter(this.player2Pokemon.name)}</div>
                                <div class="health-bar">
                                    <div 
                                        class="health-fill ${this.getHealthClass(p2Percentage)}"
                                        style="width: ${p2Percentage}%"
                                    >
                                        ${this.player2HP}/${this.player2MaxHP}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="battle-log">
                        ${this.battleLog.map(log => html`
                            <div class="log-entry ${log.class}">${log.message}</div>
                        `)}
                    </div>

                    ${this.waitingForPlayerMove ? html`
                        <div class="move-selector-overlay">
                            <div class="move-selector-panel">
                                <h3 class="move-selector-title">
                                    ¡Elige tu ataque! - ${this.capitalizeFirstLetter(
                                        this.currentAttacker === 1 ? this.player1Pokemon.name : this.player2Pokemon.name
                                    )}
                                </h3>
                                <div class="battle-moves">
                                    ${(this.currentAttacker === 1 ? this.player1SelectedMoves : this.player2SelectedMoves).map(move => html`
                                        <button 
                                            class="battle-move-button"
                                            style="background: ${this.getTypeColor(move.type)}"
                                            @click="${() => this.selectMoveForBattle(move)}"
                                        >
                                            <div class="battle-move-name">${move.displayName}</div>
                                            <div class="battle-move-info">
                                                <span>💥 ${move.power}</span>
                                                <span>🎯 ${move.accuracy}%</span>
                                                <span class="move-type-badge">${this.capitalizeFirstLetter(move.type)}</span>
                                            </div>
                                        </button>
                                    `)}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderResults() {
        // Manejar empate
        if (this.winner === 'draw') {
            return html`
                <div class="simulator-container">
                    <div class="results-container">
                        <div class="results-header">
                            <div class="winner-announcement" style="color: #f39c12;">
                                🤝 ¡Empate!
                            </div>
                            <p style="text-align: center; font-size: 1.2em; margin-top: 1rem;">
                                Ambos Pokémon se han debilitado
                            </p>
                        </div>

                        <div class="battle-summary">
                            <div class="summary-card" style="border: 3px solid #f39c12;">
                                <div class="summary-title">⚔️ ${this.capitalizeFirstLetter(this.player1Pokemon.name)}</div>
                                <div class="summary-stats">
                                    <div class="summary-stat">
                                        <span>Daño Total:</span>
                                        <span>${this.battleStats.player1.damage}</span>
                                    </div>
                                    <div class="summary-stat">
                                        <span>Turnos:</span>
                                        <span>${this.battleStats.player1.turns}</span>
                                    </div>
                                    <div class="summary-stat">
                                        <span>Críticos:</span>
                                        <span>${this.battleStats.player1.crits}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="summary-card" style="border: 3px solid #f39c12;">
                                <div class="summary-title">⚔️ ${this.capitalizeFirstLetter(this.player2Pokemon.name)}</div>
                                <div class="summary-stats">
                                    <div class="summary-stat">
                                        <span>Daño Total:</span>
                                        <span>${this.battleStats.player2.damage}</span>
                                    </div>
                                    <div class="summary-stat">
                                        <span>Turnos:</span>
                                        <span>${this.battleStats.player2.turns}</span>
                                    </div>
                                    <div class="summary-stat">
                                        <span>Críticos:</span>
                                        <span>${this.battleStats.player2.crits}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        ${this.simulationResults ? html`
                            <div class="probability-analysis">
                                <h2 class="probability-title">📊 Análisis Probabilístico</h2>
                                <p style="text-align: center; color: #666; margin-bottom: 30px;">
                                    Basado en ${this.simulationResults.totalSimulations} simulaciones
                                </p>

                                <div class="probability-chart">
                                    <div class="probability-bar">
                                        <div class="probability-label">
                                            ${this.capitalizeFirstLetter(this.player1Pokemon.name)}
                                        </div>
                                        <div class="probability-visual">
                                            <div 
                                                class="probability-fill"
                                                style="height: ${this.simulationResults.player1WinRate}%"
                                            >
                                                ${this.simulationResults.player1WinRate}%
                                            </div>
                                        </div>
                                    </div>

                                    <div class="probability-bar">
                                        <div class="probability-label">
                                            ${this.capitalizeFirstLetter(this.player2Pokemon.name)}
                                        </div>
                                        <div class="probability-visual">
                                            <div 
                                                class="probability-fill"
                                                style="height: ${this.simulationResults.player2WinRate}%; background: linear-gradient(180deg, #e74c3c, #c0392b);"
                                            >
                                                ${this.simulationResults.player2WinRate}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="probability-details">
                                    <div class="detail-card">
                                        <div class="detail-icon">⚔️</div>
                                        <div class="detail-value">${this.battleStats.player1.damage + this.battleStats.player2.damage}</div>
                                        <div class="detail-label">Daño Total</div>
                                    </div>
                                    <div class="detail-card">
                                        <div class="detail-icon">🔄</div>
                                        <div class="detail-value">${Math.max(this.battleStats.player1.turns, this.battleStats.player2.turns)}</div>
                                        <div class="detail-label">Turnos Totales</div>
                                    </div>
                                    <div class="detail-card">
                                        <div class="detail-icon">💥</div>
                                        <div class="detail-value">${this.battleStats.player1.crits + this.battleStats.player2.crits}</div>
                                        <div class="detail-label">Críticos Totales</div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}

                        <div class="action-buttons">
                            <button class="action-btn btn-rematch" @click="${this.resetBattle}">
                                🔄 Revancha
                            </button>
                            <button class="action-btn btn-new-battle" @click="${this.newBattle}">
                                ➕ Nueva Batalla
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Batalla normal con ganador
        const winnerPokemon = this.winner === 'player1' ? this.player1Pokemon : this.player2Pokemon;
        const loserPokemon = this.winner === 'player1' ? this.player2Pokemon : this.player1Pokemon;
        const winnerStats = this.winner === 'player1' ? this.battleStats.player1 : this.battleStats.player2;
        const loserStats = this.winner === 'player1' ? this.battleStats.player2 : this.battleStats.player1;

        return html`
            <div class="simulator-container">
                <div class="results-container">
                    <div class="results-header">
                        <div class="winner-announcement">
                            🏆 ¡${this.capitalizeFirstLetter(winnerPokemon.name)} Gana!
                        </div>
                    </div>

                    <div class="battle-summary">
                        <div class="summary-card winner">
                            <div class="summary-title">🏆 Ganador</div>
                            <div class="summary-stats">
                                <div class="summary-stat">
                                    <span>Pokémon:</span>
                                    <span>${this.capitalizeFirstLetter(winnerPokemon.name)}</span>
                                </div>
                                <div class="summary-stat">
                                    <span>Daño Total:</span>
                                    <span>${winnerStats.damage}</span>
                                </div>
                                <div class="summary-stat">
                                    <span>Turnos:</span>
                                    <span>${winnerStats.turns}</span>
                                </div>
                                <div class="summary-stat">
                                    <span>Críticos:</span>
                                    <span>${winnerStats.crits}</span>
                                </div>
                                <div class="summary-stat">
                                    <span>HP Restante:</span>
                                    <span>${this.winner === 'player1' ? this.player1HP : this.player2HP}</span>
                                </div>
                            </div>
                        </div>

                        <div class="summary-card loser">
                            <div class="summary-title">💀 Perdedor</div>
                            <div class="summary-stats">
                                <div class="summary-stat">
                                    <span>Pokémon:</span>
                                    <span>${this.capitalizeFirstLetter(loserPokemon.name)}</span>
                                </div>
                                <div class="summary-stat">
                                    <span>Daño Total:</span>
                                    <span>${loserStats.damage}</span>
                                </div>
                                <div class="summary-stat">
                                    <span>Turnos:</span>
                                    <span>${loserStats.turns}</span>
                                </div>
                                <div class="summary-stat">
                                    <span>Críticos:</span>
                                    <span>${loserStats.crits}</span>
                                </div>
                                <div class="summary-stat">
                                    <span>HP Restante:</span>
                                    <span>0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${this.simulationResults ? html`
                        <div class="probability-analysis">
                            <h2 class="probability-title">📊 Análisis Probabilístico</h2>
                            <p style="text-align: center; color: #666; margin-bottom: 30px;">
                                Basado en ${this.simulationResults.totalSimulations} simulaciones
                            </p>

                            <div class="probability-chart">
                                <div class="probability-bar">
                                    <div class="probability-label">
                                        ${this.capitalizeFirstLetter(this.player1Pokemon.name)}
                                    </div>
                                    <div class="probability-visual">
                                        <div 
                                            class="probability-fill"
                                            style="height: ${this.simulationResults.player1WinRate}%"
                                        >
                                            ${this.simulationResults.player1WinRate}%
                                        </div>
                                    </div>
                                </div>

                                <div class="probability-bar">
                                    <div class="probability-label">
                                        ${this.capitalizeFirstLetter(this.player2Pokemon.name)}
                                    </div>
                                    <div class="probability-visual">
                                        <div 
                                            class="probability-fill"
                                            style="height: ${this.simulationResults.player2WinRate}%; background: linear-gradient(180deg, #e74c3c, #c0392b);"
                                        >
                                            ${this.simulationResults.player2WinRate}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="probability-details">
                                <div class="detail-card">
                                    <div class="detail-icon">⚔️</div>
                                    <div class="detail-value">${winnerStats.damage + loserStats.damage}</div>
                                    <div class="detail-label">Daño Total</div>
                                </div>
                                <div class="detail-card">
                                    <div class="detail-icon">🔄</div>
                                    <div class="detail-value">${Math.max(winnerStats.turns, loserStats.turns)}</div>
                                    <div class="detail-label">Turnos Totales</div>
                                </div>
                                <div class="detail-card">
                                    <div class="detail-icon">💥</div>
                                    <div class="detail-value">${winnerStats.crits + loserStats.crits}</div>
                                    <div class="detail-label">Críticos Totales</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="action-buttons">
                        <button class="action-btn btn-rematch" @click="${this.resetBattle}">
                            🔄 Revancha
                        </button>
                        <button class="action-btn btn-new-battle" @click="${this.newBattle}">
                            ➕ Nueva Batalla
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('pokemon-battle-simulator', PokemonBattleSimulator);
