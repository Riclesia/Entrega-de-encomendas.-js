// Dicionário para armazenar os registros de entrega
const entregas = {};

// Inicializa a câmera
const videoElement = document.getElementById('videoElement');
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    videoElement.srcObject = stream;
  })
  .catch((error) => {
    console.error('Erro ao acessar a câmera:', error);
  });

function capturaFoto() {
  // Captura a foto do morador
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.width;
  canvas.height = videoElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const fotoBase64 = canvas.toDataURL('image/jpeg');

  // Obtém a data e hora atual
  const dataHora = new Date().toLocaleString();

  // Obtém os dados do registro da entrega
  const notaFiscal = document.getElementById('notaFiscal').value;
  const codigoRastreio = document.getElementById('codigoRastreio').value;
  const destinatario = document.getElementById('destinatario').value;
  const blocoApt = document.getElementById('blocoApt').value;
  const funcionario = prompt('Digite o nome do funcionário que entregou a encomenda:');

  // Gera um nome de arquivo único para a foto
  const fotoNome = `foto_${dataHora.replace(/[/: ]/g, '_')}.jpg`;

  // Salva a foto no disco
  const fotoBlob = atob(fotoBase64.split(',')[1]);
  const fotoArrayBuffer = new ArrayBuffer(fotoBlob.length);
  const fotoUint8Array = new Uint8Array(fotoArrayBuffer);
  for (let i = 0; i < fotoBlob.length; i++) {
    fotoUint8Array[i] = fotoBlob.charCodeAt(i);
  }
  const fotoFile = new File([fotoUint8Array], fotoNome, { type: 'image/jpeg' });
  saveAs(fotoFile, fotoNome);

  // Adiciona o registro da entrega no dicionário
  entregas[dataHora] = {
    foto: fotoNome,
    notaFiscal: notaFiscal,
    codigoRastreio: codigoRastreio,
    destinatario: destinatario,
    blocoApt: blocoApt,
    funcionario: funcionario
  };

  exibirRegistros();
  console.log('Entrega registrada com sucesso!');
}

function exibirRegistros() {
  const registrosElement = document.getElementById('registros');
  registrosElement.innerHTML = '';

  for (const [dataHora, registro] of Object.entries(entregas)) {
    const registroElement = document.createElement('div');
    registroElement.classList.add('registro');
    registroElement.innerHTML = `
      <h3>Data/Hora: ${dataHora}</h3>
      <img src="${registro.foto}" width="320" height="240">
      <p>Nota Fiscal: ${registro.notaFiscal}</p>
      <p>Código de Rastreio: ${registro.codigoRastreio}</p>
      <p>Destinatário: ${registro.destinatario}</p>
      <p>Bloco e Apartamento: ${registro.blocoApt}</p>
      <p>Funcionário: ${registro.funcionario}</p>
    `;
    registrosElement.appendChild(registroElement);
  }
}

function filtrarRegistros() {
  const pesquisaInput = document.getElementById('pesquisaInput');
  const pesquisaTermo = pesquisaInput.value.toLowerCase();

  const registrosElement = document.getElementById('registros');
  const registros = registrosElement.getElementsByClassName('registro');

  for (const registro of registros) {
    const dataHora = registro.getElementsByTagName('h3')[0].textContent.toLowerCase();
    if (dataHora.includes(pesquisaTermo)) {
      registro.style.display = 'block';
    } else {
      registro.style.display = 'none';
    }
  }
}