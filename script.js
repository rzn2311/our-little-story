// =====================================================
// OUR LITTLE STORY - SCRIPT.JS
// =====================================================


// =====================================================
// ELEMENT HTML
// =====================================================

const video = document.getElementById("video");
const canvas = document.createElement("canvas");


// =====================================================
// VARIABLE
// =====================================================

let fotoArray = [];

let namaUser = "";

let pertanyaanSekarang = 0;

let cameraStream = null;


// =====================================================
// KONFIGURASI
// =====================================================

const tanggalPhotobooth = "26 Desember 2024";

// NOMOR WHATSAPP TUJUAN
const nomorWhatsApp = "6285776504819";


// =====================================================
// DAFTAR PERTANYAAN
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

    const nama =
        document
            .getElementById("nama")
            .value
            .trim();

    const tanggal =
        normalisasi(
            document
                .getElementById("tanggal")
                .value
        );

    const pesan =
        document.getElementById(
            "pesanTanggal"
        );


    // Nama kosong
    if (nama === "") {

        pesan.textContent =
            "Nama jangan dikosongin yaa 😭";

        return;

    }


    // Tanggal yang benar
    const tanggalBenar = [

        "26 desember 2024",

        "26 12 2024"

    ];


    // Jika benar
    if (
        tanggalBenar.includes(tanggal)
    ) {

        namaUser = nama;

        pertanyaanSekarang = 0;

        pesan.textContent = "";


        document
            .getElementById("halamanAwal")
            .classList.remove("aktif");


        document
            .getElementById("halamanPertanyaan")
            .classList.add("aktif");


        tampilkanPertanyaan();

    }

    // Jika salah
    else {

        pesan.textContent =
            "Kamu udah ga sayang 😭";

    }

}


// =====================================================
// TAMPILKAN PERTANYAAN
// =====================================================

function tampilkanPertanyaan() {

    const data =
        pertanyaanList[
            pertanyaanSekarang
        ];


    const nomor =
        document.getElementById(
            "nomorPertanyaan"
        );


    const pertanyaan =
        document.getElementById(
            "pertanyaan"
        );


    const input =
        document.getElementById(
            "jawaban"
        );


    const textarea =
        document.getElementById(
            "saran"
        );


    const pesan =
        document.getElementById(
            "pesanJawaban"
        );


    // Nomor pertanyaan
    nomor.textContent =
        "Pertanyaan " +
        (pertanyaanSekarang + 1) +
        " dari " +
        pertanyaanList.length;


    // Isi pertanyaan
    pertanyaan.textContent =
        data.pertanyaan;


    // Bersihkan pesan
    pesan.textContent = "";


    // =================================================
    // PERTANYAAN SARAN
    // =================================================

    if (
        data.tipe === "saran"
    ) {

        input.style.display =
            "none";

        textarea.style.display =
            "block";

        textarea.value = "";

        textarea.focus();

    }

    // =================================================
    // PERTANYAAN BIASA
    // =================================================

    else {

        input.style.display =
            "block";

        textarea.style.display =
            "none";

        input.value = "";

        input.focus();

    }

}


// =====================================================
// CEK JAWABAN
// =====================================================

function cekJawaban() {

    const data =
        pertanyaanList[
            pertanyaanSekarang
        ];


    const pesan =
        document.getElementById(
            "pesanJawaban"
        );


    // =================================================
    // PERTANYAAN SARAN
    // =================================================

    if (
        data.tipe === "saran"
    ) {

        const saran =
            document
                .getElementById("saran")
                .value
                .trim();


        // Jika kosong
        if (saran === "") {

            pesan.style.color =
                "#e53935";

            pesan.textContent =
                "Tulis moment-nya dulu yaa ♡";

            return;

        }


        // Simpan di browser
        localStorage.setItem(
            "namaUser",
            namaUser
        );


        localStorage.setItem(
            "saranMoment",
            saran
        );


        // KIRIM KE WHATSAPP
        kirimSaran(saran);

        return;

    }


    // =================================================
    // PERTANYAAN BIASA
    // =================================================

    const jawaban =
        normalisasi(
            document
                .getElementById("jawaban")
                .value
        );


    // Jawaban kosong
    if (jawaban === "") {

        pesan.style.color =
            "#e53935";

        pesan.textContent =
            "Jawab dulu yaa 😭";

        return;

    }


    // =================================================
    // PERTANYAAN BAND
    // =================================================

    if (
        pertanyaanSekarang === 5
    ) {

        const adaLombaSihir =
            jawaban.includes(
                "lomba sihir"
            );


        const adaRealityClub =
            jawaban.includes(
                "reality club"
            );


        const adaBlackHorses =
            jawaban.includes(
                "black horses"
            );


        if (
            adaLombaSihir &&
            adaRealityClub &&
            adaBlackHorses
        ) {

            pesan.textContent = "";

            lanjutPertanyaan();

        }

        else {

            pesan.style.color =
                "#e53935";

            pesan.textContent =
                "Belum lengkap 😭 Sebutkan 3 band yang benar yaa.";

        }


        return;

    }


    // =================================================
    // JAWABAN NORMAL
    // =================================================

    if (
        jawaban === data.jawaban
    ) {

        pesan.textContent = "";

        lanjutPertanyaan();

    }

    else {

        pesan.style.color =
            "#e53935";

        pesan.textContent =
            "Jawabannya belum tepat 😭";

    }

}


