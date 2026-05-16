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

    // Rendering migliore

    const canvas = await html2canvas(area, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f8f4e8"
    });

    const imgData =
        canvas.toDataURL("image/png");

    const pdf =
        new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = 297;

    const margin = 10;

    const usableWidth =
        pdfWidth - margin * 2;

    const imgHeight =
        canvas.height * usableWidth / canvas.width;

    let heightLeft = imgHeight;

    let position = 0;

    // ===== LOGO =====

    const logo =
        document.querySelector(".logo");

    if (logo) {

        const logoCanvas =
            document.createElement("canvas");

        logoCanvas.width = logo.width;
        logoCanvas.height = logo.height;

        const ctx =
            logoCanvas.getContext("2d");

        ctx.drawImage(
            logo,
            0,
            0
        );

        const logoData =
            logoCanvas.toDataURL("image/png");

        pdf.addImage(
            logoData,
            "PNG",
            15,
            10,
            20,
            20
        );
    }

    // ===== TITOLO =====

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(20);

    pdf.text(
        "Impronta Ecologica",
        45,
        20
    );

    // ===== DATA =====

    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(11);

    const oggi = new Date();

    pdf.text(
        oggi.toLocaleDateString("it-IT"),
        170,
        20
    );

    // ===== CONTENUTO =====

    let y = 40;

    pdf.addImage(
        imgData,
        "PNG",
        margin,
        y,
        usableWidth,
        imgHeight
    );

    heightLeft -= (pdfHeight - y);

    // ===== PAGINE SUCCESSIVE =====

    while (heightLeft > 0) {

        position =
            heightLeft - imgHeight + y;

        pdf.addPage();

        pdf.addImage(
            imgData,
            "PNG",
            margin,
            position,
            usableWidth,
            imgHeight
        );

        heightLeft -= pdfHeight;

    }

    // ===== NOME FILE =====

    let nome =
        document.getElementById("nome").value;

    if(nome.trim() === "") {
        nome = "utente";
    }

    pdf.save(
        `impronta_ecologica_${nome}.pdf`
    );

}