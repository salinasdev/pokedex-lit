#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para actualizar el menú principal de la Pokédex
"""

import re

# Leer el archivo
with open('src/pokedex-main/pokedex-main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# HTML nuevo para el menú
new_menu_html = '''                <div class="main-menu-container">
                    <div class="menu-header">
                        <h1 class="menu-title">✨ Bienvenido a la Pokédex</h1>
                        <p class="menu-subtitle">¿Qué aventura te espera hoy?</p>
                    </div>

                    <div class="menu-category">
                        <div class="category-header">
                            <div class="category-icon">🎯</div>
                            <h2 class="category-title">Exploración</h2>
                            <p class="category-description">Descubre el mundo Pokémon</p>
                        </div>
                        <div class="category-cards">
                            <div class="menu-card featured-card" @click="${this.showGenerations}">
                                <div class="card-icon">📚</div>
                                <h3 class="card-title">Explorar Generaciones</h3>
                                <p class="card-description">Descubre todas las generaciones de Pokémon</p>
                                <div class="card-badge primary">¡Empieza aquí!</div>
                            </div>

                            <div class="menu-card" @click="${this.showStats}">
                                <div class="card-icon">📊</div>
                                <h3 class="card-title">Estadísticas</h3>
                                <p class="card-description">Rankings y comparador de stats</p>
                                <div class="card-badge">Popular</div>
                            </div>

                            <div class="menu-card" @click="${this.goToRandomPokemon}">
                                <div class="card-icon">🔀</div>
                                <h3 class="card-title">Pokémon Aleatorio</h3>
                                <p class="card-description">Descubre un Pokémon al azar</p>
                            </div>
                        </div>
                    </div>

                    <div class="menu-category">
                        <div class="category-header">
                            <div class="category-icon">⚔️</div>
                            <h2 class="category-title">Competición</h2>
                            <p class="category-description">Pon a prueba tus estrategias</p>
                        </div>
                        <div class="category-cards">
                            <div class="menu-card" @click="${this.showBattleSimulatorView}">
                                <div class="card-icon">⚔️</div>
                                <h3 class="card-title">Simulador de Combate</h3>
                                <p class="card-description">Simula batallas con IA avanzada</p>
                                <div class="card-badge hot">Hot</div>
                            </div>

                            <div class="menu-card featured-card" @click="${this.showTournamentView}">
                                <div class="card-icon">🏆</div>
                                <h3 class="card-title">Modo Torneo</h3>
                                <p class="card-description">Compite y alcanza el ranking</p>
                                <div class="card-badge new">¡Nuevo!</div>
                            </div>

                            <div class="menu-card" @click="${this.showTeamBuilderView}">
                                <div class="card-icon">👥</div>
                                <h3 class="card-title">Constructor de Equipos</h3>
                                <p class="card-description">Crea tu equipo perfecto</p>
                            </div>
                        </div>
                    </div>

                    <div class="menu-category">
                        <div class="category-header">
                            <div class="category-icon">🎮</div>
                            <h2 class="category-title">Diversión</h2>
                            <p class="category-description">Minijuegos y extras</p>
                        </div>
                        <div class="category-cards">
                            <div class="menu-card" @click="${this.showDailyChallengeView}">
                                <div class="card-icon">🎯</div>
                                <h3 class="card-title">Desafío Diario</h3>
                                <p class="card-description">Adivina el Pokémon del día</p>
                            </div>

                            <div class="menu-card" @click="${this.showShinyTrackerView}">
                                <div class="card-icon">✨</div>
                                <h3 class="card-title">Shiny Tracker</h3>
                                <p class="card-description">Rastrea tus cazas shiny</p>
                                <div class="card-badge new">¡Nuevo!</div>
                            </div>

                            <div class="menu-card" @click="${this.showEventsView}">
                                <div class="card-icon">🎉</div>
                                <h3 class="card-title">Eventos</h3>
                                <p class="card-description">Noticias y eventos actuales</p>
                            </div>
                        </div>
                    </div>
                </div>'''

# Patron para encontrar el div de features-section hasta su cierre
# Buscar desde "main-menu-container" o "features-section" hasta el cierre antes de generationsView
pattern = r'<div class="(?:main-menu-container|features-section)">.*?</div>\s*</div>\s*<div id="generationsView"'

# Reemplazar
replacement = new_menu_html + '\n            </div>\n            <div id="generationsView"'
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Guardar el archivo
with open('src/pokedex-main/pokedex-main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ HTML del menú actualizado correctamente!")
print("Ahora ejecuta el script de CSS: python update-menu-css.py")