// =====================================================
// LANJUT PERTANYAAN
// =====================================================

function lanjutPertanyaan() {

    pertanyaanSekarang++;


    if (
        pertanyaanSekarang <
        pertanyaanList.length
    ) {

        tampilkanPertanyaan();

    }

    else {

        masukPhotobooth();

    }

}


// =====================================================
// KIRIM SARAN KE WHATSAPP
// =====================================================

function kirimSaran(saran) {

    const pesanElement =
        document.getElementById(
            "pesanJawaban"
        );


    // =================================================
    // BUAT PESAN WHATSAPP
    // =================================================

    const isiPesan =
`💌 OUR LITTLE STORY ♡

Nama: ${namaUser}

Tanggal jadian: ${tanggalPhotobooth}

Moment paling bahagia:
${saran}

♡ Sent from Our Little Story`;


    // =================================================
    // ENCODE PESAN
    // =================================================

    const pesanEncoded =
        encodeURIComponent(
            isiPesan
        );


    // =================================================
    // LINK WHATSAPP
    // =================================================

    const linkWhatsApp =
        "https://wa.me/" +
        nomorWhatsApp +
        "?text=" +
        pesanEncoded;


    // =================================================
    // TAMPILKAN PESAN
    // =================================================

    pesanElement.style.color =
        "#e85c91";

    pesanElement.textContent =
        "Membuka WhatsApp... ♡";


    // =================================================
    // BUKA WHATSAPP
    // =================================================

    setTimeout(
        function () {

            window.location.href =
                linkWhatsApp;

        },
        500
    );

}


// =====================================================
// MASUK PHOTOBOOTH
// =====================================================

function masukPhotobooth() {

    hentikanKamera();


    fotoArray = [];


    document.getElementById(
        "statusFoto"
    ).textContent =
        "Ambil 3 foto yaa ♡";


    document.getElementById(
        "halamanPertanyaan"
    ).classList.remove("aktif");


    document.getElementById(
        "halamanPhotobooth"
    ).classList.add("aktif");


    document.getElementById(
        "info"
    ).textContent =
        tanggalPhotobooth +
        " ♡";


    bukaKamera();

}


// =====================================================
// BUKA KAMERA
// =====================================================

async function bukaKamera() {

    try {

        cameraStream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {

                        facingMode: "user"

                    },

                    audio: false

                });


        video.srcObject =
            cameraStream;

    }

    catch (error) {

        console.error(
            "Camera error:",
            error
        );


        document.getElementById(
            "statusFoto"
        ).textContent =
            "Kamera tidak bisa dibuka. Izinkan akses kamera yaa.";

    }

}


// =====================================================
// MATIKAN KAMERA
// =====================================================

function hentikanKamera() {

    if (
        cameraStream
    ) {

        cameraStream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );


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

    if (
        fotoArray.length >= 3
    ) {

        return;

    }


    const countdown =
        document.getElementById(
            "countdown"
        );


    let angka = 3;


    countdown.textContent =
        angka;


    const timer =
        setInterval(
            function () {

                angka--;


                if (
                    angka > 0
                ) {

                    countdown.textContent =
                        angka;

                }

                else {

                    clearInterval(
                        timer
                    );


                    countdown.textContent =
                        "";


                    foto();

                }

            },
            1000
        );

}


// =====================================================
// AMBIL FOTO DARI KAMERA
// =====================================================

function foto() {

    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        return;

    }


    canvas.width =
        video.videoWidth;


    canvas.height =
        video.videoHeight;


    const ctx =
        canvas.getContext(
            "2d"
        );


    // Mirror kamera depan
    ctx.translate(
        canvas.width,
        0
    );


    ctx.scale(
        -1,
        1
    );


    // Gambar video ke canvas
    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Simpan sebagai JPEG
    const fotoData =
        canvas.toDataURL(
            "image/jpeg",
            0.9
        );


    fotoArray.push(
        fotoData
    );


    document.getElementById(
        "statusFoto"
    ).textContent =
        "Foto " +
        fotoArray.length +
        " dari 3 ♡";


    // Kalau sudah 3 foto
    if (
        fotoArray.length >= 3
    ) {

        setTimeout(
            tampilkanHasil,
            300
        );

    }

}


// =====================================================
// TAMPILKAN HASIL
// =====================================================

