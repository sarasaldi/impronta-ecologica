function calcola() {

    let totale = 0;
    let dettagliHTML = "";

let nome =
    document.getElementById("nome").value;


    let categorie = {
        casa: 0,
        alimentazione: 0,
        trasporti: 0,
        consumi: 0
    };

    let domande = document.querySelectorAll(".question");

    domande.forEach((domanda, index) => {

        let risposta = domanda.querySelector("input:checked");

        if (!risposta) {
            alert("Rispondi a tutte le domande!");
            throw new Error("Domanda non compilata");
        }

        let punti = parseInt(risposta.value);
        totale += punti;

        let testo = risposta.parentElement.textContent;

        dettagliHTML += `
            <p>
                <strong>Domanda ${index + 1}</strong><br>
                ${testo} → ${punti} punti
            </p>
        `;

        // CATEGORIE

        if (index <= 4) categorie.casa += punti;
        else if (index <= 7) categorie.alimentazione += punti;
        else if (index <= 11) categorie.trasporti += punti;
        else categorie.consumi += punti;

    });

    // LIVELLO

    let livello = "";

    if (totale < 150) {
        livello = "🌱 Impatto basso";
    }
    else if (totale < 300) {
        livello = "⚖️ Impatto medio";
    }
    else {
        livello = "🔥 Impatto alto";
    }

    // MOSTRA RISULTATI

   document.getElementById("totale").innerHTML = `
    ${nome}, il tuo punteggio è:
    <br><br>
    ${totale} punti

    <div class="range">
        Minimo possibile: 40<br>
        Massimo possibile: 860
    </div>
`;

    document.getElementById("livello").innerHTML =
        livello;

    document.getElementById("dettagli").innerHTML =
        dettagliHTML;

    let risultatoDiv = document.getElementById("risultato");

    risultatoDiv.classList.remove("hidden");

    // GRAFICO

    const ctx = document.getElementById('grafico');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Casa',
                'Alimentazione',
                'Trasporti',
                'Consumi'
            ],
            datasets: [{
                data: [
                    categorie.casa,
                    categorie.alimentazione,
                    categorie.trasporti,
                    categorie.consumi
                ]
            }]
        }
    });

    // SCROLL

    risultatoDiv.scrollIntoView({
        behavior: "smooth"
    });

}

async function scaricaPDF() {

    const { jsPDF } = window.jspdf;

    const area =
        document.getElementById("risultato");

    const canvas =
        await html2canvas(area);

    const imgData =
        canvas.toDataURL("image/png");

    const pdf =
        new jsPDF("p", "mm", "a4");

    const pdfWidth =
        pdf.internal.pageSize.getWidth();

    const imgWidth = pdfWidth - 20;

    const imgHeight =
        canvas.height * imgWidth / canvas.width;

    pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        imgWidth,
        imgHeight
    );

    let nome =
        document.getElementById("nome").value;

    if(nome.trim() === "") {
        nome = "utente";
    }

    pdf.save(
        `impronta_ecologica_${nome}.pdf`
    );

}