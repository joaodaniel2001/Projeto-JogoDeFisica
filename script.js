const num1 = document.getElementById("num1")
const num2 = document.getElementById("num2")

const resultado = document.getElementById("resultado")
const btn = document.getElementById("button")

btn.addEventListener("click", () => {
    const forca = parseFloat(num1.value)
    const massa = parseFloat(num2.value)

    if (isNaN(forca) || isNaN(massa)) {
        resultado.textContent = "Por favor, digite números válidos."
        return
    }
    if (massa === 0) {
        resultado.textContent = "Massa não pode ser zero."
        return
    }

    const aceleracao = forca / massa

    resultado.textContent = `A aceleração é ${aceleracao.toFixed(2)} m/s²`
})
