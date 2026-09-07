/* ==================================================
   ELEMENT
================================================== */

let video = document.getElementById("camera");

let canvas = document.getElementById("canvas");

let fotoArray = [];

let namaUser = "";

let pertanyaanSekarang = 0;

let cameraStream = null;


/* ==================================================
   TANGGAL
================================================== */

const tanggalJadianBenar = "26 desember 2024";

const tanggalPhotobooth = "26 Desember 2024";


/* ==================================================
   DATA PERTANYAAN
================================================== */

const pertanyaan = [

    {
        soal:
            "Apa warna favorit saya?",

        tipe:
            "input",

        jawaban:
            "hitam"
    },


    {
        soal:
            "Berapa ukuran baju saya?",

        tipe:
            "input",

        jawaban:
            "l"
    },


    {
        soal:
            "Berapa ukuran sepatu saya?",

        tipe:
            "input",

        jawaban:
            "42"
    },


    {
        soal:
            "Kapan tanggal lahir saya?",

        tipe:
            "input",

        jawaban:
            "23 november 2006"
    },


    {
        soal:
            "Apa genre musik favorit saya?",

        tipe:
            "input",

        jawaban:
            "rock"
    },


    {
        soal:
            "Sebutkan 3 band yang sudah kita tonton!",

        tipe:
            "bands"
    },


    {
        soal:
            "Ceritakan moment paling bahagia kamu sama saya ❤️",

        tipe:
            "textarea"
    }

];


/* ==================================================
   NORMALISASI TEKS
================================================== */

function normalisasi(text) {

    return text
        .toLowerCase()
        .trim()
        .replaceAll(",", " ")
        .replaceAll("+", " ")
        .replace(/\s+/g, " ");

}


/* ==================================================
   CEK TANGGAL JADIAN
================================================== */

function cekTanggal() {

    namaUser =
        document
            .getElementById("nama")
            .value
            .trim();


    let tanggal =
        document
            .getElementById("tanggalJadian")
            .value
            .trim()
            .toLowerCase();


    if (namaUser === "") {

        document
            .getElementById("salahTanggal")
            .innerText =
            "Isi nama kamu dulu ya 🥺";

        return;

    }


    let tanggalNormal =
        tanggal
            .replaceAll("/", " ")
            .replaceAll("-", " ")
            .replace(/\s+/g, " ")
            .trim();


    let benar = [

        "26 desember 2024",

        "26 12 2024"

    ];


    if (
        benar.includes(tanggalNormal)
    ) {

        document
            .getElementById("salahTanggal")
            .innerText = "";


        document
            .getElementById("opening")
            .classList
            .remove("active");


        document
            .getElementById("questions")
            .classList
            .add("active");


        pertanyaanSekarang = 0;

        tampilkanPertanyaan();


    } else {

        document
            .getElementById("salahTanggal")
            .innerText =
            "Kamu udah ga sayang 😭";

    }

}


/* ==================================================
   TAMPILKAN PERTANYAAN
================================================== */

function tampilkanPertanyaan() {

    let data =
        pertanyaan[
            pertanyaanSekarang
        ];


    document
        .getElementById("nomorPertanyaan")
        .innerText =
        "Pertanyaan " +
        (pertanyaanSekarang + 1) +
        " dari " +
        pertanyaan.length;


    document
        .getElementById("judulPertanyaan")
        .innerText =
        data.soal;


    let area =
        document
            .getElementById("areaJawaban");


    if (data.tipe === "textarea") {

        area.innerHTML = `

            <textarea
                id="jawaban"
                placeholder="Ceritakan momentnya..."
            ></textarea>

        `;

    } else {

        area.innerHTML = `

            <input
                type="text"
                id="jawaban"
                placeholder="Tulis jawaban kamu..."
            >

        `;

    }


    document
        .getElementById("pesanJawaban")
        .innerText = "";

}


/* ==================================================
   CEK 3 BAND
================================================== */

function cekBand(input) {

    let teks =
        normalisasi(input);


    let band1 =
        teks.includes("lomba sihir");


    let band2 =
        teks.includes("reality club");


    let band3 =
        teks.includes("black horses");


    return (
        band1 &&
        band2 &&
        band3
    );

}


