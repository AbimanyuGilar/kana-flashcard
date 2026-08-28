export type KanjiItem = {
  kanji: string;
  meaning: string;
  reading: string;
};

export type KanjiGroup = {
  id: string;
  name: string;
  items: KanjiItem[];
};

export const KANJI_GROUPS_DATA: KanjiGroup[] = [
  {
    id: 'n5-number',
    name: 'Angka (N5)',
    items: [
      { kanji: '一', meaning: 'Satu', reading: 'ichi' },
      { kanji: '二', meaning: 'Dua', reading: 'ni' },
      { kanji: '三', meaning: 'Tiga', reading: 'san' },
      { kanji: '四', meaning: 'Empat', reading: 'shi/yon' },
      { kanji: '五', meaning: 'Lima', reading: 'go' },
      { kanji: '六', meaning: 'Enam', reading: 'roku' },
      { kanji: '七', meaning: 'Tujuh', reading: 'shichi/nana' },
      { kanji: '八', meaning: 'Delapan', reading: 'hachi' },
      { kanji: '九', meaning: 'Sembilan', reading: 'ku/kyuu' },
      { kanji: '十', meaning: 'Sepuluh', reading: 'juu' },
      { kanji: '百', meaning: 'Ratus', reading: 'hyaku' },
      { kanji: '千', meaning: 'Ribu', reading: 'sen' },
      { kanji: '万', meaning: 'Sepuluh ribu', reading: 'man' },
      { kanji: '円', meaning: 'Yen (mata uang)', reading: 'en' },
    ],
  },
  {
    id: 'n5-time',
    name: 'Waktu (N5)',
    items: [
      { kanji: '日', meaning: 'Hari / Matahari', reading: 'nichi/hi' },
      { kanji: '月', meaning: 'Bulan', reading: 'getsu/tsuki' },
      { kanji: '火', meaning: 'Api', reading: 'ka/hi' },
      { kanji: '水', meaning: 'Air', reading: 'sui/mizu' },
      { kanji: '木', meaning: 'Pohon', reading: 'moku/ki' },
      { kanji: '金', meaning: 'Emas / Uang', reading: 'kin/kane' },
      { kanji: '土', meaning: 'Tanah', reading: 'do/tsuchi' },
      { kanji: '年', meaning: 'Tahun', reading: 'nen/toshi' },
      { kanji: '今', meaning: 'Sekarang', reading: 'kon/ima' },
      { kanji: '午', meaning: 'Siang', reading: 'go' },
    ],
  },
  {
    id: 'n5-nature',
    name: 'Alam (N5)',
    items: [
      { kanji: '山', meaning: 'Gunung', reading: 'san/yama' },
      { kanji: '川', meaning: 'Sungai', reading: 'sen/kawa' },
      { kanji: '田', meaning: 'Sawah', reading: 'den/ta' },
      { kanji: '森', meaning: 'Hutan', reading: 'shin/mori' },
      { kanji: '花', meaning: 'Bunga', reading: 'ka/hana' },
      { kanji: '雨', meaning: 'Hujan', reading: 'u/ame' },
      { kanji: '雪', meaning: 'Salju', reading: 'setsu/yuki' },
      { kanji: '風', meaning: 'Angin', reading: 'uu/kaze' },
      { kanji: '空', meaning: 'Langit / Kosong', reading: 'kuu/sora' },
      { kanji: '海', meaning: 'Laut', reading: 'kai/umi' },
    ],
  },
  {
    id: 'n5-people',
    name: 'Orang (N5)',
    items: [
      { kanji: '人', meaning: 'Orang', reading: 'jin/hito' },
      { kanji: '男', meaning: 'Laki-laki', reading: 'dan/otoko' },
      { kanji: '女', meaning: 'Perempuan', reading: 'jo/onna' },
      { kanji: '子', meaning: 'Anak', reading: 'shi/ko' },
      { kanji: '父', meaning: 'Ayah', reading: 'fu/chichi' },
      { kanji: '母', meaning: 'Ibu', reading: 'bo/haha' },
      { kanji: '友', meaning: 'Teman', reading: 'yuu/tomo' },
      { kanji: '先', meaning: 'Sebelum / Guru', reading: 'sen' },
      { kanji: '生', meaning: 'Hidup / Siswa', reading: 'sei/ikiru' },
    ],
  },
  {
    id: 'n5-body',
    name: 'Tubuh (N5)',
    items: [
      { kanji: '目', meaning: 'Mata', reading: 'moku/me' },
      { kanji: '耳', meaning: 'Telinga', reading: 'ji/mimi' },
      { kanji: '口', meaning: 'Mulut', reading: 'kou/kuchi' },
      { kanji: '手', meaning: 'Tangan', reading: 'shu/te' },
      { kanji: '足', meaning: 'Kaki', reading: 'soku/ashi' },
      { kanji: '力', meaning: 'Kekuatan', reading: 'ryoku/chikara' },
      { kanji: '心', meaning: 'Hati', reading: 'shin/kokoro' },
      { kanji: '体', meaning: 'Tubuh', reading: 'tai/karada' },
    ],
  },
  {
    id: 'n5-direction',
    name: 'Arah (N5)',
    items: [
      { kanji: '東', meaning: 'Timur', reading: 'tou/higashi' },
      { kanji: '西', meaning: 'Barat', reading: 'sei/nishi' },
      { kanji: '南', meaning: 'Selatan', reading: 'nan/minami' },
      { kanji: '北', meaning: 'Utara', reading: 'hoku/kita' },
      { kanji: '上', meaning: 'Atas', reading: 'jou/ue' },
      { kanji: '下', meaning: 'Bawah', reading: 'ka/shita' },
      { kanji: '左', meaning: 'Kiri', reading: 'sa/hidari' },
      { kanji: '右', meaning: 'Kanan', reading: 'uu/migi' },
      { kanji: '中', meaning: 'Tengah', reading: 'chuu/naka' },
      { kanji: '外', meaning: 'Luar', reading: 'gai/soto' },
    ],
  },
  {
    id: 'n5-school',
    name: 'Sekolah (N5)',
    items: [
      { kanji: '学', meaning: 'Belajar', reading: 'gaku' },
      { kanji: '校', meaning: 'Sekolah', reading: 'kou' },
      { kanji: '文', meaning: 'Tulisan / Budaya', reading: 'bun/fumi' },
      { kanji: '字', meaning: 'Huruf', reading: 'ji' },
      { kanji: '本', meaning: 'Buku / Asal', reading: 'hon/moto' },
      { kanji: '語', meaning: 'Bahasa', reading: 'go/kotoba' },
      { kanji: '話', meaning: 'Bicara', reading: 'wa/hanashi' },
      { kanji: '数', meaning: 'Angka / Jumlah', reading: 'suu/kazu' },
    ],
  },
  {
    id: 'n5-verb',
    name: 'Kata Kerja (N5)',
    items: [
      { kanji: '行', meaning: 'Pergi', reading: 'kou/iku' },
      { kanji: '来', meaning: 'Datang', reading: 'rai/kuru' },
      { kanji: '見', meaning: 'Melihat', reading: 'ken/miru' },
      { kanji: '聞', meaning: 'Mendengar', reading: 'bun/kiku' },
      { kanji: '食', meaning: 'Makan', reading: 'shoku/taberu' },
      { kanji: '飲', meaning: 'Minum', reading: 'in/nomu' },
      { kanji: '書', meaning: 'Menulis', reading: 'sho/kaku' },
      { kanji: '読', meaning: 'Membaca', reading: 'doku/yomu' },
      { kanji: '話', meaning: 'Bicara', reading: 'wa/hanasu' },
      { kanji: '買', meaning: 'Membeli', reading: 'bai/kau' },
    ],
  },
];