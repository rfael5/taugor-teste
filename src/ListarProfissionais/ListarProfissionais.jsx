import React, { useEffect, useState } from 'react';
import {storage, listRef, db, ref, collection, doc, getDocs, deleteObject, getDownloadURL, deleteDoc, auth } from '../firebase';
//import '../firebase/storage';
import LoggedHeader from '../LoggedHeader/LoggedHeader';
import './ListarProfissionais.css'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import HistoryIcon from '@mui/icons-material/History';

import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";

function ListarProfissionais(){
    //const lista = listRef;
    const navigate = useNavigate();
    const [listaProf, setListaProf] = useState([]);


    const listarDados = async () => {
        const querySnapshot = await getDocs(collection(db, "profissionais"));
        const novaLista = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setListaProf(novaLista);
      };

    const downloadPdf = (nome, numeroId) => {
        getDownloadURL(ref(storage, `files/${nome}-${numeroId}`))
            .then((url) => {
                window.open(url);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const deletarInformacoes = async (dados) => {
        const arquivoRef = ref(storage, `files/${dados.nome}-${dados.numeroId}`);

        deleteObject(arquivoRef)
            .then(() => {
                console.log("Arquivo excluído com sucesso");
            }).catch((err) => {
                console.log("Erro ao tentar excluir arquivo");
            })
        
        const docRef = doc(db, "profissionais", dados.id)

        deleteDoc(docRef)
            .then(() => {
                listarDados()
            })
    }

    useEffect(() => {
        if(!user){
            navigate("/");
        }else{
            listarDados();
        } 
        
    }, []);

    const [user, loading, error] = useAuthState(auth);
    
    return (    
        <div>
            <LoggedHeader />

            <div className="table-container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nome</TableCell>
                                <TableCell align="center">E-Mail</TableCell>
                                <TableCell align="center">Cargo</TableCell>
                                <TableCell align="center">Setor</TableCell>
                                <TableCell align="center">Acessar PDF</TableCell>
                                <TableCell align="center">Histórico</TableCell>
                                <TableCell align="center">Editar dados</TableCell>
                                <TableCell align="center">Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaProf?.map((prof, i) => (
                                <TableRow 
                                    key={i} 
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">{prof.nome}</TableCell>
                                    <TableCell align="center">{prof.email}</TableCell>
                                    <TableCell align="center">{prof.cargo}</TableCell>
                                    <TableCell align="center">{prof.setor}</TableCell>
                                    <TableCell align="center">
                                        <button className="btn-abrir-arquivo" onClick={() => downloadPdf(prof.nome, prof.numeroId)}>
                                            <FileOpenIcon />
                                        </button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link to={`historico/${prof.id}`}>
                                            <HistoryIcon />
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link to={`/editar-dados/${prof.id}`} >
                                            <EditIcon color="disabled" />
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">
                                        <button className="btn-delete" onClick={() => {deletarInformacoes(prof)}}>
                                            <DeleteForeverIcon />
                                        </button>
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

export default ListarProfissionais;