// ===============================
// OUR LITTLE STORY - SCRIPT.JS
// ===============================

// ===============================
// DATA
// ===============================

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");

let fotoArray = [];
let namaUser = "";
let pertanyaanSekarang = 0;
let cameraStream = null;

const tanggalJadianBenar = "26 desember 2024";
const tanggalPhotobooth = "26 Desember 2024";

// Nomor WhatsApp tujuan
const nomorWhatsApp = "6285776504819";

// ===============================
// DAFTAR PERTANYAAN
// ===============================

const pertanyaan = [
    {
        soal: "Apa warna favorit kamu?",
        jawaban: "hitam"
    },
    {
        soal: "Ukuran baju kamu?",
        jawaban: "L"
    },
    {
        soal: "Ukuran sepatu kamu?",
        jawaban: "42"
    },
    {
        soal: "Kapan tanggal lahir kamu?",
        jawaban: "23 November 2006"
    },
    {
        soal: "Apa genre musik favorit kamu?",
        jawaban: "rock"
    },
    {
        soal: "Sebutkan 3 band yang pernah kita tonton bareng!",
        jawaban: "Lomba Sihir, Reality Club, Black Horses"
    },
    {
        soal: "Ceritakan moment paling bahagia kamu sama saya",
        jawaban: ""
    }
];

// ===============================
// NORMALISASI JAWABAN
// ===============================

