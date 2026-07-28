import { motion, AnimatePresence } from 'framer-motion'
import GridBackground from '../common/effects/GridBackground.jsx'
import GlassCard from '../common/ui/GlassCard.jsx'
import WhiteGlow from '../common/effects/WhiteGlow.jsx'
import SectionHeading from '../common/ui/SectionHeading.jsx'
import CarouselShell from '../common/ui/CarouselShell.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { useCarousel } from '../../hooks/useCarousel.js'

const testimonials = [
  {
    name: 'Dextra',
    region: 'Kemanggisan',
    photo: '/images/img-testimoni-kmg-dextra.jpg',
    text: 'Join ke BNCC adalah *salah satu keputusan terbaik* yang saya pilih dalam perjalanan perkuliahan sekarang. Di sini, saya bisa *mendapatkan hardskill* teknis yang cocok dengan minat saya melalui *LnT Front End Development Class*, ditambah lagi saya juga mendapatkan sebuah skill yang sering kali tidak dikira bisa didapatkan melalui organisasi yang bersifat teknis, dan itu adalah *softskill*. Melalui kegiatan pengembangan yang diberikan dari BNCC saya bisa mulai membangun skill yang diperlukan oleh perusahaan profesional seperti *teamwork, communication, hingga public speaking* yang bisa lebih ter-asah secara nyata. Lingkungan BNCC juga *mendukung self development* dari setiap membernya, disini saya merasa yakin bahwa *BNCC menjadi tempat yang cocok untuk perkembangan diri saya.*',
  },
  {
    name: 'Kenzie',
    region: 'Kemanggisan',
    photo: '/images/img-testimoni-kmg-kenzie.jpg',
    text: 'Awalnya aku kira BNCC cuma tempat buat ngoding, ngoding, dan ngoding. Ternyata jauh lebih dari itu! Disini semua skill kita diasah. Mulai dari *softskill, hardskill, dan bahkan networking!*\n\nAku bersyukur banget BNCC *memfasilitasiku* dengan *LnT Class* ngasih aku headstart dibanding teman sebayaku! Aku juga jadi punya *kesempatan buat ketemu dan belajar langsung* dari orang-orang keren di *berbagai bidang dan perusahaan* seperti BCA, Samsung, Oracle, dan masih banyak lagi. Buatku, *join BNCC adalah salah satu keputusan terbaik* karena bukan cuma nambah ilmu, tapi juga *membuka banyak kesempatan* yang sebelumnya nggak pernah aku bayangkan >.<\n\nLagipula apa lagi sih yg mau diraguin? Brand aja percaya sama BNCC, masa kalian engga? \u{1F62D}\n\nKamu bukan anak jurusan IT? Ga masalah! Di BNCC juga *banyak Tech Enthusiast dari jurusan non-IT* kok! Semua akan ter-IT pada waktunya so GAS JOIN SBLM TERLAMBAT! Tar nyesel loh kalo ngga join :3',
  },
  {
    name: 'Kelly',
    region: 'Kemanggisan',
    photo: '/images/img-testimoni-kmg-kelly.jpg',
    text: 'Awalnya aku join BNCC jujur *bukan karena pengen jago IT*. Bahkan aku juga *nggak begitu tahu banyak soal dunia IT*, aku cuma pengen cari kesibukan dan *pengalaman baru di kuliah*. Turns out, keputusan itu jadi *salah satu keputusan terbaik* yang pernah aku ambil. Di BNCC aku ngerasain *growth yang luar biasa*, bukan cuma dari sisi *hard skill* lewat berbagai learning dan project, tapi juga *soft skill* seperti *komunikasi, leadership, problem solving, sampai teamwork*. Yang paling aku suka, BNCC *selalu kasih kesempatan* yang merata buat semua member/aktivis buat *berkembang dan mencoba hal-hal baru*. Lingkungannya juga benar-benar *positif, supportif, dan bikin kita termotivasi* untuk terus improve. Kalau mau cari tempat buat belajar, berkembang, dan ketemu orang-orang yang growth driven, BNCC is definitely the right place to start.',
  },
  {
    name: 'Evelyn Elni',
    region: 'Kemanggisan',
    photo: '/images/img-testimoni-kmg-evelyn.jpg',
    text: 'Dari dulu aku *gak pernah sekalipun kepikiran* bakal berkutat di dunia komputer. But unexpectedly, here I am as an activist at BNCC, *becoming a better version* of myself. Walaupun dari zaman sekolah aku termasuk anak yang aktif berorganisasi, tapi BNCC rasanya beda. BNCC itu jauh *lebih terstruktur, lebih membangun, dan lebih solid*. BNCC ada bukan hanya sekadar buat berorganisasi, tapi juga menjadi tempat untuk membangun *networking*, mengasah *hard skill*, *soft skill*, dan *karakter*. Semua pengalaman yang aku dapat di BNCC bener bener membantu aku untuk terus berkembang menjadi *pribadi yang lebih baik* dan *lebih siap menghadapi dunia kerja di masa depan*. Yang paling aku suka, di tengah proses belajar dan berkembang itu, BNCC tetap gak lupa untuk *have fun dan bonding*. Di sini aku dipertemukan dengan banyak mahasiswa yang punya semangat yang sama untuk *terus belajar, berkembang, dan saling mendukung*. Looking back, *joining BNCC in my first year was definitely one of the best decisions I\u2019ve ever made*. And I know there\u2019s still so much more that I can learn, contribute, and grow through BNCC.',
  },
  {
    name: 'Evan',
    region: 'Kemanggisan',
    photo: '/images/img-testimoni-kmg-evan.jpg',
    text: 'Selama di BNCC, gue *dapet banyak banget kesempatan* buat *ngembangin diri dari segi teknis maupun karakter*. Lewat program LnT Class Back-End, *fondasi dan skill programming* gue bener-bener *dibangun secara terstruktur*. Nggak cuma urusan ngoding, pengalaman terjun langsung di berbagai kepanitiaan terbukti bikin soft skill gue makin matang. Kapasitas *public speaking dan leadership* gue jauh lebih berkembang karena lingkungannya ngedukung banget buat berani tampil dan mimpin. *Joining BNCC is definitely one of the best decisions I made.*',
  },
  {
    name: 'Aika',
    region: 'Alam Sutera',
    photo: '/images/img-testimoni-als-aika.png',
    text: 'Jujur awalnya aku ga pernah kepikiran kalau organisasi bisa punya pengaruh sebesar ini buat aku. Awalnya aku ngira BNCC cuma bakal jadi tempat buat belajar hal-hal baru di bidang teknologi atau sekadar menambah pengalaman organisasi. Ternyata, aku nemuin jauh lebih banyak dari itu. Selama menjadi bagian dari BNCC, aku ga cuma ngembangin hard skill yang lengkapin apa yang dipelajarin di kelas, tapi juga belajar banyak soft skill yang rasanya ga kalah penting. Mulai dari komunikasi, teamwork, problem solving, leadership, sampai gimana caranya hadapin tantangan dan terus berkembang dari setiap proses yang dijalani. Jujur yang paling berharga ga cuma pengalaman atau skill yang aku dapet, tapi juga orang-orang yang aku temuin selama perjalanan aku di BNCC. Lingkungan yang supportive, kesempatan buat terus belajar, dan kepercayaan yang dikasih buat berani coba hal yang sebelumnya ga pernah kubayangkan. For me, BNCC bukan sekedar organization. BNCC jadi tempat di mana aku tumbuh, belajar kenal diri sendiri, dan nemuin potensi yang mungkin ga akan aku sadarin kalau aku ga pernah memberanikan diri buat join BNCC. So, does BNCC mean a lot to me? The answer is YES. It means growth. It means stepping out of my comfort zone, meeting incredible people, and becoming a better version of myself. BNCC has given me experiences and lessons that go far beyond the classroom, and for that, it\u2019ll always mean a lot to me. Semua proses, tantangan, dan orang-orang yang aku temuin di dalamnya bakal selalu jadi bagian dari perjalanan yang ga akan pernah aku lupain.',
  },
  {
    name: 'Kenny',
    region: 'Alam Sutera',
    photo: '/images/img-testimoni-als-kenny.jpg',
    text: 'Menjadi bagian dari keluarga BNCC menjadi sesuatu yang cukup berarti bagi aku. Jujur, sebelum kuliah, aku bukan orang yang aktif bergaul apalagi berorganisasi. Motivasi awalku bergabung pun sangat sederhana: menganggap kuliah sebagai kesempatan terakhir untuk mencoba berorganisasi, dan kebetulan sangat relevan dengan jurusan aku, Computer Science. Awalnya, aku mengira BNCC hanya jadi wadah akademik untuk mendalami hardskill teknologi. Namun, setelah aku menjalani prosesnya, mulai dari member, aktivis, hingga pengurus, ekspektasi itu perlahan-lahan berkembang. BNCC memberikan jauh lebih banyak dari sekadar ilmu komputer. Di sini, aku mendapatkan pengalaman berharga yang mungkin tidak akan kutemukan di tempat lain. Salah satunya adalah memahami seluk beluk manajemen event dari nol hingga eksekusi akhir. Pengalaman ini mengubah perspektifku tentang bagaimana sebuah acara yang mungkin terlihat sederhana, namun bisa berhasil dijalankan lewat proses panjang yang matang. Hal yang paling berkesan dan belum pernah aku rasakan sebelumnya adalah sisi kekeluargaan yang terbentuk di dalamnya. Di BNCC, aku belajar untuk lebih memahami orang lain, menurunkan ego, dan bekerja sama demi satu tujuan yang sama. Dinamika kelompok dan kebersamaan di organisasi ini betul-betul membangun karakter dan caraku memahami sekitarku. Dalam prosesnya, BNCC menjadi ruang bertumbuh yang mengubah aku menjadi pribadi yang lebih adaptif, terbuka, dan kolaboratif.',
  },
  {
    name: 'Matthew',
    region: 'Alam Sutera',
    photo: '/images/img-testimoni-als-matthew.jpg',
    text: 'Awalnya aku mutusin join BNCC karena emang pengen cari pengalaman organisasi sekalian ngembangin skill IT di kampus. Waktu udah dijalanin, ternyata banyak hal baru yang aku dapat dari prosesnya. Aku ngerasain banget progres di diri aku sendiri. Buat hal teknis, aku jadi punya wadah buat praktekin langsung ilmu programming dan web dev ke project nyata. Tapi di luar itu, pengalamanku juga makin nambah pas ikut ngurus kepanitiaan event. Di situ aku beneran belajar cara handle acara, mikir cepet pas ada masalah di lapangan, sampe belajar cara nyatuin banyak isi kepala waktu kerja bareng tim. Ngelewatin masa-masa itu bareng tim bikin aku banyak belajar soal leadership. Untungnya temen-temen di sini pada suportif semua. Kita bisa serius ngejar target, tapi tetep ada waktunya santai biar ga stres. Kalau misal disuruh ngulang dari awal kuliah pun, aku bakal tetep milih join. Pengalamannya beneran kerasa dan kepake buat kedepannya.',
  },
  {
    name: 'Stephen',
    region: 'Alam Sutera',
    photo: '/images/img-testimoni-als-stephen.jpg',
    text: 'Aku awalnya ikut BNCC cuma karena ada temen aku disana, Ga Pernah mikir yang kayak bakal serius atau minat dalam BNCC. Namun setelah suatu seminar, aku melihat *peluang yang besar buat aku berkembang jauh kedepannya*. Dimana BNCC ini ga cuma organisasi yang hihi haha doang tapi juga *mengembangkan skill skill kita untuk siap kerja di masa depan*. Dimana aku ga cuma *dapet LnT class* setelah join BNCC, aku juga *dapet banyak pengalaman event yang ga kalah menarik* selama di BNCC. Mungkin ada saat dimana ini semua ini melelahkan tapi aku ga sendirian. Teman-teman sesama aktivis lain dan pengurus yang ada itu *keluarga aku selama di kuliah*. Mereka juga banyak banget bantu aku dikala aku kesulitan. Jadi walaupun nanti waktu berputar kembali, aku pasti akan dengan senang hati join BNCC.',
  },
  {
    name: 'Suryani',
    region: 'Alam Sutera',
    photo: '/images/img-testimoni-als-suryani.jpg',
    text: 'Menjadi bagian aktivis dari BNCC merupakan salah satu pengalaman yang sangat berharga bagi saya. Selain *mendapatkan pengembangan skills*, baik hard skills maupun soft skills, melalui BNCC saya juga dapat *memperluas relasi serta koneksi*, baik secara internal maupun eksternal. Hal yang paling menarik selama menjadi aktivis adalah ketika dipercayakan untuk memegang tanggung jawab di berbagai program kerja, terutama dalam bidang desain. Selain *melatih rasa tanggung jawab*, kesempatan ini juga membantu saya *membangun portofolio yang lebih luas*. Dengan pendampingan dari para pengurus serta dukungan teman-teman baru yang seru dan supportive, BNCC benar-benar menjadi wadah berkembang yang tepat bagi saya.',
  },
  {
    name: 'Keith',
    region: 'Bandung',
    photo: '/images/img-testimoni-bdg-keith.jpeg',
    text: 'BNCC bagi saya bukan sekadar organisasi kemahasiswaan, melainkan sebuah ruang pembelajaran yang melampaui fungsi formalnya dan bertransformasi menjadi ekosistem yang membentuk karakter, memperhalus cara berpikir, serta menumbuhkan kepemimpinan yang berlandaskan integritas dan makna. Di tengah budaya intelektual yang hidup, kolaborasi yang autentik, dan semangat kolektif untuk terus berkembang, saya belajar bahwa pertumbuhan sejati tidak selalu ditandai oleh seberapa banyak pencapaian yang berhasil diraih, melainkan oleh seberapa jauh seseorang mampu melampaui batas dirinya sendiri. BNCC menghadirkan lingkungan yang tidak hanya mengasah kompetensi, tetapi juga menanamkan keberanian untuk mengambil peluang, kerendahan hati untuk terus belajar, dan kebijaksanaan untuk memahami bahwa dampak terbesar lahir dari kemampuan memberdayakan orang lain. As the saying goes, great institutions do not merely produce competent individuals; they cultivate individuals of character, vision, and purpose. Dan BNCC, bagi saya, adalah perwujudan nyata dari gagasan tersebut, sebuah tempat di mana potensi menemukan arah, talenta menemukan maknanya, dan setiap tantangan menjadi proses pendewasaan yang memperkaya kualitas diri. It is not merely a place where talents are discovered, but where character is refined, vision is elevated, and purpose is awakened. Pada akhirnya, nilai terbesar yang saya peroleh dari BNCC bukanlah tentang apa yang berhasil saya capai selama bagiannya, melainkan tentang siapa diri saya yang perlahan, namun pasti, berhasil dibentuk karenanya. #vivabncc \u{1F499}',
  },
  {
    name: 'Bambang',
    region: 'Bandung',
    photo: '/images/img-testimoni-bdg-bambang.jpeg',
    text: 'BNCC tempat berkembang organisasi pertama gw selama menempuh pendidikan. Dulu di sekolah, gw selalu nolak buat ikutan organisasi karena keliatannya capek mulai dari rapat, pulang malem, dan tugas sekolah kadang ga kekerjain. Tapi setelah gw masuk BNCC dengan 0 pengalaman, ngebuat gw belajar banyak. Mulai dari yang basic ngoding, leadership bahkan sampai ngurus berbagai event dengan jobdesc yang beda-beda. Mulai bahas dengan external, jadi bagian perlengkapan, sampai latihan jadi MC. Banyak insights yang gw dapetin dari pengalaman ini. Meskipun kesibukan yang dikasih itu capek, tapi worth it dengan ilmu yang didapetin. Ditambah lingkungan yang asik, supportive, dan fun membuat gw tidak pernah menyesal untuk menjadi bagian dari BNCC! Love Penuh \u{1F49C} buat BNCC.',
  },
  {
    name: 'Chelsea Alanna',
    region: 'Bandung',
    photo: '/images/img-testimoni-bdg-chelsea-ivanna.jpg',
    text: 'BNCC itu kayak paket lengkap banget! Selain hard skill dan soft skill yang didapat aku juga jadi bisa networking sama orang-orang keren, apalagi orang-orangnya open banget dan seru banget diajak ngobrol. Sebagai orang yang ga pernah join organisasi selama sekolah, environment-nya bener-bener meluk banget lah istilahnya, beneran dibantu dan dibimbing sampai bisa. Selain itu, banyak banget skill leadership yang aku dapetin dari BNCC. Join BNCC bener-bener jadi investasi aku selama kuliah! apalagi karena aku jurusan CS jadi LnT Classnya bener-bener ngebantu aku selama kuliah!! \u{1F389}',
  },
  {
    name: 'Gregory',
    region: 'Bandung',
    photo: '/images/img-testimoni-bdg-greg.jpg',
    text: 'Awal-awal saya masuk kuliah, saya merasa sangat ter-pressure karena banyak pilihan organisasi yang bisa saya daftarkan. Saya juga sama sekali tidak punya koneksi waktu masuk ke BINUS, jadi saya mencari segala hal yang berhubungan dengan komputer seperti BNCC (anak IT be like...). Tapi tanpa saya sadari, yang awalnya saya mendaftar BNCC untuk membangun skill-skill saya di bidang coding, malah saya juga dapat mengembangkan soft skills saya, a lot more than I expected. Akhir-akhirnya, di sini saya diberikan berbagai ilmu yang sangat beneficial dan tidak bisa diajarkan di kelas. Not only that, saya juga dapat bertemu dan berteman dengan beberapa orang yang sangat gacor, yang menjadi inspirasi saya untuk terus berjuang and be the best person I can be. Lov banget sm BNCC \u{1F497}',
  },
  {
    name: 'Abiyyu',
    region: 'Bandung',
    photo: '/images/img-testimoni-bdg-abiyyu.jpg',
    text: 'Jujur aku rasa join BNCC tuh jadi salah satu keputusan aku yang ga akan pernah aku sesali selama kuliah. Karena selama ini di BNCC aku pribadi ga cuma belajar tentang hal hal yang IT gitu, tapi juga aku bisa ngembangin diri karna BNCC ini ngasih aku kesempatan buat mengasah softskill juga kayak komunikasi aku, problem solving, public speaking, negosiasi, leadership (ofc) dan how to manage diri sendiri sampe manage satu tim, dan ofc Hard Skill kaya ngedit dan ngoding. Jujur aku rasa ini skill skill yang bakal kepake banget waktu aku kerja, dan di BNCC aku bener bener diajarin dan juga dilatih serta dibimbing buat pelajarin itu semua... Aku bener bener bersyukur bisa jadi bagian di BNCC ini karna aku dapet banyak kesempatan untuk belajar dan ngembangin diri akuu dan juga ngebantu aku untuk mempersiapkan diriku menjadi versi yang terbaik... intinya VivaBNCC \u{1F499}\u{1F499}',
  },
  {
    name: 'Nielsen',
    region: 'Malang',
    photo: '/images/img-testimoni-mlg-nielsen.jpg',
    text: 'Awalnya aku mengira BNCC hanya tempat untuk belajar teknologi. Namun setelah menjadi bagian dari BNCC, aku menyadari bahwa organisasi ini mengajarkan jauh lebih dari sekadar technical skills. Di sini aku belajar tentang leadership, teamwork, problem solving, komunikasi, hingga bagaimana bertanggung jawab atas setiap keputusan yang diambil. Semua pengalaman, tantangan, dan kesempatan yang diberikan benar-benar membentukku menjadi pribadi yang lebih siap menghadapi dunia profesional. Yang paling berharga adalah lingkungan di BNCC yang dipenuhi oleh orang-orang dengan semangat belajar yang sama. Setiap project, event, maupun diskusi selalu menjadi ruang untuk berkembang bersama. "Success is not about being the best, it\u2019s about becoming better every single day." Nilai itulah yang paling aku rasakan selama menjadi bagian dari BNCC.',
  },
  {
    name: 'Jian',
    region: 'Malang',
    photo: '/images/img-testimoni-mlg-jian.jpg',
    text: 'Jujur, awalnya aku sama sekali gak tertarik buat join BNCC. Bahkan aku baru daftar H-1 sebelum recruitment ditutup tanpa ekspektasi apa pun. Tapi ternyata, itu jadi salah satu keputusan terbaik yang pernah aku ambil. Di BNCC aku diberi banyak kesempatan untuk berkembang, mulai dari dipercaya menjadi koordinator hingga belajar leadership, problem solving, creativity, public speaking, dan networking. Semua pengalaman itu benar-benar membentukku menjadi versi yang lebih baik dan memberikan bekal yang pasti berguna di dunia kerja nanti. Yang bikin BNCC semakin spesial adalah lingkungan orang-orangnya. Teman-temannya solid, saling support, dan staff maupun seniornya sangat helpful serta terbuka, jadi gak pernah ada rasa canggung atau kesenjangan. Setiap event juga selalu seru, mulai dari proses persiapan, bonding, sampai momen melihat hasil kerja keras tim di akhir acara yang selalu bikin bangga. Buatku, BNCC bukan cuma organisasi, tapi tempat untuk belajar, bertumbuh, dan menemukan banyak kesempatan baru. Kalau ditanya apakah join BNCC worth it? Jawabanku jelas, *100% worth it!*',
  },
  {
    name: 'Keisha',
    region: 'Malang',
    photo: '/images/img-testimoni-mlg-keisha.jpg',
    text: 'Gabung BNCC jadi salah satu keputusan terbaik yang aku ambil selama satu tahun kuliah ini. Aku bersyukur banget bisa dipertemukan sama teman-teman dan kakak pengurus yang suportif, solid, dan selalu saling bantu buat berkembang. Walaupun aku datang tanpa pengalaman organisasi dan nggak punya background di dunia IT, aku tetap dikasih banyak kesempatan buat belajar, mencoba berbagai peran, dan terus berkembang. Dari sini aku jadi lebih percaya diri, lebih familiar sama dunia IT, dan berani mencoba hal-hal baru. Buat aku, BNCC bukan cuma ngasih pengalaman selama kuliah, tapi juga membekali aku dengan skill, relasi, dan pengalaman yang pastinya berguna untuk dunia kerja nanti.',
  },
  {
    name: 'Elisya',
    region: 'Malang',
    photo: '/images/img-testimoni-mlg-elisya.jpg',
    text: 'Walaupun aku dari jurusan non-CS, aku langsung tertarik buat join BNCC *at first sight*. Setelah bergabung, aku ngerasa ecosystem BNCC benar-benar mendukung buat bertumbuh dan berkembang. Sebagai mahasiswa tahun pertama, aku ngerasa kebantu banget karena transfer knowledgenya luas\u2014nggak cuma tentang hard skill dan soft skill, tapi juga bikin aku lebih mudah beradaptasi di dunia perkuliahan. Koneksi yang dibangun juga keren banget. Aku jadi bisa kenal banyak teman dari berbagai region BINUS, dan itu bener-bener bikin aku bilang, *"Wow!"* Yang paling berkesan buat aku, solidaritas di BNCC benar-benar no counter deh!',
  },
  {
    name: 'Putra',
    region: 'Malang',
    photo: '/images/img-testimoni-mlg-putra.jpeg',
    text: 'Sejak awal, aku tertarik bergabung dengan BNCC karena organisasi ini sangat sejalan dengan jurusanku, yaitu Computer Science. Awalnya aku mengira BNCC hanya berfokus pada pembelajaran teknologi dan pengembangan hard skills, tetapi setelah bergabung aku belajar lebih dari itu. BNCC mengajarkanku pentingnya work ethic yang profesional, bekerja dalam workflow yang cepat dan dinamis, mengelola waktu dengan baik, serta membangun relasi dengan teman-teman dari berbagai jurusan dan latar belakang. Melalui berbagai kegiatan, aku juga belajar bekerja sama dalam tim, berkomunikasi secara efektif, dan menghargai perbedaan sudut pandang. Buat kalian yang ingin berkembang tidak hanya di bidang teknologi, tetapi juga kemampuan profesional dan networking, BNCC adalah tempat yang tepat untuk belajar dan bertumbuh bersama.',
  },
]

