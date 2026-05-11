function calcola() {
    let totale = 0;
    let dettagli = "";

    let domande = document.querySelectorAll(".question");

    domande.forEach((domanda, index) => {
        let risposta = domanda.querySelector("input:checked");

        if (risposta) {
            let punti = parseInt(risposta.value);
            totale += punti;

            dettagli += `<p>Domanda ${index + 1}: ${punti} punti</p>`;
        } else {
            alert("Rispondi a tutte le domande!");
            throw new Error("Domanda non compilata");
        }
    });

    let livello = "";

    if (totale < 150) {
        livello = "🌱 Impatto basso";
    } else if (totale < 300) {
        livello = "⚖️ Impatto medio";
    } else {
        livello = "🔥 Impatto alto";
    }

    let risultatoDiv = document.getElementById("risultato");

    risultatoDiv.innerHTML = `
        <h2>Punteggio totale: ${totale}</h2>
        <h3>${livello}</h3>
        <h3>Dettaglio:</h3>
        ${dettagli}
    `;

    risultatoDiv.classList.remove("hidden");

    window.scrollTo({
        top: risultatoDiv.offsetTop,
        behavior: "smooth"
    });
}