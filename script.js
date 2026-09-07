// =====================================================
// DATA
// =====================================================

let video = document.getElementById("video");

let canvas = document.createElement("canvas");

let fotoArray = [];

let namaUser = "";

let pertanyaanSekarang = 0;

let cameraStream = null;


// =====================================================
// KONFIGURASI
// =====================================================

const tanggalJadianBenar = "26 desember 2024";

const tanggalPhotobooth = "26 Desember 2024";


// =====================================================
// FORMspree
// =====================================================

// GANTI BAGIAN INI DENGAN ENDPOINT FORMSPREE KAMU
const FORMSPREE_URL = "https://formspree.io/f/XXXXXXXX";


// =====================================================
// PERTANYAAN
// =====================================================

const pertanyaanList = [

    {
        pertanyaan: "Apa warna favorit kamu?",
        jawaban: "hitam"
    },

    {
        pertanyaan: "Ukuran baju kamu?",
        jawaban: "l"
    },

    {
        pertanyaan: "Ukuran sepatu kamu?",
        jawaban: "42"
    },

    {
        pertanyaan: "Tanggal lahir kamu?",
        jawaban: "23 november 2006"
    },

    {
        pertanyaan: "Genre musik favorit kamu?",
        jawaban: "rock"
    },

    {
        pertanyaan: "Sebutkan 3 band yang pernah kita tonton!",
        jawaban: "lomba sihir, reality club, black horses"
    },

    {
        pertanyaan: "Ceritakan moment paling bahagia kamu sama saya",
        tipe: "saran"
    }

];


// =====================================================
// NORMALISASI JAWABAN
// =====================================================

function normalisasi(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

}


// =====================================================
// CEK TANGGAL
// =====================================================

function cekTanggal() {

    const nama = document
        .getElementById("nama")
        .value
        .trim();

    const tanggal = normalisasi(
        document.getElementById("tanggal").value
    );

    const pesan = document.getElementById("pesanTanggal");


    if (nama === "") {

        pesan.textContent = "Nama jangan dikosongin yaa 😭";

        return;
    }


    const benar = [
        "26 desember 2024",
        "26 12 2024"
    ];


    if (benar.includes(tanggal)) {

        namaUser = nama;

        pertanyaanSekarang = 0;

        document
            .getElementById("halamanAwal")
            .classList.remove("aktif");

        document
            .getElementById("halamanPertanyaan")
            .classList.add("aktif");

        tampilkanPertanyaan();

    } else {

        pesan.textContent =
            "Kamu udah ga sayang 😭";

    }

}


// =====================================================
// TAMPILKAN PERTANYAAN
// =====================================================

function tampilkanPertanyaan() {

    const data = pertanyaanList[pertanyaanSekarang];

    document.getElementById("nomorPertanyaan").textContent =
        "Pertanyaan " +
        (pertanyaanSekarang + 1) +
        " dari " +
        pertanyaanList.length;


    document.getElementById("pertanyaan").textContent =
        data.pertanyaan;


    const input = document.getElementById("jawaban");

    const textarea = document.getElementById("saran");


    input.style.display = "block";

    textarea.style.display = "none";


    if (data.tipe === "saran") {

        input.style.display = "none";

        textarea.style.display = "block";

        textarea.value = "";

    } else {

        input.value = "";

        input.focus();

    }

}


// =====================================================
// CEK JAWABAN
// =====================================================

