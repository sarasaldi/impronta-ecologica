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

    const pdf = new jsPDF("p", "mm", "a4");

    // ===== DATI =====

    const nome =
        document.getElementById("nome").value || "Utente";

    const totale =
        document.getElementById("totale").innerText;

    const livello =
        document.getElementById("livello").innerText;

    const dettagli =
        document.querySelectorAll("#dettagli p");

    // ===== LOGO =====

    const logo = new Image();
    logo.src = "logo.png";

    await new Promise(resolve => {
        logo.onload = resolve;
    });

    pdf.addImage(
        logo,
        "PNG",
        15,
        10,
        18,
        18
    );

    // ===== HEADER =====

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(22);

    pdf.text(
        "Impronta Ecologica",
        40,
        20
    );

    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(12);

    const oggi = new Date();

    pdf.text(
        oggi.toLocaleDateString("it-IT"),
        160,
        20
    );

    // ===== INFO =====

    let y = 40;

    pdf.setFontSize(16);

    pdf.text(
        `Nome: ${nome}`,
        15,
        y
    );

    y += 10;

    pdf.text(
        `Punteggio totale: ${totale}`,
        15,
        y
    );

    y += 10;

    pdf.text(
        livello,
        15,
        y
    );

    // ===== GRAFICO =====

    const chart =
        document.getElementById("grafico");

    const chartImage =
        chart.toDataURL("image/png");

    y += 15;

    pdf.addImage(
        chartImage,
        "PNG",
        55,
        y,
        100,
        100
    );

    y += 115;

    // ===== DETTAGLI =====

    pdf.setFontSize(12);

    dettagli.forEach(dettaglio => {

        const testo =
            dettaglio.innerText;

        // cambio pagina automatico

        if (y > 270) {

            pdf.addPage();

            y = 20;

        }

        pdf.text(
            testo,
            15,
            y
        );

        y += 10;

    });

    // ===== SALVA =====

    pdf.save(
        `impronta_ecologica_${nome}.pdf`
    );

}