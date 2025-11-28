import api from './services/api'
import { useState, useEffect } from 'react';

export default function Buscar() {
    const [jogador, setJogador] = useState('');
    const [selecionado, setSelecionado] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const pegarTexto = (evento) => {
        setJogador(evento.target.value);
    };
    
    useEffect(() => {
        const buscar = async () => {
            if (jogador && jogador.trim()) {
                setCarregando(true);
                setErro('');
                try {
                    const resultado = await buscarAtleta(jogador);
                    setSelecionado(resultado);
                } catch (error) {
                    console.log("ERRO:", error);
                    setErro("Jogador não encontrado ou erro na busca");
                    setSelecionado(null);
                } finally {
                    setCarregando(false);
                }
            } else {
                setSelecionado(null);
                setErro('');
            }
        };
        
        const timeoutId = setTimeout(buscar, 500);
        return () => clearTimeout(timeoutId);
    }, [jogador]);

    return (
        <>
            <div id="input">
                <input 
                    type="text" 
                    placeholder="Escreva Aqui" 
                    value={jogador} 
                    onChange={pegarTexto} 
                />
            </div>
            
            {carregando && <p>Carregando...</p>}
            
            {erro && <p style={{color: 'red'}}>{erro}</p>}
            
            {selecionado && (
                <div>
                    <h1>Name: {selecionado.strPlayer}</h1>
                    <h1>Team: {selecionado.strTeam}</h1>
                    <h1>Nationality: {selecionado.strNationality}</h1>
                    <h1>Position: {selecionado.strPosition}</h1>
                    <img src={selecionado.strThumb} alt="Foto Jogador" />
                </div>
            )}
        </>
    );
}

async function buscarAtleta(nome) {
    try {
        const nomeM = nome.replace(/ /g, "_");
        const API = await api.get(`${nomeM}`);
        const data = await API.data;
        
        if (!data.player || data.player.length === 0) throw new Error('Jogador não encontrado');
        
        return {
            strPlayer: data.player[0].strPlayer,
            strTeam: data.player[0].strTeam,
            strThumb: data.player[0].strThumb,
            strNationality: data.player[0].strNationality,
            strPosition: data.player[0].strPosition
        };
    } catch (error) {
        console.log(`ERRO: `, error);
        throw error;
    }
}