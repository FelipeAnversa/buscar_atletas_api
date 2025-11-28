import api from './services/api'
import { useState, useEffect } from 'react';

export default function Buscar() {
    const [jogador, setJogador] = useState(null);
    const [selecionado, setSelecionado] = useState(null);

    const pegarTexto = (evento) => {
        setJogador(evento.target.value);
    };
    
    useEffect(() => {
        const buscar = async () => {
            if (jogador && jogador.trim()) {
                try {
                    const resultado = await buscarAtleta(jogador);
                    const jogadorFinal = resultado.contents?.translated || resultado.translated || JSON.stringify(resultado);
                    setSelecionado(jogadorFinal);
                } catch (error) {
                    console.log("ERRO:", error);
                    setSelecionado("Erro na tradução");
                }
            } else {
                setSelecionado("");
            }
        };
        const timeoutId = setTimeout(buscar, 500);
        return () => clearTimeout(timeoutId);
    }, [jogador]);

    return (
        <>
            <div id="input">
                <input type="text" placeholder="Escreva Aqui" value={jogador} onChange={pegarTexto} />
            </div>
            <div>
                <h1>Name: {selecionado.strPlayer}</h1>
                <h1>Team: {selecionado.strTeam}</h1>
                <h1>Nationality: {selecionado.strNationality}</h1>
                <h1>Position: {selecionado.strPosition}</h1>
                <img src={selecionado.strThumb} alt="Foto Jogador" />
            </div>
        </>
    );
}

function buscarAtleta(nome) {
    try {
        const nomeM = nome.replace(/ /g, "_");
        const API = api.get(`${nomeM}`);
        const data = API.data;
        return {
            strPlayer: data.strPlayer,
            strTeam: data.strTeam,
            strThumb: data.strThumb,
            strNationality: data.strNationality,
            strPosition: data.strPosition
        };
    } catch (error) {
        console.log(`ERRO: `, error);
        throw error;
    }
}