function cekJawaban() {

    const data = pertanyaanList[pertanyaanSekarang];

    const pesan = document.getElementById("pesanJawaban");


    // =================================================
    // JIKA SARAN / MOMENT TERAKHIR
    // =================================================

    if (data.tipe === "saran") {

        const saran =
            document
                .getElementById("saran")
                .value
                .trim();


        if (saran === "") {

            pesan.textContent =
                "Tulis moment-nya dulu yaa ♡";

            return;
        }


        // SIMPAN DI BROWSER
        localStorage.setItem(
            "saranMoment",
            saran
        );


        // KIRIM KE FORMSPREE
        kirimSaran(saran);

        return;
    }


    // =================================================
    // JAWABAN BIASA
    // =================================================

    const jawaban =
        normalisasi(
            document
                .getElementById("jawaban")
                .value
        );


    // ===============================
    // VALIDASI BAND
    // ===============================

    if (pertanyaanSekarang === 5) {

        const band1 =
            jawaban.includes("lomba sihir");

        const band2 =
            jawaban.includes("reality club");

        const band3 =
            jawaban.includes("black horses");


        if (band1 && band2 && band3) {

            lanjutPertanyaan();

        } else {

            pesan.textContent =
                "Belum lengkap 😭 Sebutkan 3 band yang benar yaa.";

        }

        return;
    }


    // ===============================
    // JAWABAN NORMAL
    // ===============================

    if (jawaban === data.jawaban) {

        lanjutPertanyaan();

    } else {

        pesan.textContent =
            "Jawabannya belum tepat 😭";

        hentikanKamera();

    }

}


// =====================================================
// LANJUT PERTANYAAN
// =====================================================

function lanjutPertanyaan() {

    document.getElementById("pesanJawaban").textContent = "";

    pertanyaanSekarang++;


    if (pertanyaanSekarang < pertanyaanList.length) {

        tampilkanPertanyaan();

    } else {

        masukPhotobooth();

    }

}


// =====================================================
// KIRIM SARAN
// =====================================================

async function kirimSaran(saran) {

    const pesan =
        document.getElementById("pesanJawaban");


    pesan.style.color = "#e85c91";

    pesan.textContent =
        "Mengirim saran... ♡";


    const data = {

        nama: namaUser,

        tanggal_jadian: "26 Desember 2024",

        saran: saran,

        waktu:
            new Date().toLocaleString("id-ID")

    };


    try {

        const response = await fetch(
            FORMSPREE_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"

                },

                body: JSON.stringify(data)

            }
        );


        if (response.ok) {

            pesan.textContent =
                "Saran berhasil dikirim ♡";


            // Tunggu sebentar lalu masuk photobooth
            setTimeout(() => {

                masukPhotobooth();

            }, 1000);


        } else {

            throw new Error(
                "Gagal mengirim"
            );

        }

    } catch (error) {

        console.error(error);


        pesan.style.color = "#e53935";

        pesan.textContent =
            "Gagal mengirim saran 😭 Coba lagi ya.";


    }

}


// =====================================================
// MASUK PHOTOBOOTH
// =====================================================

function masukPhotobooth() {

    hentikanKamera();

    fotoArray = [];

    document.getElementById("statusFoto").textContent =
        "Ambil 3 foto yaa ♡";


    document.getElementById("halamanPertanyaan")
        .classList.remove("aktif");


    document.getElementById("halamanPhotobooth")
        .classList.add("aktif");


    document.getElementById("info").textContent =
        tanggalPhotobooth + " ♡";


    bukaKamera();

}


// =====================================================
// BUKA KAMERA
// =====================================================

async function bukaKamera() {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user"
                },

                audio: false

            });


        video.srcObject =
            cameraStream;


    } catch (error) {

        console.error(error);


        document.getElementById("statusFoto").textContent =
            "Kamera tidak bisa dibuka. Pastikan izin kamera sudah diberikan.";

    }

}


// =====================================================
// MATIKAN KAMERA
// =====================================================

function hentikanKamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => track.stop());

        cameraStream = null;

    }


    if (video) {

        video.srcObject = null;

    }

}


// =====================================================
// AMBIL FOTO
// =====================================================

function ambilFoto() {

    if (fotoArray.length >= 3) {

        return;

    }


    let angka = 3;

    const countdown =
        document.getElementById("countdown");


    countdown.textContent = angka;


    const timer =
        setInterval(() => {

            angka--;

            if (angka > 0) {

                countdown.textContent =
                    angka;

            } else {

                clearInterval(timer);

                countdown.textContent = "";

                foto();

            }

        }, 1000);

}


// =====================================================
// FOTO
// =====================================================

