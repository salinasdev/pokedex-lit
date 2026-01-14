#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para actualizar los estilos CSS del menú principal
"""

import re

# Leer el archivo
with open('src/pokedex-main/pokedex-main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Nuevo CSS
new_css = '''
        /* ========================================
           NUEVO DISEÑO DEL MENÚ PRINCIPAL
           ======================================== */

        /* Contenedor Principal */
        .main-menu-container {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 2rem;
        }

        /* Header del Menú */
        .menu-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .menu-title {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .menu-subtitle {
            font-size: 1.2rem;
            color: var(--text-secondary, #718096);
            margin: 0;
        }

        /* Categoría */
        .menu-category {
            margin-bottom: 3rem;
            padding: 2rem;
            background: var(--bg-card, white);
            border-radius: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        /* Header de Categoría */
        .category-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid rgba(102, 126, 234, 0.1);
        }

        .category-icon {
            font-size: 2.5rem;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .category-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin: 0;
        }

        .category-description {
            font-size: 0.9rem;
            color: var(--text-secondary, #718096);
            margin: 0;
            margin-left: auto;
        }

        /* Grid de Cards */
        .category-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }

        /* Card Individual */
        .menu-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 15px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .menu-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .menu-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
            border-color: #667eea;
        }

        .menu-card:hover::before {
            opacity: 1;
        }

        /* Card Destacada */
        .featured-card {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            border-color: #667eea;
        }

        .featured-card:hover {
            box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
        }

        /* Icono de la Card */
        .card-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-align: center;
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
            transition: all 0.3s ease;
        }

        .menu-card:hover .card-icon {
            transform: scale(1.15) rotate(5deg);
        }

        /* Título de la Card */
        .card-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--text-primary, #2d3748);
            margin: 0 0 0.5rem 0;
            text-align: center;
        }

        /* Descripción de la Card */
        .card-description {
            font-size: 0.85rem;
            color: var(--text-secondary, #718096);
            text-align: center;
            margin: 0;
            line-height: 1.4;
        }

        /* Badges */
        .card-badge {
            position: absolute;
            top: 0.8rem;
            right: 0.8rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.3rem 0.7rem;
            border-radius: 15px;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 3px 8px rgba(102, 126, 234, 0.4);
        }

        .card-badge.primary {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            box-shadow: 0 3px 8px rgba(245, 87, 108, 0.4);
        }

        .card-badge.hot {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            box-shadow: 0 3px 8px rgba(250, 112, 154, 0.4);
        }

        .card-badge.new {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            box-shadow: 0 3px 8px rgba(67, 233, 123, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .menu-title {
                font-size: 2rem;
            }

            .menu-subtitle {
                font-size: 1rem;
            }

            .category-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }

            .category-description {
                margin-left: 0;
            }

            .category-cards {
                grid-template-columns: 1fr;
            }

            .main-menu-container {
                padding: 1rem;
            }

            .menu-category {
                padding: 1.5rem;
            }
        }
'''

# Buscar y reemplazar la sección de CSS del menú
# Patrón: desde "/* Sección de Funciones Elegante */" o similar hasta antes de la siguiente sección grande
pattern = r'/\* Sección de Funciones Elegante \*/.*?\.feature-badge \{[^}]*\}'

# Si no encuentra ese patrón, buscar desde .features-section
if not re.search(pattern, content, flags=re.DOTALL):
    pattern = r'\.features-section \{.*?\.feature-badge \{[^}]*\}'

content = re.sub(pattern, new_css, content, flags=re.DOTALL)

# Guardar
with open('src/pokedex-main/pokedex-main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ CSS del menú actualizado correctamente!")
print("🎉 ¡Rediseño completo! Recarga la página para ver los cambios.")