/* ==================================================
   CEK JAWABAN
================================================== */

function cekJawaban() {

    let inputElement =
        document.getElementById("jawaban");


    if (!inputElement) {

        return;

    }


    let input =
        inputElement.value.trim();


    let data =
        pertanyaan[
            pertanyaanSekarang
        ];


    /* ===============================================
       MOMENT BAHAGIA
    =============================================== */

    if (
        data.tipe === "textarea"
    ) {

        if (input === "") {

            document
                .getElementById("pesanJawaban")
                .innerText =
                "Ceritain dulu momentnya dong 🥺";

            return;

        }


        localStorage.setItem(
            "momentBahagia",
            input
        );


        masukPhotobooth();


        return;

    }


    /* ===============================================
       3 BAND
    =============================================== */

    if (
        data.tipe === "bands"
    ) {

        if (
            cekBand(input)
        ) {

            pertanyaanSekarang++;


            if (
                pertanyaanSekarang <
                pertanyaan.length
            ) {

                tampilkanPertanyaan();

            }


        } else {

            document
                .getElementById("pesanJawaban")
                .innerText =
                "Hmm masih kurang tepat 😭 Coba ingat lagi 3 band yang pernah kita tonton.";

        }


        return;

    }


    /* ===============================================
       JAWABAN NORMAL
    =============================================== */

    let jawabanUser =
        normalisasi(input);


    let jawabanBenar =
        normalisasi(
            data.jawaban
        );


    if (
        jawabanUser ===
        jawabanBenar
    ) {

        pertanyaanSekarang++;


        if (
            pertanyaanSekarang <
            pertanyaan.length
        ) {

            tampilkanPertanyaan();

        }

    } else {

        /*
           PENTING:
           Kalau jawaban salah,
           TIDAK ADA pemanggilan kamera.
        */

        hentikanKamera();


        document
            .getElementById("pesanJawaban")
            .innerText =
            "Salah 😭 Coba ingat-ingat lagi...";

    }

}


/* ==================================================
   MASUK PHOTOBOOTH
================================================== */

function masukPhotobooth() {

    /*
       Pastikan kamera benar-benar mati
       sebelum halaman photobooth dibuka.
    */

    hentikanKamera();


    /*
       Reset foto.
    */

    fotoArray = [];


    document
        .getElementById("fotoKe")
        .innerText =
        "Foto 1 dari 3";


    document
        .getElementById("fotoBtn")
        .style
        .display =
        "inline-block";


    document
        .getElementById("fotoBtn")
        .disabled =
        false;


    document
        .getElementById("countdown")
        .innerText =
        "";


    document
        .getElementById("info")
        .innerText =
        tanggalPhotobooth + " ♡";


    document
        .getElementById("questions")
        .classList
        .remove("active");


    document
        .getElementById("photobooth")
        .classList
        .add("active");


    /*
       Kamera BARU dibuka di sini,
       setelah semua jawaban benar.
    */

    bukaKamera();

}


/* ==================================================
   BUKA KAMERA
================================================== */

async function bukaKamera() {

    try {

        /*
           Pastikan kamera lama dimatikan.
        */

        hentikanKamera();


        cameraStream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {

                        facingMode:
                            "user"

                    },

                    audio: false

                });


        video.srcObject =
            cameraStream;


    } catch (error) {

        alert(
            "Kamera tidak bisa dibuka. Izinkan akses kamera terlebih dahulu."
        );


        console.error(error);

    }

}


/* ==================================================
   HENTIKAN KAMERA
================================================== */

function hentikanKamera() {

    /*
       Matikan semua track kamera.
    */

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        cameraStream = null;

    }


    /*
       Pastikan video juga tidak memakai stream.
    */

    if (video) {

        video.srcObject = null;

    }

}


/* ==================================================
   AMBIL FOTO
================================================== */

