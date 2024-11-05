const btn = document.querySelectorAll("body button");

btn.forEach(function (pil) {
    pil.addEventListener('click', function () {
        let namebtn = pil.getAttribute('name');
        geserCek(namebtn);
    });
});

function geserCek(nbtn) {
    const table = document.querySelectorAll('.' + nbtn);
    if (table[0].disabled == true) {
        autoNext(0, nbtn);
    } else {
        table[0].select();
    }

    // Add event listener for input to shift focus
    for (let i = 0; i < table.length; i++) {
        table[i].addEventListener('input', function () {
            autoNext(i, nbtn); // Automatically move to the next input
        });
    }
}

document.querySelector('.btn-sukses').addEventListener('click', function () {
    const types = ['d1', 'd2', 'd3', 'd4', 'd5', 'm1', 'm2', 'm3', 'm4', 'm5'];
    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0; 
    let score = 0;

    types.forEach(type => {
        const concatString = catString(type);  // Concatenate answer for the type
        const table = document.querySelectorAll('.' + type); // Get all input boxes for the type
        
        if (concatString.trim() === "") {
            // If all boxes for this type are empty, count as empty
            emptyCount++;
        } else {
            const isCorrect = checkAnswer(concatString, type);
            const isFullyAnswered = Array.from(table).every(input => input.value.trim() !== "");

            if (isFullyAnswered) {
                if (isCorrect) {
                    correctCount++;
                    score += 20; 
                } else {
                    wrongCount++;
                    score -= 5;  
                }
            } else {
                // If not fully answered, consider it as empty, even if partially filled
                emptyCount++;
            }
        }

        submitString(concatString, type, table);
    });

    showResultPopup(correctCount, wrongCount, emptyCount, score, continueClicked);
});





// Function to check the answer
function checkAnswer(concat, type) {
    const answers = {
        d1: "INDONESIA",
        d2: "PIAOLIANG",
        d3: "LATIN",
        d4: "RUSIA",
        d5: "SALUTE",
        m1: "SUMERIA",
        m2: "CHINA",
        m3: "BONSOIR",
        m4: "INGGRIS",
        m5: "SINBAL"
    };
    return concat.toUpperCase() === answers[type];
}

let continueClicked = false;

function showResultPopup(correct, wrong, empty, score) {
    const message = `
        <div style="text-align: center; padding: 20px;">
            <h4>Hasil Pengerjaan</h4>
            <p>Jumlah Jawaban Benar: ${correct}</p>
            <p>Jumlah Jawaban Salah: ${wrong}</p>
            <p>Jumlah Jawaban Kosong: ${empty}</p>
            <p>Skor: ${score} poin</p>
            <button class="btn-grey" onclick="handleContinueButton()">Perbaiki Jawaban</button>
            <button class="btn-grey" onclick="resetGame()">Selesai</button>
            ${continueClicked ? "<p style='color: red; font-size: 0.8em; font-style: italic; margin-top: 20px;'>Kesempatan perbaiki jawaban hanya 1 kali saja</p>" : ""}
        </div>
    `;
    
    // Create and show the pop-up as before
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '20px';
    popup.style.zIndex = '1000';
    popup.innerHTML = message;
    document.body.appendChild(popup);

    // Create an overlay as before
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    document.body.appendChild(overlay);
}

function handleContinueButton() {
    if (!continueClicked) {
        continueClicked = true; // Set the flag to true
        closePopup(); // Close the pop-up
        
    }
}

// Function to close the pop-up
function closePopup() {
    const popup = document.querySelector('div[style*="fixed"]');
    if (popup) {
        popup.remove();
    }
    const overlay = document.querySelector('div[style*="rgba"]');
    if (overlay) {
        overlay.remove();
    }
}

// Function to reset the game state
function resetGame() {
    
    // Close the pop-up and overlay
    closePopup();

    // Select all input fields with class matching each type and clear them
    const types = ['d1', 'd2', 'd3', 'd4', 'd5', 'm1', 'm2', 'm3', 'm4', 'm5'];
    types.forEach(type => {
        const inputs = document.querySelectorAll('.' + type);
        inputs.forEach(input => {
            input.value = ""; // Clear the value
            input.disabled = false; // Re-enable the input
        });
    });

    continueClicked = false;
   
}



// Function to handle input navigation using arrow keys
document.addEventListener('keydown', function (event) {
    const activeElement = document.activeElement;

    if (activeElement.tagName === 'INPUT') {
        const currentInput = activeElement;
        const currentRow = currentInput.parentElement.parentElement;
        const currentCellIndex = Array.from(currentRow.children).indexOf(currentInput.parentElement);
        const currentRowIndex = Array.from(currentRow.parentElement.children).indexOf(currentRow);

        let newInput = null;

        switch (event.key) {
            case 'ArrowLeft':
                if (currentCellIndex > 0) {
                    newInput = currentRow.children[currentCellIndex - 1].querySelector('input');
                }
                break;
            case 'ArrowRight':
                if (currentCellIndex < currentRow.children.length - 1) {
                    newInput = currentRow.children[currentCellIndex + 1].querySelector('input');
                }
                break;
            case 'ArrowUp':
                if (currentRowIndex > 0) {
                    const aboveRow = currentRow.parentElement.children[currentRowIndex - 1];
                    newInput = aboveRow.children[currentCellIndex].querySelector('input');
                }
                break;
            case 'ArrowDown':
                if (currentRowIndex < currentRow.parentElement.children.length - 1) {
                    const belowRow = currentRow.parentElement.children[currentRowIndex + 1];
                    newInput = belowRow.children[currentCellIndex].querySelector('input');
                }
                break;
        }

        if (newInput) {
            newInput.focus();
            event.preventDefault(); // Prevent scrolling the page
        }
    }
});

function autoNext(i, cn) {
    let d = document.querySelectorAll('.' + cn);
    if (i < d.length - 1) { // Only focus next if not the last input
        if (d[i + 1].disabled == true) {
            // If the next input is disabled, focus the next one after that
            d[i + 2]?.select();
        } else {
            d[i + 1].select(); // Focus the next input
        }
    }
}

// Concatenate input values to a string
function catString(cn) {
    var concat = "";
    let d = document.querySelectorAll('.' + cn);
    for (let i = 0; i < d.length; i++) {
        concat += d[i].value;
    }
    return concat;
}

function submitString(concat, tipe, tabel) {
    if (concat.toUpperCase() == "INDONESIA" && tipe == "d1") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "PIAOLIANG" && tipe == "d2") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "LATIN" && tipe == "d3") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "RUSIA" && tipe == "d4") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "SALUTE" && tipe == "d5") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "SUMERIA" && tipe == "m1") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "CHINA" && tipe == "m2") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "BONSOIR" && tipe == "m3") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "INGGRIS" && tipe == "m4") {
        pengulanganTabel(tabel);
    } else if (concat.toUpperCase() == "SINBAL" && tipe == "m5") {
        pengulanganTabel(tabel);
    }
}

function pengulanganTabel(table) {
    for (let j = 0; j < table.length; j++) {
        table[j].disabled = true;
    }
}

document.getElementById("toggle-rules").addEventListener("click", function() {
    const rulesContent = document.querySelector(".rules-content");
    const button = this;

    // Toggle visibility of rules content
    if (rulesContent.style.display === "none" || rulesContent.style.display === "") {
        rulesContent.style.display = "block";
        button.textContent = "Hide";
    } else {
        rulesContent.style.display = "none";
        button.textContent = "Unhide";
    }
});