function tampilkanHasil() {

    // Matikan kamera
    hentikanKamera();


    // Pindah halaman
    document.getElementById(
        "halamanPhotobooth"
    ).classList.remove("aktif");


    document.getElementById(
        "halamanHasil"
    ).classList.add("aktif");


    const hasil =
        document.getElementById(
            "hasilFoto"
        );


    hasil.innerHTML = "";


    // =================================================
    // BUAT 2 PHOTO STRIP
    // =================================================

    for (
        let stripNumber = 1;
        stripNumber <= 2;
        stripNumber++
    ) {

        const strip =
            document.createElement(
                "div"
            );


        strip.className =
            "strip";


        // Judul
        const title =
            document.createElement(
                "div"
            );


        title.className =
            "strip-title";


        title.textContent =
            "🐱 Our Little Moment ♡";


        strip.appendChild(
            title
        );


        // 3 foto
        fotoArray.forEach(
            function (fotoData) {

                const img =
                    document.createElement(
                        "img"
                    );


                img.src =
                    fotoData;


                strip.appendChild(
                    img
                );

            }
        );


        // Tanggal
        const date =
            document.createElement(
                "div"
            );


        date.className =
            "strip-date";


        date.textContent =
            tanggalPhotobooth;


        strip.appendChild(
            date
        );


        hasil.appendChild(
            strip
        );

    }

}


// =====================================================
// DOWNLOAD FOTO
// =====================================================

async function simpanFoto() {

    if (
        fotoArray.length !== 3
    ) {

        return;

    }


    const downloadCanvas =
        document.createElement(
            "canvas"
        );


    downloadCanvas.width =
        700;


    downloadCanvas.height =
        1200;


    const ctx =
        downloadCanvas.getContext(
            "2d"
        );


    // =================================================
    // BACKGROUND
    // =================================================

    ctx.fillStyle =
        "#ffc1d9";


    ctx.fillRect(
        0,
        0,
        700,
        1200
    );


    // =================================================
    // JUDUL
    // =================================================

    ctx.fillStyle =
        "#222";


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 30px Arial";


    ctx.fillText(
        "🐱 Our Little Moment ♡",
        350,
        55
    );


    // =================================================
    // UKURAN PHOTO STRIP
    // =================================================

    const stripWidth =
        270;


    const stripHeight =
        1030;


    const x1 = 65;

    const x2 = 365;

    const top = 90;


    // =================================================
    // BACKGROUND STRIP
    // =================================================

    ctx.fillStyle =
        "white";


    ctx.fillRect(
        x1,
        top,
        stripWidth,
        stripHeight
    );


    ctx.fillRect(
        x2,
        top,
        stripWidth,
        stripHeight
    );


    // =================================================
    // LOAD FOTO
    // =================================================

    const images =
        await Promise.all(

            fotoArray.map(
                function (fotoData) {

                    return new Promise(
                        function (resolve) {

                            const img =
                                new Image();


                            img.onload =
                                function () {

                                    resolve(img);

                                };


                            img.src =
                                fotoData;

                        }
                    );

                }
            )

        );


    // =================================================
    // MASUKKAN FOTO KE STRIP
    // =================================================

    for (
        let s = 0;
        s < 2;
        s++
    ) {

        const x =
            s === 0
                ? x1
                : x2;


        let y =
            top + 30;


        images.forEach(
            function (img) {

                const photoWidth =
                    stripWidth - 30;


                const photoHeight =
                    300;


                ctx.drawImage(
                    img,
                    x + 15,
                    y,
                    photoWidth,
                    photoHeight
                );


                y +=
                    photoHeight + 15;

            }
        );


        // =================================================
        // TANGGAL
        // =================================================

        ctx.fillStyle =
            "#222";


        ctx.font =
            "bold 13px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(
            tanggalPhotobooth,
            x + stripWidth / 2,
            top + 1000
        );

    }


    // =================================================
    // DOWNLOAD
    // =================================================

    const link =
        document.createElement(
            "a"
        );


    link.download =
        "our-little-moment.png";


    link.href =
        downloadCanvas.toDataURL(
            "image/png"
        );


    link.click();

}


// =====================================================
// AMBIL FOTO ULANG
// =====================================================

function ulangFoto() {

    // Matikan kamera lama
    hentikanKamera();


    // Hapus foto
    fotoArray = [];


    // Pindah ke photobooth
    document.getElementById(
        "halamanHasil"
    ).classList.remove("aktif");


    document.getElementById(
        "halamanPhotobooth"
    ).classList.add("aktif");


    // Reset status
    document.getElementById(
        "statusFoto"
    ).textContent =
        "Ambil 3 foto yaa ♡";


    // Buka kamera lagi
    bukaKamera();

}


// =====================================================
// MATIKAN KAMERA SAAT KELUAR
// =====================================================

window.addEventListener(
    "beforeunload",
    function () {

        hentikanKamera();

    }
);