function normalisasi(teks) {
    return teks
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

// ===============================
// CEK NAMA
// ===============================

function mulaiCerita() {

    const inputNama = document.getElementById("nama");

    if (!inputNama) {
        return;
    }

    namaUser = inputNama.value.trim();

    if (namaUser === "") {
        alert("Masukkan nama kamu dulu ya ♡");
        return;
    }

    const halamanAwal = document.getElementById("opening");
    const halamanTanggal = document.getElementById("tanggalPage");

    if (halamanAwal && halamanTanggal) {
        halamanAwal.classList.remove("active");
        halamanTanggal.classList.add("active");
    }
}

// ===============================
// CEK TANGGAL JADIAN
// ===============================

function cekTanggal() {

    const inputTanggal = document.getElementById("tanggal");

    if (!inputTanggal) {
        return;
    }

    const tanggal = normalisasi(inputTanggal.value);

    if (
        tanggal === tanggalJadianBenar ||
        tanggal === "26 12 2024" ||
        tanggal === "26/12/2024" ||
        tanggal === "26-12-2024"
    ) {

        const halamanTanggal = document.getElementById("tanggalPage");
        const halamanPertanyaan = document.getElementById("questions");

        if (halamanTanggal && halamanPertanyaan) {
            halamanTanggal.classList.remove("active");
            halamanPertanyaan.classList.add("active");
        }

        pertanyaanSekarang = 0;
        tampilkanPertanyaan();

    } else {

        const pesan = document.getElementById("pesanTanggal");

        if (pesan) {
            pesan.textContent = "Kamu udah ga sayang 😭";
        }
    }
}

// ===============================
// TAMPILKAN PERTANYAAN
// ===============================

function tampilkanPertanyaan() {

    const soalElement = document.getElementById("soal");
    const inputJawaban = document.getElementById("jawaban");
    const nomorElement = document.getElementById("nomorSoal");

    if (!soalElement || !inputJawaban) {
        return;
    }

    const data = pertanyaan[pertanyaanSekarang];

    soalElement.textContent = data.soal;

    inputJawaban.value = "";

    if (nomorElement) {
        nomorElement.textContent =
            `${pertanyaanSekarang + 1} / ${pertanyaan.length}`;
    }

    // Pertanyaan terakhir menggunakan textarea
    if (pertanyaanSekarang === pertanyaan.length - 1) {

        inputJawaban.outerHTML = `
            <textarea
                id="jawaban"
                placeholder="Tulis moment paling bahagia kamu di sini ♡"
                rows="5"
            ></textarea>
        `;

    } else {

        // Kalau sebelumnya textarea, kembalikan menjadi input
        if (inputJawaban.tagName.toLowerCase() === "textarea") {

            inputJawaban.outerHTML = `
                <input
                    type="text"
                    id="jawaban"
                    placeholder="Jawaban kamu..."
                >
            `;
        }
    }
}

// ===============================
// CEK JAWABAN
// ===============================

function cekJawaban() {

    const inputJawaban = document.getElementById("jawaban");

    if (!inputJawaban) {
        return;
    }

    const jawabanUser = inputJawaban.value.trim();

    // Tidak boleh kosong
    if (jawabanUser === "") {

        const pesan = document.getElementById("pesanJawaban");

        if (pesan) {
            pesan.style.color = "#e85c91";
            pesan.textContent = "Jawab dulu ya ♡";
        }

        return;
    }

    // ===============================
    // PERTANYAAN TERAKHIR
    // ===============================

    if (pertanyaanSekarang === pertanyaan.length - 1) {

        // Simpan jawaban
        localStorage.setItem(
            "momentBahagia",
            jawabanUser
        );

        // Kirim ke WhatsApp
        kirimSaran(jawabanUser);

        return;
    }

    // ===============================
    // PERTANYAAN BAND
    // ===============================

    if (pertanyaanSekarang === 5) {

        const jawaban = normalisasi(jawabanUser);

        const wajib = [
            "lomba sihir",
            "reality club",
            "black horses"
        ];

        const benar = wajib.every(function(band) {
            return jawaban.includes(band);
        });

        if (benar) {

            pertanyaanSekarang++;

            tampilkanPertanyaan();

        } else {

            tampilkanJawabanSalah();
        }

        return;
    }

    // ===============================
    // PERTANYAAN BIASA
    // ===============================

    const jawabanBenar =
        normalisasi(pertanyaan[pertanyaanSekarang].jawaban);

    const jawabanMasuk =
        normalisasi(jawabanUser);

    if (jawabanMasuk === jawabanBenar) {

        pertanyaanSekarang++;

        tampilkanPertanyaan();

    } else {

        tampilkanJawabanSalah();
    }
}

// ===============================
// JAWABAN SALAH
// ===============================

function tampilkanJawabanSalah() {

    const pesan = document.getElementById("pesanJawaban");

    if (pesan) {

        pesan.style.color = "#e85c91";

        pesan.textContent =
            "Hmm, kayaknya jawaban kamu salah deh 😭";
    }
}

// ===============================
// KIRIM SARAN KE WHATSAPP
// ===============================

function kirimSaran(saran) {

    const pesanElement =
        document.getElementById("pesanJawaban");

    const isiPesan =
`💌 OUR LITTLE STORY ♡

Nama: ${namaUser}

Tanggal jadian: ${tanggalPhotobooth}

Moment paling bahagia:
${saran}

♡ Sent from Our Little Story`;

    const pesanEncoded =
        encodeURIComponent(isiPesan);

    const linkWhatsApp =
        "https://wa.me/" +
        nomorWhatsApp +
        "?text=" +
        pesanEncoded;

    if (pesanElement) {

        pesanElement.style.color = "#e85c91";

        pesanElement.textContent =
            "Membuka WhatsApp... ♡";
    }

    // ===============================
    // BUKA WHATSAPP
    // ===============================

    window.open(
        linkWhatsApp,
        "_blank"
    );

    // ===============================
    // LANJUT KE PHOTOBOX
    // ===============================

    setTimeout(function() {

        masukPhotobooth();

    }, 1500);
}

// ===============================
// MASUK PHOTOBOOTH
// ===============================

function masukPhotobooth() {

    hentikanKamera();

    fotoArray = [];

    const halamanPertanyaan =
        document.getElementById("questions");

    const halamanPhotobooth =
        document.getElementById("photobooth");

    const halamanHasil =
        document.getElementById("result");

    if (halamanPertanyaan) {
        halamanPertanyaan.classList.remove("active");
    }

    if (halamanHasil) {
        halamanHasil.classList.remove("active");
    }

    if (halamanPhotobooth) {
        halamanPhotobooth.classList.add("active");
    }

    const info =
        document.getElementById("info");

    if (info) {
        info.textContent =
            tanggalPhotobooth + " ♡";
    }

    const counter =
        document.getElementById("counter");

    if (counter) {
        counter.textContent =
            "Foto 1 dari 3";
    }

    const countdown =
        document.getElementById("countdown");

    if (countdown) {
        countdown.textContent = "";
    }

    bukaKamera();
}

// ===============================
// BUKA KAMERA
// ===============================

async function bukaKamera() {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                },
                audio: false
            });

        video =
            document.getElementById("video");

        if (video) {

            video.srcObject =
                cameraStream;

            video.play();
        }

    } catch (error) {

        console.error(
            "Kamera tidak bisa dibuka:",
            error
        );

        alert(
            "Kamera tidak bisa dibuka. Pastikan izin kamera sudah diberikan ya ♡"
        );
    }
}

