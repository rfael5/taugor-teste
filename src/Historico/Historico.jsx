import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { db, doc, query, getDocs, collection} from '../firebase';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import LoggedHeader from '../LoggedHeader/LoggedHeader';

function Historico() {

    const { idProf } = useParams();
    
    const [dadosHistorico, setDadosHistorico] = useState();

    const buscarHistorico = () => {
        const colecaoPrincipal = collection(db, `profissionais/${idProf}/historico`)
        getDocs(colecaoPrincipal)
            .then(async (querySnapshot) => {
               const attUsuario = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id}));
               setDadosHistorico(attUsuario);
            })
    } 

    useEffect(() => {
        buscarHistorico();
    }, [])
    
    return (
        <div>
            <LoggedHeader />

            <div className="table-container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Data da atualização</TableCell>
                                <TableCell align="center">Dados antigos</TableCell>
                                <TableCell align="center">Data atualizados</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dadosHistorico?.map((atualizacao, i) => (
                                <TableRow
                                    key={i} 
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">{atualizacao.id}</TableCell>
                                    <TableCell>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemText>
                                                E-mail: {atualizacao.att.dadosAntigos.email}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Telefone: {atualizacao.att.dadosAntigos.telefone}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Endereço: {atualizacao.att.dadosAntigos.endereço}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Cargo: {atualizacao.att.dadosAntigos.cargo}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Setor: {atualizacao.att.dadosAntigos.setor}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Salário: {atualizacao.att.dadosAntigos.salario}
                                            </ListItemText>                                    
                                        </ListItem>
        
                                        </List>
                                    </TableCell>

                                    <TableCell>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemText>
                                                E-mail: {atualizacao.att.novosDados.email}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Telefone: {atualizacao.att.novosDados.telefone}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Endereço: {atualizacao.att.novosDados.endereço}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Cargo: {atualizacao.att.novosDados.cargo}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Setor: {atualizacao.att.novosDados.setor}
                                            </ListItemText>                                    
                                        </ListItem>

                                        <ListItem disablePadding>
                                            <ListItemText>
                                                Salário: {atualizacao.att.novosDados.salario}
                                            </ListItemText>                                    
                                        </ListItem>
        
                                        </List>
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </div>
    )
}

export default Historico;