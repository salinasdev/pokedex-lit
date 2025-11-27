import { html, LitElement, css} from "lit";

class PokedexFooter extends LitElement {

    static get properties(){
        return {
            isScrolled: {type: Boolean}
        };

    }

    constructor(){
        super();
        this.isScrolled = false;
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        // Si el scroll es mayor a 100px, activar el estado compacto
        this.isScrolled = window.scrollY > 100;
    }
    static styles = css`
        .footer-container {
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a88 100%);
            margin-top: 4rem;
            padding: 2rem 0;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-container.scrolled {
            padding: 1rem 0;
            transform: scale(0.95);
        }

        footer {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
            border-top: 2px solid rgba(255, 255, 255, 0.1);
            transition: padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-container.scrolled footer {
            padding: 1rem 1rem;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1.5rem;
            transition: gap 0.4s ease;
        }

        .footer-container.scrolled .footer-content {
            gap: 1rem;
        }

        .footer-brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .footer-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.95rem;
            font-weight: 500;
            transition: font-size 0.4s ease;
        }

        .footer-container.scrolled .footer-text {
            font-size: 0.85rem;
        }

        .social-links {
            display: flex;
            gap: 1rem;
            list-style: none;
            margin: 0;
            padding: 0;
            transition: gap 0.4s ease;
        }

        .footer-container.scrolled .social-links {
            gap: 0.7rem;
        }

        .social-link {
            position: relative;
            display: inline-block;
            transition: transform 0.3s ease;
        }

        .social-link:hover {
            transform: translateY(-8px) scale(1.1);
            animation: bounce 0.6s ease;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(-8px) scale(1.1); }
            50% { transform: translateY(-12px) scale(1.15); }
        }

        .social-link::before {
            content: '';
            position: absolute;
            inset: -8px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .social-link:hover::before {
            opacity: 1;
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.3); opacity: 0; }
        }

        .social-icon {
            width: 36px;
            height: 36px;
            filter: brightness(0) invert(1);
            opacity: 0.9;
            transition: all 0.4s ease;
        }

        .footer-container.scrolled .social-icon {
            width: 28px;
            height: 28px;
        }

        .social-link:hover .social-icon {
            opacity: 1;
            filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
            transform: rotate(360deg);
        }

        @media (max-width: 768px) {
            .footer-content {
                flex-direction: column;
                text-align: center;
            }

            .footer-brand {
                flex-direction: column;
            }
            
            .footer-container {
                position: relative;
            }
        }
    `;

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <div class="footer-container ${this.isScrolled ? 'scrolled' : ''}">
            <footer>
                <div class="footer-content">
                    <div class="footer-brand">
                        <span class="footer-text">© 2021 salinasdev</span>
                    </div>

                    <ul class="social-links">
                        <li>
                            <a class="social-link" target="_blank" href="#" aria-label="Twitter">
                                <img src="../img/twitter.svg" alt="Twitter" class="social-icon">
                            </a>
                        </li>
                        <li>
                            <a class="social-link" target="_blank" href="https://es.linkedin.com/in/v%C3%ADctor-salinas-villarrubia-b8a0b1132" aria-label="LinkedIn">
                                <img src="../img/linkedin.svg" alt="LinkedIn" class="social-icon">
                            </a>
                        </li>
                        <li>
                            <a class="social-link" target="_blank" href="https://github.com/salinasdev" aria-label="GitHub">
                                <img src="../img/github.svg" alt="GitHub" class="social-icon">
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
        `;
    }
    
}



customElements.define('pokedex-footer', PokedexFooter);