// ===============================
// HENTIKAN KAMERA
// ===============================

function hentikanKamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(function(track) {
                track.stop();
            });

        cameraStream = null;
    }

    if (video) {
        video.srcObject = null;
    }
}

// ===============================
// AMBIL FOTO
// ===============================

function ambilFoto() {

    if (fotoArray.length >= 3) {
        return;
    }

    const countdown =
        document.getElementById("countdown");

    let angka = 3;

    if (countdown) {
        countdown.textContent = angka;
    }

    const timer =
        setInterval(function() {

            angka--;

            if (countdown) {

                if (angka > 0) {

                    countdown.textContent =
                        angka;

                } else {

                    countdown.textContent =
                        "📸";
                }
            }

            if (angka <= 0) {

                clearInterval(timer);

                setTimeout(function() {

                    foto();

                }, 300);
            }

        }, 1000);
}

// ===============================
// FOTO KE CANVAS
// ===============================

function foto() {

    video =
        document.getElementById("video");

    canvas =
        document.getElementById("canvas");

    if (!video || !canvas) {
        return;
    }

    const ctx =
        canvas.getContext("2d");

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;

    // Mirror seperti kamera depan HP
    ctx.save();

    ctx.translate(
        canvas.width,
        0
    );

    ctx.scale(
        -1,
        1
    );

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.restore();

    const fotoData =
        canvas.toDataURL(
            "image/jpeg",
            0.9
        );

    fotoArray.push(fotoData);

    // Update counter
    const counter =
        document.getElementById("counter");

    if (counter) {

        if (fotoArray.length < 3) {

            counter.textContent =
                `Foto ${fotoArray.length + 1} dari 3`;

        } else {

            counter.textContent =
                "Semua foto selesai ♡";
        }
    }

    const countdown =
        document.getElementById("countdown");

    if (countdown) {
        countdown.textContent = "";
    }

    // Kalau sudah 3 foto
    if (fotoArray.length === 3) {

        setTimeout(function() {

            tampilkanHasil();

        }, 500);
    }
}

// ===============================
// TAMPILKAN HASIL
// ===============================

function tampilkanHasil() {

    hentikanKamera();

    const halamanPhotobooth =
        document.getElementById("photobooth");

    const halamanHasil =
        document.getElementById("result");

    if (halamanPhotobooth) {
        halamanPhotobooth.classList.remove("active");
    }

    if (halamanHasil) {
        halamanHasil.classList.add("active");
    }

    const hasil =
        document.getElementById("hasil");

    if (!hasil) {
        return;
    }

    hasil.innerHTML = "";

    // ===============================
    // STRIP 1
    // ===============================

    const strip1 =
        document.createElement("div");

    strip1.className =
        "photo-strip";

    strip1.innerHTML = `
        <div class="strip-title">
            🐱 OUR LITTLE STORY
        </div>

        <img src="${fotoArray[0]}">
        <img src="${fotoArray[1]}">
        <img src="${fotoArray[2]}">

        <div class="strip-date">
            ${tanggalPhotobooth}
        </div>
    `;

    // ===============================
    // STRIP 2
    // ===============================

    const strip2 =
        document.createElement("div");

    strip2.className =
        "photo-strip";

    strip2.innerHTML = `
        <div class="strip-title">
            🐱 OUR LITTLE STORY
        </div>

        <img src="${fotoArray[0]}">
        <img src="${fotoArray[1]}">
        <img src="${fotoArray[2]}">

        <div class="strip-date">
            ${tanggalPhotobooth}
        </div>
    `;

    hasil.appendChild(strip1);
    hasil.appendChild(strip2);
}

// ===============================
// SIMPAN / DOWNLOAD FOTO
// ===============================