function foto() {

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;


    const ctx =
        canvas.getContext("2d");


    // Mirror seperti kamera depan
    ctx.translate(
        canvas.width,
        0
    );

    ctx.scale(-1, 1);


    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    const fotoData =
        canvas.toDataURL(
            "image/jpeg",
            0.9
        );


    fotoArray.push(fotoData);


    document.getElementById("statusFoto").textContent =
        "Foto " +
        fotoArray.length +
        " dari 3 ♡";


    if (fotoArray.length >= 3) {

        tampilkanHasil();

    }

}


// =====================================================
// TAMPILKAN HASIL
// =====================================================

function tampilkanHasil() {

    hentikanKamera();


    document
        .getElementById("halamanPhotobooth")
        .classList.remove("aktif");


    document
        .getElementById("halamanHasil")
        .classList.add("aktif");


    const hasil =
        document.getElementById("hasilFoto");


    hasil.innerHTML = "";


    // Buat 2 strip
    for (let stripNumber = 1; stripNumber <= 2; stripNumber++) {

        const strip =
            document.createElement("div");

        strip.className = "strip";


        const title =
            document.createElement("div");

        title.className = "strip-title";

        title.textContent =
            "🐱 Our Little Moment ♡";


        strip.appendChild(title);


        fotoArray.forEach((fotoData) => {

            const img =
                document.createElement("img");

            img.src = fotoData;

            strip.appendChild(img);

        });


        const date =
            document.createElement("div");

        date.className = "strip-date";

        date.textContent =
            tanggalPhotobooth;


        strip.appendChild(date);


        hasil.appendChild(strip);

    }

}


// =====================================================
// DOWNLOAD FOTO
// =====================================================

function simpanFoto() {

    const canvasDownload =
        document.createElement("canvas");


    canvasDownload.width = 700;

    canvasDownload.height = 1200;


    const ctx =
        canvasDownload.getContext("2d");


    // Background
    ctx.fillStyle = "#ffc1d9";

    ctx.fillRect(
        0,
        0,
        700,
        1200
    );


    // Judul
    ctx.fillStyle = "#222";

    ctx.textAlign = "center";

    ctx.font =
        "bold 32px Arial";

    ctx.fillText(
        "🐱 Our Little Moment ♡",
        350,
        55
    );


    const stripWidth = 270;

    const stripX1 = 65;

    const stripX2 = 365;

    const top = 90;


    for (let s = 0; s < 2; s++) {

        const x =
            s === 0
                ? stripX1
                : stripX2;


        // White strip
        ctx.fillStyle = "white";

        ctx.fillRect(
            x,
            top,
            stripWidth,
            1030
        );


        // Foto
        let y = top + 35;


        fotoArray.forEach((fotoData) => {

            const img =
                new Image();


            img.onload = function () {

                const photoWidth =
                    stripWidth - 30;

                const photoHeight =
                    210;


                ctx.drawImage(
                    img,
                    x + 15,
                    y,
                    photoWidth,
                    photoHeight
                );


                y +=
                    photoHeight + 15;


                ctx.fillStyle = "#222";

                ctx.font =
                    "bold 14px Arial";

                ctx.textAlign =
                    "center";

                ctx.fillText(
                    tanggalPhotobooth,
                    x + stripWidth / 2,
                    top + 1000
                );


                if (
                    s === 1 &&
                    y > 0
                ) {

                    downloadCanvas(
                        canvasDownload
                    );

                }

            };


            img.src = fotoData;

        });

    }

}


// =====================================================
// DOWNLOAD CANVAS
// =====================================================

function downloadCanvas(canvas) {

    const link =
        document.createElement("a");


    link.download =
        "our-little-moment.png";


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.click();

}


// =====================================================
// ULANG FOTO
// =====================================================

function ulangFoto() {

    fotoArray = [];


    document
        .getElementById("halamanHasil")
        .classList.remove("aktif");


    document
        .getElementById("halamanPhotobooth")
        .classList.add("aktif");


    document.getElementById("statusFoto").textContent =
        "Ambil 3 foto yaa ♡";


    bukaKamera();

}
