import api from './services/api'
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Typography } from '@mui/material';
import { createTheme , ThemeProvider } from '@mui/material';

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

    const style = {
        p: 0,
        width: '100%',
        maxWidth: 360,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    const theme = createTheme({
        pallete: {
            background: {
                paper: '#fff',
            },
            status: {
                danger: '#f00',
            },
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <div style={{fontFamily: ' "Arial", "Helvetica", "sans-serif" ', textAlign: 'center'}}>
                <div>
                    <TextField 
                        id='outlined-read-only-input'
                        placeholder="Escreva Aqui" 
                        value={jogador} 
                        onChange={pegarTexto} 
                    />
                </div>
                
                {carregando && <p>Carregando...</p>}
                
                {erro && <Typography sx={{color: 'status.danger'}}>{erro}</Typography>}
                
                {selecionado && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <List sx={style} aria-label='mailbox folders'>
                            <ListItem>
                                <ListItemText primary={selecionado.strPlayer} />
                            </ListItem>
                            <Divider component='li' />
                            <ListItem>
                                <ListItemText primary={selecionado.strTeam} />
                            </ListItem>
                            <Divider component='li' />
                            <ListItem>
                                <ListItemText primary={selecionado.strNationality} />
                            </ListItem>
                            <Divider component='li' />
                            <ListItem>
                                <ListItemText primary={selecionado.strPosition} />
                            </ListItem>
                            <Divider component='li' />
                            <ImageList sx={{ width: 725, height: 450 }}>
                                <ImageListItem>
                                    <img 
                                        srcSet={`${selecionado.strThumb}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${selecionado.strThumb}?w=164&h=164&fit=crop&auto=format`} 
                                        alt={selecionado.strPlayer}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            </ImageList>
                        </List>
                    </div>
                )}
            </div>
        </ThemeProvider>
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