function simpanFoto() {

    if (fotoArray.length < 3) {

        alert(
            "Foto belum lengkap ♡"
        );

        return;
    }

    const downloadCanvas =
        document.createElement("canvas");

    const ctx =
        downloadCanvas.getContext("2d");

    // Ukuran gambar hasil
    downloadCanvas.width = 700;
    downloadCanvas.height = 1200;

    // ===============================
    // BACKGROUND PINK
    // ===============================

    ctx.fillStyle = "#ffd6e7";

    ctx.fillRect(
        0,
        0,
        downloadCanvas.width,
        downloadCanvas.height
    );

    // ===============================
    // JUDUL
    // ===============================

    ctx.fillStyle = "#222";

    ctx.textAlign = "center";

    ctx.font =
        "bold 32px Arial";

    ctx.fillText(
        "🐱 OUR LITTLE STORY",
        350,
        55
    );

    // ===============================
    // FOTO
    // ===============================

    const stripWidth = 270;
    const stripHeight = 980;

    const jarak = 35;

    const x1 = 60;
    const x2 = 370;

    const y = 100;

    // Background strip 1
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        x1,
        y,
        stripWidth,
        stripHeight
    );

    // Background strip 2
    ctx.fillRect(
        x2,
        y,
        stripWidth,
        stripHeight
    );

    // ===============================
    // GAMBAR DALAM STRIP
    // ===============================

    const tinggiFoto = 260;

    function gambarFoto(
        data,
        x,
        yFoto
    ) {

        const img =
            new Image();

        img.src = data;

        img.onload = function() {

            const rasio =
                Math.max(
                    250 / img.width,
                    tinggiFoto / img.height
                );

            const width =
                img.width * rasio;

            const height =
                img.height * rasio;

            const cropX =
                (width - 250) / 2;

            const cropY =
                (height - tinggiFoto) / 2;

            ctx.drawImage(
                img,
                cropX / rasio,
                cropY / rasio,
                250 / rasio,
                tinggiFoto / rasio,
                x + 10,
                yFoto,
                250,
                tinggiFoto
            );
        };
    }

    gambarFoto(
        fotoArray[0],
        x1 + 10,
        y + 15
    );

    gambarFoto(
        fotoArray[1],
        x1 + 10,
        y + 280
    );

    gambarFoto(
        fotoArray[2],
        x1 + 10,
        y + 545
    );

    gambarFoto(
        fotoArray[0],
        x2 + 10,
        y + 15
    );

    gambarFoto(
        fotoArray[1],
        x2 + 10,
        y + 280
    );

    gambarFoto(
        fotoArray[2],
        x2 + 10,
        y + 545
    );

    // ===============================
    // TANGGAL
    // ===============================

    ctx.fillStyle = "#222";

    ctx.font =
        "bold 20px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        tanggalPhotobooth,
        x1 + stripWidth / 2,
        y + 950
    );

    ctx.fillText(
        tanggalPhotobooth,
        x2 + stripWidth / 2,
        y + 950
    );

    // ===============================
    // DOWNLOAD
    // ===============================

    setTimeout(function() {

        downloadCanvas.toBlob(
            function(blob) {

                const url =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    "our-little-moment.png";

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

                URL.revokeObjectURL(url);

            },
            "image/png"
        );

    }, 500);
}

// ===============================
// ULANGI PHOTOBOX
// ===============================

function ulangiFoto() {

    hentikanKamera();

    fotoArray = [];

    const halamanHasil =
        document.getElementById("result");

    const halamanPhotobooth =
        document.getElementById("photobooth");

    if (halamanHasil) {
        halamanHasil.classList.remove("active");
    }

    if (halamanPhotobooth) {
        halamanPhotobooth.classList.add("active");
    }

    const counter =
        document.getElementById("counter");

    if (counter) {
        counter.textContent =
            "Foto 1 dari 3";
    }

    const countdown =
        document.getElementById("countdown");

    if (countdown) {
        countdown.textContent = "";
    }

    bukaKamera();
}

// ===============================
// STOP KAMERA SAAT KELUAR HALAMAN
// ===============================

window.addEventListener(
    "beforeunload",
    function() {

        hentikanKamera();

    }
);
