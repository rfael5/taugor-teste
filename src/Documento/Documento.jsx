import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dayjs from "dayjs";

import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


async function documentoPDF(dadosUsuario) {

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    if (dadosUsuario.numeroId == "") {
        dadosUsuario.numeroId = gerarId();
    }

    const formatarData = (data) => {
        const dataFormatada = dayjs(data).format("DD/MM/YYYY");
        return dataFormatada;
    }

    const tituloDoc = {
        text: 'Informações do usuário',
        fontSize: 18,
        bold: true,
        margin: [15, 20, 0, 40],
        color: '#3f51b5'
    };

    const conteudo = [
        {
            stack: [
                {
                    table: {
                        widths: [230, '*'],
                        margin: [0, 180],
                        body: [
                            [
                                {
                                    text: 'Dados pessoais',
                                    fontSize: 16,
                                    bold: true,
                                    color: '#3f51b5'
                                }, ""],

                            [{
                                image: dadosUsuario.foto,
                                height: 150,
                                width: 150
                            },
                            {
                                text: `Id: ${dadosUsuario.numeroId}
                    Nome: ${dadosUsuario.nome}
                    Gênero: ${dadosUsuario.genero}
                    E-mail: ${dadosUsuario.email}
                    Telefone: ${dadosUsuario.telefone}
                    Endereço: ${dadosUsuario.endereco}
                    Data de nascimento: ${formatarData(dadosUsuario.dataNascimento)}`
                            }]
                        ]
                    }, layout: 'noBorders'
                }
            ], margin: [0, 0, 0, 40]
        },

        {
            stack: [
                {
                    table: {
                        widths: [230],
                        body: [

                            [{
                                text: 'Dados profissionais',
                                fontSize: 16,
                                bold: true,
                                color: '#3f51b5',
                            }],
                            [{
                                text: `Cargo: ${dadosUsuario.cargo}
                    Setor: ${dadosUsuario.setor}
                    Salário: R$${dadosUsuario.salario}
                    Data de admissão: ${formatarData(dadosUsuario.dataAdmissao)}`
                            }
                            ]]
                    }, layout: 'noBorders'
                },
            ]
        }

    ];

    function Rodape(currentPage, pageCount) {
        return [
            {
                text: currentPage + ' / ' + pageCount,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 10, 20, 0]
            }
        ]
    }

    const docDefinitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],

        header: [tituloDoc],
        content: [conteudo],
        footer: Rodape
    }

    const pdfDoc = pdfMake.createPdf(docDefinitions);
    pdfDoc.getBlob((blob) => {
        handleUpload(blob, dadosUsuario);
    })

}

function gerarId() {

    const tamanho = 8;
    let numeroId = '';

    for (let i = 0; i < tamanho; i++) {
        const digito = Math.floor(Math.random() * 10);
        numeroId += digito;
    }

    return numeroId;
}

function handleUpload(file, userData) {
    if (!file) {
        alert("O arquivo não foi criado");
    }

    const storageRef = ref(storage, `files/${userData.nome}-${userData.numeroId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
        },
        (err) => console.log(err),
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log(url);
            })
        }
    )
}


export default documentoPDF