import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CurrencyInput from 'react-currency-input-field';
import * as yup from 'yup';
import { getDocs, collection, where, addDoc, db, query, auth } from '../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import './Cadastro.css'

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
import React, { useState, useEffect } from 'react';
import LoggedHeader from '../LoggedHeader/LoggedHeader';



function Cadastro() {

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


    const [formData, setFormData] = useState({
        numeroId: '',
        nome: '',
        genero: '',
        telefone: '',
        endereco: '',
        email: '',
        dataNascimento: null,
        foto: null,
        cargo: '',
        dataAdmissao: null,
        setor: '',
        salario: '',
        linkPdf: ''
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

    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    useEffect(() => {
        if (!user) return navigate("/");
        fetchUserName();
    }, [user]);

    const schema = yup.object().shape({
        nome: yup.string().required("O campo 'Nome' é obrigatório").min(3, "Digite um nome válido"),
        genero: yup.string().required("O campo 'Gênero' é obrigatório"),
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
        setFormData({
            ...formData,
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
            setFormData({
                ...formData,
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

        setFormData({ ...formData, telefone: numeroFormatado })
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

    const addProfissional = async (e) => {
        e.preventDefault();

        const copiaFormData = { ...formData };
        copiaFormData.dataNascimento = copiaFormData.dataNascimento.toString();
        copiaFormData.dataAdmissao = copiaFormData.dataAdmissao.toString();

        try {
            const docRef = await addDoc(collection(db, "profissionais"), {
                cargo: copiaFormData.cargo,
                dataAdmissao: copiaFormData.dataAdmissao,
                dataNascimento: copiaFormData.dataNascimento,
                email: copiaFormData.email,
                endereco: copiaFormData.endereco,
                foto: copiaFormData.foto,
                genero: copiaFormData.genero,
                numeroId: copiaFormData.numeroId,
                nome: copiaFormData.nome,
                salario: copiaFormData.salario,
                setor: copiaFormData.setor,
                telefone: copiaFormData.telefone
            });
        } catch (e) {
            console.error("Erro ao tentar adicionar documento: ", e);
        }
    }

    function limparFormulario() {
        setFormData({
            numeroId: '',
            nome: '',
            genero: '',
            telefone: '',
            endereco: '',
            email: '',
            dataNascimento: null,
            cargo: '',
            dataAdmissao: null,
            setor: '',
            salario: 0,
        })
        setUserImage(NoImage);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await schema.validate(formData, { abortEarly: false });
            documentoPDF(formData);
            addProfissional(e);
            handleOpen("Dados cadastrados com sucesso", "sucesso");

            limparFormulario();
            setFormErrors({});
        } catch (errors) {
            const validationErrors = {};
            errors.inner.forEach((error) => {
                if (!error.path) {
                    return;
                }

                validationErrors[error.path] = error.message;
            })
            setFormErrors(validationErrors);
            handleOpen("Por favor, preencha os campos corretamente.", "erro");
        }
    };

    return (
        <div className='container'>
            <LoggedHeader />
            <div className="form-cabecalho">
                <h2>
                    Fale-nos um pouco sobre você
                </h2>
                <span>
                    Diga quem você é, como os empregadores podem entrar em contato
                    com você e qual a sua profissão.
                </span>
            </div>

            <div className="row2">
                <div className="form-container">

                    <div className="title-form">
                        <h3>Informações de contato</h3>
                        <EditIcon color="disabled" />
                    </div>

                    <FormControl>
                        <div className="linha1">
                            <div className="col-input">
                                <div className="input-name">
                                    <Input label="Nome" className="estilo-input" value={formData.nome} onChange={(value) => handleChange('nome', value)} />
                                    {formErrors.nome && <small style={{ color: 'red' }}>{formErrors.nome}</small>}
                                </div>

                                <div className="input-genero">
                                    <FormLabel id="demo-radio-buttons-group-label">Gênero</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={formData.genero}
                                        name="radio-buttons-group"
                                        onChange={(e) => handleChange('genero', e.target.value)}
                                    >
                                        <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
                                        <FormControlLabel value="Feminino" control={<Radio />} label="Feminino" />
                                        <FormControlLabel value="Prefiro não responder" control={<Radio />} label="Prefiro não responder" />
                                    </RadioGroup>
                                    {formErrors.genero && <small style={{ color: 'red' }}>{formErrors.genero}</small>}
                                </div>

                            </div>

                            <div className="img-container">
                                <div className="img-field">
                                    <img src={userImage} className="img-perfil" alt="img-cadastro" />
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
                                value={formData.endereco}
                                className="input-endereco"
                                onChange={(e) => {
                                    setFormData({ ...formData, endereco: e.target.value })
                                }} />
                            {formErrors.endereco && <small style={{ color: 'red' }}>{formErrors.endereco}</small>}
                        </div>

                        <div className="linha4">
                            <div className="col-input">
                                <div className="input-field">
                                    <input
                                        placeholder="Telefone"
                                        variant="filled"
                                        id="filled-basic"
                                        className="estilo-input"
                                        value={formData.telefone}
                                        maxLength={15}
                                        onChange={handleTelefoneChange}
                                    />

                                    {formErrors.telefone && <small style={{ color: 'red' }}>{formErrors.telefone}</small>}
                                </div>

                                <div className="input-field">

                                    <Input label="E-mail" className="estilo-input" value={formData.email} onChange={(value) => handleChange('email', value)} />
                                    {formErrors.email && <small style={{ color: 'red' }}>{formErrors.email}</small>}

                                </div>


                            </div>

                            <div className="col-input2">
                                <div className="input-field">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Data de nascimento"
                                            value={formData.dataNascimento}
                                            onChange={(value) => {
                                                setFormData({ ...formData, dataNascimento: value })
                                            }} />
                                    </LocalizationProvider>
                                    {formErrors.dataNascimento && <small style={{ color: 'red' }}>{formErrors.dataNascimento}</small>}
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
                                    <Input label="Cargo" className="estilo-input" value={formData.cargo} onChange={(value) => handleChange('cargo', value)} />
                                    {formErrors.cargo && <small style={{ color: 'red' }}>{formErrors.cargo}</small>}

                                </div>

                                <div className="input-field">
                                    <Input label="Setor" className="estilo-input" value={formData.setor} onChange={(value) => handleChange('setor', value)} />
                                    {formErrors.setor && <small style={{ color: 'red' }}>{formErrors.setor}</small>}
                                </div>


                            </div>

                            <div className="col-input2">
                                <div className="input-field">

                                    <CurrencyInput
                                        id="input-salario"
                                        name="input-sal"
                                        value={formData.salario}
                                        decimalsLimit={2}
                                        prefix="R$ "
                                        className="estilo-input"
                                        onValueChange={(value) => {
                                            setFormData({ ...formData, salario: value })
                                        }}
                                    />

                                    {formErrors.salario && <small style={{ color: 'red' }}>{formErrors.salario}</small>}

                                </div>

                                <div className="input-field">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            className="text-field"
                                            label="Data de admissão"
                                            value={formData.dataAdmissao}
                                            onChange={(value) => {
                                                setFormData({ ...formData, dataAdmissao: value })
                                            }} />
                                    </LocalizationProvider>
                                    {formErrors.dataAdmissao && <small style={{ color: 'red' }}>{formErrors.dataAdmissao}</small>}

                                </div>

                            </div>
                        </div>

                        <div className="btn-cadastro-container">

                            <button onClick={handleSubmit} className="btn-cadastro">
                                <span>CRIAR PDF</span>
                            </button>
                        </div>


                    </FormControl>
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

export default Cadastro;