function ambilFoto() {

    if (
        !cameraStream
    ) {

        alert(
            "Kamera belum siap."
        );

        return;

    }


    let tombol =
        document
            .getElementById("fotoBtn");


    tombol.disabled =
        true;


    let angka = 3;


    let countdown =
        document
            .getElementById("countdown");


    countdown.innerText =
        angka;


    let timer =
        setInterval(function () {

            angka--;


            if (
                angka > 0
            ) {

                countdown.innerText =
                    angka;

            } else {

                clearInterval(timer);


                countdown.innerText =
                    "";


                foto();

            }

        }, 1000);

}


/* ==================================================
   AMBIL GAMBAR DARI VIDEO
================================================== */

function foto() {

    if (
        !cameraStream
    ) {

        return;

    }


    canvas.width =
        video.videoWidth;


    canvas.height =
        video.videoHeight;


    let context =
        canvas.getContext("2d");


    /*
       Mirror agar hasil foto
       seperti kamera depan.
    */

    context.save();


    context.translate(
        canvas.width,
        0
    );


    context.scale(
        -1,
        1
    );


    context.drawImage(

        video,

        0,
        0,

        canvas.width,
        canvas.height

    );


    context.restore();


    let fotoData =
        canvas.toDataURL(
            "image/jpeg",
            0.95
        );


    fotoArray.push(
        fotoData
    );


    if (
        fotoArray.length < 3
    ) {

        document
            .getElementById("fotoKe")
            .innerText =
            "Foto " +
            (fotoArray.length + 1) +
            " dari 3";


        document
            .getElementById("fotoBtn")
            .disabled =
            false;

    } else {

        document
            .getElementById("fotoBtn")
            .style
            .display =
            "none";


        document
            .getElementById("fotoKe")
            .innerText =
            "Selesai ♡";


        setTimeout(
            tampilkanHasil,
            500
        );

    }

}


/* ==================================================
   HASIL
================================================== */

function tampilkanHasil() {

    /*
       MATIKAN KAMERA
    */

    hentikanKamera();


    /*
       PINDAH HALAMAN
    */

    document
        .getElementById("photobooth")
        .classList
        .remove("active");


    document
        .getElementById("hasilPage")
        .classList
        .add("active");


    let hasil =
        document
            .getElementById("hasil");


    /*
       DUA POLAROID
    */

    hasil.innerHTML = `

        <!-- POLAROID 1 -->

        <div class="photostrip">

            <div class="photostrip-header">

                <div class="cat-decoration">
                    🐱
                </div>

            </div>


            <div class="photostrip-title">

                our little moments ♡

            </div>


            <div class="photo-box">

                <img
                    src="${fotoArray[0]}"
                    alt="Foto 1"
                >

            </div>


            <div class="photo-box">

                <img
                    src="${fotoArray[1]}"
                    alt="Foto 2"
                >

            </div>


            <div class="photo-box">

                <img
                    src="${fotoArray[2]}"
                    alt="Foto 3"
                >

            </div>


            <div class="photostrip-footer">

                together ♡

                <div class="photostrip-date">

                    ${tanggalPhotobooth}

                </div>

            </div>

        </div>



        <!-- POLAROID 2 -->

        <div class="photostrip">

            <div class="photostrip-header">

                <div class="cat-decoration">
                    🐱
                </div>

            </div>


            <div class="photostrip-title">

                memories ♡

            </div>


            <div class="photo-box">

                <img
                    src="${fotoArray[0]}"
                    alt="Foto 1"
                >

            </div>


            <div class="photo-box">

                <img
                    src="${fotoArray[1]}"
                    alt="Foto 2"
                >

            </div>


            <div class="photo-box">

                <img
                    src="${fotoArray[2]}"
                    alt="Foto 3"
                >

            </div>


            <div class="photostrip-footer">

                forever ♡

                <div class="photostrip-date">

                    ${tanggalPhotobooth}

                </div>

            </div>

        </div>

    `;

}


/* ==================================================
   SAVE / DOWNLOAD PHOTO
================================================== */

