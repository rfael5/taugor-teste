import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, doc, getDoc, updateDoc, setDoc, auth } from '../firebase'

import CurrencyInput from 'react-currency-input-field';

import * as yup from 'yup';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { FormControl } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import NoImage from '../assets/profile-picture.jpg'

import Input from '../Input/Input';
import documentoPDF from '../Documento/Documento';
import LoggedHeader from '../LoggedHeader/LoggedHeader';

import './EditarDados.css';

function EditarDados(props) {

    const { idProf } = useParams();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        borderRadius: '4px',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    };

    const [mensagemModal, setMensagemModal] = useState();
    const [iconeModal, setIconeModal] = useState();
    const [open, setOpen] = React.useState(false);
    const handleOpen = (mensagem, res) => {
        setIconeModal(res);
        setMensagemModal(mensagem);

        setOpen(true);
    }
    const handleClose = () => setOpen(false);


    const [dadosIniciais, setDadosIniciais] = useState();

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            buscarDados();
        }

    }, []);

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    async function buscarDados() {
        const docRef = doc(db, "profissionais", idProf);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const dados = docSnap.data()
            setUpdateForm({
                cargo: dados.cargo,
                dataAdmissao: dados.dataAdmissao,
                dataNascimento: dados.dataNascimento,
                email: dados.email,
                endereco: dados.endereco,
                foto: dados.foto,
                genero: dados.genero,
                numeroId: dados.numeroId,
                nome: dados.nome,
                salario: dados.salario,
                setor: dados.setor,
                telefone: dados.telefone,
            })

            setDadosIniciais({
                cargo: dados.cargo,
                email: dados.email,
                endereco: dados.endereco,
                foto: dados.foto,
                salario: dados.salario,
                setor: dados.setor,
                telefone: dados.telefone,
            })

        } else {
            console.log("Documento não encontrado");
        }
    }


    const [updateForm, setUpdateForm] = useState({
        id: '',
        nome: '',
        telefone: '',
        endereco: '',
        email: '',
        foto: null,
        cargo: '',
        dataAdmissao: null,
        setor: '',
        salario: '',
    });

    const [formErrors, setFormErrors] = useState({
        nome: null,
        sexo: null,
        telefone: null,
        endereco: null,
        email: null,
        dataNascimento: null,
        foto: null,
        cargo: null,
        dataAdmissao: null,
        setor: null,
        salario: null,
    });

    const schema = yup.object().shape({
        telefone: yup.string().required("O campo 'Telefone' é obrigatório").min(15, "Digite um número de telefone válido").matches(/^[0-9()\- ]+$/, "Digite um número de telefone válido"),
        endereco: yup.string().required("O campo 'Endereço' é obrigatório"),
        email: yup.string().required("O campo 'E-mail' é obrigatório").email("Digite um e-mail válido"),
        dataNascimento: yup.date().required("O campo 'Data de nascimento' é obrigatório"),
        foto: yup.mixed().required("Adicione uma foto"),
        cargo: yup.string().required("O campo 'Cargo' é obrigatório"),
        dataAdmissao: yup.date().required("O campo 'Data de admissão' é obrigatório"),
        setor: yup.string().required("O campo 'Setor' é obrigatório"),
        salario: yup.string().required("O campo 'Salário' é obrigatório").matches(/^[0-9]+$/, "Digíte um valor válido."),
    })


    const handleChange = (nomeCampo, value) => {
        setUpdateForm({
            ...updateForm,
            [nomeCampo]: value
        });

        if (formErrors[nomeCampo]) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [nomeCampo]: null,
            }));
        }
    }


    const [userImage, setUserImage] = useState(NoImage);


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        setUserImage(URL.createObjectURL(file));

        reader.onload = () => {
            const imagemBase64 = reader.result;
            setUpdateForm({
                ...updateForm,
                foto: imagemBase64
            })
        }

        if (file) {
            reader.readAsDataURL(file);
        }

    }


    const handleTelefoneChange = (e) => {
        const value = e.target.value;
        const numeroFormatado = formatarTelefone(value);

        setUpdateForm({ ...updateForm, telefone: numeroFormatado })
    }


    const formatarTelefone = (value) => {
        const numericValue = value.replace(/\D/g, '');

        if (numericValue.length <= 2) {
            return `(${numericValue}`;
        } else if (numericValue.length <= 7) {
            return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
        } else {
            return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
        }
    };


    function padZero(number) {
        return String(number).padStart(2, "0");
    }


    async function atualizarHistorico() {
        const dataAtual = new Date();

        const nomeDoDocumento = `${dataAtual.getFullYear()}-${padZero(dataAtual.getMonth() + 1)}-${padZero(dataAtual.getDate())}--${padZero(dataAtual.getHours())}:${padZero(dataAtual.getMinutes())}:${padZero(dataAtual.getSeconds())}`;
        const atualizacoes = {
            novosDados: {
                foto: updateForm.foto,
                email: updateForm.email,
                endereço: updateForm.endereco,
                telefone: updateForm.telefone,
                cargo: updateForm.cargo,
                setor: updateForm.setor,
                salário: updateForm.salario
            },
            dadosAntigos: {
                foto: dadosIniciais.foto,
                email: dadosIniciais.email,
                endereço: dadosIniciais.endereco,
                telefone: dadosIniciais.telefone,
                cargo: dadosIniciais.cargo,
                setor: dadosIniciais.setor,
                salário: dadosIniciais.salario
            }
        }

        const docRef = doc(db, `profissionais/${idProf}/historico/${nomeDoDocumento}`);
        try {
            await setDoc(docRef, { att: atualizacoes })

        } catch (err) {
            console.error(err);
        }

    }


    async function atualizarDados() {
        const data = {
            cargo: updateForm.cargo,
            dataAdmissao: updateForm.dataAdmissao,
            dataNascimento: updateForm.dataNascimento,
            email: updateForm.email,
            endereco: updateForm.endereco,
            foto: updateForm.foto,
            genero: updateForm.genero,
            numeroId: updateForm.numeroId,
            nome: updateForm.nome,
            salario: updateForm.salario,
            setor: updateForm.setor,
            telefone: updateForm.telefone,
        };

        const docRef = doc(db, "profissionais", idProf)

        updateDoc(docRef, data)
            .then(docRef => {
                atualizarHistorico();
                documentoPDF(updateForm);
                handleOpen("Dados atualizados com sucesso", "sucesso");
                buscarDados();
            }).catch(error => console.log(error));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await schema.validate(updateForm, { abortEarly: false });
            atualizarDados()
            setFormErrors({});
        } catch (errors) {
            const validationErrors = {};
            errors.inner.forEach((error) => {
                if (!error.path) {
                    return;
                }

                validationErrors[error.path] = error.message;
            })
            console.log(validationErrors);
            setFormErrors(validationErrors);
            handleOpen("Por favor, preencha os campos corretamente.", "erro");
        }
    };

    return (
        <div>
            <div className='container'>
                <LoggedHeader />
                <div className="form-cabecalho">
                    <h2>
                        Atualização de dados
                    </h2>
                </div>

                <div className="row2">
                    <div className="form-container">

                        <div className="title-form">
                            <h3>Informações de contato</h3>
                            <EditIcon color="disabled" />
                        </div>

                        <FormControl>
                            <div className="editar-img">

                                <div className="img-container">
                                    <div className="img-field">
                                        <img src={updateForm.foto} className="img-perfil" alt="img-cadastro" />
                                        {formErrors.foto && <small style={{ color: 'red' }}>{formErrors.foto}</small>}
                                    </div>

                                    <div className="img-box">
                                        <div className="img-box-title">
                                            <h4>Foto do perfil</h4>
                                            <LightbulbIcon color="disabled" />
                                        </div>

                                        <label htmlFor="file-input" className="btn-add-foto">
                                            <FileUploadIcon color="primary" />
                                            <span>Adicionar foto</span>
                                        </label>
                                        <input type="file" id="file-input" style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
                                    </div>

                                </div>

                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Endereço"
                                    value={updateForm.endereco}
                                    className="input-endereco"
                                    onChange={(e) => {
                                        setUpdateForm({ ...updateForm, endereco: e.target.value })
                                    }} />
                                {formErrors.endereco && <small style={{ color: 'red' }}>{formErrors.endereco}</small>}
                            </div>

                            <div className="tel-endereco">
                                <div className="row-input">
                                    <div className="input-field">
                                        <input
                                            placeholder="Telefone"
                                            variant="filled"
                                            id="filled-basic"
                                            className="estilo-input"
                                            value={updateForm.telefone}
                                            maxLength={15}
                                            onChange={handleTelefoneChange}
                                        />

                                        {formErrors.telefone && <small style={{ color: 'red' }}>{formErrors.telefone}</small>}
                                    </div>

                                    <div className="input-field">

                                        <Input label="E-mail" className="estilo-input" value={updateForm.email} onChange={(value) => handleChange('email', value)} />
                                        {formErrors.email && <small style={{ color: 'red' }}>{updateForm.email}</small>}

                                    </div>

                                </div>

                            </div>

                            <div className="title-form">
                                <h3>Informações profissionais</h3>
                                <EditIcon color="disabled" />
                            </div>
                            <div className="linha4">

                                <div className="col-input">
                                    <div className="input-field">
                                        <Input label="Cargo" className="estilo-input" value={updateForm.cargo} onChange={(value) => handleChange('cargo', value)} />
                                        {formErrors.cargo && <small style={{ color: 'red' }}>{formErrors.cargo}</small>}

                                    </div>

                                    <div className="input-field">
                                        <Input label="Setor" className="estilo-input" value={updateForm.setor} onChange={(value) => handleChange('setor', value)} />
                                        {formErrors.setor && <small style={{ color: 'red' }}>{formErrors.setor}</small>}
                                    </div>

                                </div>

                                <div className="col-input2">
                                    <div className="input-field">

                                        <CurrencyInput
                                            id="input-salario"
                                            name="input-sal"
                                            defaultValue={0}
                                            decimalsLimit={2}
                                            value={updateForm.salario}
                                            prefix="R$ "
                                            className="estilo-input"
                                            onValueChange={(value) => {
                                                setUpdateForm({ ...updateForm, salario: value })
                                            }}
                                        />
                                        {formErrors.salario && <small style={{ color: 'red' }}>{formErrors.salario}</small>}

                                    </div>

                                </div>
                            </div>

                            <div className="btn-cadastro-container">
                                <button onClick={handleSubmit} className="btn-cadastro">
                                    <span>ATUALIZAR</span>
                                </button>
                            </div>
                        </FormControl>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <Typography id="modal-modal-description" sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        {iconeModal == "sucesso" && <CheckCircleOutlineIcon color="success" sx={{ fontSize: 50 }} />}
                        {iconeModal == "erro" && <ErrorOutlineIcon sx={{ fontSize: 50, color: 'red' }} />}

                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, display: 'flex', justifyContent: 'center', fontSize: 30, textAlign: 'center' }}>
                        {mensagemModal}
                    </Typography>
                </Box>
            </Modal>
        </div>
    )

}

export default EditarDados;