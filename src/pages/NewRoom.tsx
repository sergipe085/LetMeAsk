import { Link } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import "../styles/auth.scss";
import { Button } from "../components/Button";

export function NewRoom() {
    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustracao simulando perguntas e respostas."/>
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as duvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="LetMeAsk"/>
                    <h2>Crie uma nova sala</h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala ja existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    );
}