async function simpanFoto() {

    let tombol =
        document
            .querySelector(
                ".save-button"
            );


    tombol.innerText =
        "⏳ MEMPROSES...";


    tombol.disabled =
        true;


    /*
       CANVAS HASIL AKHIR
    */

    let saveCanvas =
        document.createElement(
            "canvas"
        );


    let ctx =
        saveCanvas.getContext(
            "2d"
        );


    let width = 700;

    let height = 1200;


    saveCanvas.width =
        width;


    saveCanvas.height =
        height;


    /* ===============================================
       BACKGROUND
    =============================================== */

    ctx.fillStyle =
        "#ffe1eb";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* ===============================================
       JUDUL
    =============================================== */

    ctx.fillStyle =
        "#713f50";


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 32px Arial";


    ctx.fillText(
        "Our Little Moment ♡",
        width / 2,
        50
    );


    /* ===============================================
       POSISI POLAROID
    =============================================== */

    let stripWidth =
        285;


    let stripHeight =
        1050;


    let gap =
        25;


    let startX =
        (
            width -
            (
                stripWidth * 2 +
                gap
            )
        ) / 2;


    let startY =
        85;


    /* ===============================================
       LOAD SEMUA FOTO
    =============================================== */

    let images =
        [];


    for (
        let i = 0;
        i < fotoArray.length;
        i++
    ) {

        let img =
            new Image();


        img.src =
            fotoArray[i];


        await new Promise(
            function(resolve) {

                img.onload =
                    resolve;

            }
        );


        images.push(
            img
        );

    }


    /* ===============================================
       BUAT POLAROID
    =============================================== */

    function buatPolaroid(
        x,
        y,
        judul,
        footer
    ) {

        /*
           BACKGROUND
        */

        ctx.fillStyle =
            "#ffb8cd";


        ctx.fillRect(
            x,
            y,
            stripWidth,
            stripHeight
        );


        /*
           KUCING
        */

        ctx.font =
            "42px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(
            "🐱",
            x +
            stripWidth / 2,
            y + 48
        );


        /*
           JUDUL
        */

        ctx.fillStyle =
            "#713f50";


        ctx.font =
            "bold 17px Arial";


        ctx.fillText(
            judul,
            x +
            stripWidth / 2,
            y + 78
        );


        /*
           FOTO
        */

        let photoY =
            y + 92;


        let photoWidth =
            stripWidth - 20;


        let photoHeight =
            285;


        for (
            let i = 0;
            i < 3;
            i++
        ) {

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(

                x + 10,

                photoY,

                photoWidth,

                photoHeight

            );


            /*
               FOTO DI DALAM FRAME
            */

            ctx.drawImage(

                images[i],

                x + 14,

                photoY + 4,

                photoWidth - 8,

                photoHeight - 8

            );


            photoY +=
                photoHeight + 8;

        }


        /*
           FOOTER
        */

        ctx.fillStyle =
            "#713f50";


        ctx.font =
            "bold 16px Arial";


        ctx.fillText(
            footer,
            x +
            stripWidth / 2,
            y +
            stripHeight -
            35
        );


        /*
           TANGGAL
        */

        ctx.font =
            "11px Arial";


        ctx.fillText(
            tanggalPhotobooth,
            x +
            stripWidth / 2,
            y +
            stripHeight -
            15
        );

    }


    /* ===============================================
       POLAROID KIRI
    =============================================== */

    buatPolaroid(

        startX,

        startY,

        "our little moments ♡",

        "together ♡"

    );


    /* ===============================================
       POLAROID KANAN
    =============================================== */

    buatPolaroid(

        startX +
        stripWidth +
        gap,

        startY,

        "memories ♡",

        "forever ♡"

    );


    /* ===============================================
       DOWNLOAD
    =============================================== */

    let link =
        document.createElement(
            "a"
        );


    link.download =
        "our-little-moment.png";


    link.href =
        saveCanvas.toDataURL(
            "image/png"
        );


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    tombol.innerText =
        "✅ PHOTO DOWNLOADED";


    setTimeout(
        function() {

            tombol.innerText =
                "💾 DOWNLOAD PHOTO";

            tombol.disabled =
                false;

        },
        2000
    );

}