function renderText(text) {
  const paragraphs = text.split('\n\n')
  return paragraphs.map((para, pIdx) => (
    <p key={pIdx} className={pIdx > 0 ? 'mt-4' : ''}>
      {para.replace(/\*/g, '')}
    </p>
  ))
}

function getPhotoStyle(name) {
  if (name === 'Bambang') {
    return {
      objectPosition: 'center 50%',
    }
  }
  if (name === 'Keith') {
    return {
      objectPosition: 'center 15%',
      transform: 'scale(1.20)',
    }
  }
  if (name === 'Gregory') {
    return {
      objectPosition: 'center 45%',
    }
  }
  if (name === 'Putra') {
    return {
      objectPosition: 'center 55%',
    }
  }
  return {
    objectPosition: 'center top',
  }
}

export default function Testimonials() {
  const { current, next, prev } = useCarousel(testimonials)

  const headingVariants = useScrollReveal(24, 0.6)
  const cardVariants = useScrollReveal(32, 0.6)
  const navButtonVariants = useScrollReveal(16, 0.5)

  return (
    <section
      id="testimonial"
      className="relative py-14 sm:py-24 md:py-36 px-10 sm:px-12 md:px-14"
    >
      <GridBackground />

      <WhiteGlow className="-left-10 top-1/2 -translate-y-1/2 h-[140px] w-[140px] sm:-left-16 sm:h-[220px] sm:w-[220px] lg:-left-[40px] lg:h-[340px] lg:w-[340px] z-0" />
      <WhiteGlow className="right-0 top-0 h-[200px] w-[200px] sm:h-[380px] sm:w-[380px] lg:-right-[40px] lg:top-0 lg:h-[560px] lg:w-[560px] z-0" />
      <WhiteGlow className="right-0 top-[28%] h-[220px] w-[220px] sm:h-[420px] sm:w-[420px] lg:-right-[20px] lg:top-[32%] lg:h-[620px] lg:w-[620px] z-0" />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={headingVariants}
        >
          <SectionHeading>Testimonial</SectionHeading>
        </motion.div>
        <CarouselShell
          onPrev={prev}
          onNext={next}
          prevLabel="Previous testimonial"
          nextLabel="Next testimonial"
          navButtonVariants={navButtonVariants}
          cardVariants={cardVariants}
          prevButtonClassName="lg:-mr-8"
          nextButtonClassName="lg:-ml-8"
        >
          <GlassCard
            rounded="rounded-[20px] sm:rounded-[28px]"
            borderVariant="card"
            className="w-full min-w-0 p-5 sm:p-8 md:px-14 md:py-12 lg:px-20 lg:py-14"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col lg:flex-row items-center gap-5 sm:gap-6 md:gap-8 lg:gap-20 text-center lg:text-left"
              >
                <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-48 md:w-48 lg:h-60 lg:w-60 shrink-0 overflow-hidden rounded-full self-center">
                  <img
                    src={current.photo}
                    alt={current.name}
                    className="h-full w-full object-cover"
                    style={getPhotoStyle(current.name)}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-secondary text-lg sm:text-2xl md:text-3xl mb-2 sm:mb-4 md:mb-6 font-poppins">
                    {current.name}
                  </h3>
                  <div className="text-xs sm:text-base md:text-lg text-secondary">
                    {renderText(current.text)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </CarouselShell>
      </div>
    </section>
  )
}
