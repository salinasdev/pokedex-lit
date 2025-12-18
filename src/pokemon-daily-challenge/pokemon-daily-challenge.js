import { html, LitElement, css } from "lit";

class PokemonDailyChallenge extends LitElement {

    static get properties(){
        return {
            currentPokemon: {type: Object},
            options: {type: Array},
            loading: {type: Boolean},
            revealed: {type: Boolean},
            selectedAnswer: {type: String},
            isCorrect: {type: Boolean},
            hasPlayed: {type: Boolean},
            streak: {type: Number},
            bestStreak: {type: Number},
            totalCorrect: {type: Number},
            totalPlayed: {type: Number},
            showHint: {type: Boolean},
            hintLevel: {type: Number} // 0: no hint, 1: type, 2: generation, 3: first letter
        };
    }

    constructor(){
        super();
        this.currentPokemon = null;
        this.options = [];
        this.loading = true;
        this.revealed = false;
        this.selectedAnswer = null;
        this.isCorrect = null;
        this.hasPlayed = false;
        this.streak = 0;
        this.bestStreak = 0;
        this.totalCorrect = 0;
        this.totalPlayed = 0;
        this.showHint = false;
        this.hintLevel = 0;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.loadStats();
        await this.loadDailyChallenge();
    }

    // Generar un número basado en la fecha del día (seed)
    getDailySeed() {
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        // Convertir fecha a número para seed
        let hash = 0;
        for (let i = 0; i < dateString.length; i++) {
            hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Generar número pseudo-aleatorio basado en seed
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    async loadDailyChallenge() {
        this.loading = true;
        try {
            // Verificar si ya jugó hoy
            const lastPlayedDate = localStorage.getItem('pokemon-challenge-last-played');
            const today = new Date().toDateString();
            
            if (lastPlayedDate === today) {
                this.hasPlayed = true;
                const savedResult = JSON.parse(localStorage.getItem('pokemon-challenge-today-result'));
                if (savedResult) {
                    this.revealed = true;
                    this.isCorrect = savedResult.isCorrect;
                    this.selectedAnswer = savedResult.selectedAnswer;
                }
            }

            // Obtener lista de Pokémon
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898'); // Gen 1-8
            const data = await response.json();
            
            // Seleccionar Pokémon del día basado en la fecha
            const seed = this.getDailySeed();
            const pokemonIndex = Math.floor(this.seededRandom(seed) * data.results.length);
            const pokemonUrl = data.results[pokemonIndex].url;
            
            // Cargar detalles del Pokémon
            const pokemonResponse = await fetch(pokemonUrl);
            this.currentPokemon = await pokemonResponse.json();
            
            // Generar opciones (3 incorrectas + 1 correcta)
            this.options = await this.generateOptions(data.results, pokemonIndex, seed);
            
        } catch (error) {
            console.error('Error loading daily challenge:', error);
        }
        this.loading = false;
    }

    async generateOptions(allPokemon, correctIndex, seed) {
        const options = [this.currentPokemon.name];
        const usedIndices = new Set([correctIndex]);
        
        // Generar 3 opciones incorrectas
        let attempts = 0;
        while (options.length < 4 && attempts < 50) {
            const randomIndex = Math.floor(this.seededRandom(seed + options.length * 100) * allPokemon.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                options.push(allPokemon[randomIndex].name);
            }
            attempts++;
        }
        
        // Mezclar opciones usando el seed
        return this.shuffleArray(options, seed);
    }

    shuffleArray(array, seed) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(this.seededRandom(seed + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    loadStats() {
        this.streak = parseInt(localStorage.getItem('pokemon-challenge-streak') || '0');
        this.bestStreak = parseInt(localStorage.getItem('pokemon-challenge-best-streak') || '0');
        this.totalCorrect = parseInt(localStorage.getItem('pokemon-challenge-total-correct') || '0');
        this.totalPlayed = parseInt(localStorage.getItem('pokemon-challenge-total-played') || '0');
    }

    saveStats() {
        localStorage.setItem('pokemon-challenge-streak', this.streak.toString());
        localStorage.setItem('pokemon-challenge-best-streak', this.bestStreak.toString());
        localStorage.setItem('pokemon-challenge-total-correct', this.totalCorrect.toString());
        localStorage.setItem('pokemon-challenge-total-played', this.totalPlayed.toString());
    }

    handleAnswerClick(optionName) {
        if (this.revealed || this.hasPlayed) return;
        
        this.selectedAnswer = optionName;
        this.isCorrect = optionName === this.currentPokemon.name;
        this.revealed = true;
        this.hasPlayed = true;
        
        // Actualizar estadísticas
        this.totalPlayed++;
        if (this.isCorrect) {
            this.totalCorrect++;
            this.streak++;
            if (this.streak > this.bestStreak) {
                this.bestStreak = this.streak;
            }
        } else {
            this.streak = 0;
        }
        
        this.saveStats();
        
        // Guardar resultado del día
        const today = new Date().toDateString();
        localStorage.setItem('pokemon-challenge-last-played', today);
        localStorage.setItem('pokemon-challenge-today-result', JSON.stringify({
            isCorrect: this.isCorrect,
            selectedAnswer: this.selectedAnswer,
            correctAnswer: this.currentPokemon.name
        }));
    }

    toggleHint() {
        if (this.revealed) return;
        this.showHint = !this.showHint;
    }

    getNextHint() {
        if (this.revealed || this.hintLevel >= 3) return;
        this.hintLevel++;
        this.showHint = true;
    }

    getGeneration(id) {
        if (id <= 151) return 'Generación I (Kanto)';
        if (id <= 251) return 'Generación II (Johto)';
        if (id <= 386) return 'Generación III (Hoenn)';
        if (id <= 493) return 'Generación IV (Sinnoh)';
        if (id <= 649) return 'Generación V (Teselia)';
        if (id <= 721) return 'Generación VI (Kalos)';
        if (id <= 809) return 'Generación VII (Alola)';
        return 'Generación VIII (Galar)';
    }

    async shareResults() {
        const today = new Date();
        const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
        
        // Crear mensaje con emojis
        const resultEmoji = this.isCorrect ? '✅' : '❌';
        const streakEmoji = this.streak >= 7 ? '🔥🔥🔥' : this.streak >= 3 ? '🔥🔥' : this.streak > 0 ? '🔥' : '💔';
        
        // Calcular porcentaje de aciertos
        const percentage = this.totalPlayed > 0 ? Math.round((this.totalCorrect / this.totalPlayed) * 100) : 0;
        
        // Generar indicador de pistas usadas
        const hintsUsed = this.hintLevel > 0 ? `\n💡 Pistas usadas: ${this.hintLevel}/3` : '';
        
        const shareText = `🎮 ¿Quién es ese Pokémon? - ${dateStr}

${resultEmoji} Resultado: ${this.isCorrect ? 'CORRECTO' : 'INCORRECTO'}
${this.isCorrect ? `🎯 ¡Es ${this.currentPokemon.name.toUpperCase()}!` : `😔 Era ${this.currentPokemon.name.toUpperCase()}`}${hintsUsed}

${streakEmoji} Racha actual: ${this.streak} día${this.streak !== 1 ? 's' : ''}
🏆 Mejor racha: ${this.bestStreak} día${this.bestStreak !== 1 ? 's' : ''}
📊 Aciertos: ${this.totalCorrect}/${this.totalPlayed} (${percentage}%)

¡Juega tú también en la Pokédex!`;

        try {
            // Intentar usar la Web Share API (funciona en móviles y algunos navegadores)
            if (navigator.share) {
                await navigator.share({
                    title: '¿Quién es ese Pokémon?',
                    text: shareText,
                    url: window.location.href
                });
                this.showNotification('¡Compartido exitosamente! 🎉', 'success');
            } else {
                // Fallback: copiar al portapapeles
                await navigator.clipboard.writeText(shareText);
                this.showNotification('¡Resultado copiado al portapapeles! 📋', 'success');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Si todo falla, mostrar el texto para copiar manualmente
            this.showShareDialog(shareText);
        }
    }

    showShareDialog(text) {
        // Crear un diálogo temporal para mostrar el texto
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-card, white);
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 90%;
            width: 500px;
        `;
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: var(--text-primary, #333);">Compartir Resultado</h3>
            <textarea readonly style="
                width: 100%;
                height: 200px;
                padding: 1rem;
                border: 2px solid var(--border-color, #ddd);
                border-radius: 8px;
                font-family: monospace;
                resize: none;
                background: var(--bg-primary, #f5f5f5);
                color: var(--text-primary, #333);
            ">${text}</textarea>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.value).then(() => alert('¡Copiado!')); this.parentElement.parentElement.remove();" style="
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Copiar</button>
                <button onclick="this.parentElement.parentElement.remove();" style="
                    padding: 0.75rem 1.5rem;
                    background: var(--bg-secondary, #ddd);
                    color: var(--text-primary, #333);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#333'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    renderHints() {
        if (!this.showHint || this.hintLevel === 0) return '';
        
        const hints = [];
        
        if (this.hintLevel >= 1 && this.currentPokemon.types) {
            hints.push(html`
                <div class="hint-item">
                    🏷️ Tipo: ${this.currentPokemon.types.map(t => html`
                        <span class="hint-type">${t.type.name}</span>
                    `)}
                </div>
            `);
        }
        
        if (this.hintLevel >= 2) {
            hints.push(html`
                <div class="hint-item">
                    🌍 ${this.getGeneration(this.currentPokemon.id)}
                </div>
            `);
        }
        
        if (this.hintLevel >= 3) {
            hints.push(html`
                <div class="hint-item">
                    🔤 Empieza por: <strong>${this.currentPokemon.name.charAt(0).toUpperCase()}</strong>
                </div>
            `);
        }
        
        return html`
            <div class="hints-container">
                <h4>💡 Pistas</h4>
                ${hints}
            </div>
        `;
    }

    render(){
        if (this.loading) {
            return html`
                <div class="challenge-container">
                    <div class="loading-container">
                        <div class="pokeball-loader"></div>
                        <p>Cargando desafío del día...</p>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="challenge-container">
                <div class="challenge-header">
                    <h1>🎮 ¿Quién es ese Pokémon?</h1>
                    <p class="challenge-subtitle">Desafío Diario</p>
                </div>

                <div class="stats-bar">
                    <div class="stat-item">
                        <span class="stat-icon">🔥</span>
                        <div class="stat-info">
                            <span class="stat-label">Racha</span>
                            <span class="stat-value">${this.streak}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🏆</span>
                        <div class="stat-info">
                            <span class="stat-label">Mejor</span>
                            <span class="stat-value">${this.bestStreak}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">✅</span>
                        <div class="stat-info">
                            <span class="stat-label">Aciertos</span>
                            <span class="stat-value">${this.totalCorrect}/${this.totalPlayed}</span>
                        </div>
                    </div>
                </div>

                <div class="pokemon-display ${this.revealed ? 'revealed' : ''}">
                    <img 
                        src="${this.currentPokemon.sprites.other['official-artwork'].front_default || this.currentPokemon.sprites.front_default}" 
                        alt="Pokemon silhouette"
                        class="pokemon-image ${this.revealed ? '' : 'silhouette'}"
                    />
                    ${this.revealed ? html`
                        <h2 class="pokemon-name">${this.currentPokemon.name}</h2>
                        <span class="pokemon-id">#${this.currentPokemon.id.toString().padStart(3, '0')}</span>
                    ` : ''}
                </div>

                ${!this.revealed && this.hintLevel < 3 ? html`
                    <button class="hint-button" @click="${this.getNextHint}">
                        💡 Obtener Pista (${this.hintLevel}/3)
                    </button>
                ` : ''}

                ${this.renderHints()}

                ${this.revealed ? html`
                    <div class="result-message ${this.isCorrect ? 'correct' : 'incorrect'}">
                        ${this.isCorrect ? html`
                            <div class="result-icon">🎉</div>
                            <h3>¡Correcto!</h3>
                            <p>Has acertado. ¡Sigue así!</p>
                            ${this.streak > 1 ? html`<p class="streak-message">🔥 Racha de ${this.streak} días</p>` : ''}
                        ` : html`
                            <div class="result-icon">😔</div>
                            <h3>¡Incorrecto!</h3>
                            <p>Era <strong>${this.currentPokemon.name}</strong></p>
                            <p class="streak-lost">Racha perdida. ¡Inténtalo mañana!</p>
                        `}
                        <button class="share-button" @click="${this.shareResults}">
                            📤 Compartir Resultado
                        </button>
                    </div>
                ` : ''}

                <div class="options-grid">
                    ${this.options.map(option => html`
                        <button 
                            class="option-button ${this.selectedAnswer === option ? (this.isCorrect ? 'selected-correct' : 'selected-incorrect') : ''} ${this.revealed && option === this.currentPokemon.name ? 'correct-answer' : ''}"
                            @click="${() => this.handleAnswerClick(option)}"
                            ?disabled="${this.revealed || this.hasPlayed}">
                            ${option}
                        </button>
                    `)}
                </div>

                ${this.hasPlayed ? html`
                    <div class="next-challenge-info">
                        <p>⏰ Vuelve mañana para un nuevo desafío</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            padding: 2rem;
            background-color: var(--bg-primary, #f5f5f5);
        }

        .challenge-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .challenge-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .challenge-header h1 {
            color: var(--text-primary, #333);
            font-size: 2.5rem;
            margin: 0 0 0.5rem 0;
        }

        .challenge-subtitle {
            color: var(--text-secondary, #666);
            font-size: 1.2rem;
            margin: 0;
        }

        .stats-bar {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stat-item {
            background: var(--bg-card, white);
            border-radius: 12px;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            box-shadow: 0 2px 8px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .stat-icon {
            font-size: 2rem;
        }

        .stat-info {
            display: flex;
            flex-direction: column;
        }

        .stat-label {
            font-size: 0.85rem;
            color: var(--text-secondary, #666);
            font-weight: 600;
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--text-primary, #333);
        }

        .pokemon-display {
            background: var(--bg-card, white);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            margin-bottom: 2rem;
            box-shadow: 0 4px 16px var(--shadow-color, rgba(0,0,0,0.1));
            position: relative;
            overflow: hidden;
        }

        .pokemon-display::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(255,215,0,0.1) 0%, transparent 70%);
            pointer-events: none;
        }

        .pokemon-image {
            width: 300px;
            height: 300px;
            object-fit: contain;
            transition: all 0.8s ease;
            position: relative;
            z-index: 1;
        }

        .pokemon-image.silhouette {
            filter: brightness(0) drop-shadow(0 0 20px rgba(0,0,0,0.3));
        }

        .pokemon-display.revealed .pokemon-image {
            animation: revealPokemon 0.8s ease-out;
        }

        @keyframes revealPokemon {
            0% {
                filter: brightness(0);
                transform: scale(0.8) rotate(-10deg);
            }
            50% {
                transform: scale(1.1) rotate(5deg);
            }
            100% {
                filter: brightness(1);
                transform: scale(1) rotate(0deg);
            }
        }

        .pokemon-name {
            color: var(--text-primary, #333);
            font-size: 2rem;
            margin: 1rem 0 0.5rem 0;
            text-transform: capitalize;
            animation: fadeInUp 0.5s ease 0.3s both;
        }

        .pokemon-id {
            color: var(--text-secondary, #666);
            font-size: 1.2rem;
            font-weight: 600;
            animation: fadeInUp 0.5s ease 0.4s both;
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

        .hint-button {
            display: block;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .hint-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
        }

        .hints-container {
            background: var(--bg-card, white);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 8px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .hints-container h4 {
            color: var(--text-primary, #333);
            margin: 0 0 1rem 0;
            font-size: 1.2rem;
        }

        .hint-item {
            background: var(--bg-hover, #f8fafc);
            padding: 0.8rem 1rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            color: var(--text-primary, #333);
            font-weight: 600;
        }

        .hint-item:last-child {
            margin-bottom: 0;
        }

        .hint-type {
            display: inline-block;
            background: var(--bg-secondary, #e0e0e0);
            padding: 0.2rem 0.8rem;
            border-radius: 6px;
            margin-left: 0.5rem;
            text-transform: capitalize;
        }

        .options-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .option-button {
            background: var(--bg-card, white);
            border: 3px solid var(--border-color, #e0e0e0);
            padding: 1.2rem;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            color: var(--text-primary, #333);
            text-transform: capitalize;
        }

        .option-button:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow-hover, rgba(0,0,0,0.15));
            border-color: #667eea;
        }

        .option-button:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }

        .option-button.selected-correct {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border-color: #16a34a;
            color: white;
            animation: correctPulse 0.6s ease;
        }

        .option-button.selected-incorrect {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            border-color: #dc2626;
            color: white;
            animation: shake 0.5s ease;
        }

        .option-button.correct-answer {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border-color: #16a34a;
            color: white;
        }

        @keyframes correctPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        .result-message {
            background: var(--bg-card, white);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            margin-bottom: 2rem;
            box-shadow: 0 4px 16px var(--shadow-color, rgba(0,0,0,0.1));
            animation: slideDown 0.5s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .result-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        .result-message h3 {
            color: var(--text-primary, #333);
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
        }

        .result-message p {
            color: var(--text-secondary, #666);
            margin: 0.5rem 0;
            font-size: 1.1rem;
        }

        .streak-message {
            color: #f59e0b !important;
            font-weight: 700;
            font-size: 1.3rem !important;
        }

        .streak-lost {
            color: #ef4444 !important;
            font-weight: 600;
        }

        .share-button {
            margin-top: 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .share-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        .share-button:active {
            transform: translateY(0);
        }

        .next-challenge-info {
            text-align: center;
            background: var(--bg-card, white);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px var(--shadow-color, rgba(0,0,0,0.1));
        }

        .next-challenge-info p {
            margin: 0;
            color: var(--text-secondary, #666);
            font-size: 1.1rem;
            font-weight: 600;
        }

        .loading-container {
            text-align: center;
            padding: 4rem 2rem;
        }

        .pokeball-loader {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            border-radius: 50%;
            border: 8px solid var(--border-color, #e0e0e0);
            border-top-color: #ef4444;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            :host {
                padding: 1rem;
            }

            .challenge-header h1 {
                font-size: 1.8rem;
            }

            .stats-bar {
                grid-template-columns: 1fr;
            }

            .pokemon-image {
                width: 200px;
                height: 200px;
            }

            .options-grid {
                grid-template-columns: 1fr;
            }

            .share-button {
                font-size: 1rem;
                padding: 0.875rem 1.75rem;
            }
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
}

customElements.define('pokemon-daily-challenge', PokemonDailyChallenge);
